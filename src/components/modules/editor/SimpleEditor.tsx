import React, { useState, useRef, useEffect } from 'react';

interface SimpleEditorProps {
  content: string;
  onChange: (content: string) => void;
  onFormatRequest?: (type: string, value?: string) => void;
}

// 暴露格式化方法的接口
export interface EditorRef {
  applyFormat: (command: string, value?: string) => void;
  insertText: (before: string, after?: string) => void;
  focus: () => void;
}

// 提取Markdown的辅助函数
const extractMarkdownFromHtml = (html: string): string => {
  let markdown = html;

  // 处理图片：从HTML转回Markdown
  markdown = markdown.replace(
    /<div class="image-display"[^>]*>[\s\S]*?<img src="([^"]+)" alt="([^"]*)"[^>]*>[\s\S]*?<\/div>/g,
    '![$2]($1)',
  );

  // 处理标题
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1');

  // 处理粗体和斜体
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**');
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*');

  // 处理段落和换行
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/g, '$1\n\n');
  markdown = markdown.replace(/<br\s*\/?>/g, '\n');

  // 清理HTML标签
  markdown = markdown.replace(/<[^>]+>/g, '');

  // 解码HTML实体
  markdown = markdown.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

  // 清理多余的空行
  markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

  return markdown;
};

