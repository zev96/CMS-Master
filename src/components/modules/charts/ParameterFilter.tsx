import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { cn } from '../../../lib/utils';
import {
  Search,
  Check,
  Settings,
  ChevronRight,
  ChevronLeft,
  Zap,
  Battery,
  Gauge,
} from 'lucide-react';

interface ParameterFilterProps {
  availableParameters: string[];
  selectedParameters: string[];
  onSelectionChange: (parameters: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  getParameterRange?: (parameter: string) => { min: number; max: number; count: number } | null;
}

const ParameterFilter: React.FC<ParameterFilterProps> = ({
  availableParameters,
  selectedParameters,
  onSelectionChange,
  onNext,
  onBack,
  getParameterRange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // 参数分类和图标映射
  const parameterCategories = {
    基本参数: {
      icon: Settings,
      keywords: ['价格', '重量', '尺寸', '容量', '型号', 'price', 'weight', 'size', 'capacity'],
    },
    性能参数: {
      icon: Zap,
      keywords: ['功率', '吸力', '转速', '噪音', 'power', 'suction', 'speed', 'noise'],
    },
    电池参数: {
      icon: Battery,
      keywords: ['电池', '续航', '充电', '电压', 'battery', 'runtime', 'charge', 'voltage'],
    },
    其他参数: {
      icon: Gauge,
      keywords: [],
    },
  };

  // 将参数分类
  const categorizeParameter = (param: string) => {
    const paramLower = param.toLowerCase();

    for (const [category, config] of Object.entries(parameterCategories)) {
      if (config.keywords.some(keyword => paramLower.includes(keyword))) {
        return category;
      }
    }

    return '其他参数';
  };

  // 按分类组织参数
  const categorizedParameters = availableParameters.reduce(
    (acc, param) => {
      const category = categorizeParameter(param);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(param);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  // 筛选参数
  const filteredParameters = availableParameters.filter(param =>
    param.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // 处理参数选择
  const handleParameterToggle = (parameter: string) => {
    const isSelected = selectedParameters.includes(parameter);

    if (isSelected) {
      onSelectionChange(selectedParameters.filter(p => p !== parameter));
    } else {
      onSelectionChange([...selectedParameters, parameter]);
    }
  };

  // 获取参数单位
  const getParameterUnit = (param: string): string => {
    const units: Record<string, string> = {
      价格: '元',
      吸力功率: 'W',
      档位数: '档',
      噪音级别: 'dB',
      电压: 'V',
      电池容量: 'mAh',
      续航时间: '分钟',
      充电时间: '小时',
      重量: 'kg',
      容量: 'L',
    };
    return units[param] || '';
  };

  // 格式化参数范围信息
  const formatParameterRange = (param: string) => {
    if (!getParameterRange) return null;
    const range = getParameterRange(param);
    if (!range) return null;

    const unit = getParameterUnit(param);
    return `${range.min}${unit} - ${range.max}${unit} (${range.count}个产品)`;
  };

  // 检查是否可以进入下一步
  const canProceed = selectedParameters.length > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>选择对比参数</span>
          <Badge variant="secondary">已选择 {selectedParameters.length} 个参数</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">选择要在图表中对比的具体参数</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 搜索栏 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索参数..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 已选择的参数 */}
        {selectedParameters.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">已选择的参数</h4>
            <div className="flex flex-wrap gap-2">
              {selectedParameters.map(parameter => (
                <Badge
                  key={parameter}
                  variant="default"
                  className="flex items-center space-x-2 px-3 py-1 cursor-pointer hover:bg-primary/80"
                  onClick={() => handleParameterToggle(parameter)}
                >
                  <span>{parameter}</span>
                  <Check className="w-3 h-3" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 参数列表 - 按分类显示 */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">
            可选参数 ({availableParameters.length})
          </h4>

          {/* 如果有搜索，显示搜索结果 */}
          {searchQuery ? (
            <div className="space-y-2">
              <h5 className="font-medium text-sm">搜索结果</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {filteredParameters.map(parameter => {
                  const isSelected = selectedParameters.includes(parameter);

                  return (
                    <div
                      key={parameter}
                      className={cn(
                        'p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm',
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:border-primary/50',
                      )}
                      onClick={() => handleParameterToggle(parameter)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium block truncate">{parameter}</span>
                          {formatParameterRange(parameter) && (
                            <span className="text-xs text-muted-foreground block mt-1">
                              {formatParameterRange(parameter)}
                            </span>
                          )}
                        </div>
                        <div
                          className={cn(
                            'w-4 h-4 rounded-full border-2 flex items-center justify-center ml-2 flex-shrink-0',
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-gray-300',
                          )}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* 按分类显示参数 */
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(categorizedParameters).map(([category, parameters]) => {
                const CategoryIcon =
                  parameterCategories[category as keyof typeof parameterCategories]?.icon ||
                  Settings;

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                      <h5 className="font-medium text-sm">{category}</h5>
                      <Badge variant="outline" className="text-xs">
                        {parameters.length}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pl-6">
                      {parameters.map(parameter => {
                        const isSelected = selectedParameters.includes(parameter);

                        return (
                          <div
                            key={parameter}
                            className={cn(
                              'p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm',
                              isSelected
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-border hover:border-primary/50',
                            )}
                            onClick={() => handleParameterToggle(parameter)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium block truncate">
                                  {parameter}
                                </span>
                                {formatParameterRange(parameter) && (
                                  <span className="text-xs text-muted-foreground block mt-1">
                                    {formatParameterRange(parameter)}
                                  </span>
                                )}
                              </div>
                              <div
                                className={cn(
                                  'w-4 h-4 rounded-full border-2 flex items-center justify-center ml-2 flex-shrink-0',
                                  isSelected
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-gray-300',
                                )}
                              >
                                {isSelected && <Check className="w-2.5 h-2.5" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {availableParameters.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>没有可用的参数</p>
              <p className="text-sm">请确保选择的产品有完整的规格信息</p>
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
            <ChevronLeft className="w-4 h-4" />
            <span>上一步</span>
          </Button>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              {selectedParameters.length === 0
                ? '请选择至少1个参数'
                : `已选择 ${selectedParameters.length} 个参数`}
            </div>

            <Button onClick={onNext} disabled={!canProceed} className="flex items-center space-x-2">
              <span>下一步：配置图表</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParameterFilter;
