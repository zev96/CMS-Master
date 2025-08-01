import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { appInitializer } from './utils/appInitializer';

// 性能监控
const startTime = performance.now();

// 添加全局错误处理
const handleGlobalError = (error: Error, errorInfo?: any) => {
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

    // 挂载到全局对象供其他组件使用
    (window as any).appInitializer = appInitializer;

    // 渲染应用
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <ErrorBoundary showDetails={import.meta.env.DEV} onError={handleGlobalError}>
          <App />
        </ErrorBoundary>
      </React.StrictMode>,
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
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">启动失败</h1>
          <p className="text-gray-600 mb-6">应用无法正常启动，请检查您的设备配置或联系技术支持。</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            重新启动
          </button>
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
              查看错误详情
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto text-red-600">
              {error?.toString()}
            </pre>
          </details>
        </div>
      </div>,
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
