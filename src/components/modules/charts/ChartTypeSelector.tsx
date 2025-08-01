import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { cn } from '../../../lib/utils';
import {
  BarChart3,
  LineChart,
  PieChart,
  Radar,
  Table,
  ChevronRight,
  ChevronLeft,
  Palette,
  Type,
  Sparkles,
} from 'lucide-react';

interface ChartTypeSelectorProps {
  chartType: 'bar' | 'line' | 'pie' | 'radar' | 'table';
  chartTitle: string;
  chartTheme: string;
  onChartTypeChange: (type: 'bar' | 'line' | 'pie' | 'radar' | 'table') => void;
  onTitleChange: (title: string) => void;
  onThemeChange: (theme: string) => void;
  onGenerate: () => void;
  onBack: () => void;
  isGenerating: boolean;
}

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
  chartType,
  chartTitle,
  chartTheme,
  onChartTypeChange,
  onTitleChange,
  onThemeChange,
  onGenerate,
  onBack,
  isGenerating,
}) => {
  // 图表类型配置
  const chartTypes = [
    {
      id: 'bar' as const,
      name: '柱状图',
      description: '适合对比数值大小差异',
      icon: BarChart3,
      bestFor: '价格、重量、功率等数值对比',
      pros: ['直观对比', '易于理解', '支持多系列'],
    },
    {
      id: 'line' as const,
      name: '折线图',
      description: '适合显示趋势变化',
      icon: LineChart,
      bestFor: '性能变化、时间序列数据',
      pros: ['趋势明显', '连续性好', '数据关联性强'],
    },
    {
      id: 'pie' as const,
      name: '饼图',
      description: '适合显示占比关系',
      icon: PieChart,
      bestFor: '市场份额、成本构成',
      pros: ['占比清晰', '视觉冲击', '简洁明了'],
    },
    {
      id: 'radar' as const,
      name: '雷达图',
      description: '适合多维度综合对比',
      icon: Radar,
      bestFor: '综合性能、多参数评估',
      pros: ['多维展示', '全面对比', '专业感强'],
    },
    {
      id: 'table' as const,
      name: '对比表格',
      description: '清晰展示详细数据对比',
      icon: Table,
      bestFor: '详细参数对比、规格列表',
      pros: ['数据详细', '易于对比', '专业严谨'],
    },
  ];

  // 主题配置
  const themes = [
    {
      id: 'default',
      name: '默认主题',
      colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
      description: '经典配色，适合商务场景',
    },
    {
      id: 'business',
      name: '商务主题',
      colors: ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed'],
      description: '专业商务风格',
    },
    {
      id: 'modern',
      name: '现代主题',
      colors: ['#06b6d4', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'],
      description: '时尚现代配色',
    },
    {
      id: 'dark',
      name: '深色主题',
      colors: ['#60a5fa', '#f87171', '#34d399', '#fbbf24', '#a78bfa'],
      description: '深色背景适配',
    },
  ];

  const selectedTheme = themes.find(t => t.id === chartTheme) || themes[0];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="w-5 h-5" />
          <span>配置图表样式</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">选择图表类型、设置标题和主题样式</p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* 图表标题设置 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Type className="w-4 h-4 text-muted-foreground" />
            <h4 className="font-medium text-sm">图表标题</h4>
          </div>
          <Input
            placeholder="输入图表标题..."
            value={chartTitle}
            onChange={e => onTitleChange(e.target.value)}
            className="text-base"
          />
        </div>

        {/* 图表类型选择 */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">选择图表类型</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chartTypes.map(type => {
              const Icon = type.icon;
              const isSelected = chartType === type.id;

              return (
                <div
                  key={type.id}
                  className={cn(
                    'p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/50',
                  )}
                  onClick={() => onChartTypeChange(type.id)}
                >
                  <div className="space-y-3">
                    {/* 图表类型标题 */}
                    <div className="flex items-center space-x-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted',
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-semibold">{type.name}</h5>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>

                    {/* 适用场景 */}
                    <div className="text-sm">
                      <span className="font-medium text-muted-foreground">适用于：</span>
                      <span className="ml-1">{type.bestFor}</span>
                    </div>

                    {/* 优势特点 */}
                    <div className="flex flex-wrap gap-1">
                      {type.pros.map(pro => (
                        <span
                          key={pro}
                          className="inline-flex items-center px-2 py-1 text-xs bg-muted rounded-md"
                        >
                          {pro}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 主题选择 */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">选择配色主题</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map(theme => {
              const isSelected = chartTheme === theme.id;

              return (
                <div
                  key={theme.id}
                  className={cn(
                    'p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/50',
                  )}
                  onClick={() => onThemeChange(theme.id)}
                >
                  <div className="space-y-3">
                    {/* 主题名称 */}
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold">{theme.name}</h5>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>

                    {/* 颜色预览 */}
                    <div className="flex space-x-1">
                      {theme.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-md border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {/* 主题描述 */}
                    <p className="text-sm text-muted-foreground">{theme.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 预览信息 */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h5 className="font-medium">配置预览</h5>
              <div className="text-sm text-muted-foreground mt-1 space-y-1">
                <p>标题：{chartTitle || '产品参数对比'}</p>
                <p>类型：{chartTypes.find(t => t.id === chartType)?.name}</p>
                <p>主题：{selectedTheme.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
            <ChevronLeft className="w-4 h-4" />
            <span>上一步</span>
          </Button>

          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>生成中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>生成图表</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartTypeSelector;
