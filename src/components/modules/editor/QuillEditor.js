import { jsx as _jsx } from 'react/jsx-runtime';
import React, { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const QuillEditor = ({ content, onChange, placeholder = '开始编写内容...', height = 450 }) => {
  const quillRef = useRef(null);
  // 中文排版标准的工具栏配置
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, false] }], // 增加标题1和标题4
          ['bold', 'italic', 'underline'],
          [{ align: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['image', 'link'],
          ['clean'],
        ],
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [],
  );
  // 格式配置
  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'align',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'clean',
  ];
  // 自定义样式
  const editorStyle = {
    height: `${height}px`,
    backgroundColor: '#fff',
  };
  // 添加编辑器容器样式，防止长内容拉伸
  const containerStyle = {
    maxWidth: '100%',
    overflow: 'hidden',
  };
  // 添加中文排版标准样式
  React.useEffect(() => {
    const styleId = 'quill-chinese-typography';
    // 移除已存在的样式
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* 中文排版标准字号设置 */
      .ql-editor {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif !important;
        font-size: 14px !important; /* 正文小四号 */
        line-height: 1.8 !important;
        color: #333 !important;
        padding: 24px !important;
        overflow-y: auto !important;
        word-wrap: break-word !important;
        word-break: break-all !important;
        min-height: ${height - 50}px !important;
      }
      
      /* 标题字号设置 - 按照中文排版标准 */
      .ql-editor h1 {
        font-size: 22px !important; /* 二号 */
        font-weight: 700 !important;
        line-height: 1.4 !important;
        margin: 32px 0 16px 0 !important;
        color: #1a1a1a !important;
        text-align: left !important;
      }
      
      .ql-editor h2 {
        font-size: 18px !important; /* 小二号 */
        font-weight: 600 !important;
        line-height: 1.4 !important;
        margin: 28px 0 14px 0 !important;
        color: #1a1a1a !important;
        text-align: left !important;
      }
      
      .ql-editor h3 {
        font-size: 16px !important; /* 三号 */
        font-weight: 600 !important;
        line-height: 1.5 !important;
        margin: 24px 0 12px 0 !important;
        color: #262626 !important;
        text-align: left !important;
      }
      
      .ql-editor h4 {
        font-size: 14px !important; /* 四号 */
        font-weight: 600 !important;
        line-height: 1.5 !important;
        margin: 20px 0 10px 0 !important;
        color: #262626 !important;
        text-align: left !important;
      }
      
      /* 正文段落 */
      .ql-editor p {
        font-size: 14px !important; /* 小四号 */
        line-height: 1.8 !important;
        margin: 16px 0 !important;
        text-align: justify !important;
        color: #333 !important;
      }
      
      /* 列表样式 */
      .ql-editor ul, .ql-editor ol {
        font-size: 14px !important;
        line-height: 1.8 !important;
        margin: 16px 0 !important;
        padding-left: 28px !important;
      }
      
      .ql-editor li {
        margin: 8px 0 !important;
        line-height: 1.8 !important;
      }
      
      /* 表格样式优化 */
      .ql-editor table {
        width: 100% !important;
        max-width: 100% !important;
        table-layout: fixed !important;
        border-collapse: collapse !important;
        margin: 20px 0 !important;
        font-size: 13px !important;
        background-color: white !important;
      }
      
      .ql-editor table td, .ql-editor table th {
        border: 1px solid #e5e7eb !important;
        padding: 12px 8px !important;
        word-wrap: break-word !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        vertical-align: top !important;
        font-family: inherit !important;
      }
      
      .ql-editor table th {
        font-weight: 600 !important;
        background-color: #f9fafb !important;
        color: #374151 !important;
        font-size: 13px !important;
      }
      
      .ql-editor table td {
        background-color: white !important;
        color: #4b5563 !important;
        font-size: 13px !important;
      }
      
      .ql-editor table tr:nth-child(even) td {
        background-color: #f9fafb !important;
      }
      
      .ql-editor table tr:hover td {
        background-color: #f1f5f9 !important;
      }
      
      /* 代码块样式 */
      .ql-editor pre {
        max-width: 100% !important;
        overflow-x: auto !important;
        white-space: pre-wrap !important;
        word-wrap: break-word !important;
        background-color: #f8f9fa !important;
        padding: 16px !important;
        border-radius: 6px !important;
        border: 1px solid #e9ecef !important;
        font-size: 13px !important;
        line-height: 1.5 !important;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
      }
      
      .ql-editor code {
        background-color: #f1f5f9 !important;
        padding: 2px 6px !important;
        border-radius: 4px !important;
        font-size: 13px !important;
        word-wrap: break-word !important;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
        color: #e11d48 !important;
      }
      
      /* 图片样式 */
      .ql-editor img {
        max-width: 100% !important;
        height: auto !important;
        border-radius: 6px !important;
        margin: 20px 0 !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
      }
      
      /* 引用样式 */
      .ql-editor blockquote {
        border-left: 4px solid #3b82f6 !important;
        margin: 20px 0 !important;
        padding: 16px 20px !important;
        background-color: #f8fafc !important;
        font-style: italic !important;
        color: #64748b !important;
        font-size: 14px !important;
        line-height: 1.7 !important;
      }
      
      /* 链接样式 */
      .ql-editor a {
        color: #3b82f6 !important;
        text-decoration: none !important;
        border-bottom: 1px solid transparent !important;
        transition: border-color 0.2s !important;
      }
      
      .ql-editor a:hover {
        border-bottom-color: #3b82f6 !important;
      }
      
      /* 溢出内容处理 */
      .ql-editor div[style*="overflow-x: auto"] {
        max-width: 100% !important;
        overflow-x: auto !important;
      }
      
      /* 占位符样式 */
      .ql-editor.ql-blank::before {
        color: #9ca3af !important;
        font-style: italic !important;
        font-size: 14px !important;
        left: 24px !important;
        right: 24px !important;
      }
      
      /* 工具栏样式优化 */
      .ql-toolbar {
        border: 1px solid #e5e7eb !important;
        border-bottom: none !important;
        border-radius: 8px 8px 0 0 !important;
        background: #fafafa !important;
        padding: 12px 16px !important;
      }
      
      .ql-container {
        border: 1px solid #e5e7eb !important;
        border-radius: 0 0 8px 8px !important;
        background: #fff !important;
      }
      
      /* 工具栏按钮样式 */
      .ql-toolbar .ql-stroke {
        fill: none !important;
        stroke: #4b5563 !important;
      }
      
      .ql-toolbar .ql-fill {
        fill: #4b5563 !important;
        stroke: none !important;
      }
      
      .ql-toolbar .ql-picker-label {
        color: #4b5563 !important;
      }
      
      .ql-toolbar button:hover,
      .ql-toolbar button:focus,
      .ql-toolbar button.ql-active {
        color: #3b82f6 !important;
      }
      
      .ql-toolbar button:hover .ql-stroke {
        stroke: #3b82f6 !important;
      }
      
      .ql-toolbar button:hover .ql-fill {
        fill: #3b82f6 !important;
      }
      
      .ql-toolbar button.ql-active .ql-stroke {
        stroke: #3b82f6 !important;
      }
      
      .ql-toolbar button.ql-active .ql-fill {
        fill: #3b82f6 !important;
      }
      
      /* 下拉菜单样式 */
      .ql-picker.ql-expanded .ql-picker-options {
        background: #fff !important;
        border: 1px solid #e5e7eb !important;
        border-radius: 6px !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        z-index: 1000 !important;
      }
      
      .ql-picker-options .ql-picker-item {
        padding: 8px 12px !important;
        color: #4b5563 !important;
        font-size: 14px !important;
      }
      
      .ql-picker-options .ql-picker-item:hover {
        background: #f3f4f6 !important;
        color: #3b82f6 !important;
      }
      
      /* 标题选择器样式 */
      .ql-picker-options .ql-picker-item[data-value="1"] {
        font-size: 22px !important;
        font-weight: 700 !important;
      }
      
      .ql-picker-options .ql-picker-item[data-value="2"] {
        font-size: 18px !important;
        font-weight: 600 !important;
      }
      
      .ql-picker-options .ql-picker-item[data-value="3"] {
        font-size: 16px !important;
        font-weight: 600 !important;
      }
      
      .ql-picker-options .ql-picker-item[data-value="4"] {
        font-size: 14px !important;
        font-weight: 600 !important;
      }
      
      /* 链接工具提示样式 */
      .ql-tooltip {
        background: #fff !important;
        border: 1px solid #e5e7eb !important;
        border-radius: 6px !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        color: #4b5563 !important;
        z-index: 1000 !important;
      }
      
      .ql-tooltip input[type=text] {
        border: 1px solid #e5e7eb !important;
        border-radius: 4px !important;
        padding: 6px 8px !important;
        font-size: 14px !important;
      }
      
      .ql-tooltip a.ql-action::after {
        border-right: 1px solid #e5e7eb !important;
        color: #3b82f6 !important;
      }
      
      .ql-tooltip a.ql-remove::before {
        color: #ef4444 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [height]);
  // 处理图片上传
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection();
            const index = range ? range.index : quill.getLength();
            quill.insertEmbed(index, 'image', reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
  };
  // 监听插入内容事件
  React.useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const toolbar = quill.getModule('toolbar');
      toolbar.addHandler('image', imageHandler);
    }
    // 防重复插入机制
    let lastInsertTime = 0;
    const DEBOUNCE_TIME = 300; // 300ms内不允许重复插入
    const handleInsertContent = event => {
      const now = Date.now();
      if (now - lastInsertTime < DEBOUNCE_TIME) {
        console.log('⏱️ 防重复：忽略重复的insertContentAtCursor事件');
        return;
      }
      lastInsertTime = now;
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        const index = range ? range.index : quill.getLength();
        // 插入内容
        quill.clipboard.dangerouslyPasteHTML(index, event.detail.content);
        // 设置光标位置到插入内容之后
        const newIndex = index + event.detail.content.length;
        quill.setSelection(newIndex);
      }
    };
    const handleInsertChart = event => {
      const now = Date.now();
      if (now - lastInsertTime < DEBOUNCE_TIME) {
        console.log('⏱️ 防重复：忽略重复的insertChart事件');
        return;
      }
      lastInsertTime = now;
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        const index = range ? range.index : quill.getLength();
        const chart = event.detail.chart;
        let insertContent = '';
        if (chart.chartType === 'table') {
          // 表格类型：优先使用tableHTML字段，如果没有则使用url字段
          let tableContent = '';
          if (chart.tableHTML) {
            // 新版本：直接使用保存的HTML表格内容
            tableContent = chart.tableHTML;
          } else if (chart.url && chart.url.includes('<table')) {
            // 兼容旧版本：url字段包含HTML表格
            tableContent = chart.url;
          } else {
            // 如果都没有HTML内容，显示为图片
            insertContent = `
              <div style="text-align: center; margin: 20px 0; clear: both;">
                <img src="${chart.url}" alt="${chart.title}" style="max-width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
                <p style="text-align: center; font-size: 14px; color: #666; margin-top: 8px;"><em>${chart.title}</em></p>
              </div>
            `;
          }
          if (tableContent) {
            insertContent = `
              <div style="margin: 20px 0; clear: both; overflow-x: auto;">
                <h4 style="text-align: center; margin-bottom: 15px; color: #374151; font-size: 16px; font-weight: 600;">${chart.title}</h4>
                ${tableContent}
              </div>
            `;
          }
        } else if (chart.url && chart.url.startsWith('data:image')) {
          // 图片图表
          insertContent = `
            <div style="text-align: center; margin: 20px 0; clear: both;">
              <img src="${chart.url}" alt="${chart.title}" style="max-width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
              <p style="text-align: center; font-size: 14px; color: #666; margin-top: 8px;"><em>${chart.title}</em></p>
            </div>
          `;
        } else {
          // 其他类型图表
          insertContent = `<div style="margin: 20px 0; text-align: center;"><p>图表: ${chart.title}</p></div>`;
        }
        // 使用 dangerouslyPasteHTML 确保HTML被正确解析
        quill.clipboard.dangerouslyPasteHTML(index, insertContent);
        // 设置光标位置到插入内容之后
        setTimeout(() => {
          quill.setSelection(index + 1);
        }, 100);
      }
    };
    window.addEventListener('insertContentAtCursor', handleInsertContent);
    window.addEventListener('insertChart', handleInsertChart);
    return () => {
      window.removeEventListener('insertContentAtCursor', handleInsertContent);
      window.removeEventListener('insertChart', handleInsertChart);
    };
  }, []);
  // 处理拖拽事件
  React.useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const editorElement = quill.container;
      const handleDragOver = e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      };
      const handleDrop = e => {
        e.preventDefault();
        try {
          const assetDataString = e.dataTransfer.getData('application/json');
          if (!assetDataString) {
            console.log('❌ 拖拽数据为空');
            return;
          }
          const asset = JSON.parse(assetDataString);
          const selection = quill.getSelection();
          const index = selection ? selection.index : quill.getLength();
          // 准备插入的内容 - 使用与insertChart相同的逻辑
          let insertContent = '';
          if (asset.chartType === 'table' || asset.type === 'chart') {
            // 表格类型：优先使用tableHTML字段，如果没有则使用url字段
            let tableContent = '';
            if (asset.tableHTML) {
              // 新版本：直接使用保存的HTML表格内容
              tableContent = asset.tableHTML;
            } else if (asset.url && asset.url.includes('<table')) {
              // 兼容旧版本：url字段包含HTML表格
              tableContent = asset.url;
            } else if (asset.url && asset.url.startsWith('data:image')) {
              // 如果没有HTML内容，显示为图片
              insertContent = `
                      <div style="text-align: center; margin: 20px 0; clear: both;">
                  <img src="${asset.url}" alt="${asset.title}" style="max-width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
                        <p style="text-align: center; font-size: 14px; color: #666; margin-top: 8px;"><em>${asset.title}</em></p>
                      </div>
                    `;
            }
            if (tableContent) {
              insertContent = `
                <div style="margin: 20px 0; clear: both; overflow-x: auto;">
                  <h4 style="text-align: center; margin-bottom: 15px; color: #374151; font-size: 16px; font-weight: 600;">${asset.title}</h4>
                  ${tableContent}
                </div>
              `;
            }
          } else if (asset.url && asset.url.startsWith('data:image')) {
            // 图片资源
            insertContent = `
                    <div style="text-align: center; margin: 20px 0; clear: both;">
                      <img src="${asset.url}" alt="${asset.title}" style="max-width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
                      <p style="text-align: center; font-size: 14px; color: #666; margin-top: 8px;"><em>${asset.title}</em></p>
                    </div>
                  `;
          } else if (asset.content) {
            // 文本内容
            insertContent = asset.content;
          }
          if (insertContent.trim()) {
            quill.clipboard.dangerouslyPasteHTML(index, insertContent);
            setTimeout(() => {
              quill.setSelection(index + 1);
            }, 50);
          }
        } catch (error) {
          console.error('处理拖拽内容失败:', error);
          const textData = e.dataTransfer.getData('text/plain');
          if (textData) {
            const range = quill.getSelection();
            const index = range ? range.index : quill.getLength();
            quill.insertText(index, textData);
          }
        }
      };
      editorElement.addEventListener('dragover', handleDragOver);
      editorElement.addEventListener('drop', handleDrop);
      return () => {
        editorElement.removeEventListener('dragover', handleDragOver);
        editorElement.removeEventListener('drop', handleDrop);
      };
    }
  }, []);
  return _jsx('div', {
    style: containerStyle,
    children: _jsx(ReactQuill, {
      ref: quillRef,
      theme: 'snow',
      value: content,
      onChange: onChange,
      placeholder: placeholder,
      modules: modules,
      formats: formats,
      style: editorStyle,
    }),
  });
};
export default QuillEditor;
