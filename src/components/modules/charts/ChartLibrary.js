import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
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
const ChartLibrary = ({ charts, onChartSelect, onChartDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
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
  const handleUseChart = chart => {
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
  const formatDate = date => {
    try {
      // 处理 null、undefined 或空值
      if (!date) {
        return '未知时间';
      }
      let dateObj;
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
  return _jsxs(Card, {
    className: 'h-full flex flex-col',
    children: [
      _jsxs(CardHeader, {
        className: 'pb-4',
        children: [
          _jsxs(CardTitle, {
            className: 'flex items-center space-x-2 text-base',
            children: [
              _jsx(Library, { className: 'w-4 h-4' }),
              _jsx('span', { children: '\u56FE\u8868\u5E93' }),
              _jsx(Badge, {
                variant: 'secondary',
                className: 'text-xs',
                children: validatedCharts.length,
              }),
            ],
          }),
          _jsxs('div', {
            className: 'space-y-3',
            children: [
              _jsxs('div', {
                className: 'relative',
                children: [
                  _jsx(Search, {
                    className:
                      'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground',
                  }),
                  _jsx(Input, {
                    placeholder: '\u641C\u7D22\u56FE\u8868...',
                    value: searchQuery,
                    onChange: e => setSearchQuery(e.target.value),
                    className: 'pl-10 h-8 text-sm',
                  }),
                ],
              }),
              _jsxs('select', {
                value: selectedType,
                onChange: e => setSelectedType(e.target.value),
                className: 'w-full px-3 py-1.5 text-sm border rounded-md bg-background',
                children: [
                  _jsx('option', { value: 'all', children: '\u5168\u90E8\u7C7B\u578B' }),
                  _jsx('option', { value: 'bar', children: '\u67F1\u5F62\u56FE' }),
                  _jsx('option', { value: 'line', children: '\u6298\u7EBF\u56FE' }),
                  _jsx('option', { value: 'table', children: '\u8868\u683C\u56FE' }),
                  _jsx('option', { value: 'pie', children: '\u997C\u56FE' }),
                  _jsx('option', { value: 'radar', children: '\u96F7\u8FBE\u56FE' }),
                ],
              }),
            ],
          }),
        ],
      }),
      _jsx(CardContent, {
        className: 'flex-1 p-0 overflow-hidden',
        children:
          validatedCharts.length === 0
            ? // 空状态
              _jsxs('div', {
                className: 'flex flex-col items-center justify-center h-full p-6 text-center',
                children: [
                  _jsx(Library, { className: 'w-12 h-12 text-muted-foreground mb-4 opacity-50' }),
                  _jsx('h4', {
                    className: 'font-medium mb-2',
                    children: '\u8FD8\u6CA1\u6709\u56FE\u8868',
                  }),
                  _jsx('p', {
                    className: 'text-sm text-muted-foreground mb-4',
                    children: '\u751F\u6210\u7684\u56FE\u8868\u4F1A\u4FDD\u5B58\u5728\u8FD9\u91CC',
                  }),
                  _jsxs('div', {
                    className: 'text-xs text-muted-foreground space-y-1',
                    children: [
                      _jsx('p', { children: '\uD83D\uDCA1 \u63D0\u793A\uFF1A' }),
                      _jsx('p', {
                        children:
                          '\u2022 \u70B9\u51FB\u4F7F\u7528\u6309\u94AE\u5BFC\u5165\u56FE\u8868',
                      }),
                      _jsx('p', {
                        children: '\u2022 \u652F\u6301\u641C\u7D22\u548C\u5206\u7C7B\u7B5B\u9009',
                      }),
                    ],
                  }),
                ],
              })
            : // 图表列表
              _jsxs('div', {
                className: 'h-full overflow-y-auto p-4 space-y-3',
                children: [
                  filteredCharts.map(chart => {
                    const Icon = chartTypeIcons[chart.config.type] || BarChart3;
                    return _jsxs(
                      Card,
                      {
                        className:
                          'group cursor-pointer transition-all duration-200 hover:shadow-lg bg-white border border-gray-200 hover:border-blue-300',
                        onClick: () => onChartSelect(chart),
                        children: [
                          _jsx(CardHeader, {
                            className: 'pb-3',
                            children: _jsxs('div', {
                              className: 'flex items-start justify-between',
                              children: [
                                _jsxs('div', {
                                  className: 'flex items-center space-x-3',
                                  children: [
                                    _jsx('div', {
                                      className: cn(
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
                                      ),
                                      children: React.createElement(
                                        chartTypeIcons[chart.config.type],
                                        { className: 'w-5 h-5' },
                                      ),
                                    }),
                                    _jsxs('div', {
                                      children: [
                                        _jsx(CardTitle, {
                                          className:
                                            'text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors',
                                          children: chart.title,
                                        }),
                                        _jsx(Badge, {
                                          variant: 'secondary',
                                          className: 'mt-1',
                                          children: chartTypeNames[chart.config.type],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                _jsxs('div', {
                                  className:
                                    'flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity',
                                  children: [
                                    _jsxs(Button, {
                                      variant: 'outline',
                                      size: 'sm',
                                      onClick: e => {
                                        e.stopPropagation();
                                        handleUseChart(chart);
                                      },
                                      className:
                                        'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200',
                                      children: [
                                        _jsx(Plus, { className: 'w-4 h-4 mr-1' }),
                                        '\u4F7F\u7528',
                                      ],
                                    }),
                                    _jsx(Button, {
                                      variant: 'ghost',
                                      size: 'sm',
                                      onClick: e => {
                                        e.stopPropagation();
                                        onChartDelete(chart.id);
                                      },
                                      className: 'text-red-600 hover:text-red-700 hover:bg-red-50',
                                      children: _jsx(Trash2, { className: 'w-4 h-4' }),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          }),
                          _jsxs(CardContent, {
                            className: 'pt-0',
                            children: [
                              _jsx('div', {
                                className: 'mb-4',
                                children: chart.thumbnail
                                  ? _jsx('div', {
                                      className:
                                        'w-full h-32 bg-gray-50 rounded-lg overflow-hidden border',
                                      children: _jsx('img', {
                                        src: chart.thumbnail,
                                        alt: chart.title,
                                        className:
                                          'w-full h-full object-cover group-hover:scale-105 transition-transform duration-200',
                                      }),
                                    })
                                  : _jsx('div', {
                                      className:
                                        'w-full h-32 bg-gray-50 rounded-lg border flex items-center justify-center',
                                      children: React.createElement(
                                        chartTypeIcons[chart.config.type],
                                        {
                                          className: 'w-12 h-12 text-gray-400',
                                        },
                                      ),
                                    }),
                              }),
                              _jsxs('div', {
                                className: 'space-y-3',
                                children: [
                                  _jsx('div', {
                                    className:
                                      'flex items-center justify-between text-sm text-gray-600',
                                    children: _jsxs('div', {
                                      className: 'flex items-center space-x-4',
                                      children: [
                                        _jsxs('span', {
                                          className: 'flex items-center space-x-1',
                                          children: [
                                            _jsx(Package, { className: 'w-4 h-4' }),
                                            _jsxs('span', {
                                              children: [
                                                (chart.config.products || []).length,
                                                ' \u4E2A\u4EA7\u54C1',
                                              ],
                                            }),
                                          ],
                                        }),
                                        _jsxs('span', {
                                          className: 'flex items-center space-x-1',
                                          children: [
                                            _jsx(BarChart3, { className: 'w-4 h-4' }),
                                            _jsxs('span', {
                                              children: [
                                                (chart.config.parameters || []).length,
                                                ' \u4E2A\u53C2\u6570',
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  }),
                                  chart.config.parameters &&
                                    chart.config.parameters.length > 0 &&
                                    _jsxs('div', {
                                      className: 'flex flex-wrap gap-2',
                                      children: [
                                        chart.config.parameters
                                          .slice(0, 3)
                                          .map(param =>
                                            _jsx(
                                              Badge,
                                              {
                                                variant: 'outline',
                                                className: 'text-xs',
                                                children: param,
                                              },
                                              param,
                                            ),
                                          ),
                                        chart.config.parameters.length > 3 &&
                                          _jsxs(Badge, {
                                            variant: 'outline',
                                            className: 'text-xs',
                                            children: ['+', chart.config.parameters.length - 3],
                                          }),
                                      ],
                                    }),
                                  _jsxs('div', {
                                    className:
                                      'flex items-center justify-between text-xs text-gray-500',
                                    children: [
                                      _jsxs('div', {
                                        className: 'flex items-center space-x-1',
                                        children: [
                                          _jsx(Calendar, { className: 'w-3 h-3' }),
                                          _jsxs('span', {
                                            children: [
                                              '\u521B\u5EFA\u4E8E ',
                                              formatDate(chart.createdAt),
                                            ],
                                          }),
                                        ],
                                      }),
                                      _jsxs('div', {
                                        className:
                                          'flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600',
                                        children: [
                                          _jsx(MousePointer, { className: 'w-3 h-3' }),
                                          _jsx('span', { children: '\u70B9\u51FB\u4F7F\u7528' }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      },
                      chart.id,
                    );
                  }),
                  filteredCharts.length === 0 &&
                    validatedCharts.length > 0 &&
                    _jsxs('div', {
                      className: 'text-center py-8',
                      children: [
                        _jsx(Search, {
                          className: 'w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50',
                        }),
                        _jsx('p', {
                          className: 'text-sm text-muted-foreground',
                          children: '\u672A\u627E\u5230\u5339\u914D\u7684\u56FE\u8868',
                        }),
                        _jsx('p', {
                          className: 'text-xs text-muted-foreground mt-1',
                          children: '\u5C1D\u8BD5\u8C03\u6574\u641C\u7D22\u6761\u4EF6',
                        }),
                      ],
                    }),
                ],
              }),
      }),
      validatedCharts.length > 0 &&
        _jsx('div', {
          className: 'px-4 py-2 border-t bg-muted/30',
          children: _jsx('p', {
            className: 'text-xs text-muted-foreground text-center',
            children:
              '\uD83D\uDCA1 \u5C06\u56FE\u8868\u62D6\u62FD\u5230\u5185\u5BB9\u7F16\u8F91\u5668\u4E2D\u4F7F\u7528',
          }),
        }),
    ],
  });
};
export default ChartLibrary;
