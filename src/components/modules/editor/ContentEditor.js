import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useEffect, useRef } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import useAppStore from '../../../stores/useAppStore';
import QuillEditor from './QuillEditor';
import {
  Save,
  Eye,
  Pen,
  Trash2,
  FileDown,
  Download,
  FileText,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useToast } from '../../ui/use-toast';
import { saveAs } from 'file-saver';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
const getChineseNumber = num => {
  const nums = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  if (num <= 10) return nums[num];
  return num.toString();
};
const ContentEditor = ({ template, article, onSave, onExport, className }) => {
  const { currentTemplateInEditor: activeTemplate, actions } = useAppStore();
  const { toast } = useToast();
  const [editorState, setEditorState] = useState({ title: '', subtitle: '', content: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const autoSaveTimeoutRef = useRef(null);
  const editorContainerRef = useRef(null);
  // 初始化编辑器状态
  useEffect(() => {
    console.log('🔄 编辑器初始化, activeTemplate:', activeTemplate?.name);
    let initialState = { title: '', subtitle: '', content: '' };
    // 首先检查是否有已保存的用户修改内容（优先级最高）
    const savedContent = actions.getEditorContent();
    const isTemplateModified = actions.isTemplateModified();
    if (savedContent && isTemplateModified) {
      try {
        const savedState = JSON.parse(savedContent);
        if (
          typeof savedState === 'object' &&
          savedState !== null &&
          savedState.content !== undefined
        ) {
          initialState = { ...initialState, ...savedState };
          console.log('✅ 恢复已保存的编辑器内容（优先）');
        } else {
          initialState.content = savedContent;
          console.log('✅ 恢复已保存的纯文本内容（优先）');
        }
      } catch (e) {
        initialState.content = savedContent;
        console.log('✅ 恢复已保存的内容（解析异常时使用原始内容，优先）');
      }
    }
    // 如果没有已保存的内容且有activeTemplate，使用模板内容（新使用的模板）
    else if (activeTemplate && !isTemplateModified) {
      let templateContent = '';
      activeTemplate.structure.forEach((section, index) => {
        const chineseNum = getChineseNumber(index + 1);
        templateContent += `<h2>${chineseNum}、${section.title}</h2>\n`;
        if (section.content && section.content.trim() !== '') {
          templateContent += section.content;
        } else {
          templateContent += `<p>请在此处添加${section.title}的具体内容...</p>\n`;
        }
        templateContent += '\n';
      });
      initialState = {
        title: activeTemplate.main_title,
        subtitle: '',
        content: templateContent,
      };
      console.log('✅ 使用模板内容初始化编辑器:', activeTemplate.name);
      // 立即标记为已修改并清除模板状态
      actions.markTemplateAsModified();
      // 清除当前模板状态，避免重复应用
      setTimeout(() => {
        actions.clearTemplateInEditor();
      }, 0);
    }
    // 如果有文章数据，使用文章内容
    else if (article) {
      initialState = {
        title: article.title || '',
        subtitle: article.subtitle || '',
        content: article.content || '',
      };
      console.log('✅ 使用文章内容初始化编辑器');
    }
    setEditorState(initialState);
    setIsLoading(false);
  }, [activeTemplate]); // 监听activeTemplate变化
  const { title, subtitle, content } = editorState;
  const updateEditorState = newState => {
    setEditorState(prevState => ({ ...prevState, ...newState }));
  };
  const insertAssetContent = asset => {
    let insertText = '';
    if ('content' in asset) {
      insertText = asset.content;
    } else if (asset.type === 'chart') {
      insertText = `<img src="${asset.url}" alt="${asset.title}" />`;
    } else {
      insertText = `<img src="${asset.url}" alt="${asset.title}" />`;
    }
    const insertEvent = new CustomEvent('insertContentAtCursor', {
      detail: { content: insertText },
    });
    window.dispatchEvent(insertEvent);
  };
  const insertChartContent = chart => {
    const insertText = `<img src="${chart.url}" alt="${chart.title}" />`;
    const insertEvent = new CustomEvent('insertContentAtCursor', {
      detail: { content: insertText },
    });
    window.dispatchEvent(insertEvent);
  };
  useEffect(() => {
    if (isLoading) return;
    const handleAssetInsert = event => {
      insertAssetContent(event.detail.asset);
    };
    const handleChartInsert = event => {
      insertChartContent(event.detail.chart);
    };
    window.addEventListener('insertAsset', handleAssetInsert);
    window.addEventListener('insertChart', handleChartInsert);
    return () => {
      window.removeEventListener('insertAsset', handleAssetInsert);
      window.removeEventListener('insertChart', handleChartInsert);
    };
  }, [isLoading]);
  useEffect(() => {
    if (isLoading) return;
    const textContent = content.replace(/<[^>]*>/g, '');
    const totalWords = textContent.length + title.length + subtitle.length;
    setWordCount(totalWords);
  }, [content, title, subtitle, isLoading]);
  useEffect(() => {
    // 当编辑器状态发生变化时，启动自动保存
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    setAutoSaveStatus('unsaved');
    autoSaveTimeoutRef.current = setTimeout(() => {
      try {
        const contentToSave = JSON.stringify(editorState);
        actions.saveEditorContent(contentToSave);
        setAutoSaveStatus('saved');
        console.log('✅ 自动保存成功');
      } catch (error) {
        console.error('❌ 自动保存失败:', error);
        setAutoSaveStatus('unsaved');
      }
    }, 1000); // 1秒后自动保存
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [editorState, actions]);
  const handleAutoSave = () => {
    setAutoSaveStatus('saving');
    console.log('💾 正在自动保存状态:', editorState);
    actions.saveEditorContent(JSON.stringify(editorState));
    setTimeout(() => {
      setAutoSaveStatus('saved');
    }, 500);
  };
  const handleSave = () => {
    if (onSave) {
      handleAutoSave();
      onSave({
        id: article?.id,
        title: editorState.title,
        content: editorState.content,
      });
      toast({
        title: '保存成功',
        description: '文章已成功保存',
        variant: 'default',
      });
    }
  };
  const handleClearEditor = () => {
    if (confirm('确定要清空当前编辑内容吗？此操作不可撤销。')) {
      updateEditorState({ title: '', subtitle: '', content: '' });
      actions.clearEditorContent();
      console.log('🧹 用户手动清空编辑器内容');
      toast({
        title: '内容已清空',
        description: '编辑器内容已被清空',
        variant: 'default',
      });
    }
  };
  const handleRestoreContent = () => {
    const savedContent = actions.getEditorContent();
    if (savedContent) {
      if (confirm('发现有上次未保存的内容，是否恢复？')) {
        try {
          const editorState = JSON.parse(savedContent);
          updateEditorState(editorState);
          console.log('✅ 手动恢复内容成功');
          setAutoSaveStatus('saved');
          toast({
            title: '内容已恢复',
            description: '已成功恢复之前的编辑内容',
            variant: 'default',
          });
        } catch (error) {
          console.log('⚠️ 手动恢复时解析失败，使用原始内容:', error);
          updateEditorState({ content: savedContent });
          setAutoSaveStatus('saved');
        }
      }
    } else {
      toast({
        title: '没有可恢复的内容',
        description: '未找到可以恢复的内容',
        variant: 'destructive',
      });
    }
  };
  // 增强的导出功能
  const generateExportContent = format => {
    const timestamp = new Date().toLocaleDateString('zh-CN');
    switch (format) {
      case 'markdown':
        const markdownContent = `# ${title}

${subtitle ? `> ${subtitle}\n` : ''}
${subtitle ? `---\n` : ''}

${content
  .replace(/<[^>]*>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')}

---
*导出时间: ${timestamp}*`;
        return markdownContent;
      case 'html':
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 40px 20px; 
            line-height: 1.8; 
            color: #333;
            background: #fff;
        }
        h1 { 
            color: #2c3e50; 
            border-bottom: 3px solid #3498db; 
            padding-bottom: 15px; 
            margin-bottom: 30px;
            font-size: 2.5em;
            font-weight: 700;
        }
        h2 { 
            color: #34495e; 
            margin-top: 40px; 
            margin-bottom: 20px;
            font-size: 1.8em;
            font-weight: 600;
        }
        h3 { 
            color: #2980b9; 
            margin-top: 30px; 
            margin-bottom: 15px;
            font-size: 1.3em;
            font-weight: 600;
        }
        p { 
            margin: 18px 0; 
            text-align: justify; 
            font-size: 16px;
        }
        img { 
            max-width: 100%; 
            height: auto; 
            border-radius: 8px; 
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            margin: 20px 0;
            display: block;
        }
        blockquote {
            border-left: 4px solid #3498db;
            margin: 20px 0;
            padding: 15px 20px;
            background-color: #f8f9fa;
            font-style: italic;
            color: #555;
        }
        ul, ol {
            padding-left: 30px;
            margin: 20px 0;
        }
        li {
            margin: 8px 0;
            line-height: 1.6;
        }
        .subtitle {
            font-size: 1.2em;
            color: #7f8c8d;
            font-style: italic;
            margin-bottom: 30px;
            text-align: center;
        }
        .export-info {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
            font-size: 0.9em;
            color: #95a5a6;
            text-align: center;
        }
        @media print {
            body { max-width: none; margin: 0; padding: 20px; }
        }
    </style>
</head>
<body>
    <h1>${title}</h1>
    ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ''}
    <div class="content">${content}</div>
    <div class="export-info">
        <p>导出时间: ${timestamp}</p>
    </div>
</body>
</html>`;
      case 'docx':
        // 生成RTF格式，兼容Word
        const cleanedContent = content
          .replace(/<h1[^>]*>/g, '\\par\\b\\fs28 ')
          .replace(/<\/h1>/g, '\\b0\\par')
          .replace(/<h2[^>]*>/g, '\\par\\b\\fs24 ')
          .replace(/<\/h2>/g, '\\b0\\par')
          .replace(/<h3[^>]*>/g, '\\par\\b\\fs20 ')
          .replace(/<\/h3>/g, '\\b0\\par')
          .replace(/<p[^>]*>/g, '\\par ')
          .replace(/<\/p>/g, '')
          .replace(/<br\s*\/?>/g, '\\par')
          .replace(/<strong[^>]*>/g, '\\b ')
          .replace(/<\/strong>/g, '\\b0 ')
          .replace(/<em[^>]*>/g, '\\i ')
          .replace(/<\/em>/g, '\\i0 ')
          .replace(/<[^>]*>/g, ''); // 移除其他HTML标签
        return `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 微软雅黑;}}
\\f0\\fs22
{\\qc\\b\\fs28 ${title}\\b0\\par}
${subtitle ? `{\\qc\\fs20 ${subtitle}\\par}` : ''}
\\par
${cleanedContent}
\\par
{\\qc\\fs16 导出时间: ${timestamp}\\par}
}`;
      default:
        return content;
    }
  };
  const downloadFile = async (content, filename, format) => {
    const mimeTypes = {
      markdown: 'text/markdown;charset=utf-8',
      html: 'text/html;charset=utf-8',
      docx: 'application/rtf', // 改用RTF格式，Word可以直接打开
      txt: 'text/plain;charset=utf-8',
    };
    try {
      // 为Word文档使用特殊文件名
      const actualFilename = format === 'docx' ? filename.replace('.docx', '.doc') : filename;
      const blob = new Blob([content], {
        type: mimeTypes[format] || 'text/plain;charset=utf-8',
      });
      saveAs(blob, actualFilename);
      toast({
        title: '导出成功',
        description: `文件 ${actualFilename} 已开始下载`,
        variant: 'default',
      });
    } catch (error) {
      console.error('导出失败:', error);
      toast({
        title: '导出失败',
        description: '文档导出过程中出现错误',
        variant: 'destructive',
      });
    }
  };
  const handleExport = async format => {
    if (!title.trim()) {
      toast({
        title: '请先输入标题',
        description: '导出前请为文章添加标题',
        variant: 'destructive',
      });
      return;
    }
    if (onExport) {
      onExport(format);
    } else {
      const exportContent = generateExportContent(format);
      const timestamp = new Date().toISOString().slice(0, 10);
      const safeTitle = title.replace(/[<>:"/\\|?*]/g, '_'); // 清理文件名中的非法字符
      const filename = `${safeTitle}_${timestamp}.${format}`;
      // 显示导出提示
      toast({
        title: '开始导出',
        description: `正在生成 ${format.toUpperCase()} 文档...`,
        variant: 'default',
      });
      await downloadFile(exportContent, filename, format);
    }
  };
  const PreviewRenderer = ({ content }) =>
    _jsxs('div', {
      className: 'prose lg:prose-xl max-w-full mx-auto',
      children: [
        _jsx('h1', { className: 'text-3xl font-bold text-gray-900 mb-4', children: title }),
        subtitle && _jsx('h2', { className: 'text-xl text-gray-600 mb-6', children: subtitle }),
        _jsx('div', { className: 'prose-content', dangerouslySetInnerHTML: { __html: content } }),
      ],
    });
  const AutoSaveIndicator = () =>
    _jsxs('div', {
      className: 'flex items-center space-x-2',
      children: [
        _jsx('div', {
          className: `w-2 h-2 rounded-full ${
            autoSaveStatus === 'saving'
              ? 'bg-yellow-500 animate-pulse'
              : autoSaveStatus === 'saved'
                ? 'bg-green-500'
                : 'bg-gray-400'
          }`,
        }),
        _jsxs('span', {
          className: 'text-sm text-gray-600',
          children: [
            autoSaveStatus === 'saving' && '保存中...',
            autoSaveStatus === 'saved' && '已保存',
            autoSaveStatus === 'unsaved' && '有未保存更改',
          ],
        }),
      ],
    });
  if (isLoading) {
    return _jsx('div', {
      className: 'flex justify-center items-center h-full bg-gray-50',
      children: _jsxs('div', {
        className: 'text-center',
        children: [
          _jsx('div', {
            className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto',
          }),
          _jsx('p', {
            className: 'mt-4 text-gray-600',
            children: '\u6B63\u5728\u52A0\u8F7D\u7F16\u8F91\u5668...',
          }),
        ],
      }),
    });
  }
  return _jsxs('div', {
    className: `flex flex-col h-full bg-white ${fullscreen ? 'fixed inset-0 z-50' : ''} ${className}`,
    children: [
      _jsxs('div', {
        className: 'flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm',
        children: [
          _jsxs('div', {
            className: 'flex items-center space-x-4',
            children: [
              _jsxs('div', {
                className: 'flex items-center space-x-2',
                children: [
                  _jsx(FileText, { className: 'w-5 h-5 text-blue-600' }),
                  _jsx('span', {
                    className: 'font-medium text-gray-700',
                    children: '\u5185\u5BB9\u7F16\u8F91\u5668',
                  }),
                ],
              }),
              _jsxs(Badge, {
                variant: 'outline',
                className: 'text-xs',
                children: [wordCount, ' \u5B57'],
              }),
              _jsx(AutoSaveIndicator, {}),
            ],
          }),
          _jsxs('div', {
            className: 'flex items-center space-x-2',
            children: [
              _jsxs(Button, {
                onClick: () => setPreviewMode(!previewMode),
                variant: previewMode ? 'default' : 'outline',
                size: 'sm',
                className: 'flex items-center space-x-2',
                children: [
                  previewMode
                    ? _jsx(Pen, { className: 'w-4 h-4' })
                    : _jsx(Eye, { className: 'w-4 h-4' }),
                  _jsx('span', { children: previewMode ? '编辑模式' : '预览模式' }),
                ],
              }),
              _jsx(Button, {
                onClick: () => setFullscreen(!fullscreen),
                variant: 'outline',
                size: 'sm',
                children: fullscreen
                  ? _jsx(Minimize2, { className: 'w-4 h-4' })
                  : _jsx(Maximize2, { className: 'w-4 h-4' }),
              }),
              _jsxs(DropdownMenu, {
                children: [
                  _jsxs(DropdownMenuTrigger, {
                    children: [_jsx(Download, { className: 'w-4 h-4 mr-2' }), '\u5BFC\u51FA'],
                  }),
                  _jsxs(DropdownMenuContent, {
                    align: 'end',
                    className: 'w-48',
                    children: [
                      _jsx('div', {
                        className: 'px-2 py-1.5 text-sm font-semibold text-gray-700',
                        children: '\u5BFC\u51FA\u683C\u5F0F',
                      }),
                      _jsx(DropdownMenuSeparator, {}),
                      _jsxs(DropdownMenuItem, {
                        onClick: () => handleExport('html'),
                        children: [
                          _jsx(FileText, { className: 'w-4 h-4 mr-2' }),
                          'HTML \u7F51\u9875',
                        ],
                      }),
                      _jsxs(DropdownMenuItem, {
                        onClick: () => handleExport('markdown'),
                        children: [
                          _jsx(FileText, { className: 'w-4 h-4 mr-2' }),
                          'Markdown \u6587\u6863',
                        ],
                      }),
                      _jsxs(DropdownMenuItem, {
                        onClick: () => handleExport('docx'),
                        children: [
                          _jsx(FileText, { className: 'w-4 h-4 mr-2' }),
                          'Word \u6587\u6863 (.doc)',
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              _jsxs(Button, {
                onClick: handleSave,
                size: 'sm',
                disabled: !onSave,
                className: 'bg-blue-600 hover:bg-blue-700',
                children: [_jsx(Save, { className: 'w-4 h-4 mr-2' }), '\u4FDD\u5B58\u6587\u7AE0'],
              }),
            ],
          }),
        ],
      }),
      _jsx('div', {
        className: 'px-6 py-4 bg-gray-50 border-b',
        children: _jsxs('div', {
          className: 'space-y-3',
          children: [
            _jsx(Input, {
              value: title,
              onChange: e => updateEditorState({ title: e.target.value }),
              placeholder: '\u8BF7\u8F93\u5165\u6587\u7AE0\u6807\u9898...',
              className:
                'text-2xl font-bold border-none bg-transparent px-0 placeholder:text-gray-400 focus:ring-0 focus:outline-none',
              style: { fontSize: '24px', lineHeight: '1.2' },
            }),
            _jsx(Input, {
              value: subtitle,
              onChange: e => updateEditorState({ subtitle: e.target.value }),
              placeholder: '\u8BF7\u8F93\u5165\u526F\u6807\u9898\uFF08\u53EF\u9009\uFF09...',
              className:
                'text-lg text-gray-600 border-none bg-transparent px-0 placeholder:text-gray-400 focus:ring-0 focus:outline-none',
            }),
          ],
        }),
      }),
      _jsx('div', {
        className: 'flex-1 overflow-hidden',
        children: _jsx('div', {
          className: 'h-full p-6',
          ref: editorContainerRef,
          children: previewMode
            ? _jsx('div', {
                className: 'h-full overflow-y-auto',
                children: _jsx(PreviewRenderer, { content: content }),
              })
            : _jsx(QuillEditor, {
                content: content,
                onChange: newContent => updateEditorState({ content: newContent }),
                placeholder: '\u5F00\u59CB\u5199\u4F5C...',
                height: fullscreen ? window.innerHeight - 280 : 500,
              }),
        }),
      }),
      _jsxs('div', {
        className: 'flex items-center justify-between px-6 py-3 border-t bg-gray-50',
        children: [
          _jsxs('div', {
            className: 'flex items-center space-x-3',
            children: [
              _jsxs(Button, {
                onClick: handleClearEditor,
                variant: 'destructive',
                size: 'sm',
                children: [_jsx(Trash2, { className: 'w-4 h-4 mr-2' }), '\u6E05\u7A7A\u5185\u5BB9'],
              }),
              _jsxs(Button, {
                onClick: handleRestoreContent,
                variant: 'outline',
                size: 'sm',
                children: [
                  _jsx(FileDown, { className: 'w-4 h-4 mr-2' }),
                  '\u6062\u590D\u5185\u5BB9',
                ],
              }),
            ],
          }),
          _jsxs('div', {
            className: 'flex items-center space-x-4 text-sm text-gray-500',
            children: [
              _jsxs('span', { children: ['\u5171 ', wordCount, ' \u5B57'] }),
              _jsx('span', { children: '\u2022' }),
              _jsxs('span', {
                children: ['\u6700\u540E\u4FDD\u5B58: ', new Date().toLocaleTimeString()],
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
export default ContentEditor;
