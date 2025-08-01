import React, { useState } from 'react';
import useAppStore from '../../../stores/useAppStore';

import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Edit3, Image, BarChart3 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import ContentEditor from './ContentEditor';
import AssetPicker from '../assets/AssetPicker';

interface EditorModuleProps {
  className?: string;
}

const EditorModule: React.FC<EditorModuleProps> = ({ className }) => {
  const [activeLibraryTab, setActiveLibraryTab] = useState<'assets' | 'charts'>('assets');
  const [ChartLibrary, setChartLibrary] = useState<any>(null);
  const { charts, actions } = useAppStore();

  React.useEffect(() => {
    const loadChartLibrary = async () => {
      try {
        const { default: Component } = await import('../charts/ChartLibrary');
        setChartLibrary(() => Component);
      } catch (error) {
        console.error('加载图表库失败:', error);
      }
    };
    loadChartLibrary();
  }, []);

  return (
    <div className={cn('flex flex-col h-full bg-muted/30', className)}>
      {/* 主要工作区域 - 左右两栏布局 */}
      <div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* 左侧：素材库和图表库区域 - 固定宽度 */}
        <div className="w-[480px] min-h-0 flex flex-col">
          {/* 选项卡切换 */}
          <div className="flex bg-white rounded-lg p-1 mb-4 shadow-sm">
            <Button
              variant={activeLibraryTab === 'assets' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveLibraryTab('assets')}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <Image className="w-4 h-4" />
              <span>素材库</span>
            </Button>
            <Button
              variant={activeLibraryTab === 'charts' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveLibraryTab('charts')}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>图表库</span>
            </Button>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 min-h-0">
            {activeLibraryTab === 'assets' ? (
              <AssetPicker />
            ) : ChartLibrary ? (
              <ChartLibrary
                charts={charts}
                onChartSelect={(chart: any) => {
                  console.log('选择图表:', chart);
                  // 这里可以添加图表预览功能
                }}
                onChartDelete={(chartId: string) => {
                  actions.deleteChart(chartId);
                }}
              />
            ) : (
              <Card className="h-full">
                <CardContent className="p-6 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>正在加载图表库...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 右侧：内容编辑器区域 - 占剩余空间 */}
        <div className="flex-1 min-h-0">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2 shrink-0">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Edit3 className="w-4 h-4" />
                <span>内容创作区</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 min-h-0">
              <ContentEditor className="h-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditorModule;
