import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
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
const ParameterFilter = ({
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
  const categorizeParameter = param => {
    const paramLower = param.toLowerCase();
    for (const [category, config] of Object.entries(parameterCategories)) {
      if (config.keywords.some(keyword => paramLower.includes(keyword))) {
        return category;
      }
    }
    return '其他参数';
  };
  // 按分类组织参数
  const categorizedParameters = availableParameters.reduce((acc, param) => {
    const category = categorizeParameter(param);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(param);
    return acc;
  }, {});
  // 筛选参数
  const filteredParameters = availableParameters.filter(param =>
    param.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  // 处理参数选择
  const handleParameterToggle = parameter => {
    const isSelected = selectedParameters.includes(parameter);
    if (isSelected) {
      onSelectionChange(selectedParameters.filter(p => p !== parameter));
    } else {
      onSelectionChange([...selectedParameters, parameter]);
    }
  };
  // 获取参数单位
  const getParameterUnit = param => {
    const units = {
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
  const formatParameterRange = param => {
    if (!getParameterRange) return null;
    const range = getParameterRange(param);
    if (!range) return null;
    const unit = getParameterUnit(param);
    return `${range.min}${unit} - ${range.max}${unit} (${range.count}个产品)`;
  };
  // 检查是否可以进入下一步
  const canProceed = selectedParameters.length > 0;
  return _jsxs(Card, {
    className: 'w-full',
    children: [
      _jsxs(CardHeader, {
        children: [
          _jsxs(CardTitle, {
            className: 'flex items-center space-x-2',
            children: [
              _jsx(Settings, { className: 'w-5 h-5' }),
              _jsx('span', { children: '\u9009\u62E9\u5BF9\u6BD4\u53C2\u6570' }),
              _jsxs(Badge, {
                variant: 'secondary',
                children: ['\u5DF2\u9009\u62E9 ', selectedParameters.length, ' \u4E2A\u53C2\u6570'],
              }),
            ],
          }),
          _jsx('p', {
            className: 'text-sm text-muted-foreground',
            children:
              '\u9009\u62E9\u8981\u5728\u56FE\u8868\u4E2D\u5BF9\u6BD4\u7684\u5177\u4F53\u53C2\u6570',
          }),
        ],
      }),
      _jsxs(CardContent, {
        className: 'space-y-6',
        children: [
          _jsxs('div', {
            className: 'relative',
            children: [
              _jsx(Search, {
                className:
                  'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground',
              }),
              _jsx(Input, {
                placeholder: '\u641C\u7D22\u53C2\u6570...',
                value: searchQuery,
                onChange: e => setSearchQuery(e.target.value),
                className: 'pl-10',
              }),
            ],
          }),
          selectedParameters.length > 0 &&
            _jsxs('div', {
              className: 'space-y-3',
              children: [
                _jsx('h4', {
                  className: 'font-medium text-sm text-muted-foreground',
                  children: '\u5DF2\u9009\u62E9\u7684\u53C2\u6570',
                }),
                _jsx('div', {
                  className: 'flex flex-wrap gap-2',
                  children: selectedParameters.map(parameter =>
                    _jsxs(
                      Badge,
                      {
                        variant: 'default',
                        className:
                          'flex items-center space-x-2 px-3 py-1 cursor-pointer hover:bg-primary/80',
                        onClick: () => handleParameterToggle(parameter),
                        children: [
                          _jsx('span', { children: parameter }),
                          _jsx(Check, { className: 'w-3 h-3' }),
                        ],
                      },
                      parameter,
                    ),
                  ),
                }),
              ],
            }),
          _jsxs('div', {
            className: 'space-y-4',
            children: [
              _jsxs('h4', {
                className: 'font-medium text-sm text-muted-foreground',
                children: ['\u53EF\u9009\u53C2\u6570 (', availableParameters.length, ')'],
              }),
              searchQuery
                ? _jsxs('div', {
                    className: 'space-y-2',
                    children: [
                      _jsx('h5', {
                        className: 'font-medium text-sm',
                        children: '\u641C\u7D22\u7ED3\u679C',
                      }),
                      _jsx('div', {
                        className: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2',
                        children: filteredParameters.map(parameter => {
                          const isSelected = selectedParameters.includes(parameter);
                          return _jsx(
                            'div',
                            {
                              className: cn(
                                'p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm',
                                isSelected
                                  ? 'border-primary bg-primary/5 shadow-sm'
                                  : 'border-border hover:border-primary/50',
                              ),
                              onClick: () => handleParameterToggle(parameter),
                              children: _jsxs('div', {
                                className: 'flex items-start justify-between',
                                children: [
                                  _jsxs('div', {
                                    className: 'flex-1 min-w-0',
                                    children: [
                                      _jsx('span', {
                                        className: 'text-sm font-medium block truncate',
                                        children: parameter,
                                      }),
                                      formatParameterRange(parameter) &&
                                        _jsx('span', {
                                          className: 'text-xs text-muted-foreground block mt-1',
                                          children: formatParameterRange(parameter),
                                        }),
                                    ],
                                  }),
                                  _jsx('div', {
                                    className: cn(
                                      'w-4 h-4 rounded-full border-2 flex items-center justify-center ml-2 flex-shrink-0',
                                      isSelected
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-gray-300',
                                    ),
                                    children:
                                      isSelected && _jsx(Check, { className: 'w-2.5 h-2.5' }),
                                  }),
                                ],
                              }),
                            },
                            parameter,
                          );
                        }),
                      }),
                    ],
                  })
                : /* 按分类显示参数 */
                  _jsx('div', {
                    className: 'space-y-4 max-h-96 overflow-y-auto',
                    children: Object.entries(categorizedParameters).map(
                      ([category, parameters]) => {
                        const CategoryIcon = parameterCategories[category]?.icon || Settings;
                        return _jsxs(
                          'div',
                          {
                            className: 'space-y-2',
                            children: [
                              _jsxs('div', {
                                className: 'flex items-center space-x-2',
                                children: [
                                  _jsx(CategoryIcon, {
                                    className: 'w-4 h-4 text-muted-foreground',
                                  }),
                                  _jsx('h5', {
                                    className: 'font-medium text-sm',
                                    children: category,
                                  }),
                                  _jsx(Badge, {
                                    variant: 'outline',
                                    className: 'text-xs',
                                    children: parameters.length,
                                  }),
                                ],
                              }),
                              _jsx('div', {
                                className:
                                  'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pl-6',
                                children: parameters.map(parameter => {
                                  const isSelected = selectedParameters.includes(parameter);
                                  return _jsx(
                                    'div',
                                    {
                                      className: cn(
                                        'p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm',
                                        isSelected
                                          ? 'border-primary bg-primary/5 shadow-sm'
                                          : 'border-border hover:border-primary/50',
                                      ),
                                      onClick: () => handleParameterToggle(parameter),
                                      children: _jsxs('div', {
                                        className: 'flex items-start justify-between',
                                        children: [
                                          _jsxs('div', {
                                            className: 'flex-1 min-w-0',
                                            children: [
                                              _jsx('span', {
                                                className: 'text-sm font-medium block truncate',
                                                children: parameter,
                                              }),
                                              formatParameterRange(parameter) &&
                                                _jsx('span', {
                                                  className:
                                                    'text-xs text-muted-foreground block mt-1',
                                                  children: formatParameterRange(parameter),
                                                }),
                                            ],
                                          }),
                                          _jsx('div', {
                                            className: cn(
                                              'w-4 h-4 rounded-full border-2 flex items-center justify-center ml-2 flex-shrink-0',
                                              isSelected
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-gray-300',
                                            ),
                                            children:
                                              isSelected &&
                                              _jsx(Check, { className: 'w-2.5 h-2.5' }),
                                          }),
                                        ],
                                      }),
                                    },
                                    parameter,
                                  );
                                }),
                              }),
                            ],
                          },
                          category,
                        );
                      },
                    ),
                  }),
              availableParameters.length === 0 &&
                _jsxs('div', {
                  className: 'text-center py-8 text-muted-foreground',
                  children: [
                    _jsx(Settings, { className: 'w-12 h-12 mx-auto mb-3 opacity-50' }),
                    _jsx('p', { children: '\u6CA1\u6709\u53EF\u7528\u7684\u53C2\u6570' }),
                    _jsx('p', {
                      className: 'text-sm',
                      children:
                        '\u8BF7\u786E\u4FDD\u9009\u62E9\u7684\u4EA7\u54C1\u6709\u5B8C\u6574\u7684\u89C4\u683C\u4FE1\u606F',
                    }),
                  ],
                }),
            ],
          }),
          _jsxs('div', {
            className: 'flex items-center justify-between pt-4 border-t',
            children: [
              _jsxs(Button, {
                variant: 'outline',
                onClick: onBack,
                className: 'flex items-center space-x-2',
                children: [
                  _jsx(ChevronLeft, { className: 'w-4 h-4' }),
                  _jsx('span', { children: '\u4E0A\u4E00\u6B65' }),
                ],
              }),
              _jsxs('div', {
                className: 'flex items-center space-x-4',
                children: [
                  _jsx('div', {
                    className: 'text-sm text-muted-foreground',
                    children:
                      selectedParameters.length === 0
                        ? '请选择至少1个参数'
                        : `已选择 ${selectedParameters.length} 个参数`,
                  }),
                  _jsxs(Button, {
                    onClick: onNext,
                    disabled: !canProceed,
                    className: 'flex items-center space-x-2',
                    children: [
                      _jsx('span', {
                        children: '\u4E0B\u4E00\u6B65\uFF1A\u914D\u7F6E\u56FE\u8868',
                      }),
                      _jsx(ChevronRight, { className: 'w-4 h-4' }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
export default ParameterFilter;