const SimpleEditor = React.forwardRef<EditorRef, SimpleEditorProps>(
  ({ content, onChange }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [lastKnownContent, setLastKnownContent] = useState(content);

    // 格式化工具函数
    const applyFormat = (command: string, value?: string) => {
      if (!editorRef.current || !isEditing) return;

      editorRef.current.focus();
      document.execCommand(command, false, value);

      // 立即更新内容
      setTimeout(() => {
        if (editorRef.current) {
          const textContent = editorRef.current.innerText || '';
          onChange(textContent);
          setLastKnownContent(textContent);
        }
      }, 0);
    };

    // 插入文本
    const insertText = (before: string, after: string = '') => {
      if (!editorRef.current) return;

      // 确保编辑器获得焦点
      if (!isEditing) {
        setIsEditing(true);
        editorRef.current.focus();
      }

      // 等一下让焦点设置完成，然后插入文本
      setTimeout(() => {
        if (!editorRef.current) return;

        // 直接在内容末尾插入，或者在当前光标位置插入
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const selectedText = range.toString();
          const newText = before + selectedText + after;

          range.deleteContents();
          range.insertNode(document.createTextNode(newText));

          // 设置光标位置到插入文本的末尾
          const newRange = document.createRange();
          newRange.setStartAfter(range.endContainer);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } else {
          // 如果没有选择，在末尾插入
          const newContent = content + before + (after || '');
          onChange(newContent);
          setLastKnownContent(newContent);

          // 重新渲染
          setTimeout(() => {
            if (editorRef.current) {
              editorRef.current.innerHTML = renderMarkdown(newContent);
            }
          }, 0);
        }

        // 更新内容
        setTimeout(() => {
          if (editorRef.current) {
            const extractedMarkdown = extractMarkdownFromHtml(editorRef.current.innerHTML);
            if (extractedMarkdown !== content) {
              onChange(extractedMarkdown);
              setLastKnownContent(extractedMarkdown);
            }
          }
        }, 100);
      }, 50);
    };

    // 处理图片粘贴
    const handlePaste = (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = e => {
              const dataUrl = e.target?.result as string;
              if (dataUrl) {
                // 插入图片
                const imageMarkdown = `\n\n![粘贴的图片](${dataUrl})\n\n`;
                const newContent = content + imageMarkdown;
                onChange(newContent);
                setLastKnownContent(newContent);

                // 重新渲染
                setTimeout(() => {
                  if (editorRef.current) {
                    editorRef.current.innerHTML = renderMarkdown(newContent);
                  }
                }, 100);
              }
            };
            reader.readAsDataURL(blob);
          }
          break;
        }
      }
    };

    // 将Markdown转换为显示用的HTML
    const renderMarkdown = (markdown: string) => {
      if (!markdown) return '';

      let html = markdown;

      // 处理已有的HTML表格（直接保留）
      const tableMatches = html.match(/<table[\s\S]*?<\/table>/g);
      const tablePlaceholders: string[] = [];
      if (tableMatches) {
        tableMatches.forEach((table, index) => {
          const placeholder = `__TABLE_PLACEHOLDER_${index}__`;
          tablePlaceholders.push(table);
          html = html.replace(table, placeholder);
        });
      }

      // 处理图片
      html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
        return `<div class="image-display" style="margin: 16px 0; text-align: center;">
        <img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"/>
        <div style="font-size: 12px; color: #666; margin-top: 8px;">${alt}</div>
      </div>`;
      });

      // 处理粗体
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // 处理斜体
      html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

      // 处理标题
      html = html.replace(
        /^### (.*$)/gm,
        '<h3 style="font-size: 18px; font-weight: bold; margin: 20px 0 12px 0;">$1</h3>',
      );
      html = html.replace(
        /^## (.*$)/gm,
        '<h2 style="font-size: 22px; font-weight: bold; margin: 24px 0 16px 0;">$1</h2>',
      );
      html = html.replace(
        /^# (.*$)/gm,
        '<h1 style="font-size: 26px; font-weight: bold; margin: 28px 0 20px 0;">$1</h1>',
      );

      // 恢复表格占位符
      if (tablePlaceholders.length > 0) {
        tablePlaceholders.forEach((table, index) => {
          const placeholder = `__TABLE_PLACEHOLDER_${index}__`;
          html = html.replace(
            placeholder,
            `<div style="margin: 20px 0; overflow-x: auto;">${table}</div>`,
          );
        });
      }

      // 处理段落
      const paragraphs = html.split('\n\n').filter(p => p.trim());
      html = paragraphs
        .map(p => {
          if (
            p.startsWith('<h') ||
            p.startsWith('<div class="image-display"') ||
            p.startsWith('<div style="margin: 20px 0; overflow-x: auto;">')
          ) {
            return p;
          }
          return `<p style="margin: 12px 0; line-height: 1.6;">${p.replace(/\n/g, '<br>')}</p>`;
        })
        .join('');

      return html;
    };

    // 处理内容更新 - 只在外部内容变化且用户不在编辑时更新
    useEffect(() => {
      if (!isEditing && content !== lastKnownContent && editorRef.current) {
        editorRef.current.innerHTML =
          renderMarkdown(content) ||
          '<p style="margin: 12px 0; line-height: 1.6; color: #999;">点击开始输入内容...</p>';
        setLastKnownContent(content);
      }
    }, [content, isEditing, lastKnownContent]);

    // 暴露给父组件的方法
    React.useImperativeHandle(
      ref,
      () => ({
        applyFormat,
        insertText,
        focus: () => {
          if (editorRef.current) {
            editorRef.current.focus();
          }
        },
      }),
      [applyFormat, insertText],
    );

    // 全局图表插入函数
    useEffect(() => {
      (window as any).insertChartToContentEditor = (
        chartUrl: string,
        title: string,
        chartType?: string,
      ) => {
        let newContent = '';

        if (chartType === 'table') {
          // 对于表格类型，直接插入HTML内容
          newContent = content + (content ? '\n\n' : '') + chartUrl + '\n\n';
        } else {
          // 对于图片类型，使用Markdown图片语法
          newContent =
            content + (content ? '\n\n' : '') + `![${title}](${chartUrl})\n\n*${title}*\n\n`;
        }

        onChange(newContent);

        // 立即更新显示
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.innerHTML = renderMarkdown(newContent);
            setLastKnownContent(newContent);

            // 滚动到底部
            editorRef.current.scrollTop = editorRef.current.scrollHeight;

            // 设置焦点到最后
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(editorRef.current);
            range.collapse(false);
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        }, 100);
      };

      return () => {
        delete (window as any).insertChartToContentEditor;
      };
    }, [content, onChange]);

    const handleFocus = () => {
      setIsEditing(true);
      if (editorRef.current) {
        const currentHtml = editorRef.current.innerHTML;
        if (currentHtml.includes('点击开始输入内容')) {
          editorRef.current.innerHTML = '<p style="margin: 12px 0; line-height: 1.6;"><br></p>';

          // 设置光标到段落内
          setTimeout(() => {
            if (editorRef.current) {
              const range = document.createRange();
              const selection = window.getSelection();
              const p = editorRef.current.querySelector('p');
              if (p && selection) {
                range.setStart(p, 0);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
              }
            }
          }, 0);
        }
      }
    };

    const handleBlur = () => {
      setIsEditing(false);
      if (editorRef.current) {
        const currentHtml = editorRef.current.innerHTML;
        const extractedMarkdown = extractMarkdownFromHtml(currentHtml);

        if (extractedMarkdown !== content) {
          onChange(extractedMarkdown);
          setLastKnownContent(extractedMarkdown);
        }

        // 重新渲染为格式化的HTML
        setTimeout(() => {
          if (editorRef.current && !isEditing) {
            editorRef.current.innerHTML =
              renderMarkdown(extractedMarkdown) ||
              '<p style="margin: 12px 0; line-height: 1.6; color: #999;">点击开始输入内容...</p>';
          }
        }, 100);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.execCommand('insertHTML', false, '<br><br>');
      }
    };

    return (
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className="flex-1 p-6 outline-none overflow-y-auto"
          style={{
            minHeight: '300px',
            maxHeight: '100%',
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#333',
          }}
          dangerouslySetInnerHTML={{
            __html:
              renderMarkdown(content) ||
              '<p style="margin: 12px 0; line-height: 1.6; color: #999;">点击开始输入内容...</p>',
          }}
        />
      </div>
    );
  },
);

SimpleEditor.displayName = 'SimpleEditor';

export default SimpleEditor;
