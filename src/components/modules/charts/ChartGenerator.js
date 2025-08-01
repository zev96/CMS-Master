import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import useAppStore from '../../../stores/useAppStore';
import {
  BarChart3,
  LineChart,
  PieChart,
  Radar,
  Table,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Download,
  Eye,
  Save,
  Target,
  Users,
  Zap,
  CheckCircle,
  Filter,
  Search,
  Settings,
  Palette,
  LayoutDashboard,
  FileBarChart,
  Wand2,
  Lightbulb,
} from 'lucide-react';
import ChartPreview from './ChartPreview';
const ChartGenerator = () => {
  const { products } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [stepData, setStepData] = useState({
    products: [],
    parameters: [],
    chartType: '',
    template: null,
    title: '',
    theme: 'professional',
    advanced: {
      colors: [],
      layout: {},
      animations: true,
      responsive: true,
    },
  });
  // 图表模板定义
  const chartTemplates = [
    {
      id: 'performance-comparison',
      name: '性能对比分析',
      description: '专业的产品性能横向对比图表，突出关键性能指标',
      type: 'bar',
      icon: BarChart3,
      preview: '/api/preview/bar-comparison.png',
      useCase: '比较多个产品的核心性能参数',
      recommended: true,
      tags: ['对比', '性能', '专业'],
    },
    {
      id: 'trend-analysis',
      name: '趋势分析图',
      description: '展示数据变化趋势和发展轨迹的动态线图',
      type: 'line',
      icon: LineChart,
      preview: '/api/preview/line-trend.png',
      useCase: '展示参数随时间或条件的变化趋势',
      recommended: true,
      tags: ['趋势', '分析', '动态'],
    },
    {
      id: 'market-share',
      name: '市场份额分布',
      description: '清晰展示各部分占比关系的饼图设计',
      type: 'pie',
      icon: PieChart,
      preview: '/api/preview/pie-market.png',
      useCase: '展示比例分布和市场占有率',
      recommended: false,
      tags: ['占比', '分布', '市场'],
    },
    {
      id: 'comprehensive-evaluation',
      name: '综合评价雷达',
      description: '多维度综合评价的专业雷达图',
      type: 'radar',
      icon: Radar,
      preview: '/api/preview/radar-eval.png',
      useCase: '多维度综合评估和对比',
      recommended: true,
      tags: ['多维', '评价', '综合'],
    },
    {
      id: 'detailed-comparison',
      name: '详细对比表格',
      description: '结构化的详细参数对比表格',
      type: 'table',
      icon: Table,
      preview: '/api/preview/table-detailed.png',
      useCase: '详细参数的精确对比',
      recommended: false,
      tags: ['详细', '精确', '参数'],
    },
  ];
  // 获取所有可用参数
  const getAllAvailableParameters = () => {
    const allParams = new Set();
    products.forEach(product => {
      // 基本信息参数
      if (product.basicInfo.price) allParams.add('价格');
      allParams.add('品牌');
      allParams.add('型号');
      allParams.add('类别');
      // 从 parameters 对象中获取参数
      if (product.parameters) {
        Object.keys(product.parameters).forEach(key => allParams.add(key));
      }
      // 从 features 数组中获取特性
      if (product.features) {
        product.features.forEach(feature => allParams.add(feature));
      }
    });
    return Array.from(allParams);
  };
  // 智能推荐逻辑
  const getSmartRecommendations = () => {
    const productCount = stepData.products.length;
    const paramCount = stepData.parameters.length;
    let recommendations = [];
    if (productCount >= 3 && paramCount <= 3) {
      recommendations.push({
        template: chartTemplates.find(t => t.id === 'performance-comparison'),
        reason: `${productCount}个产品的${paramCount}个关键参数对比，柱状图最直观`,
      });
    }
    if (paramCount >= 4) {
      recommendations.push({
        template: chartTemplates.find(t => t.id === 'comprehensive-evaluation'),
        reason: `${paramCount}个维度的综合评价，雷达图展现更全面`,
      });
    }
    if (productCount <= 5 && paramCount === 1) {
      recommendations.push({
        template: chartTemplates.find(t => t.id === 'market-share'),
        reason: '单一参数的占比分析，饼图清晰易懂',
      });
    }
    return recommendations;
  };
  // 处理预览
  const handlePreview = () => {
    if (stepData.template && stepData.title.trim()) {
      setShowPreview(true);
    }
  };
  // 生成图表配置
  const generateChartConfig = () => {
    return {
      title: stepData.title,
      type: stepData.template.type,
      products: stepData.products,
      parameters: stepData.parameters,
      theme: stepData.theme,
    };
  };
  // 如果显示预览，返回预览组件
  if (showPreview && stepData.template) {
    return _jsx(ChartPreview, {
      config: generateChartConfig(),
      onSave: chartData => {
        console.log('Chart saved:', chartData);
        setShowPreview(false);
      },
      onBack: () => setShowPreview(false),
      onReset: () => {
        setStepData({
          products: [],
          parameters: [],
          chartType: '',
          template: null,
          title: '',
          theme: 'professional',
          advanced: {
            colors: [],
            layout: {},
            animations: true,
            responsive: true,
          },
        });
        setCurrentStep(1);
        setShowPreview(false);
      },
    });
  }
  // 步骤指示器组件
  const StepIndicator = () =>
    _jsx('div', {
      className:
        'flex items-center justify-center mb-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl',
      children: [
        { step: 1, title: '选择数据', icon: Target },
        { step: 2, title: '智能推荐', icon: Sparkles },
        { step: 3, title: '定制样式', icon: Palette },
        { step: 4, title: '预览导出', icon: Download },
      ].map(({ step, title, icon: Icon }, index) =>
        _jsxs(
          React.Fragment,
          {
            children: [
              _jsxs('div', {
                className: `flex flex-col items-center ${currentStep >= step ? 'text-blue-600' : 'text-gray-400'}`,
                children: [
                  _jsx('div', {
                    className: `
              w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
              ${
                currentStep >= step
                  ? 'bg-blue-500 border-blue-500 text-white shadow-lg transform scale-110'
                  : 'bg-white border-gray-300'
              }
            `,
                    children:
                      currentStep > step
                        ? _jsx(CheckCircle, { className: 'w-6 h-6' })
                        : _jsx(Icon, { className: 'w-6 h-6' }),
                  }),
                  _jsx('span', {
                    className: `mt-2 text-sm font-medium ${currentStep >= step ? 'text-blue-600' : 'text-gray-500'}`,
                    children: title,
                  }),
                ],
              }),
              index < 3 &&
                _jsx('div', {
                  className: `flex-1 h-0.5 mx-4 transition-all duration-300 ${currentStep > step ? 'bg-blue-500' : 'bg-gray-200'}`,
                }),
            ],
          },
          step,
        ),
      ),
    });
  return _jsx('div', {
    className: 'min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6',
    children: _jsxs('div', {
      className: 'max-w-6xl mx-auto',
      children: [
        _jsxs('div', {
          className: 'text-center mb-8',
          children: [
            _jsx('h1', {
              className: 'text-4xl font-bold text-gray-900 mb-4',
              children: '\u667A\u80FD\u56FE\u8868\u751F\u6210\u5668',
            }),
            _jsx('p', {
              className: 'text-xl text-gray-600',
              children:
                'AI \u9A71\u52A8\u7684\u4E13\u4E1A\u56FE\u8868\u8BBE\u8BA1\u5E73\u53F0\uFF0C\u8BA9\u6570\u636E\u53EF\u89C6\u5316\u53D8\u5F97\u7B80\u5355\u800C\u5F3A\u5927',
            }),
          ],
        }),
        _jsx(StepIndicator, {}),
        _jsx(Card, {
          className: 'shadow-2xl border-0',
          children: _jsxs(CardContent, {
            className: 'p-8',
            children: [
              currentStep === 1 &&
                _jsxs('div', {
                  className: 'space-y-8',
                  children: [
                    _jsxs('div', {
                      className: 'text-center',
                      children: [
                        _jsx('h2', {
                          className: 'text-2xl font-bold text-gray-900 mb-3',
                          children: '\u9009\u62E9\u8981\u5206\u6790\u7684\u6570\u636E',
                        }),
                        _jsx('p', {
                          className: 'text-gray-600',
                          children:
                            '\u9996\u5148\u9009\u62E9\u4EA7\u54C1\uFF0C\u7136\u540E\u9009\u62E9\u8981\u5BF9\u6BD4\u7684\u53C2\u6570',
                        }),
                      ],
                    }),
                    _jsxs(Card, {
                      className:
                        'border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors',
                      children: [
                        _jsx(CardHeader, {
                          className: 'bg-gradient-to-r from-blue-50 to-blue-100',
                          children: _jsxs(CardTitle, {
                            className: 'flex items-center space-x-2 text-blue-800',
                            children: [
                              _jsx(Users, { className: 'w-5 h-5' }),
                              _jsxs('span', {
                                children: [
                                  '\u4EA7\u54C1\u9009\u62E9 (',
                                  stepData.products.length,
                                  ' \u5DF2\u9009\u62E9)',
                                ],
                              }),
                            ],
                          }),
                        }),
                        _jsxs(CardContent, {
                          className: 'p-6',
                          children: [
                            _jsxs('div', {
                              className: 'flex items-center space-x-4 mb-6',
                              children: [
                                _jsxs('div', {
                                  className: 'relative flex-1',
                                  children: [
                                    _jsx(Search, {
                                      className:
                                        'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4',
                                    }),
                                    _jsx(Input, {
                                      placeholder: '\u641C\u7D22\u4EA7\u54C1\u578B\u53F7...',
                                      value: searchTerm,
                                      onChange: e => setSearchTerm(e.target.value),
                                      className: 'pl-10',
                                    }),
                                  ],
                                }),
                                _jsx(Button, {
                                  variant: 'outline',
                                  onClick: () => setStepData(prev => ({ ...prev, products: [] })),
                                  disabled: stepData.products.length === 0,
                                  children: '\u6E05\u7A7A\u9009\u62E9',
                                }),
                              ],
                            }),
                            _jsx('div', {
                              className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
                              children: products
                                .filter(product =>
                                  product.basicInfo.modelName
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase()),
                                )
                                .map(product => {
                                  const isSelected = stepData.products.some(
                                    p => p.id === product.id,
                                  );
                                  return _jsx(
                                    'div',
                                    {
                                      onClick: () => {
                                        if (isSelected) {
                                          setStepData(prev => ({
                                            ...prev,
                                            products: prev.products.filter(
                                              p => p.id !== product.id,
                                            ),
                                          }));
                                        } else {
                                          setStepData(prev => ({
                                            ...prev,
                                            products: [...prev.products, product],
                                          }));
                                        }
                                      },
                                      className: `
                                p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg
                                ${
                                  isSelected
                                    ? 'border-blue-500 bg-blue-50 shadow-md'
                                    : 'border-gray-200 hover:border-blue-300'
                                }
                              `,
                                      children: _jsxs('div', {
                                        className: 'flex items-center justify-between',
                                        children: [
                                          _jsxs('div', {
                                            children: [
                                              _jsx('h3', {
                                                className: 'font-semibold text-gray-900',
                                                children: product.basicInfo.modelName,
                                              }),
                                              _jsx('p', {
                                                className: 'text-sm text-gray-600',
                                                children: product.basicInfo.brand,
                                              }),
                                              product.basicInfo.price &&
                                                _jsxs('p', {
                                                  className: 'text-lg font-bold text-blue-600 mt-1',
                                                  children: ['\u00A5', product.basicInfo.price],
                                                }),
                                            ],
                                          }),
                                          isSelected &&
                                            _jsx(CheckCircle, {
                                              className: 'w-6 h-6 text-blue-500',
                                            }),
                                        ],
                                      }),
                                    },
                                    product.id,
                                  );
                                }),
                            }),
                          ],
                        }),
                      ],
                    }),
                    stepData.products.length > 0 &&
                      _jsxs(Card, {
                        className:
                          'border-2 border-dashed border-green-200 hover:border-green-400 transition-colors',
                        children: [
                          _jsx(CardHeader, {
                            className: 'bg-gradient-to-r from-green-50 to-green-100',
                            children: _jsxs(CardTitle, {
                              className: 'flex items-center space-x-2 text-green-800',
                              children: [
                                _jsx(Filter, { className: 'w-5 h-5' }),
                                _jsxs('span', {
                                  children: [
                                    '\u53C2\u6570\u9009\u62E9 (',
                                    stepData.parameters.length,
                                    ' \u5DF2\u9009\u62E9)',
                                  ],
                                }),
                              ],
                            }),
                          }),
                          _jsxs(CardContent, {
                            className: 'p-6',
                            children: [
                              _jsx('div', {
                                className: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3',
                                children: getAllAvailableParameters().map(param => {
                                  const isSelected = stepData.parameters.includes(param);
                                  return _jsxs(
                                    Button,
                                    {
                                      variant: isSelected ? 'default' : 'outline',
                                      size: 'sm',
                                      onClick: () => {
                                        if (isSelected) {
                                          setStepData(prev => ({
                                            ...prev,
                                            parameters: prev.parameters.filter(p => p !== param),
                                          }));
                                        } else {
                                          setStepData(prev => ({
                                            ...prev,
                                            parameters: [...prev.parameters, param],
                                          }));
                                        }
                                      },
                                      className: `
                                justify-start transition-all duration-200
                                ${
                                  isSelected
                                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg transform scale-105'
                                    : 'hover:border-green-300 hover:bg-green-50'
                                }
                              `,
                                      children: [
                                        isSelected &&
                                          _jsx(CheckCircle, { className: 'w-4 h-4 mr-2' }),
                                        param,
                                      ],
                                    },
                                    param,
                                  );
                                }),
                              }),
                              stepData.parameters.length === 0 &&
                                _jsxs('div', {
                                  className: 'text-center py-8 text-gray-500',
                                  children: [
                                    _jsx(Target, {
                                      className: 'w-12 h-12 mx-auto mb-4 text-gray-300',
                                    }),
                                    _jsx('p', {
                                      children:
                                        '\u8BF7\u9009\u62E9\u8981\u5BF9\u6BD4\u7684\u53C2\u6570',
                                    }),
                                  ],
                                }),
                            ],
                          }),
                        ],
                      }),
                    _jsx('div', {
                      className: 'bg-blue-50 p-4 rounded-lg border border-blue-200',
                      children: _jsxs('div', {
                        className: 'flex items-center space-x-3',
                        children: [
                          _jsx(Lightbulb, { className: 'w-5 h-5 text-blue-600' }),
                          _jsxs('div', {
                            children: [
                              _jsxs('p', {
                                className: 'text-sm font-medium text-blue-800',
                                children: [
                                  '\u5DF2\u9009\u62E9 ',
                                  stepData.products.length,
                                  ' \u4E2A\u4EA7\u54C1\uFF0C',
                                  stepData.parameters.length,
                                  ' \u4E2A\u53C2\u6570',
                                ],
                              }),
                              _jsx('p', {
                                className: 'text-xs text-blue-600 mt-1',
                                children:
                                  '\u5EFA\u8BAE\u9009\u62E9 2-6 \u4E2A\u4EA7\u54C1\u548C 1-5 \u4E2A\u53C2\u6570\u4EE5\u83B7\u5F97\u6700\u4F73\u5BF9\u6BD4\u6548\u679C',
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              currentStep === 2 &&
                _jsxs('div', {
                  className: 'space-y-8',
                  children: [
                    _jsxs('div', {
                      className: 'text-center',
                      children: [
                        _jsx('h2', {
                          className: 'text-2xl font-bold text-gray-900 mb-3',
                          children: 'AI \u667A\u80FD\u56FE\u8868\u63A8\u8350',
                        }),
                        _jsx('p', {
                          className: 'text-gray-600',
                          children:
                            '\u57FA\u4E8E\u60A8\u7684\u6570\u636E\u7279\u5F81\uFF0C\u4E3A\u60A8\u63A8\u8350\u6700\u9002\u5408\u7684\u56FE\u8868\u7C7B\u578B',
                        }),
                      ],
                    }),
                    getSmartRecommendations().length > 0 &&
                      _jsxs(Card, {
                        className:
                          'border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50',
                        children: [
                          _jsx(CardHeader, {
                            children: _jsxs(CardTitle, {
                              className: 'flex items-center space-x-2 text-yellow-800',
                              children: [
                                _jsx(Sparkles, { className: 'w-6 h-6' }),
                                _jsx('span', { children: 'AI \u63A8\u8350' }),
                                _jsx(Badge, {
                                  variant: 'secondary',
                                  className: 'bg-yellow-200 text-yellow-800',
                                  children: '\u667A\u80FD',
                                }),
                              ],
                            }),
                          }),
                          _jsx(CardContent, {
                            children: _jsx('div', {
                              className: 'space-y-4',
                              children: getSmartRecommendations().map((rec, index) => {
                                if (!rec.template) return null;
                                const IconComponent = rec.template.icon;
                                return _jsx(
                                  'div',
                                  {
                                    onClick: () =>
                                      setStepData(prev => ({
                                        ...prev,
                                        template: rec.template || null,
                                      })),
                                    className: `
                                p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg
                                ${
                                  stepData.template?.id === rec.template.id
                                    ? 'border-yellow-500 bg-yellow-50 shadow-md'
                                    : 'border-yellow-200 hover:border-yellow-400'
                                }
                              `,
                                    children: _jsxs('div', {
                                      className: 'flex items-start space-x-4',
                                      children: [
                                        _jsx('div', {
                                          className: 'p-2 bg-yellow-100 rounded-lg',
                                          children: _jsx(IconComponent, {
                                            className: 'w-6 h-6 text-yellow-600',
                                          }),
                                        }),
                                        _jsxs('div', {
                                          className: 'flex-1',
                                          children: [
                                            _jsxs('h3', {
                                              className:
                                                'font-semibold text-gray-900 flex items-center space-x-2',
                                              children: [
                                                _jsx('span', { children: rec.template.name }),
                                                _jsx(Badge, {
                                                  variant: 'outline',
                                                  className: 'text-xs',
                                                  children: '\u63A8\u8350',
                                                }),
                                              ],
                                            }),
                                            _jsx('p', {
                                              className: 'text-sm text-gray-600 mt-1',
                                              children: rec.reason,
                                            }),
                                            _jsxs('div', {
                                              className: 'flex items-center space-x-2 mt-2',
                                              children: [
                                                _jsx(Zap, { className: 'w-4 h-4 text-yellow-500' }),
                                                _jsx('span', {
                                                  className: 'text-xs text-yellow-700 font-medium',
                                                  children: 'AI \u63A8\u8350\u7406\u7531',
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        stepData.template?.id === rec.template.id &&
                                          _jsx(CheckCircle, {
                                            className: 'w-6 h-6 text-yellow-500',
                                          }),
                                      ],
                                    }),
                                  },
                                  index,
                                );
                              }),
                            }),
                          }),
                        ],
                      }),
                    _jsxs(Card, {
                      children: [
                        _jsx(CardHeader, {
                          children: _jsxs(CardTitle, {
                            className: 'flex items-center space-x-2',
                            children: [
                              _jsx(LayoutDashboard, { className: 'w-5 h-5' }),
                              _jsx('span', { children: '\u4E13\u4E1A\u56FE\u8868\u6A21\u677F' }),
                            ],
                          }),
                        }),
                        _jsx(CardContent, {
                          children: _jsx('div', {
                            className: 'grid grid-cols-1 md:grid-cols-2 gap-6',
                            children: chartTemplates.map(template =>
                              _jsx(
                                'div',
                                {
                                  onClick: () => setStepData(prev => ({ ...prev, template })),
                                  className: `
                            p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg group
                            ${
                              stepData.template?.id === template.id
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 hover:border-blue-300'
                            }
                          `,
                                  children: _jsxs('div', {
                                    className: 'flex items-start space-x-4',
                                    children: [
                                      _jsx('div', {
                                        className: `
                              p-3 rounded-lg transition-colors
                              ${
                                stepData.template?.id === template.id
                                  ? 'bg-blue-100'
                                  : 'bg-gray-100 group-hover:bg-blue-50'
                              }
                            `,
                                        children: _jsx(template.icon, {
                                          className: `w-8 h-8 ${stepData.template?.id === template.id ? 'text-blue-600' : 'text-gray-600'}`,
                                        }),
                                      }),
                                      _jsxs('div', {
                                        className: 'flex-1',
                                        children: [
                                          _jsxs('div', {
                                            className: 'flex items-center space-x-2 mb-2',
                                            children: [
                                              _jsx('h3', {
                                                className: 'font-bold text-gray-900',
                                                children: template.name,
                                              }),
                                              template.recommended &&
                                                _jsx(Badge, {
                                                  className: 'bg-green-100 text-green-800 text-xs',
                                                  children: '\u70ED\u95E8',
                                                }),
                                            ],
                                          }),
                                          _jsx('p', {
                                            className: 'text-sm text-gray-600 mb-3',
                                            children: template.description,
                                          }),
                                          _jsxs('div', {
                                            className: 'flex items-center space-x-2 text-xs',
                                            children: [
                                              _jsx('span', {
                                                className: 'text-gray-500',
                                                children: '\u9002\u7528\u573A\u666F:',
                                              }),
                                              _jsx('span', {
                                                className: 'text-blue-600 font-medium',
                                                children: template.useCase,
                                              }),
                                            ],
                                          }),
                                          _jsx('div', {
                                            className: 'flex flex-wrap gap-1 mt-2',
                                            children: template.tags.map(tag =>
                                              _jsx(
                                                Badge,
                                                {
                                                  variant: 'outline',
                                                  className: 'text-xs',
                                                  children: tag,
                                                },
                                                tag,
                                              ),
                                            ),
                                          }),
                                        ],
                                      }),
                                      stepData.template?.id === template.id &&
                                        _jsx(CheckCircle, { className: 'w-6 h-6 text-blue-500' }),
                                    ],
                                  }),
                                },
                                template.id,
                              ),
                            ),
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
              currentStep === 3 &&
                _jsxs('div', {
                  className: 'space-y-8',
                  children: [
                    _jsxs('div', {
                      className: 'text-center',
                      children: [
                        _jsx('h2', {
                          className: 'text-2xl font-bold text-gray-900 mb-3',
                          children: '\u5B9A\u5236\u56FE\u8868\u6837\u5F0F',
                        }),
                        _jsx('p', {
                          className: 'text-gray-600',
                          children:
                            '\u4E2A\u6027\u5316\u60A8\u7684\u56FE\u8868\u5916\u89C2\u548C\u4EA4\u4E92\u6548\u679C',
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      className: 'grid grid-cols-1 lg:grid-cols-2 gap-8',
                      children: [
                        _jsxs(Card, {
                          children: [
                            _jsx(CardHeader, {
                              children: _jsxs(CardTitle, {
                                className: 'flex items-center space-x-2',
                                children: [
                                  _jsx(Settings, { className: 'w-5 h-5' }),
                                  _jsx('span', { children: '\u57FA\u7840\u8BBE\u7F6E' }),
                                ],
                              }),
                            }),
                            _jsxs(CardContent, {
                              className: 'space-y-6',
                              children: [
                                _jsxs('div', {
                                  children: [
                                    _jsx('label', {
                                      className: 'block text-sm font-medium text-gray-700 mb-2',
                                      children: '\u56FE\u8868\u6807\u9898',
                                    }),
                                    _jsx(Input, {
                                      value: stepData.title,
                                      onChange: e =>
                                        setStepData(prev => ({ ...prev, title: e.target.value })),
                                      placeholder: '\u8F93\u5165\u56FE\u8868\u6807\u9898...',
                                      className: 'w-full',
                                    }),
                                  ],
                                }),
                                _jsxs('div', {
                                  children: [
                                    _jsx('label', {
                                      className: 'block text-sm font-medium text-gray-700 mb-3',
                                      children: '\u4E3B\u9898\u98CE\u683C',
                                    }),
                                    _jsx('div', {
                                      className: 'grid grid-cols-2 gap-3',
                                      children: [
                                        {
                                          id: 'professional',
                                          name: '商务专业',
                                          color: 'bg-blue-500',
                                        },
                                        { id: 'modern', name: '现代简约', color: 'bg-purple-500' },
                                        { id: 'vibrant', name: '活力色彩', color: 'bg-green-500' },
                                        { id: 'elegant', name: '优雅经典', color: 'bg-gray-700' },
                                      ].map(theme =>
                                        _jsxs(
                                          Button,
                                          {
                                            variant:
                                              stepData.theme === theme.id ? 'default' : 'outline',
                                            onClick: () =>
                                              setStepData(prev => ({ ...prev, theme: theme.id })),
                                            className: 'justify-start space-x-3',
                                            children: [
                                              _jsx('div', {
                                                className: `w-4 h-4 rounded-full ${theme.color}`,
                                              }),
                                              _jsx('span', { children: theme.name }),
                                            ],
                                          },
                                          theme.id,
                                        ),
                                      ),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        _jsxs(Card, {
                          children: [
                            _jsx(CardHeader, {
                              children: _jsxs(CardTitle, {
                                className: 'flex items-center space-x-2',
                                children: [
                                  _jsx(Wand2, { className: 'w-5 h-5' }),
                                  _jsx('span', { children: '\u9AD8\u7EA7\u9009\u9879' }),
                                ],
                              }),
                            }),
                            _jsx(CardContent, {
                              className: 'space-y-6',
                              children: _jsxs('div', {
                                className: 'space-y-4',
                                children: [
                                  _jsxs('div', {
                                    className: 'flex items-center justify-between',
                                    children: [
                                      _jsx('label', {
                                        className: 'text-sm font-medium text-gray-700',
                                        children: '\u542F\u7528\u52A8\u753B\u6548\u679C',
                                      }),
                                      _jsx(Button, {
                                        variant: stepData.advanced.animations
                                          ? 'default'
                                          : 'outline',
                                        size: 'sm',
                                        onClick: () =>
                                          setStepData(prev => ({
                                            ...prev,
                                            advanced: {
                                              ...prev.advanced,
                                              animations: !prev.advanced.animations,
                                            },
                                          })),
                                        children: stepData.advanced.animations
                                          ? '已启用'
                                          : '已禁用',
                                      }),
                                    ],
                                  }),
                                  _jsxs('div', {
                                    className: 'flex items-center justify-between',
                                    children: [
                                      _jsx('label', {
                                        className: 'text-sm font-medium text-gray-700',
                                        children: '\u54CD\u5E94\u5F0F\u5E03\u5C40',
                                      }),
                                      _jsx(Button, {
                                        variant: stepData.advanced.responsive
                                          ? 'default'
                                          : 'outline',
                                        size: 'sm',
                                        onClick: () =>
                                          setStepData(prev => ({
                                            ...prev,
                                            advanced: {
                                              ...prev.advanced,
                                              responsive: !prev.advanced.responsive,
                                            },
                                          })),
                                        children: stepData.advanced.responsive
                                          ? '已启用'
                                          : '已禁用',
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              currentStep === 4 &&
                _jsxs('div', {
                  className: 'space-y-8',
                  children: [
                    _jsxs('div', {
                      className: 'text-center',
                      children: [
                        _jsx('h2', {
                          className: 'text-2xl font-bold text-gray-900 mb-3',
                          children: '\u9884\u89C8\u548C\u5BFC\u51FA',
                        }),
                        _jsx('p', {
                          className: 'text-gray-600',
                          children:
                            '\u67E5\u770B\u6700\u7EC8\u6548\u679C\u5E76\u9009\u62E9\u5BFC\u51FA\u683C\u5F0F',
                        }),
                      ],
                    }),
                    _jsxs(Card, {
                      className: 'border-2 border-green-200',
                      children: [
                        _jsx(CardHeader, {
                          className: 'bg-gradient-to-r from-green-50 to-green-100',
                          children: _jsxs(CardTitle, {
                            className: 'flex items-center space-x-2 text-green-800',
                            children: [
                              _jsx(Eye, { className: 'w-5 h-5' }),
                              _jsx('span', { children: '\u56FE\u8868\u9884\u89C8' }),
                            ],
                          }),
                        }),
                        _jsx(CardContent, {
                          className: 'p-8',
                          children: _jsxs('div', {
                            className:
                              'bg-white border-2 border-dashed border-gray-200 rounded-lg p-8 text-center',
                            children: [
                              _jsx(FileBarChart, {
                                className: 'w-16 h-16 mx-auto text-gray-400 mb-4',
                              }),
                              _jsx('h3', {
                                className: 'text-lg font-semibold text-gray-700 mb-2',
                                children: stepData.title || '图表预览',
                              }),
                              _jsxs('p', {
                                className: 'text-gray-500 mb-4',
                                children: [
                                  stepData.template?.name,
                                  ' \u2022 ',
                                  stepData.products.length,
                                  ' \u4E2A\u4EA7\u54C1 \u2022 ',
                                  stepData.parameters.length,
                                  ' \u4E2A\u53C2\u6570',
                                ],
                              }),
                              _jsxs(Button, {
                                onClick: handlePreview,
                                children: [
                                  _jsx(Eye, { className: 'w-4 h-4 mr-2' }),
                                  '\u8FDB\u5165\u8BE6\u7EC6\u9884\u89C8',
                                ],
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      className: 'grid grid-cols-1 md:grid-cols-3 gap-4',
                      children: [
                        _jsxs(Button, {
                          onClick: handlePreview,
                          className: 'flex items-center space-x-2 bg-blue-600 hover:bg-blue-700',
                          children: [
                            _jsx(Save, { className: 'w-4 h-4' }),
                            _jsx('span', { children: '\u4FDD\u5B58\u5230\u56FE\u8868\u5E93' }),
                          ],
                        }),
                        _jsxs(Button, {
                          variant: 'outline',
                          className: 'flex items-center space-x-2',
                          children: [
                            _jsx(Download, { className: 'w-4 h-4' }),
                            _jsx('span', { children: '\u5BFC\u51FA PNG' }),
                          ],
                        }),
                        _jsxs(Button, {
                          variant: 'outline',
                          className: 'flex items-center space-x-2',
                          children: [
                            _jsx(Download, { className: 'w-4 h-4' }),
                            _jsx('span', { children: '\u5BFC\u51FA PDF' }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              _jsxs('div', {
                className: 'flex justify-between items-center pt-8 border-t border-gray-200',
                children: [
                  _jsxs(Button, {
                    variant: 'outline',
                    onClick: () => setCurrentStep(Math.max(1, currentStep - 1)),
                    disabled: currentStep === 1,
                    className: 'flex items-center space-x-2',
                    children: [
                      _jsx(ChevronLeft, { className: 'w-4 h-4' }),
                      _jsx('span', { children: '\u4E0A\u4E00\u6B65' }),
                    ],
                  }),
                  _jsxs('div', {
                    className: 'text-sm text-gray-500',
                    children: ['\u7B2C ', currentStep, ' \u6B65\uFF0C\u5171 4 \u6B65'],
                  }),
                  _jsxs(Button, {
                    onClick: () => {
                      if (currentStep === 4) {
                        handlePreview();
                      } else {
                        setCurrentStep(Math.min(4, currentStep + 1));
                      }
                    },
                    disabled:
                      (currentStep === 1 &&
                        (stepData.products.length === 0 || stepData.parameters.length === 0)) ||
                      (currentStep === 2 && !stepData.template) ||
                      (currentStep === 3 && !stepData.title.trim()),
                    className: 'flex items-center space-x-2 bg-blue-600 hover:bg-blue-700',
                    children: [
                      _jsx('span', { children: currentStep === 4 ? '生成图表' : '下一步' }),
                      currentStep !== 4 && _jsx(ChevronRight, { className: 'w-4 h-4' }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
      ],
    }),
  });
};
export default ChartGenerator;
