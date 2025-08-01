import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import MainContent from './components/layout/MainContent';
import useAppStore from './stores/useAppStore';
import { AppInitializer } from './utils/appInitializer';
import './App.css';
const App = () => {
  const { actions } = useAppStore();
  // 应用启动时初始化
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const initializer = new AppInitializer();
        await initializer.initialize();
      } catch (error) {
        console.error('应用初始化失败:', error);
        // 如果初始化完全失败，尝试加载基础数据
        try {
          await actions.loadDatabase();
        } catch (fallbackError) {
          console.error('基础数据加载也失败:', fallbackError);
        }
      }
    };
    initializeApp();
  }, [actions]);
  return _jsxs('div', {
    className: 'h-screen w-screen flex flex-col overflow-hidden bg-background',
    children: [
      _jsx(Topbar, {}),
      _jsxs('div', {
        className: 'flex flex-1 overflow-hidden min-w-0',
        children: [_jsx(Sidebar, {}), _jsx(MainContent, {})],
      }),
    ],
  });
};
export default App;
