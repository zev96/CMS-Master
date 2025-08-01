import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { cn } from '../../../lib/utils';
import {
  Search,
  Library,
  Trash2,
  Download,
  Eye,
  Copy,
  Calendar,
  BarChart3,
  LineChart,
  PieChart,
  Radar,
  MousePointer,
  Table,
  Plus,
  Package,
} from 'lucide-react';

interface ChartConfig {
  title: string;
  type: 'bar' | 'line' | 'pie' | 'radar' | 'table';
  products: any[];
  parameters: string[];
  theme: string;
}

interface ChartData {
  id: string;
  title: string;
  config: ChartConfig;
  url: string;
  thumbnail: string;
  createdAt: Date;
}

interface ChartLibraryProps {
  charts: ChartData[];
  onChartSelect: (chart: ChartData) => void;
  onChartDelete: (chartId: string) => void;
}

const ChartLibrary: React.FC<ChartLibraryProps> = ({ charts, onChartSelect, onChartDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  // 验证和清理图表数据
  const validatedCharts = React.useMemo(() => {
    return charts
      .filter(chart => {
        try {
          // 验证基本字段
          if (!chart || !chart.id || !chart.title || !chart.config) {
            console.warn('图表数据缺少必要字段:', chart);
            return false;
          }

          // 验证日期字段
          if (!chart.createdAt) {
            console.warn('图表缺少创建时间:', chart.id);
            // 为缺少日期的图表添加默认日期
            chart.createdAt = new Date();
          }

          return true;
        } catch (error) {
          console.error('验证图表数据时出错:', error, chart);
          return false;
        }
      })
      .map(chart => {
        // 确保日期字段是有效的
        try {
          if (typeof chart.createdAt === 'string') {
            chart.createdAt = new Date(chart.createdAt);
          }

          // 如果日期无效，使用当前时间
          if (!chart.createdAt || isNaN(chart.createdAt.getTime())) {
            chart.createdAt = new Date();
          }

          return chart;
        } catch (error) {
          console.error('修复图表日期时出错:', error, chart);
          return {
            ...chart,
            createdAt: new Date(),
          };
        }
      });
  }, [charts]);

  // 图表类型图标映射
  const chartTypeIcons = {
    bar: BarChart3,
    line: LineChart,
    pie: PieChart,
    radar: Radar,
    table: Table,
  };

  // 图表类型名称映射
  const chartTypeNames = {
    bar: '柱形图',
    line: '折线图',
    pie: '饼图',
    radar: '雷达图',
    table: '表格图',
  };

  // 筛选图表 - 使用验证后的数据
  const filteredCharts = validatedCharts.filter(chart => {
    try {
      const matchesSearch =
        chart.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (chart.config.parameters &&
          chart.config.parameters.some(param =>
            param.toLowerCase().includes(searchQuery.toLowerCase()),
          ));
      const matchesType = selectedType === 'all' || chart.config.type === selectedType;

      return matchesSearch && matchesType;
    } catch (error) {
      console.error('筛选图表时出错:', error, chart);
      return false;
    }
  });

  // 处理图表使用（点击事件）

  // 处理图表使用按钮点击
  const handleUseChart = (chart: ChartData) => {
    // 触发自定义事件，让编辑器处理图表插入
    const insertEvent = new CustomEvent('insertChart', {
      detail: {
        chart: {
          type: 'chart',
          id: chart.id,
          title: chart.title,
          url: chart.url,
          chartType: chart.config.type,
          data: chart.config,
        },
      },
    });
    window.dispatchEvent(insertEvent);
  };

  // 格式化日期
  const formatDate = (date: Date | string | null | undefined) => {
    try {
      // 处理 null、undefined 或空值
      if (!date) {
        return '未知时间';
      }

      let dateObj: Date;

      if (typeof date === 'string') {
        dateObj = new Date(date);
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        return '未知时间';
      }

      // 检查日期是否有效
      if (!dateObj || isNaN(dateObj.getTime()) || dateObj.getTime() === 0) {
        return '未知时间';
      }

      // 确保日期在合理范围内（1970年到2100年）
      const timestamp = dateObj.getTime();
      if (timestamp < 0 || timestamp > 4102444800000) {
        // 2100年1月1日
        return '未知时间';
      }

      return new Intl.DateTimeFormat('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(dateObj);
    } catch (error) {
      console.warn('日期格式化失败:', date, error);
      return '未知时间';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-base">
          <Library className="w-4 h-4" />
          <span>图表库</span>
          <Badge variant="secondary" className="text-xs">
            {validatedCharts.length}
          </Badge>
        </CardTitle>

        {/* 搜索和筛选 */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索图表..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 h-8 text-sm"
            />
          </div>

          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border rounded-md bg-background"
          >
            <option value="all">全部类型</option>
            <option value="bar">柱形图</option>
            <option value="line">折线图</option>
            <option value="table">表格图</option>
            <option value="pie">饼图</option>
            <option value="radar">雷达图</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        {validatedCharts.length === 0 ? (
          // 空状态
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Library className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h4 className="font-medium mb-2">还没有图表</h4>
            <p className="text-sm text-muted-foreground mb-4">生成的图表会保存在这里</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>💡 提示：</p>
              <p>• 点击使用按钮导入图表</p>
              <p>• 支持搜索和分类筛选</p>
            </div>
          </div>
        ) : (
          // 图表列表
          <div className="h-full overflow-y-auto p-4 space-y-3">
            {filteredCharts.map(chart => {
              const Icon = chartTypeIcons[chart.config.type] || BarChart3;

              return (
                <Card
                  key={chart.id}
                  className="group cursor-pointer transition-all duration-200 hover:shadow-lg bg-white border border-gray-200 hover:border-blue-300"
                  onClick={() => onChartSelect(chart)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            'p-2 rounded-lg',
                            chart.config.type === 'bar'
                              ? 'bg-blue-100 text-blue-600'
                              : chart.config.type === 'line'
                                ? 'bg-green-100 text-green-600'
                                : chart.config.type === 'pie'
                                  ? 'bg-purple-100 text-purple-600'
                                  : chart.config.type === 'radar'
                                    ? 'bg-orange-100 text-orange-600'
                                    : 'bg-gray-100 text-gray-600',
                          )}
                        >
                          {React.createElement(chartTypeIcons[chart.config.type], {
                            className: 'w-5 h-5',
                          })}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {chart.title}
                          </CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {chartTypeNames[chart.config.type]}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            handleUseChart(chart);
                          }}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          使用
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            onChartDelete(chart.id);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* 图表缩略图或预览 */}
                    <div className="mb-4">
                      {chart.thumbnail ? (
                        <div className="w-full h-32 bg-gray-50 rounded-lg overflow-hidden border">
                          <img
                            src={chart.thumbnail}
                            alt={chart.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-32 bg-gray-50 rounded-lg border flex items-center justify-center">
                          {React.createElement(chartTypeIcons[chart.config.type], {
                            className: 'w-12 h-12 text-gray-400',
                          })}
                        </div>
                      )}
                    </div>

                    {/* 图表信息 */}
                    <div className="space-y-3">
                      {/* 产品和参数统计 */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Package className="w-4 h-4" />
                            <span>{(chart.config.products || []).length} 个产品</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <BarChart3 className="w-4 h-4" />
                            <span>{(chart.config.parameters || []).length} 个参数</span>
                          </span>
                        </div>
                      </div>

                      {/* 参数标签 */}
                      {chart.config.parameters && chart.config.parameters.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {chart.config.parameters.slice(0, 3).map(param => (
                            <Badge key={param} variant="outline" className="text-xs">
                              {param}
                            </Badge>
                          ))}
                          {chart.config.parameters.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{chart.config.parameters.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* 创建时间 */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>创建于 {formatDate(chart.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                          <MousePointer className="w-3 h-3" />
                          <span>点击使用</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* 搜索无结果 */}
            {filteredCharts.length === 0 && validatedCharts.length > 0 && (
              <div className="text-center py-8">
                <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">未找到匹配的图表</p>
                <p className="text-xs text-muted-foreground mt-1">尝试调整搜索条件</p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* 底部提示 */}
      {validatedCharts.length > 0 && (
        <div className="px-4 py-2 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            💡 将图表拖拽到内容编辑器中使用
          </p>
        </div>
      )}
    </Card>
  );
};

export default ChartLibrary;
