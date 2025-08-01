import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { appInitializer } from './utils/appInitializer';
// 性能监控
const startTime = performance.now();
// 添加全局错误处理
const handleGlobalError = (error, errorInfo) => {
  console.error('全局应用错误:', error, errorInfo);
  // 发送错误报告（可选）
  if (import.meta.env.PROD) {
    // 在生产环境中可以发送到错误监控服务
    // sendErrorReport(error, errorInfo)
  }
};
// 初始化应用
const initializeApp = async () => {
  try {
    console.log('🚀 CMS Content Creator 启动中...');
    // 应用初始化
    await appInitializer.initialize();
    window.appInitializer = appInitializer;
    // 渲染应用
    ReactDOM.createRoot(document.getElementById('root')).render(
      _jsx(React.StrictMode, {
        children: _jsx(ErrorBoundary, {
          showDetails: import.meta.env.DEV,
          onError: handleGlobalError,
          children: _jsx(App, {}),
        }),
      }),
    );
    // 记录启动性能
    const totalStartupTime = performance.now() - startTime;
    console.log(`✅ 应用启动完成，总耗时: ${totalStartupTime.toFixed(2)}ms`);
    // 开发环境性能提示
    if (import.meta.env.DEV && totalStartupTime > 3000) {
      console.warn('⚠️ 应用启动时间较长，建议优化');
    }
  } catch (error) {
    console.error('❌ 应用启动失败:', error);
    // 显示启动失败页面
    ReactDOM.createRoot(document.getElementById('root')).render(
      _jsx('div', {
        className: 'min-h-screen bg-red-50 flex items-center justify-center p-4',
        children: _jsxs('div', {
          className: 'bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center',
          children: [
            _jsx('div', { className: 'text-red-600 text-6xl mb-4', children: '\u26A0\uFE0F' }),
            _jsx('h1', {
              className: 'text-2xl font-bold text-gray-900 mb-4',
              children: '\u542F\u52A8\u5931\u8D25',
            }),
            _jsx('p', {
              className: 'text-gray-600 mb-6',
              children:
                '\u5E94\u7528\u65E0\u6CD5\u6B63\u5E38\u542F\u52A8\uFF0C\u8BF7\u68C0\u67E5\u60A8\u7684\u8BBE\u5907\u914D\u7F6E\u6216\u8054\u7CFB\u6280\u672F\u652F\u6301\u3002',
            }),
            _jsx('button', {
              onClick: () => window.location.reload(),
              className:
                'bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors',
              children: '\u91CD\u65B0\u542F\u52A8',
            }),
            _jsxs('details', {
              className: 'mt-6 text-left',
              children: [
                _jsx('summary', {
                  className: 'cursor-pointer text-gray-500 hover:text-gray-700',
                  children: '\u67E5\u770B\u9519\u8BEF\u8BE6\u60C5',
                }),
                _jsx('pre', {
                  className: 'mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto text-red-600',
                  children: error?.toString(),
                }),
              ],
            }),
          ],
        }),
      }),
    );
  }
};
// 启动应用
initializeApp();
// 开发环境热更新支持
if (import.meta.env.DEV) {
  if (import.meta.hot) {
    import.meta.hot.accept();
  }
}
// 生产环境性能优化
if (import.meta.env.PROD) {
  // 注册Service Worker（如果需要）
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
  // 预加载关键资源
  const preloadCriticalResources = () => {
    const criticalResources = [
      '/icons/icon.png',
      // 添加其他关键资源
    ];
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.png') ? 'image' : 'script';
      document.head.appendChild(link);
    });
  };
  preloadCriticalResources();
}
