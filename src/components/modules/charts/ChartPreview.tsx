import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import ReactECharts from 'echarts-for-react';
import useAppStore from '../../../stores/useAppStore';
import {
  Save,
  ChevronLeft,
  RefreshCw,
  Eye,
  Download,
  Settings,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Type,
  Layout,
  X,
  RotateCcw,
} from 'lucide-react';
import type { Product } from '../../../types';
import TablePreview from './TablePreview';
import html2canvas from 'html2canvas';

interface ChartConfig {
  title: string;
  type: 'bar' | 'line' | 'pie' | 'radar' | 'table';
  products: Product[];
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

interface ChartLayoutOptions {
  width: number;
  height: number | 'auto';
  alignment: 'left' | 'center' | 'right';
  margin: { top: number; bottom: number; left: number; right: number };
  padding: { top: number; bottom: number; left: number; right: number };
  borderRadius: number;
  showBorder: boolean;
  borderColor: string;
  borderWidth: number;
  backgroundColor: string;
  backgroundOpacity: number;
  showShadow: boolean;
  titleStyle: {
    fontSize: number;
    color: string;
    fontWeight: 'normal' | 'bold' | 'bolder';
    textAlign: 'left' | 'center' | 'right';
    marginBottom: number;
  };
  descriptionStyle: {
    fontSize: number;
    color: string;
    fontStyle: 'normal' | 'italic';
    marginTop: number;
  };
  chartPadding: { top: number; bottom: number; left: number; right: number };
  legendPosition: 'top' | 'bottom' | 'left' | 'right' | 'none';
  showGrid: boolean;
  gridColor: string;
  tableTextStyle: {
    headerFontSize: number;
    headerColor: string;
    contentFontSize: number;
    contentColor: string;
  };
}

interface ChartPreviewProps {
  config: ChartConfig;
  onSave: (chartData: ChartData) => void;
  onBack: () => void;
  onReset: () => void;
}

const ChartPreview: React.FC<ChartPreviewProps> = ({ config, onSave, onBack, onReset }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showLayoutPanel, setShowLayoutPanel] = useState(true);
  const [activeTab, setActiveTab] = useState<'layout' | 'typography' | 'appearance'>('layout');
  const chartRef = useRef<ReactECharts>(null);
  const { actions } = useAppStore();

  // 图表布局选项
  const [layoutOptions, setLayoutOptions] = useState<ChartLayoutOptions>({
    width: 600,
    height: config.type === 'table' ? ('auto' as any) : 400,
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
    headerStyle: 'primary' as 'default' | 'primary' | 'dark',
  });

  // 实时预览更新效果
  useEffect(() => {
    if (chartRef.current && config.type !== 'table') {
      const chartInstance = chartRef.current.getEchartsInstance();
      chartInstance.setOption(generateEChartsOption());
    }
  }, [layoutOptions]);

