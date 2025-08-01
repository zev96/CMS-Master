import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { Button } from '../../ui/button';
import ReactECharts from 'echarts-for-react';
import useAppStore from '../../../stores/useAppStore';
import {
  Save,
  ChevronLeft,
  Eye,
  Settings,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Type,
  Layout,
  X,
} from 'lucide-react';
import TablePreview from './TablePreview';
import html2canvas from 'html2canvas';
const ChartPreview = ({ config, onSave, onBack, onReset }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showLayoutPanel, setShowLayoutPanel] = useState(true);
  const [activeTab, setActiveTab] = useState('layout');
  const chartRef = useRef(null);
  const { actions } = useAppStore();
  // 图表布局选项
  const [layoutOptions, setLayoutOptions] = useState({
    width: 600,
    height: config.type === 'table' ? 'auto' : 400,
    alignment: 'center',
    margin: { top: 20, bottom: 20, left: 20, right: 20 },
    padding: { top: 16, bottom: 16, left: 16, right: 16 },
    borderRadius: 8,
    showBorder: true,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    backgroundOpacity: 1,
    showShadow: false,
    titleStyle: {
      fontSize: 18,
      color: '#333333',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    descriptionStyle: {
      fontSize: 14,
      color: '#666',
      fontStyle: 'normal',
      marginTop: 8,
    },
    chartPadding: { top: 20, bottom: 20, left: 20, right: 20 },
    legendPosition: 'top',
    showGrid: true,
    gridColor: '#e5e7eb',
    tableTextStyle: {
      headerFontSize: 14,
      headerColor: '#111827',
      contentFontSize: 12,
      contentColor: '#666',
    },
  });
  const [tableStyle, setTableStyle] = useState({
    striped: true,
    bordered: true,
    compact: false,
    headerStyle: 'primary',
  });
  // 实时预览更新效果
  useEffect(() => {
    if (chartRef.current && config.type !== 'table') {
      const chartInstance = chartRef.current.getEchartsInstance();
      chartInstance.setOption(generateEChartsOption());
    }
  }, [layoutOptions]);
  // 获取参数值的辅助函数
  const getParameterValue = (product, parameter) => {
    // 基本信息参数
    if (parameter === '价格' && product.basicInfo.price) {
      return product.basicInfo.price;
    }
    // 从 parameters 对象中获取数值参数
    if (product.parameters && product.parameters[parameter]) {
      const value = product.parameters[parameter];
      // 尝试将字符串转换为数字
      const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
      return isNaN(numValue) ? 0 : numValue;
    }
    return 0;
  };
  // 获取产品名称
  const getProductName = product => {
    return product.basicInfo.modelName;
  };
  // 获取产品品牌
  const getProductBrand = product => {
    return product.basicInfo.brand;
  };
  // 主题配置
  const themeConfigs = {
    default: {
      backgroundColor: '#ffffff',
      colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
    },
    business: {
      backgroundColor: '#ffffff',
      colors: ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed'],
    },
    modern: {
      backgroundColor: '#ffffff',
      colors: ['#06b6d4', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'],
    },
    dark: {
      backgroundColor: '#1f2937',
      colors: ['#60a5fa', '#f87171', '#34d399', '#fbbf24', '#a78bfa'],
    },
  };
  // 生成图表配置
  const generateEChartsOption = () => {
    const theme = themeConfigs[config.theme] || themeConfigs.default;
    const productNames = config.products.map(p => p.basicInfo.modelName);
    const baseOption = {
      backgroundColor: layoutOptions.backgroundColor,
      color: theme.colors,
      title: {
        text: config.title,
        left: layoutOptions.titleStyle.textAlign,
        top: 20,
        textStyle: {
          fontSize: layoutOptions.titleStyle.fontSize,
          fontWeight: layoutOptions.titleStyle.fontWeight,
          color: layoutOptions.titleStyle.color,
        },
      },
      tooltip: { trigger: 'item' },
      legend: { top: 60 },
      grid: {
        left: `${layoutOptions.chartPadding.left}px`,
        right: `${layoutOptions.chartPadding.right}px`,
        bottom: `${layoutOptions.chartPadding.bottom}px`,
        top: `${layoutOptions.chartPadding.top + 80}px`,
        containLabel: true,
      },
    };
    switch (config.type) {
      case 'bar':
        return {
          ...baseOption,
          tooltip: { trigger: 'axis' },
          xAxis: {
            type: 'category',
            data: productNames,
            axisLabel: { rotate: productNames.some(name => name.length > 6) ? 45 : 0 },
          },
          yAxis: { type: 'value' },
          series: config.parameters.map((param, index) => ({
            name: param,
            type: 'bar',
            data: config.products.map(product => getParameterValue(product, param)),
            itemStyle: { color: theme.colors[index % theme.colors.length] },
          })),
        };
      case 'line':
        return {
          ...baseOption,
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: productNames },
          yAxis: { type: 'value' },
          series: config.parameters.map((param, index) => ({
            name: param,
            type: 'line',
            data: config.products.map(product => getParameterValue(product, param)),
            smooth: true,
            itemStyle: { color: theme.colors[index % theme.colors.length] },
          })),
        };
      case 'pie':
        const firstParam = config.parameters[0];
        return {
          ...baseOption,
          series: [
            {
              type: 'pie',
              radius: '60%',
              center: ['50%', '60%'],
              data: config.products.map((product, index) => ({
                name: product.basicInfo.modelName,
                value: getParameterValue(product, firstParam),
                itemStyle: { color: theme.colors[index % theme.colors.length] },
              })),
            },
          ],
        };
      default:
        return baseOption;
    }
  };
  // 更新函数
  const updateLayoutOption = (key, value) => {
    setLayoutOptions(prev => ({ ...prev, [key]: value }));
  };
  const updateMargin = (side, value) => {
    setLayoutOptions(prev => ({
      ...prev,
      margin: { ...prev.margin, [side]: value },
    }));
  };
  const updatePadding = (side, value) => {
    setLayoutOptions(prev => ({
      ...prev,
      padding: { ...prev.padding, [side]: value },
    }));
  };
  const updateTitleStyle = (key, value) => {
    setLayoutOptions(prev => ({
      ...prev,
      titleStyle: { ...prev.titleStyle, [key]: value },
    }));
  };
  const updateDescriptionStyle = (key, value) => {
    setLayoutOptions(prev => ({
      ...prev,
      descriptionStyle: { ...prev.descriptionStyle, [key]: value },
    }));
  };
  const updateTableTextStyle = (key, value) => {
    setLayoutOptions(prev => ({
      ...prev,
      tableTextStyle: { ...prev.tableTextStyle, [key]: value },
    }));
  };
  // 保存图表
  const handleSaveChart = async () => {
    const chartContainer = document.querySelector('.chart-container');
    if (!chartContainer) return;
    try {
      setIsSaving(true);
      const canvas = await html2canvas(chartContainer, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      const imageUrl = canvas.toDataURL('image/png');
      const thumbnail = canvas.toDataURL('image/png', 0.3);
      const chartData = {
        title: config.title,
        config: {
          ...config,
          theme: config.theme,
        },
        url: imageUrl,
        thumbnail,
      };
      actions.addChart(chartData);
      console.log('图表保存成功');
    } catch (error) {
      console.error('保存图表失败:', error);
    } finally {
      setIsSaving(false);
    }
  };
  return _jsxs('div', {
    className: 'flex h-screen bg-gray-50',
    children: [
      _jsx('div', {
        className: `transition-all duration-300 ${showLayoutPanel ? 'w-80' : 'w-0'} overflow-hidden bg-white shadow-lg border-r`,
        children: _jsxs('div', {
          className: 'h-full flex flex-col',
          children: [
            _jsxs('div', {
              className: 'flex items-center justify-between p-4 border-b bg-blue-50',
              children: [
                _jsxs('h3', {
                  className: 'font-semibold flex items-center space-x-2 text-blue-900',
                  children: [
                    _jsx(Settings, { className: 'w-5 h-5' }),
                    _jsx('span', { children: '\u5B9E\u65F6\u6392\u7248\u8BBE\u7F6E' }),
                  ],
                }),
                _jsx(Button, {
                  variant: 'ghost',
                  size: 'sm',
                  onClick: () => setShowLayoutPanel(false),
                  className: 'text-blue-700 hover:text-blue-900',
                  children: _jsx(X, { className: 'w-4 h-4' }),
                }),
              ],
            }),
            _jsx('div', {
              className: 'flex border-b bg-gray-50',
              children: [
                { key: 'layout', label: '布局', icon: Layout },
                { key: 'typography', label: '文字', icon: Type },
                { key: 'appearance', label: '外观', icon: Palette },
              ].map(({ key, label, icon: Icon }) =>
                _jsxs(
                  'button',
                  {
                    onClick: () => setActiveTab(key),
                    className: `flex-1 py-3 px-2 text-sm font-medium transition-all duration-200 ${
                      activeTab === key
                        ? 'border-b-2 border-blue-500 text-blue-600 bg-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`,
                    children: [
                      _jsx(Icon, { className: 'w-4 h-4 mx-auto mb-1' }),
                      _jsx('div', { children: label }),
                    ],
                  },
                  key,
                ),
              ),
            }),
            _jsxs('div', {
              className: 'flex-1 overflow-y-auto p-4 space-y-6',
              children: [
                activeTab === 'layout' &&
                  _jsxs(_Fragment, {
                    children: [
                      _jsxs('div', {
                        className: 'space-y-4',
                        children: [
                          _jsxs('h4', {
                            className:
                              'font-medium text-gray-900 border-b pb-2 flex items-center space-x-2',
                            children: [
                              _jsx('div', { className: 'w-2 h-2 bg-blue-500 rounded-full' }),
                              _jsx('span', { children: '\uD83D\uDCD0 \u5C3A\u5BF8\u8BBE\u7F6E' }),
                            ],
                          }),
                          _jsxs('div', {
                            className: 'space-y-4',
                            children: [
                              _jsxs('div', {
                                className: 'bg-blue-50 p-3 rounded-lg',
                                children: [
                                  _jsxs('label', {
                                    className: 'block text-sm font-medium text-gray-700 mb-2',
                                    children: [
                                      '\u5BBD\u5EA6: ',
                                      _jsxs('span', {
                                        className: 'text-blue-600 font-semibold',
                                        children: [layoutOptions.width, 'px'],
                                      }),
                                    ],
                                  }),
                                  _jsx('input', {
                                    type: 'range',
                                    min: '300',
                                    max: '1200',
                                    step: '10',
                                    value: layoutOptions.width,
                                    onChange: e =>
                                      updateLayoutOption('width', parseInt(e.target.value)),
                                    className:
                                      'w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer',
                                  }),
                                  _jsxs('div', {
                                    className: 'flex justify-between text-xs text-gray-500 mt-1',
                                    children: [
                                      _jsx('span', { children: '300px' }),
                                      _jsx('span', { children: '1200px' }),
                                    ],
                                  }),
                                ],
                              }),
                              config.type !== 'table' &&
                                _jsxs('div', {
                                  className: 'bg-green-50 p-3 rounded-lg',
                                  children: [
                                    _jsxs('label', {
                                      className: 'block text-sm font-medium text-gray-700 mb-2',
                                      children: [
                                        '\u9AD8\u5EA6: ',
                                        _jsxs('span', {
                                          className: 'text-green-600 font-semibold',
                                          children: [layoutOptions.height, 'px'],
                                        }),
                                      ],
                                    }),
                                    _jsx('input', {
                                      type: 'range',
                                      min: '200',
                                      max: '800',
                                      step: '10',
                                      value: layoutOptions.height,
                                      onChange: e =>
                                        updateLayoutOption('height', parseInt(e.target.value)),
                                      className:
                                        'w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer',
                                    }),
                                    _jsxs('div', {
                                      className: 'flex justify-between text-xs text-gray-500 mt-1',
                                      children: [
                                        _jsx('span', { children: '200px' }),
                                        _jsx('span', { children: '800px' }),
                                      ],
                                    }),
                                  ],
                                }),
                              config.type === 'table' &&
                                _jsx('div', {
                                  className: 'bg-yellow-50 p-3 rounded-lg border border-yellow-200',
                                  children: _jsxs('div', {
                                    className: 'flex items-center space-x-2 text-yellow-800',
                                    children: [
                                      _jsx('span', {
                                        className: 'text-lg',
                                        children: '\uD83D\uDCCF',
                                      }),
                                      _jsx('span', {
                                        className: 'font-medium',
                                        children:
                                          '\u8868\u683C\u9AD8\u5EA6\u81EA\u52A8\u9002\u5E94\u5185\u5BB9',
                                      }),
                                    ],
                                  }),
                                }),
                            ],
                          }),
                        ],
                      }),
                      _jsxs('div', {
                        className: 'space-y-4',
                        children: [
                          _jsxs('h4', {
                            className:
                              'font-medium text-gray-900 border-b pb-2 flex items-center space-x-2',
                            children: [
                              _jsx('div', { className: 'w-2 h-2 bg-green-500 rounded-full' }),
                              _jsx('span', { children: '\uD83D\uDCCD \u5BF9\u9F50\u65B9\u5F0F' }),
                            ],
                          }),
                          _jsx('div', {
                            className: 'grid grid-cols-3 gap-2',
                            children: [
                              { value: 'left', icon: AlignLeft, label: '左对齐' },
                              { value: 'center', icon: AlignCenter, label: '居中' },
                              { value: 'right', icon: AlignRight, label: '右对齐' },
                            ].map(({ value, icon: Icon, label }) =>
                              _jsxs(
                                Button,
                                {
                                  variant:
                                    layoutOptions.alignment === value ? 'default' : 'outline',
                                  size: 'sm',
                                  onClick: () => updateLayoutOption('alignment', value),
                                  className: `flex flex-col items-center py-3 h-auto transition-all ${
                                    layoutOptions.alignment === value
                                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                                      : 'hover:bg-blue-50 hover:border-blue-300'
                                  }`,
                                  children: [
                                    _jsx(Icon, { className: 'w-4 h-4 mb-1' }),
                                    _jsx('span', {
                                      className: 'text-xs',
                                      children: label.replace('对齐', ''),
                                    }),
                                  ],
                                },
                                value,
                              ),
                            ),
                          }),
                        ],
                      }),
                    ],
                  }),
                activeTab === 'typography' &&
                  _jsxs(_Fragment, {
                    children: [
                      _jsxs('div', {
                        className: 'space-y-4',
                        children: [
                          _jsxs('h4', {
                            className:
                              'font-medium text-gray-900 border-b pb-2 flex items-center space-x-2',
                            children: [
                              _jsx('div', { className: 'w-2 h-2 bg-blue-500 rounded-full' }),
                              _jsx('span', { children: '\uD83D\uDCDD \u6807\u9898\u8BBE\u7F6E' }),
                            ],
                          }),
                          _jsxs('div', {
                            className: 'bg-blue-50 p-4 rounded-lg space-y-4',
                            children: [
                              _jsxs('div', {
                                children: [
                                  _jsxs('label', {
                                    className: 'block text-sm font-medium text-gray-700 mb-2',
                                    children: [
                                      '\u5B57\u4F53\u5927\u5C0F: ',
                                      _jsxs('span', {
                                        className: 'text-blue-600 font-semibold',
                                        children: [layoutOptions.titleStyle.fontSize, 'px'],
                                      }),
                                    ],
                                  }),
                                  _jsx('input', {
                                    type: 'range',
                                    min: '12',
                                    max: '32',
                                    step: '1',
                                    value: layoutOptions.titleStyle.fontSize,
                                    onChange: e =>
                                      updateTitleStyle('fontSize', parseInt(e.target.value)),
                                    className:
                                      'w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer',
                                  }),
                                ],
                              }),
                              _jsxs('div', {
                                children: [
                                  _jsx('label', {
                                    className: 'block text-sm font-medium text-gray-700 mb-2',
                                    children: '\u6807\u9898\u989C\u8272',
                                  }),
                                  _jsx('input', {
                                    type: 'color',
                                    value: layoutOptions.titleStyle.color,
                                    onChange: e => updateTitleStyle('color', e.target.value),
                                    className:
                                      'w-full h-10 rounded border border-gray-300 cursor-pointer',
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      config.type === 'table' &&
                        _jsxs('div', {
                          className: 'space-y-4',
                          children: [
                            _jsxs('h4', {
                              className:
                                'font-medium text-gray-900 border-b pb-2 flex items-center space-x-2',
                              children: [
                                _jsx('div', { className: 'w-2 h-2 bg-green-500 rounded-full' }),
                                _jsx('span', {
                                  children: '\uD83D\uDCCA \u8868\u683C\u6587\u5B57\u8BBE\u7F6E',
                                }),
                              ],
                            }),
                            _jsxs('div', {
                              className: 'bg-green-50 p-4 rounded-lg space-y-4',
                              children: [
                                _jsxs('div', {
                                  className: 'space-y-3',
                                  children: [
                                    _jsx('h5', {
                                      className: 'font-medium text-green-800',
                                      children: '\u8868\u5934\u6837\u5F0F',
                                    }),
                                    _jsxs('div', {
                                      children: [
                                        _jsxs('label', {
                                          className: 'block text-sm font-medium text-gray-700 mb-2',
                                          children: [
                                            '\u8868\u5934\u5B57\u4F53\u5927\u5C0F: ',
                                            _jsxs('span', {
                                              className: 'text-green-600 font-semibold',
                                              children: [
                                                layoutOptions.tableTextStyle.headerFontSize,
                                                'px',
                                              ],
                                            }),
                                          ],
                                        }),
                                        _jsx('input', {
                                          type: 'range',
                                          min: '10',
                                          max: '20',
                                          step: '1',
                                          value: layoutOptions.tableTextStyle.headerFontSize,
                                          onChange: e =>
                                            updateTableTextStyle(
                                              'headerFontSize',
                                              parseInt(e.target.value),
                                            ),
                                          className:
                                            'w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer',
                                        }),
                                      ],
                                    }),
                                    _jsxs('div', {
                                      children: [
                                        _jsx('label', {
                                          className: 'block text-sm font-medium text-gray-700 mb-2',
                                          children: '\u8868\u5934\u6587\u5B57\u989C\u8272',
                                        }),
                                        _jsx('input', {
                                          type: 'color',
                                          value: layoutOptions.tableTextStyle.headerColor,
                                          onChange: e =>
                                            updateTableTextStyle('headerColor', e.target.value),
                                          className:
                                            'w-full h-10 rounded border border-gray-300 cursor-pointer',
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                _jsxs('div', {
                                  className: 'space-y-3 border-t border-green-200 pt-3',
                                  children: [
                                    _jsx('h5', {
                                      className: 'font-medium text-green-800',
                                      children: '\u5185\u5BB9\u6837\u5F0F',
                                    }),
                                    _jsxs('div', {
                                      children: [
                                        _jsxs('label', {
                                          className: 'block text-sm font-medium text-gray-700 mb-2',
                                          children: [
                                            '\u5185\u5BB9\u5B57\u4F53\u5927\u5C0F: ',
                                            _jsxs('span', {
                                              className: 'text-green-600 font-semibold',
                                              children: [
                                                layoutOptions.tableTextStyle.contentFontSize,
                                                'px',
                                              ],
                                            }),
                                          ],
                                        }),
                                        _jsx('input', {
                                          type: 'range',
                                          min: '8',
                                          max: '16',
                                          step: '1',
                                          value: layoutOptions.tableTextStyle.contentFontSize,
                                          onChange: e =>
                                            updateTableTextStyle(
                                              'contentFontSize',
                                              parseInt(e.target.value),
                                            ),
                                          className:
                                            'w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer',
                                        }),
                                      ],
                                    }),
                                    _jsxs('div', {
                                      children: [
                                        _jsx('label', {
                                          className: 'block text-sm font-medium text-gray-700 mb-2',
                                          children: '\u5185\u5BB9\u6587\u5B57\u989C\u8272',
                                        }),
                                        _jsx('input', {
                                          type: 'color',
                                          value: layoutOptions.tableTextStyle.contentColor,
                                          onChange: e =>
                                            updateTableTextStyle('contentColor', e.target.value),
                                          className:
                                            'w-full h-10 rounded border border-gray-300 cursor-pointer',
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                    ],
                  }),
                activeTab === 'appearance' &&
                  _jsx(_Fragment, {
                    children: _jsxs('div', {
                      className: 'space-y-4',
                      children: [
                        _jsxs('h4', {
                          className:
                            'font-medium text-gray-900 border-b pb-2 flex items-center space-x-2',
                          children: [
                            _jsx('div', { className: 'w-2 h-2 bg-pink-500 rounded-full' }),
                            _jsx('span', { children: '\uD83C\uDFA8 \u5916\u89C2\u6837\u5F0F' }),
                          ],
                        }),
                        _jsx('div', {
                          className: 'space-y-4',
                          children: _jsxs('div', {
                            className: 'bg-pink-50 p-4 rounded-lg',
                            children: [
                              _jsx('label', {
                                className: 'block text-sm font-medium text-gray-700 mb-2',
                                children: '\u80CC\u666F\u989C\u8272',
                              }),
                              _jsx('input', {
                                type: 'color',
                                value: layoutOptions.backgroundColor,
                                onChange: e =>
                                  updateLayoutOption('backgroundColor', e.target.value),
                                className:
                                  'w-full h-10 rounded border border-gray-300 cursor-pointer',
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                  }),
              ],
            }),
          ],
        }),
      }),
      _jsxs('div', {
        className: 'flex-1 flex flex-col',
        children: [
          _jsx('div', {
            className: 'bg-white border-b p-4 shadow-sm',
            children: _jsxs('div', {
              className: 'flex items-center justify-between',
              children: [
                _jsxs('div', {
                  className: 'flex items-center space-x-4',
                  children: [
                    _jsxs('div', {
                      className: 'flex items-center space-x-2',
                      children: [
                        _jsx(Eye, { className: 'w-5 h-5 text-blue-600' }),
                        _jsx('h1', {
                          className: 'text-lg font-semibold text-gray-900',
                          children: '\u5B9E\u65F6\u9884\u89C8',
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      className: 'text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full',
                      children: [
                        config.type === 'table' ? '📊 对比表格' : '📈 数据图表',
                        ' \u2022 ',
                        config.products.length,
                        ' \u4E2A\u4EA7\u54C1 \u2022 ',
                        config.parameters.length,
                        ' \u4E2A\u53C2\u6570',
                      ],
                    }),
                  ],
                }),
                _jsxs('div', {
                  className: 'flex items-center space-x-2',
                  children: [
                    !showLayoutPanel &&
                      _jsxs(Button, {
                        variant: 'outline',
                        size: 'sm',
                        onClick: () => setShowLayoutPanel(true),
                        className:
                          'flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
                        children: [
                          _jsx(Settings, { className: 'w-4 h-4' }),
                          _jsx('span', { children: '\u6392\u7248\u8BBE\u7F6E' }),
                        ],
                      }),
                    _jsxs(Button, {
                      onClick: handleSaveChart,
                      disabled: isSaving,
                      className:
                        'flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white',
                      children: [
                        _jsx(Save, { className: 'w-4 h-4' }),
                        _jsx('span', { children: isSaving ? '保存中...' : '保存图表' }),
                      ],
                    }),
                    _jsxs(Button, {
                      variant: 'outline',
                      size: 'sm',
                      onClick: onBack,
                      className: 'flex items-center space-x-2',
                      children: [
                        _jsx(ChevronLeft, { className: 'w-4 h-4' }),
                        _jsx('span', { children: '\u8FD4\u56DE' }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
          _jsx('div', {
            className: 'flex-1 p-8 overflow-auto bg-gray-50',
            children: _jsx('div', {
              className: 'flex justify-center',
              children: _jsx('div', {
                className: `transition-all duration-300 ${
                  layoutOptions.alignment === 'center'
                    ? 'mx-auto'
                    : layoutOptions.alignment === 'right'
                      ? 'ml-auto'
                      : 'mr-auto'
                }`,
                style: {
                  margin: `${layoutOptions.margin.top}px ${layoutOptions.margin.right}px ${layoutOptions.margin.bottom}px ${layoutOptions.margin.left}px`,
                },
                children: _jsxs('div', {
                  className: `chart-container bg-white transition-all duration-300 ${layoutOptions.showShadow ? 'shadow-xl' : 'shadow-sm'}`,
                  style: {
                    width: `${layoutOptions.width}px`,
                    height: config.type === 'table' ? 'auto' : `${layoutOptions.height}px`,
                    backgroundColor: layoutOptions.backgroundColor,
                    opacity: layoutOptions.backgroundOpacity,
                    border: layoutOptions.showBorder
                      ? `${layoutOptions.borderWidth}px solid ${layoutOptions.borderColor}`
                      : 'none',
                    borderRadius: `${layoutOptions.borderRadius}px`,
                    padding: `${layoutOptions.padding.top}px ${layoutOptions.padding.right}px ${layoutOptions.padding.bottom}px ${layoutOptions.padding.left}px`,
                  },
                  children: [
                    _jsx('h3', {
                      style: {
                        fontSize: `${layoutOptions.titleStyle.fontSize}px`,
                        color: layoutOptions.titleStyle.color,
                        fontWeight: layoutOptions.titleStyle.fontWeight,
                        textAlign: layoutOptions.titleStyle.textAlign,
                        margin: `0 0 ${layoutOptions.titleStyle.marginBottom}px 0`,
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      },
                      children: config.title,
                    }),
                    config.type === 'table'
                      ? _jsx('div', {
                          style: { height: 'auto', overflow: 'visible' },
                          children: _jsx(TablePreview, {
                            products: config.products,
                            parameters: config.parameters,
                            title: '',
                            theme: config.theme,
                            tableStyle: tableStyle,
                            tableTextStyle: layoutOptions.tableTextStyle,
                          }),
                        })
                      : _jsx(ReactECharts, {
                          ref: chartRef,
                          option: generateEChartsOption(),
                          style: {
                            height: `${Number(layoutOptions.height) - layoutOptions.titleStyle.fontSize - layoutOptions.titleStyle.marginBottom - 20}px`,
                            width: '100%',
                          },
                          notMerge: true,
                          lazyUpdate: true,
                        }),
                  ],
                }),
              }),
            }),
          }),
        ],
      }),
    ],
  });
};
export default ChartPreview;
