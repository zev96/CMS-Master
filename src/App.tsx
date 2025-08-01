import React from 'react';
import { useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import MainContent from './components/layout/MainContent';
import useAppStore from './stores/useAppStore';
import { AppInitializer } from './utils/appInitializer';
import './App.css';

const App: React.FC = () => {
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

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      {/* 顶部栏 */}
      <Topbar />

      {/* 主体区域 */}
      <div className="flex flex-1 overflow-hidden min-w-0">
        {/* 侧边栏 */}
        <Sidebar />

        {/* 主内容区 */}
        <MainContent />
      </div>
    </div>
  );
};

export default App;