  // 获取参数值的辅助函数
  const getParameterValue = (product: Product, parameter: string): number => {
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
  const getProductName = (product: Product): string => {
    return product.basicInfo.modelName;
  };

  // 获取产品品牌
  const getProductBrand = (product: Product): string => {
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
    const theme = themeConfigs[config.theme as keyof typeof themeConfigs] || themeConfigs.default;
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
  const updateLayoutOption = (key: keyof ChartLayoutOptions, value: any) => {
    setLayoutOptions(prev => ({ ...prev, [key]: value }));
  };

  const updateMargin = (side: keyof ChartLayoutOptions['margin'], value: number) => {
    setLayoutOptions(prev => ({
      ...prev,
      margin: { ...prev.margin, [side]: value },
    }));
  };

  const updatePadding = (side: keyof ChartLayoutOptions['padding'], value: number) => {
    setLayoutOptions(prev => ({
      ...prev,
      padding: { ...prev.padding, [side]: value },
    }));
  };

  const updateTitleStyle = (key: keyof ChartLayoutOptions['titleStyle'], value: any) => {
    setLayoutOptions(prev => ({
      ...prev,
      titleStyle: { ...prev.titleStyle, [key]: value },
    }));
  };

  const updateDescriptionStyle = (
    key: keyof ChartLayoutOptions['descriptionStyle'],
    value: any,
  ) => {
    setLayoutOptions(prev => ({
      ...prev,
      descriptionStyle: { ...prev.descriptionStyle, [key]: value },
    }));
  };

  const updateTableTextStyle = (key: keyof ChartLayoutOptions['tableTextStyle'], value: any) => {
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
      const canvas = await html2canvas(chartContainer as HTMLElement, {
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
          theme: config.theme as 'professional' | 'modern' | 'simple',
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左侧排版设置面板 */}
      <div
        className={`transition-all duration-300 ${showLayoutPanel ? 'w-80' : 'w-0'} overflow-hidden bg-white shadow-lg border-r`}
      >
        <div className="h-full flex flex-col">
          {/* 面板头部 */}
          <div className="flex items-center justify-between p-4 border-b bg-blue-50">
            <h3 className="font-semibold flex items-center space-x-2 text-blue-900">
              <Settings className="w-5 h-5" />
              <span>实时排版设置</span>
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLayoutPanel(false)}
              className="text-blue-700 hover:text-blue-900"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* 设置选项卡 */}
          <div className="flex border-b bg-gray-50">
            {[
              { key: 'layout', label: '布局', icon: Layout },
              { key: 'typography', label: '文字', icon: Type },
              { key: 'appearance', label: '外观', icon: Palette },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex-1 py-3 px-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === key
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4 mx-auto mb-1" />
                <div>{label}</div>
              </button>
            ))}
          </div>

          {/* 设置内容区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {activeTab === 'layout' && (
              <>
                {/* 尺寸设置 */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>📐 尺寸设置</span>
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        宽度:{' '}
                        <span className="text-blue-600 font-semibold">{layoutOptions.width}px</span>
                      </label>
                      <input
                        type="range"
                        min="300"
                        max="1200"
                        step="10"
                        value={layoutOptions.width}
                        onChange={e => updateLayoutOption('width', parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>300px</span>
                        <span>1200px</span>
                      </div>
                    </div>
                    {config.type !== 'table' && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          高度:{' '}
                          <span className="text-green-600 font-semibold">
                            {layoutOptions.height}px
                          </span>
                        </label>
                        <input
                          type="range"
                          min="200"
                          max="800"
                          step="10"
                          value={layoutOptions.height}
                          onChange={e => updateLayoutOption('height', parseInt(e.target.value))}
                          className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>200px</span>
                          <span>800px</span>
                        </div>
                      </div>
                    )}
                    {config.type === 'table' && (
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <div className="flex items-center space-x-2 text-yellow-800">
                          <span className="text-lg">📏</span>
                          <span className="font-medium">表格高度自动适应内容</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 对齐方式 */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>📍 对齐方式</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'left', icon: AlignLeft, label: '左对齐' },
                      { value: 'center', icon: AlignCenter, label: '居中' },
                      { value: 'right', icon: AlignRight, label: '右对齐' },
                    ].map(({ value, icon: Icon, label }) => (
                      <Button
                        key={value}
                        variant={layoutOptions.alignment === value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateLayoutOption('alignment', value)}
                        className={`flex flex-col items-center py-3 h-auto transition-all ${
                          layoutOptions.alignment === value
                            ? 'bg-blue-500 text-white shadow-lg scale-105'
                            : 'hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <span className="text-xs">{label.replace('对齐', '')}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'typography' && (
              <>
                {/* 标题设置 */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>📝 标题设置</span>
                  </h4>
                  <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        字体大小:{' '}
                        <span className="text-blue-600 font-semibold">
                          {layoutOptions.titleStyle.fontSize}px
                        </span>
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="32"
                        step="1"
                        value={layoutOptions.titleStyle.fontSize}
                        onChange={e => updateTitleStyle('fontSize', parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        标题颜色
                      </label>
                      <input
                        type="color"
                        value={layoutOptions.titleStyle.color}
                        onChange={e => updateTitleStyle('color', e.target.value)}
                        className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* 表格文字设置 */}
                {config.type === 'table' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 border-b pb-2 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>📊 表格文字设置</span>
                    </h4>
                    <div className="bg-green-50 p-4 rounded-lg space-y-4">
                      {/* 表头设置 */}
                      <div className="space-y-3">
                        <h5 className="font-medium text-green-800">表头样式</h5>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            表头字体大小:{' '}
                            <span className="text-green-600 font-semibold">
                              {layoutOptions.tableTextStyle.headerFontSize}px
                            </span>
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="20"
                            step="1"
                            value={layoutOptions.tableTextStyle.headerFontSize}
                            onChange={e =>
                              updateTableTextStyle('headerFontSize', parseInt(e.target.value))
                            }
                            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            表头文字颜色
                          </label>
                          <input
                            type="color"
                            value={layoutOptions.tableTextStyle.headerColor}
                            onChange={e => updateTableTextStyle('headerColor', e.target.value)}
                            className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* 内容设置 */}
                      <div className="space-y-3 border-t border-green-200 pt-3">
                        <h5 className="font-medium text-green-800">内容样式</h5>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            内容字体大小:{' '}
                            <span className="text-green-600 font-semibold">
                              {layoutOptions.tableTextStyle.contentFontSize}px
                            </span>
                          </label>
                          <input
                            type="range"
                            min="8"
                            max="16"
                            step="1"
                            value={layoutOptions.tableTextStyle.contentFontSize}
                            onChange={e =>
                              updateTableTextStyle('contentFontSize', parseInt(e.target.value))
                            }
                            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            内容文字颜色
                          </label>
                          <input
                            type="color"
                            value={layoutOptions.tableTextStyle.contentColor}
                            onChange={e => updateTableTextStyle('contentColor', e.target.value)}
                            className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'appearance' && (
              <>
                {/* 外观样式 */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span>🎨 外观样式</span>
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        背景颜色
                      </label>
                      <input
                        type="color"
                        value={layoutOptions.backgroundColor}
                        onChange={e => updateLayoutOption('backgroundColor', e.target.value)}
                        className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 右侧主内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部工具栏 */}
        <div className="bg-white border-b p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <h1 className="text-lg font-semibold text-gray-900">实时预览</h1>
              </div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {config.type === 'table' ? '📊 对比表格' : '📈 数据图表'} • {config.products.length}{' '}
                个产品 • {config.parameters.length} 个参数
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!showLayoutPanel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLayoutPanel(true)}
                  className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                >
                  <Settings className="w-4 h-4" />
                  <span>排版设置</span>
                </Button>
              )}
              <Button
                onClick={handleSaveChart}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? '保存中...' : '保存图表'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>返回</span>
              </Button>
            </div>
          </div>
        </div>

        {/* 预览区域 */}
        <div className="flex-1 p-8 overflow-auto bg-gray-50">
          <div className="flex justify-center">
            <div
              className={`transition-all duration-300 ${
                layoutOptions.alignment === 'center'
                  ? 'mx-auto'
                  : layoutOptions.alignment === 'right'
                    ? 'ml-auto'
                    : 'mr-auto'
              }`}
              style={{
                margin: `${layoutOptions.margin.top}px ${layoutOptions.margin.right}px ${layoutOptions.margin.bottom}px ${layoutOptions.margin.left}px`,
              }}
            >
              <div
                className={`chart-container bg-white transition-all duration-300 ${layoutOptions.showShadow ? 'shadow-xl' : 'shadow-sm'}`}
                style={{
                  width: `${layoutOptions.width}px`,
                  height: config.type === 'table' ? 'auto' : `${layoutOptions.height}px`,
                  backgroundColor: layoutOptions.backgroundColor,
                  opacity: layoutOptions.backgroundOpacity,
                  border: layoutOptions.showBorder
                    ? `${layoutOptions.borderWidth}px solid ${layoutOptions.borderColor}`
                    : 'none',
                  borderRadius: `${layoutOptions.borderRadius}px`,
                  padding: `${layoutOptions.padding.top}px ${layoutOptions.padding.right}px ${layoutOptions.padding.bottom}px ${layoutOptions.padding.left}px`,
                }}
              >
                {/* 标题 */}
                <h3
                  style={{
                    fontSize: `${layoutOptions.titleStyle.fontSize}px`,
                    color: layoutOptions.titleStyle.color,
                    fontWeight: layoutOptions.titleStyle.fontWeight,
                    textAlign: layoutOptions.titleStyle.textAlign,
                    margin: `0 0 ${layoutOptions.titleStyle.marginBottom}px 0`,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  {config.title}
                </h3>

                {/* 图表/表格内容 */}
                {config.type === 'table' ? (
                  <div style={{ height: 'auto', overflow: 'visible' }}>
                    <TablePreview
                      products={config.products}
                      parameters={config.parameters}
                      title=""
                      theme={config.theme}
                      tableStyle={tableStyle}
                      tableTextStyle={layoutOptions.tableTextStyle}
                    />
                  </div>
                ) : (
                  <ReactECharts
                    ref={chartRef}
                    option={generateEChartsOption()}
                    style={{
                      height: `${Number(layoutOptions.height) - layoutOptions.titleStyle.fontSize - layoutOptions.titleStyle.marginBottom - 20}px`,
                      width: '100%',
                    }}
                    notMerge={true}
                    lazyUpdate={true}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPreview;
