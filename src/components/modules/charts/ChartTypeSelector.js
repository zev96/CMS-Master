import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
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
const ChartTypeSelector = ({
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
      id: 'bar',
      name: '柱状图',
      description: '适合对比数值大小差异',
      icon: BarChart3,
      bestFor: '价格、重量、功率等数值对比',
      pros: ['直观对比', '易于理解', '支持多系列'],
    },
    {
      id: 'line',
      name: '折线图',
      description: '适合显示趋势变化',
      icon: LineChart,
      bestFor: '性能变化、时间序列数据',
      pros: ['趋势明显', '连续性好', '数据关联性强'],
    },
    {
      id: 'pie',
      name: '饼图',
      description: '适合显示占比关系',
      icon: PieChart,
      bestFor: '市场份额、成本构成',
      pros: ['占比清晰', '视觉冲击', '简洁明了'],
    },
    {
      id: 'radar',
      name: '雷达图',
      description: '适合多维度综合对比',
      icon: Radar,
      bestFor: '综合性能、多参数评估',
      pros: ['多维展示', '全面对比', '专业感强'],
    },
    {
      id: 'table',
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
  return _jsxs(Card, {
    className: 'w-full',
    children: [
      _jsxs(CardHeader, {
        children: [
          _jsxs(CardTitle, {
            className: 'flex items-center space-x-2',
            children: [
              _jsx(Palette, { className: 'w-5 h-5' }),
              _jsx('span', { children: '\u914D\u7F6E\u56FE\u8868\u6837\u5F0F' }),
            ],
          }),
          _jsx('p', {
            className: 'text-sm text-muted-foreground',
            children:
              '\u9009\u62E9\u56FE\u8868\u7C7B\u578B\u3001\u8BBE\u7F6E\u6807\u9898\u548C\u4E3B\u9898\u6837\u5F0F',
          }),
        ],
      }),
      _jsxs(CardContent, {
        className: 'space-y-8',
        children: [
          _jsxs('div', {
            className: 'space-y-3',
            children: [
              _jsxs('div', {
                className: 'flex items-center space-x-2',
                children: [
                  _jsx(Type, { className: 'w-4 h-4 text-muted-foreground' }),
                  _jsx('h4', {
                    className: 'font-medium text-sm',
                    children: '\u56FE\u8868\u6807\u9898',
                  }),
                ],
              }),
              _jsx(Input, {
                placeholder: '\u8F93\u5165\u56FE\u8868\u6807\u9898...',
                value: chartTitle,
                onChange: e => onTitleChange(e.target.value),
                className: 'text-base',
              }),
            ],
          }),
          _jsxs('div', {
            className: 'space-y-4',
            children: [
              _jsx('h4', {
                className: 'font-medium text-sm text-muted-foreground',
                children: '\u9009\u62E9\u56FE\u8868\u7C7B\u578B',
              }),
              _jsx('div', {
                className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
                children: chartTypes.map(type => {
                  const Icon = type.icon;
                  const isSelected = chartType === type.id;
                  return _jsx(
                    'div',
                    {
                      className: cn(
                        'p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md',
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:border-primary/50',
                      ),
                      onClick: () => onChartTypeChange(type.id),
                      children: _jsxs('div', {
                        className: 'space-y-3',
                        children: [
                          _jsxs('div', {
                            className: 'flex items-center space-x-3',
                            children: [
                              _jsx('div', {
                                className: cn(
                                  'w-10 h-10 rounded-lg flex items-center justify-center',
                                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted',
                                ),
                                children: _jsx(Icon, { className: 'w-5 h-5' }),
                              }),
                              _jsxs('div', {
                                children: [
                                  _jsx('h5', { className: 'font-semibold', children: type.name }),
                                  _jsx('p', {
                                    className: 'text-sm text-muted-foreground',
                                    children: type.description,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          _jsxs('div', {
                            className: 'text-sm',
                            children: [
                              _jsx('span', {
                                className: 'font-medium text-muted-foreground',
                                children: '\u9002\u7528\u4E8E\uFF1A',
                              }),
                              _jsx('span', { className: 'ml-1', children: type.bestFor }),
                            ],
                          }),
                          _jsx('div', {
                            className: 'flex flex-wrap gap-1',
                            children: type.pros.map(pro =>
                              _jsx(
                                'span',
                                {
                                  className:
                                    'inline-flex items-center px-2 py-1 text-xs bg-muted rounded-md',
                                  children: pro,
                                },
                                pro,
                              ),
                            ),
                          }),
                        ],
                      }),
                    },
                    type.id,
                  );
                }),
              }),
            ],
          }),
          _jsxs('div', {
            className: 'space-y-4',
            children: [
              _jsx('h4', {
                className: 'font-medium text-sm text-muted-foreground',
                children: '\u9009\u62E9\u914D\u8272\u4E3B\u9898',
              }),
              _jsx('div', {
                className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
                children: themes.map(theme => {
                  const isSelected = chartTheme === theme.id;
                  return _jsx(
                    'div',
                    {
                      className: cn(
                        'p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md',
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:border-primary/50',
                      ),
                      onClick: () => onThemeChange(theme.id),
                      children: _jsxs('div', {
                        className: 'space-y-3',
                        children: [
                          _jsxs('div', {
                            className: 'flex items-center justify-between',
                            children: [
                              _jsx('h5', { className: 'font-semibold', children: theme.name }),
                              isSelected &&
                                _jsx('div', {
                                  className:
                                    'w-5 h-5 rounded-full bg-primary flex items-center justify-center',
                                  children: _jsx('span', {
                                    className: 'w-2 h-2 rounded-full bg-white',
                                  }),
                                }),
                            ],
                          }),
                          _jsx('div', {
                            className: 'flex space-x-1',
                            children: theme.colors.map((color, index) =>
                              _jsx(
                                'div',
                                {
                                  className: 'w-6 h-6 rounded-md border border-gray-200',
                                  style: { backgroundColor: color },
                                },
                                index,
                              ),
                            ),
                          }),
                          _jsx('p', {
                            className: 'text-sm text-muted-foreground',
                            children: theme.description,
                          }),
                        ],
                      }),
                    },
                    theme.id,
                  );
                }),
              }),
            ],
          }),
          _jsx('div', {
            className: 'p-4 bg-muted/50 rounded-lg',
            children: _jsxs('div', {
              className: 'flex items-start space-x-3',
              children: [
                _jsx(Sparkles, { className: 'w-5 h-5 text-primary mt-0.5' }),
                _jsxs('div', {
                  children: [
                    _jsx('h5', { className: 'font-medium', children: '\u914D\u7F6E\u9884\u89C8' }),
                    _jsxs('div', {
                      className: 'text-sm text-muted-foreground mt-1 space-y-1',
                      children: [
                        _jsxs('p', {
                          children: ['\u6807\u9898\uFF1A', chartTitle || '产品参数对比'],
                        }),
                        _jsxs('p', {
                          children: [
                            '\u7C7B\u578B\uFF1A',
                            chartTypes.find(t => t.id === chartType)?.name,
                          ],
                        }),
                        _jsxs('p', { children: ['\u4E3B\u9898\uFF1A', selectedTheme.name] }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
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
              _jsx(Button, {
                onClick: onGenerate,
                disabled: isGenerating,
                className: 'flex items-center space-x-2 bg-primary hover:bg-primary/90',
                children: isGenerating
                  ? _jsxs(_Fragment, {
                      children: [
                        _jsx('div', {
                          className:
                            'w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin',
                        }),
                        _jsx('span', { children: '\u751F\u6210\u4E2D...' }),
                      ],
                    })
                  : _jsxs(_Fragment, {
                      children: [
                        _jsx(Sparkles, { className: 'w-4 h-4' }),
                        _jsx('span', { children: '\u751F\u6210\u56FE\u8868' }),
                        _jsx(ChevronRight, { className: 'w-4 h-4' }),
                      ],
                    }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
export default ChartTypeSelector;
