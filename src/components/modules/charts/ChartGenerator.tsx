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
import type { Product } from '../../../types';
import ChartPreview from './ChartPreview';

interface ChartTemplate {
  id: string;
  name: string;
  description: string;
  type: 'bar' | 'line' | 'pie' | 'radar' | 'table';
  icon: React.ComponentType<any>;
  preview: string;
  useCase: string;
  recommended: boolean;
  tags: string[];
}

interface StepData {
  products: Product[];
  parameters: string[];
  chartType: string;
  template: ChartTemplate | null;
  title: string;
  theme: string;
  advanced: {
    colors: string[];
    layout: any;
    animations: boolean;
    responsive: boolean;
  };
}

interface ChartConfig {
  title: string;
  type: 'bar' | 'line' | 'pie' | 'radar' | 'table';
  products: Product[];
  parameters: string[];
  theme: string;
}

const ChartGenerator: React.FC = () => {
  const { products } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [stepData, setStepData] = useState<StepData>({
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
  const chartTemplates: ChartTemplate[] = [
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
  const getAllAvailableParameters = (): string[] => {
    const allParams = new Set<string>();

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
  const generateChartConfig = (): ChartConfig => {
    return {
      title: stepData.title,
      type: stepData.template!.type,
      products: stepData.products,
      parameters: stepData.parameters,
      theme: stepData.theme,
    };
  };

  // 如果显示预览，返回预览组件
  if (showPreview && stepData.template) {
    return (
      <ChartPreview
        config={generateChartConfig()}
        onSave={chartData => {
          console.log('Chart saved:', chartData);
          setShowPreview(false);
        }}
        onBack={() => setShowPreview(false)}
        onReset={() => {
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
        }}
      />
    );
  }

  // 步骤指示器组件
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
      {[
        { step: 1, title: '选择数据', icon: Target },
        { step: 2, title: '智能推荐', icon: Sparkles },
        { step: 3, title: '定制样式', icon: Palette },
        { step: 4, title: '预览导出', icon: Download },
      ].map(({ step, title, icon: Icon }, index) => (
        <React.Fragment key={step}>
          <div
            className={`flex flex-col items-center ${currentStep >= step ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <div
              className={`
              w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
              ${
                currentStep >= step
                  ? 'bg-blue-500 border-blue-500 text-white shadow-lg transform scale-110'
                  : 'bg-white border-gray-300'
              }
            `}
            >
              {currentStep > step ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <Icon className="w-6 h-6" />
              )}
            </div>
            <span
              className={`mt-2 text-sm font-medium ${currentStep >= step ? 'text-blue-600' : 'text-gray-500'}`}
            >
              {title}
            </span>
          </div>
          {index < 3 && (
            <div
              className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                currentStep > step ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">智能图表生成器</h1>
          <p className="text-xl text-gray-600">
            AI 驱动的专业图表设计平台，让数据可视化变得简单而强大
          </p>
        </div>

        {/* 步骤指示器 */}
        <StepIndicator />

        {/* 主要内容区域 */}
        <Card className="shadow-2xl border-0">
          <CardContent className="p-8">
            {/* 步骤1：数据选择 */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">选择要分析的数据</h2>
                  <p className="text-gray-600">首先选择产品，然后选择要对比的参数</p>
                </div>

                {/* 产品选择 */}
                <Card className="border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <CardTitle className="flex items-center space-x-2 text-blue-800">
                      <Users className="w-5 h-5" />
                      <span>产品选择 ({stepData.products.length} 已选择)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="搜索产品型号..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setStepData(prev => ({ ...prev, products: [] }))}
                        disabled={stepData.products.length === 0}
                      >
                        清空选择
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products
                        .filter(product =>
                          product.basicInfo.modelName
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()),
                        )
                        .map(product => {
                          const isSelected = stepData.products.some(p => p.id === product.id);
                          return (
                            <div
                              key={product.id}
                              onClick={() => {
                                if (isSelected) {
                                  setStepData(prev => ({
                                    ...prev,
                                    products: prev.products.filter(p => p.id !== product.id),
                                  }));
                                } else {
                                  setStepData(prev => ({
                                    ...prev,
                                    products: [...prev.products, product],
                                  }));
                                }
                              }}
                              className={`
                                p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg
                                ${
                                  isSelected
                                    ? 'border-blue-500 bg-blue-50 shadow-md'
                                    : 'border-gray-200 hover:border-blue-300'
                                }
                              `}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {product.basicInfo.modelName}
                                  </h3>
                                  <p className="text-sm text-gray-600">{product.basicInfo.brand}</p>
                                  {product.basicInfo.price && (
                                    <p className="text-lg font-bold text-blue-600 mt-1">
                                      ¥{product.basicInfo.price}
                                    </p>
                                  )}
                                </div>
                                {isSelected && <CheckCircle className="w-6 h-6 text-blue-500" />}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>

                {/* 参数选择 */}
                {stepData.products.length > 0 && (
                  <Card className="border-2 border-dashed border-green-200 hover:border-green-400 transition-colors">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                      <CardTitle className="flex items-center space-x-2 text-green-800">
                        <Filter className="w-5 h-5" />
                        <span>参数选择 ({stepData.parameters.length} 已选择)</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {getAllAvailableParameters().map(param => {
                          const isSelected = stepData.parameters.includes(param);
                          return (
                            <Button
                              key={param}
                              variant={isSelected ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => {
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
                              }}
                              className={`
                                justify-start transition-all duration-200
                                ${
                                  isSelected
                                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg transform scale-105'
                                    : 'hover:border-green-300 hover:bg-green-50'
                                }
                              `}
                            >
                              {isSelected && <CheckCircle className="w-4 h-4 mr-2" />}
                              {param}
                            </Button>
                          );
                        })}
                      </div>

                      {stepData.parameters.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>请选择要对比的参数</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* 进度提示 */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        已选择 {stepData.products.length} 个产品，{stepData.parameters.length}{' '}
                        个参数
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        建议选择 2-6 个产品和 1-5 个参数以获得最佳对比效果
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 步骤2：智能推荐 */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">AI 智能图表推荐</h2>
                  <p className="text-gray-600">基于您的数据特征，为您推荐最适合的图表类型</p>
                </div>

                {/* 智能推荐区域 */}
                {getSmartRecommendations().length > 0 && (
                  <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-yellow-800">
                        <Sparkles className="w-6 h-6" />
                        <span>AI 推荐</span>
                        <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                          智能
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getSmartRecommendations().map((rec, index) => {
                          if (!rec.template) return null;
                          const IconComponent = rec.template.icon;
                          return (
                            <div
                              key={index}
                              onClick={() =>
                                setStepData(prev => ({ ...prev, template: rec.template || null }))
                              }
                              className={`
                                p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg
                                ${
                                  stepData.template?.id === rec.template.id
                                    ? 'border-yellow-500 bg-yellow-50 shadow-md'
                                    : 'border-yellow-200 hover:border-yellow-400'
                                }
                              `}
                            >
                              <div className="flex items-start space-x-4">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                  <IconComponent className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                                    <span>{rec.template.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      推荐
                                    </Badge>
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Zap className="w-4 h-4 text-yellow-500" />
                                    <span className="text-xs text-yellow-700 font-medium">
                                      AI 推荐理由
                                    </span>
                                  </div>
                                </div>
                                {stepData.template?.id === rec.template.id && (
                                  <CheckCircle className="w-6 h-6 text-yellow-500" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 所有模板选择 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <LayoutDashboard className="w-5 h-5" />
                      <span>专业图表模板</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {chartTemplates.map(template => (
                        <div
                          key={template.id}
                          onClick={() => setStepData(prev => ({ ...prev, template }))}
                          className={`
                            p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg group
                            ${
                              stepData.template?.id === template.id
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 hover:border-blue-300'
                            }
                          `}
                        >
                          <div className="flex items-start space-x-4">
                            <div
                              className={`
                              p-3 rounded-lg transition-colors
                              ${
                                stepData.template?.id === template.id
                                  ? 'bg-blue-100'
                                  : 'bg-gray-100 group-hover:bg-blue-50'
                              }
                            `}
                            >
                              <template.icon
                                className={`w-8 h-8 ${
                                  stepData.template?.id === template.id
                                    ? 'text-blue-600'
                                    : 'text-gray-600'
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-bold text-gray-900">{template.name}</h3>
                                {template.recommended && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    热门
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                              <div className="flex items-center space-x-2 text-xs">
                                <span className="text-gray-500">适用场景:</span>
                                <span className="text-blue-600 font-medium">
                                  {template.useCase}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {template.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            {stepData.template?.id === template.id && (
                              <CheckCircle className="w-6 h-6 text-blue-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 步骤3：样式定制 */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">定制图表样式</h2>
                  <p className="text-gray-600">个性化您的图表外观和交互效果</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 基础设置 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Settings className="w-5 h-5" />
                        <span>基础设置</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          图表标题
                        </label>
                        <Input
                          value={stepData.title}
                          onChange={e => setStepData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="输入图表标题..."
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          主题风格
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'professional', name: '商务专业', color: 'bg-blue-500' },
                            { id: 'modern', name: '现代简约', color: 'bg-purple-500' },
                            { id: 'vibrant', name: '活力色彩', color: 'bg-green-500' },
                            { id: 'elegant', name: '优雅经典', color: 'bg-gray-700' },
                          ].map(theme => (
                            <Button
                              key={theme.id}
                              variant={stepData.theme === theme.id ? 'default' : 'outline'}
                              onClick={() => setStepData(prev => ({ ...prev, theme: theme.id }))}
                              className="justify-start space-x-3"
                            >
                              <div className={`w-4 h-4 rounded-full ${theme.color}`} />
                              <span>{theme.name}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 高级选项 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Wand2 className="w-5 h-5" />
                        <span>高级选项</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">启用动画效果</label>
                          <Button
                            variant={stepData.advanced.animations ? 'default' : 'outline'}
                            size="sm"
                            onClick={() =>
                              setStepData(prev => ({
                                ...prev,
                                advanced: {
                                  ...prev.advanced,
                                  animations: !prev.advanced.animations,
                                },
                              }))
                            }
                          >
                            {stepData.advanced.animations ? '已启用' : '已禁用'}
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">响应式布局</label>
                          <Button
                            variant={stepData.advanced.responsive ? 'default' : 'outline'}
                            size="sm"
                            onClick={() =>
                              setStepData(prev => ({
                                ...prev,
                                advanced: {
                                  ...prev.advanced,
                                  responsive: !prev.advanced.responsive,
                                },
                              }))
                            }
                          >
                            {stepData.advanced.responsive ? '已启用' : '已禁用'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* 步骤4：预览导出 */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">预览和导出</h2>
                  <p className="text-gray-600">查看最终效果并选择导出格式</p>
                </div>

                <Card className="border-2 border-green-200">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                    <CardTitle className="flex items-center space-x-2 text-green-800">
                      <Eye className="w-5 h-5" />
                      <span>图表预览</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                      <FileBarChart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        {stepData.title || '图表预览'}
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {stepData.template?.name} • {stepData.products.length} 个产品 •{' '}
                        {stepData.parameters.length} 个参数
                      </p>
                      <Button onClick={handlePreview}>
                        <Eye className="w-4 h-4 mr-2" />
                        进入详细预览
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={handlePreview}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4" />
                    <span>保存到图表库</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>导出 PNG</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>导出 PDF</span>
                  </Button>
                </div>
              </div>
            )}

            {/* 导航按钮 */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>上一步</span>
              </Button>

              <div className="text-sm text-gray-500">第 {currentStep} 步，共 4 步</div>

              <Button
                onClick={() => {
                  if (currentStep === 4) {
                    handlePreview();
                  } else {
                    setCurrentStep(Math.min(4, currentStep + 1));
                  }
                }}
                disabled={
                  (currentStep === 1 &&
                    (stepData.products.length === 0 || stepData.parameters.length === 0)) ||
                  (currentStep === 2 && !stepData.template) ||
                  (currentStep === 3 && !stepData.title.trim())
                }
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                <span>{currentStep === 4 ? '生成图表' : '下一步'}</span>
                {currentStep !== 4 && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChartGenerator;
