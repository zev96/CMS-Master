import { jsx as _jsx } from 'react/jsx-runtime';
import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
const TinyMCEEditorComponent = ({
  content,
  onChange,
  placeholder = '开始编写内容...',
  height = 500,
}) => {
  const editorRef = useRef(null);
  // 知乎/搜狐风格的工具栏配置
  const toolbarConfig = [
    'undo redo | formatselect |',
    'bold italic | alignleft aligncenter alignright |',
    'bullist numlist | image link |',
    'removeformat',
  ].join(' ');
  // 插件配置
  const plugins = [
    'lists',
    'link',
    'image',
    'paste',
    'help',
    'wordcount',
    'autoresize',
    'quickbars',
  ];
  // TinyMCE 初始化配置
  const editorConfig = {
    height: height,
    menubar: false,
    plugins: plugins,
    toolbar: toolbarConfig,
    toolbar_mode: 'floating',
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
    quickbars_insert_toolbar: '',
    // 自托管配置，无需API密钥
    base_url: '/node_modules/tinymce',
    suffix: '.min',
    // 内容样式
    content_style: `
      body { 
        font-family: -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #1a1a1a;
        max-width: none;
        margin: 20px;
      }
      
      p {
        margin: 16px 0;
        text-align: justify;
      }
      
      h2 {
        font-size: 24px;
        font-weight: 600;
        margin: 32px 0 16px 0;
        line-height: 1.3;
        color: #262626;
      }
      
      h3 {
        font-size: 20px;
        font-weight: 600;
        margin: 24px 0 12px 0;
        line-height: 1.4;
        color: #262626;
      }
      
      ul, ol {
        margin: 16px 0;
        padding-left: 28px;
      }
      
      li {
        margin: 8px 0;
        line-height: 1.6;
      }
      
      img {
        max-width: 100%;
        height: auto;
        border-radius: 6px;
        margin: 20px 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      blockquote {
        border-left: 4px solid #0084ff;
        margin: 20px 0;
        padding: 10px 20px;
        background-color: #f8f9fa;
        font-style: italic;
        color: #666;
      }
      
      a {
        color: #0084ff;
        text-decoration: none;
      }
      
      a:hover {
        text-decoration: underline;
      }

      .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
        color: #999;
        font-style: italic;
      }
    `,
    // 占位符
    placeholder: placeholder,
    // 格式选择器
    format_painter_blacklist: 'h1,h4,h5,h6,address,pre,code',
    block_formats: '段落=p; 大标题=h2; 小标题=h3; 引用=blockquote',
    // 自动调整高度
    autoresize_min_height: 300,
    autoresize_max_height: 800,
    autoresize_bottom_margin: 50,
    // 图片上传
    images_upload_handler: (blobInfo, success, failure, progress) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        success(dataUrl);
      };
      reader.onerror = () => failure('图片上传失败');
      reader.readAsDataURL(blobInfo.blob());
    },
    // 粘贴配置
    paste_as_text: false,
    paste_auto_cleanup_on_paste: true,
    paste_remove_styles: true,
    paste_remove_styles_if_webkit: true,
    // 链接配置
    link_assume_external_targets: true,
    link_title: false,
    target_list: false,
    // 中文支持
    language: 'zh_CN',
    language_url: 'https://cdn.jsdelivr.net/npm/tinymce-i18n@23.10.9/langs6/zh_CN.js',
    // 移除一些不需要的功能
    elementpath: false,
    branding: false,
    promotion: false,
    // 自定义样式
    skin: 'oxide',
    content_css: 'default',
    // 初始化回调
    setup: editor => {
      editorRef.current = editor;
      // 自定义快捷键
      editor.addShortcut('Meta+B', 'Bold', () => {
        editor.execCommand('Bold');
      });
      editor.addShortcut('Meta+I', 'Italic', () => {
        editor.execCommand('Italic');
      });
      // 监听内容变化
      editor.on('input change undo redo', () => {
        const content = editor.getContent();
        onChange(content);
      });
      // 监听粘贴事件
      editor.on('paste', e => {
        // 可以在这里处理特殊的粘贴逻辑
      });
    },
  };
  return _jsx('div', {
    className: 'w-full',
    children: _jsx(Editor, {
      value: content,
      init: editorConfig,
      onEditorChange: content => onChange(content),
    }),
  });
};
export default TinyMCEEditorComponent;
