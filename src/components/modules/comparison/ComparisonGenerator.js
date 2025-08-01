import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import useAppStore from '../../../stores/useAppStore';
import {
  Table,
  Search,
  CheckCircle,
  Save,
  Eye,
  Settings,
  LayoutGrid,
  Download,
  Shuffle,
} from 'lucide-react';
import html2canvas from 'html2canvas';
const ComparisonGenerator = () => {
  const { products, actions } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('other');
  const chartRef = useRef(null);
  const tableRef = useRef(null);
  const [comparisonData, setComparisonData] = useState({
    title: '产品对比分析',
    selectedProducts: [],
    selectedParameters: [],
    chartType: 'table',
    theme: 'professional',
  });
  const [chartStyle, setChartStyle] = useState({
    title: {
      text: '产品对比分析',
      fontSize: 18,
      color: '#000000',
      align: 'center',
    },
    table: {
      headerBgColor: '#f8f9fa',
      headerTextColor: '#212529',
      headerFontSize: 14,
      headerBold: true,
      headerTextAlign: 'left',
      contentTextColor: '#495057',
      contentFontSize: 12,
      contentTextAlign: 'left',
      contentBgColor: '#ffffff',
      borderColor: '#dee2e6',
      borderWidth: 1,
      zebraStripe: true,
      zebraColor: '#f8f9fa',
      evenRowBgColor: '#ffffff',
      oddRowBgColor: '#f8f9fa',
      columnWidth: 150,
      rowHeight: 40,
    },
    chart: {
      colorScheme: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
      axisColor: '#666666',
      axisTextColor: '#333333',
      showGrid: true,
      showDataLabels: false,
      dataLabelColor: '#333333',
      dataLabelSize: 12,
      barLabelFontSize: 12,
      barLabelColor: '#333333',
    },
  });
  // 预设配色方案
  const colorSchemes = {
    default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
    blue: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c'],
    green: ['#2ca02c', '#98df8a', '#d62728', '#ff9896', '#ff7f0e'],
    warm: ['#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728'],
    cool: ['#1f77b4', '#aec7e8', '#17becf', '#9edae5', '#9467bd'],
    purple: ['#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2'],
    rainbow: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'],
  };
  // 生成随机颜色
  const generateRandomColors = count => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (360 / count) * i + Math.random() * 60;
      const saturation = 60 + Math.random() * 30;
      const lightness = 45 + Math.random() * 20;
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  };
  // 当选择的产品变化时，自动更新可用参数
  useEffect(() => {
    const availableParams = getAllAvailableParameters();
    const validSelectedParams = comparisonData.selectedParameters.filter(param =>
      availableParams.includes(param),
    );
    if (JSON.stringify(validSelectedParams) !== JSON.stringify(comparisonData.selectedParameters)) {
      setComparisonData(prev => ({
        ...prev,
        selectedParameters: validSelectedParams,
      }));
    }
  }, [comparisonData.selectedProducts]);
  // 同步标题
  useEffect(() => {
    setChartStyle(prev => ({
      ...prev,
      title: {
        ...prev.title,
        text: comparisonData.title,
      },
    }));
  }, [comparisonData.title]);
  // 获取所有可用参数
  const getAllAvailableParameters = () => {
    if (comparisonData.selectedProducts.length === 0) return [];
    const allParams = new Set();
    comparisonData.selectedProducts.forEach(product => {
      if (product.basicInfo.price) allParams.add('价格');
      if (product.parameters) {
        Object.keys(product.parameters).forEach(key => {
          const value = product.parameters[key];
          if (value !== undefined && value !== null && value !== '') {
            allParams.add(key);
          }
        });
      }
    });
    return Array.from(allParams).sort();
  };
  // 获取所有品类
  const getAllCategories = () => {
    const categories = new Set();
    products.forEach(product => {
      if (product.basicInfo.category) {
        categories.add(product.basicInfo.category);
      }
    });
    return Array.from(categories).sort();
  };
  // 获取参数值
  const getParameterValue = (product, parameter) => {
    if (parameter === '价格') {
      return product.basicInfo.price || 0;
    }
    if (product.parameters && product.parameters[parameter] !== undefined) {
      const value = product.parameters[parameter];
      if (typeof value === 'number') return value;
      return parseFloat(String(value).replace(/[^0-9.-]+/g, '')) || 0;
    }
    return 0;
  };
  // 获取显示值
  const getParameterDisplayValue = (product, parameter) => {
    if (parameter === '价格') {
      return product.basicInfo.price ? `¥${product.basicInfo.price}` : '-';
    }
    if (product.parameters && product.parameters[parameter] !== undefined) {
      const value = product.parameters[parameter];
      if (value !== null && value !== '') return String(value);
    }
    return '-';
  };
  // 切换产品选择
  const toggleProduct = product => {
    const isSelected = comparisonData.selectedProducts.some(p => p.id === product.id);
    if (isSelected) {
      setComparisonData(prev => ({
        ...prev,
        selectedProducts: prev.selectedProducts.filter(p => p.id !== product.id),
      }));
    } else {
      setComparisonData(prev => ({
        ...prev,
        selectedProducts: [...prev.selectedProducts, product],
      }));
    }
  };
  // 切换参数选择
  const toggleParameter = parameter => {
    const isSelected = comparisonData.selectedParameters.includes(parameter);
    if (isSelected) {
      setComparisonData(prev => ({
        ...prev,
        selectedParameters: prev.selectedParameters.filter(p => p !== parameter),
      }));
    } else {
      setComparisonData(prev => ({
        ...prev,
        selectedParameters: [...prev.selectedParameters, parameter],
      }));
    }
  };
  // 按品类筛选产品（不直接选择，只是筛选显示）
  const [selectedCategory, setSelectedCategory] = useState('all');
  const selectProductsByCategory = category => {
    setSelectedCategory(category);
  };
  // 生成图表配置
  const generateChartOption = () => {
    const { selectedProducts, selectedParameters } = comparisonData;
    if (selectedProducts.length === 0 || selectedParameters.length === 0) {
      return {};
    }
    const series = selectedParameters.map((param, index) => ({
      name: param,
      type: comparisonData.chartType === 'line' ? 'line' : 'bar',
      data: selectedProducts.map((product, productIndex) => ({
        value: getParameterValue(product, param),
        itemStyle: {
          color: chartStyle.chart.colorScheme[productIndex % chartStyle.chart.colorScheme.length],
        },
      })),
      label: chartStyle.chart.showDataLabels
        ? {
            show: true,
            color: chartStyle.chart.dataLabelColor,
            fontSize: chartStyle.chart.dataLabelSize,
          }
        : { show: false },
    }));
    return {
      title: {
        text: chartStyle.title.text,
        left: chartStyle.title.align,
        textStyle: {
          fontSize: chartStyle.title.fontSize,
          color: chartStyle.title.color,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: selectedParameters,
        bottom: 10,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true,
        show: chartStyle.chart.showGrid,
        borderColor: chartStyle.chart.axisColor,
      },
      xAxis: {
        type: 'category',
        data: selectedProducts.map(p => `${p.basicInfo.brand} ${p.basicInfo.modelName}`),
        axisLine: {
          lineStyle: {
            color: chartStyle.chart.axisColor,
          },
        },
        axisLabel: {
          color: chartStyle.chart.barLabelColor,
          fontSize: chartStyle.chart.barLabelFontSize,
          rotate: 0,
          interval: 0,
          margin: 8,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: chartStyle.chart.axisColor,
          },
        },
        axisLabel: {
          color: chartStyle.chart.axisTextColor,
        },
        splitLine: {
          show: chartStyle.chart.showGrid,
          lineStyle: {
            color: chartStyle.chart.axisColor,
            opacity: 0.3,
          },
        },
      },
      series,
    };
  };
  // 生成表格 - 修正为行是属性，列是品牌
  const generateTable = () => {
    const { selectedProducts, selectedParameters } = comparisonData;
    if (selectedProducts.length === 0 || selectedParameters.length === 0) {
      return _jsx('div', {
        className: 'flex items-center justify-center h-64 text-gray-500',
        children: _jsxs('div', {
          className: 'text-center',
          children: [
            _jsx(Table, { className: 'w-12 h-12 mx-auto mb-4 opacity-50' }),
            _jsx('p', {
              children:
                '\u8BF7\u9009\u62E9\u4EA7\u54C1\u548C\u53C2\u6570\u6765\u751F\u6210\u5BF9\u6BD4\u8868\u683C',
            }),
          ],
        }),
      });
    }
    return _jsx('div', {
      className: 'w-full h-full flex flex-col overflow-hidden',
      children: _jsxs('div', {
        ref: tableRef,
        className: 'flex-1 overflow-auto bg-white rounded-lg shadow-sm',
        style: {
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#ffffff',
        },
        children: [
          _jsx('div', {
            style: {
              textAlign: chartStyle.title.align,
              fontSize: `${chartStyle.title.fontSize}px`,
              color: chartStyle.title.color,
              fontWeight: 'bold',
              marginBottom: '20px',
              padding: '10px',
            },
            children: chartStyle.title.text,
          }),
          _jsxs('table', {
            style: {
              width: '100%',
              borderCollapse: 'collapse',
              border: `${chartStyle.table.borderWidth}px solid ${chartStyle.table.borderColor}`,
              tableLayout: 'auto',
              minWidth: 'fit-content',
            },
            children: [
              _jsx('thead', {
                children: _jsxs('tr', {
                  children: [
                    _jsx('th', {
                      style: {
                        padding: `${chartStyle.table.rowHeight / 4}px 8px`,
                        border: `${chartStyle.table.borderWidth}px solid ${chartStyle.table.borderColor}`,
                        fontSize: `${chartStyle.table.headerFontSize}px`,
                        color: chartStyle.table.headerTextColor,
                        fontWeight: chartStyle.table.headerBold ? 'bold' : 'normal',
                        textAlign: chartStyle.table.headerTextAlign,
                        backgroundColor: chartStyle.table.headerBgColor,
                        minWidth: `${chartStyle.table.columnWidth}px`,
                        height: `${chartStyle.table.rowHeight}px`,
                        whiteSpace: 'nowrap',
                      },
                      children: '\u53C2\u6570',
                    }),
                    selectedProducts.map(product =>
                      _jsxs(
                        'th',
                        {
                          style: {
                            padding: `${chartStyle.table.rowHeight / 4}px 8px`,
                            border: `${chartStyle.table.borderWidth}px solid ${chartStyle.table.borderColor}`,
                            fontSize: `${chartStyle.table.headerFontSize}px`,
                            color: chartStyle.table.headerTextColor,
                            fontWeight: chartStyle.table.headerBold ? 'bold' : 'normal',
                            textAlign: chartStyle.table.headerTextAlign,
                            backgroundColor: chartStyle.table.headerBgColor,
                            minWidth: `${chartStyle.table.columnWidth}px`,
                            height: `${chartStyle.table.rowHeight}px`,
                            whiteSpace: 'nowrap',
                          },
                          children: [product.basicInfo.brand, ' ', product.basicInfo.modelName],
                        },
                        product.id,
                      ),
                    ),
                  ],
                }),
              }),
              _jsx('tbody', {
                children: selectedParameters.map((param, index) =>
                  _jsxs(
                    'tr',
                    {
                      style: {
                        backgroundColor: chartStyle.table.zebraStripe
                          ? index % 2 === 0
                            ? chartStyle.table.evenRowBgColor
                            : chartStyle.table.oddRowBgColor
                          : chartStyle.table.contentBgColor,
                      },
                      children: [
                        _jsx('td', {
                          style: {
                            padding: `${chartStyle.table.rowHeight / 4}px 8px`,
                            border: `${chartStyle.table.borderWidth}px solid ${chartStyle.table.borderColor}`,
                            fontSize: `${chartStyle.table.contentFontSize}px`,
                            color: chartStyle.table.contentTextColor,
                            fontWeight: 'bold',
                            textAlign: chartStyle.table.contentTextAlign,
                            backgroundColor: 'inherit',
                            height: `${chartStyle.table.rowHeight}px`,
                          },
                          children: param,
                        }),
                        selectedProducts.map(product =>
                          _jsx(
                            'td',
                            {
                              style: {
                                padding: `${chartStyle.table.rowHeight / 4}px 8px`,
                                border: `${chartStyle.table.borderWidth}px solid ${chartStyle.table.borderColor}`,
                                fontSize: `${chartStyle.table.contentFontSize}px`,
                                color: chartStyle.table.contentTextColor,
                                textAlign: chartStyle.table.contentTextAlign,
                                backgroundColor: 'inherit',
                                height: `${chartStyle.table.rowHeight}px`,
                              },
                              children: getParameterDisplayValue(product, param),
                            },
                            product.id,
                          ),
                        ),
                      ],
                    },
                    param,
                  ),
                ),
              }),
            ],
          }),
        ],
      }),
    });
  };
  // 保存图表到图表库
  const saveChart = async () => {
    if (
      comparisonData.selectedProducts.length === 0 ||
      comparisonData.selectedParameters.length === 0
    ) {
      alert('请先选择产品和参数');
      return;
    }
    try {
      let url = '';
      let thumbnail = '';
      let tableHTML = ''; // 新增：保存原始HTML表格内容
      if (comparisonData.chartType === 'table') {
        if (tableRef.current) {
          // 1. 先获取HTML表格内容
          tableHTML = tableRef.current.innerHTML;
          // 2. 生成PNG图片
          const canvas = await html2canvas(tableRef.current, {
            backgroundColor: '#ffffff',
            scale: 1,
            width: Math.min(tableRef.current.scrollWidth, 1920),
            height: Math.min(tableRef.current.scrollHeight, 1080),
          });
          url = canvas.toDataURL('image/png');
          // 3. 生成缩略图
          const thumbnailCanvas = document.createElement('canvas');
          const ctx = thumbnailCanvas.getContext('2d');
          const img = new Image();
          await new Promise(resolve => {
            img.onload = () => {
              const aspectRatio = img.width / img.height;
              const thumbnailWidth = 200;
              const thumbnailHeight = thumbnailWidth / aspectRatio;
              thumbnailCanvas.width = thumbnailWidth;
              thumbnailCanvas.height = thumbnailHeight;
              ctx?.drawImage(img, 0, 0, thumbnailWidth, thumbnailHeight);
              thumbnail = thumbnailCanvas.toDataURL('image/png', 0.8);
              resolve(null);
            };
            img.src = url;
          });
        }
      } else {
        if (chartRef.current) {
          const echartsInstance = chartRef.current.getEchartsInstance();
          url = echartsInstance.getDataURL({
            type: 'png',
            backgroundColor: '#ffffff',
            pixelRatio: 2,
          });
          thumbnail = echartsInstance.getDataURL({
            type: 'png',
            backgroundColor: '#ffffff',
            pixelRatio: 1,
          });
        }
      }
      if (url) {
        // 保存图表，对于表格类型，同时保存HTML内容和PNG图片
        const chartData = {
          title: chartStyle.title.text,
          config: {
            title: chartStyle.title.text,
            type: comparisonData.chartType,
            products: comparisonData.selectedProducts,
            parameters: comparisonData.selectedParameters,
            theme: comparisonData.theme,
          },
          url, // PNG图片（用于缩略图显示）
          thumbnail,
          // 新增：对于表格类型，保存原始HTML内容
          ...(comparisonData.chartType === 'table' && { tableHTML }),
        };
        actions.addChart(chartData);
        alert('图表保存成功！');
      }
    } catch (error) {
      console.error('保存图表失败:', error);
      alert('保存图表失败，请重试');
    }
  };
  // 导出图表
  const exportChart = async format => {
    try {
      let dataUrl = '';
      let filename = `${chartStyle.title.text}.${format}`;
      if (comparisonData.chartType === 'table') {
        if (tableRef.current) {
          const canvas = await html2canvas(tableRef.current, {
            backgroundColor: '#ffffff',
            scale: 1,
            width: Math.min(tableRef.current.scrollWidth, 1920),
            height: Math.min(tableRef.current.scrollHeight, 1080),
          });
          dataUrl = canvas.toDataURL('image/png');
          filename = `${chartStyle.title.text}.png`; // 表格只支持PNG
        }
      } else {
        if (chartRef.current) {
          const echartsInstance = chartRef.current.getEchartsInstance();
          if (format === 'png') {
            dataUrl = echartsInstance.getDataURL({
              type: 'png',
              backgroundColor: '#ffffff',
              pixelRatio: 1,
            });
          } else {
            dataUrl = echartsInstance.getDataURL({
              type: 'svg',
            });
          }
        }
      }
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    }
  };
  // 重置为默认设置
  const resetToDefault = () => {
    setChartStyle({
      title: {
        text: comparisonData.title,
        fontSize: 18,
        color: '#000000',
        align: 'center',
      },
      table: {
        headerBgColor: '#f8f9fa',
        headerTextColor: '#212529',
        headerFontSize: 14,
        headerBold: true,
        headerTextAlign: 'left',
        contentTextColor: '#495057',
        contentFontSize: 12,
        contentTextAlign: 'left',
        contentBgColor: '#ffffff',
        borderColor: '#dee2e6',
        borderWidth: 1,
        zebraStripe: true,
        zebraColor: '#f8f9fa',
        evenRowBgColor: '#ffffff',
        oddRowBgColor: '#f8f9fa',
        columnWidth: 150,
        rowHeight: 40,
      },
      chart: {
        colorScheme: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
        axisColor: '#666666',
        axisTextColor: '#333333',
        showGrid: true,
        showDataLabels: false,
        dataLabelColor: '#333333',
        dataLabelSize: 12,
        barLabelFontSize: 12,
        barLabelColor: '#333333',
      },
    });
  };
  // 预览组件
  const PreviewComponent = () => {
    const { selectedProducts, selectedParameters, chartType } = comparisonData;
    if (selectedProducts.length === 0 || selectedParameters.length === 0) {
      return _jsx('div', {
        className:
          'flex items-center justify-center h-96 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg',
        children: _jsxs('div', {
          className: 'text-center',
          children: [
            _jsx(LayoutGrid, { className: 'w-16 h-16 mx-auto mb-4 opacity-50' }),
            _jsx('p', {
              className: 'text-lg',
              children:
                '\u8BF7\u9009\u62E9\u4EA7\u54C1\u548C\u53C2\u6570\u6765\u751F\u6210\u5BF9\u6BD4\u56FE\u8868',
            }),
          ],
        }),
      });
    }
    if (chartType === 'table') {
      return generateTable();
    }
    const option = generateChartOption();
    return _jsx('div', {
      className: 'w-full h-full min-h-[350px] flex flex-col',
      children: _jsx(ReactECharts, {
        ref: chartRef,
        option: option,
        style: { height: '100%', width: '100%', minHeight: '350px' },
        opts: { renderer: 'canvas' },
      }),
    });
  };
  // 过滤产品
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.basicInfo.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.basicInfo.modelName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.basicInfo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const availableParameters = getAllAvailableParameters();
  const availableCategories = getAllCategories();
  return _jsxs('div', {
    className: 'space-y-6',
    children: [
      _jsxs(Card, {
        children: [
          _jsx(CardHeader, {
            className: 'pb-4',
            children: _jsxs(CardTitle, {
              className: 'flex items-center space-x-2',
              children: [
                _jsx(Eye, { className: 'w-5 h-5' }),
                _jsx('span', { children: '\u9884\u89C8' }),
              ],
            }),
          }),
          _jsx(CardContent, {
            children: _jsx('div', {
              className:
                'min-h-[400px] max-h-[600px] overflow-hidden bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center',
              children: _jsx('div', {
                className: 'w-full h-full p-4',
                children: _jsx(PreviewComponent, {}),
              }),
            }),
          }),
        ],
      }),
      _jsxs('div', {
        className: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
        children: [
          _jsx('div', {
            className: 'lg:col-span-1',
            children: _jsxs(Card, {
              children: [
                _jsx(CardHeader, {
                  children: _jsxs('div', {
                    className: 'flex space-x-2',
                    children: [
                      _jsx(Button, {
                        variant: activeTab === 'other' ? 'default' : 'outline',
                        size: 'sm',
                        onClick: () => setActiveTab('other'),
                        children: '\u5176\u4ED6\u8BBE\u7F6E',
                      }),
                      _jsx(Button, {
                        variant: activeTab === 'table' ? 'default' : 'outline',
                        size: 'sm',
                        onClick: () => setActiveTab('table'),
                        children: '\u8868\u683C\u8BBE\u7F6E',
                      }),
                    ],
                  }),
                }),
                _jsx(CardContent, {
                  className: 'space-y-4',
                  children:
                    activeTab === 'other'
                      ? _jsxs(_Fragment, {
                          children: [
                            _jsxs('div', {
                              children: [
                                _jsx('h3', {
                                  className: 'font-medium text-gray-900 mb-3',
                                  children: '\u56FE\u8868\u7C7B\u578B',
                                }),
                                _jsxs('div', {
                                  className: 'flex space-x-2',
                                  children: [
                                    _jsx(Button, {
                                      variant:
                                        comparisonData.chartType === 'table'
                                          ? 'default'
                                          : 'outline',
                                      size: 'sm',
                                      onClick: () =>
                                        setComparisonData(prev => ({
                                          ...prev,
                                          chartType: 'table',
                                        })),
                                      className: 'flex-1',
                                      children: '\u8868\u683C\u56FE',
                                    }),
                                    _jsx(Button, {
                                      variant:
                                        comparisonData.chartType === 'bar' ? 'default' : 'outline',
                                      size: 'sm',
                                      onClick: () =>
                                        setComparisonData(prev => ({ ...prev, chartType: 'bar' })),
                                      className: 'flex-1',
                                      children: '\u67F1\u5F62\u56FE',
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            _jsxs('div', {
                              children: [
                                _jsx('h3', {
                                  className: 'font-medium text-gray-900 mb-3',
                                  children: '\u56FE\u8868\u6807\u9898',
                                }),
                                _jsxs('div', {
                                  className: 'space-y-3',
                                  children: [
                                    _jsx(Input, {
                                      placeholder: '\u8BF7\u8F93\u5165\u56FE\u8868\u6807\u9898',
                                      value: comparisonData.title,
                                      onChange: e => {
                                        setComparisonData(prev => ({
                                          ...prev,
                                          title: e.target.value,
                                        }));
                                        setChartStyle(prev => ({
                                          ...prev,
                                          title: { ...prev.title, text: e.target.value },
                                        }));
                                      },
                                    }),
                                    _jsxs('div', {
                                      className: 'grid grid-cols-2 gap-2',
                                      children: [
                                        _jsxs('div', {
                                          children: [
                                            _jsx('label', {
                                              className: 'text-xs text-gray-600 mb-1 block',
                                              children: '\u6807\u9898\u5927\u5C0F',
                                            }),
                                            _jsx(Input, {
                                              type: 'number',
                                              value: chartStyle.title.fontSize,
                                              onChange: e =>
                                                setChartStyle(prev => ({
                                                  ...prev,
                                                  title: {
                                                    ...prev.title,
                                                    fontSize: parseInt(e.target.value) || 18,
                                                  },
                                                })),
                                              className: 'text-xs',
                                              placeholder: '18px',
                                            }),
                                          ],
                                        }),
                                        _jsxs('div', {
                                          children: [
                                            _jsx('label', {
                                              className: 'text-xs text-gray-600 mb-1 block',
                                              children: '\u6587\u5B57\u989C\u8272',
                                            }),
                                            _jsxs('div', {
                                              className: 'flex items-center space-x-2',
                                              children: [
                                                _jsx('input', {
                                                  type: 'color',
                                                  value: chartStyle.title.color,
                                                  onChange: e =>
                                                    setChartStyle(prev => ({
                                                      ...prev,
                                                      title: {
                                                        ...prev.title,
                                                        color: e.target.value,
                                                      },
                                                    })),
                                                  className: 'w-8 h-8 rounded border',
                                                }),
                                                _jsx('div', {
                                                  className: 'w-6 h-6 rounded border',
                                                  style: {
                                                    backgroundColor: chartStyle.title.color,
                                                  },
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
                            _jsxs('div', {
                              className: 'flex space-x-2',
                              children: [
                                _jsxs(Button, {
                                  onClick: saveChart,
                                  className: 'flex-1',
                                  children: [
                                    _jsx(Save, { className: 'w-4 h-4 mr-2' }),
                                    '\u4FDD\u5B58\u8868\u683C',
                                  ],
                                }),
                                _jsxs(Select, {
                                  onValueChange: format => exportChart(format),
                                  children: [
                                    _jsxs(SelectTrigger, {
                                      className: 'flex-1',
                                      children: [
                                        _jsx(Download, { className: 'w-4 h-4 mr-2' }),
                                        _jsx(SelectValue, { placeholder: '\u5BFC\u51FA' }),
                                      ],
                                    }),
                                    _jsxs(SelectContent, {
                                      children: [
                                        _jsx(SelectItem, {
                                          value: 'png',
                                          children: '\u5BFC\u51FAPNG',
                                        }),
                                        _jsx(SelectItem, {
                                          value: 'svg',
                                          children: '\u5BFC\u51FASVG',
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        })
                      : _jsxs(_Fragment, {
                          children: [
                            comparisonData.chartType === 'table' &&
                              _jsxs('div', {
                                className: 'space-y-4',
                                children: [
                                  _jsxs('div', {
                                    children: [
                                      _jsx('h4', {
                                        className: 'text-sm font-medium text-gray-700 mb-2',
                                        children: '\u8868\u5934\u8BBE\u7F6E',
                                      }),
                                      _jsxs('div', {
                                        className: 'grid grid-cols-2 gap-2',
                                        children: [
                                          _jsxs('div', {
                                            children: [
                                              _jsx('label', {
                                                className: 'text-xs text-gray-600 mb-1 block',
                                                children: '\u5B57\u4F53\u5927\u5C0F',
                                              }),
                                              _jsx(Input, {
                                                type: 'number',
                                                value: chartStyle.table.headerFontSize,
                                                onChange: e =>
                                                  setChartStyle(prev => ({
                                                    ...prev,
                                                    table: {
                                                      ...prev.table,
                                                      headerFontSize:
                                                        parseInt(e.target.value) || 14,
                                                    },
                                                  })),
                                                className: 'text-xs',
                                                placeholder: '14px',
                                              }),
                                            ],
                                          }),
                                          _jsxs('div', {
                                            children: [
                                              _jsx('label', {
                                                className: 'text-xs text-gray-600 mb-1 block',
                                                children: '\u6587\u5B57\u989C\u8272',
                                              }),
                                              _jsxs('div', {
                                                className: 'flex items-center space-x-2',
                                                children: [
                                                  _jsx('input', {
                                                    type: 'color',
                                                    value: chartStyle.table.headerTextColor,
                                                    onChange: e =>
                                                      setChartStyle(prev => ({
                                                        ...prev,
                                                        table: {
                                                          ...prev.table,
                                                          headerTextColor: e.target.value,
                                                        },
                                                      })),
                                                    className: 'w-8 h-8 rounded border',
                                                  }),
                                                  _jsx('div', {
                                                    className: 'w-6 h-6 rounded border',
                                                    style: {
                                                      backgroundColor:
                                                        chartStyle.table.headerTextColor,
                                                    },
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  _jsxs('div', {
                                    children: [
                                      _jsx('h4', {
                                        className: 'text-sm font-medium text-gray-700 mb-2',
                                        children: '\u5185\u5BB9\u8BBE\u7F6E',
                                      }),
                                      _jsxs('div', {
                                        className: 'grid grid-cols-2 gap-2',
                                        children: [
                                          _jsxs('div', {
                                            children: [
                                              _jsx('label', {
                                                className: 'text-xs text-gray-600 mb-1 block',
                                                children: '\u5B57\u4F53\u5927\u5C0F',
                                              }),
                                              _jsx(Input, {
                                                type: 'number',
                                                value: chartStyle.table.contentFontSize,
                                                onChange: e =>
                                                  setChartStyle(prev => ({
                                                    ...prev,
                                                    table: {
                                                      ...prev.table,
                                                      contentFontSize:
                                                        parseInt(e.target.value) || 12,
                                                    },
                                                  })),
                                                className: 'text-xs',
                                                placeholder: '12px',
                                              }),
                                            ],
                                          }),
                                          _jsxs('div', {
                                            children: [
                                              _jsx('label', {
                                                className: 'text-xs text-gray-600 mb-1 block',
                                                children: '\u6587\u5B57\u989C\u8272',
                                              }),
                                              _jsxs('div', {
                                                className: 'flex items-center space-x-2',
                                                children: [
                                                  _jsx('input', {
                                                    type: 'color',
                                                    value: chartStyle.table.contentTextColor,
                                                    onChange: e =>
                                                      setChartStyle(prev => ({
                                                        ...prev,
                                                        table: {
                                                          ...prev.table,
                                                          contentTextColor: e.target.value,
                                                        },
                                                      })),
                                                    className: 'w-8 h-8 rounded border',
                                                  }),
                                                  _jsx('div', {
                                                    className: 'w-6 h-6 rounded border',
                                                    style: {
                                                      backgroundColor:
                                                        chartStyle.table.contentTextColor,
                                                    },
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  _jsxs('div', {
                                    children: [
                                      _jsx('label', {
                                        className: 'text-xs text-gray-600 mb-1 block',
                                        children: '\u8868\u683C\u8FB9\u6846\u989C\u8272',
                                      }),
                                      _jsxs('div', {
                                        className: 'flex items-center space-x-2',
                                        children: [
                                          _jsx('input', {
                                            type: 'color',
                                            value: chartStyle.table.borderColor,
                                            onChange: e =>
                                              setChartStyle(prev => ({
                                                ...prev,
                                                table: {
                                                  ...prev.table,
                                                  borderColor: e.target.value,
                                                },
                                              })),
                                            className: 'w-8 h-8 rounded border',
                                          }),
                                          _jsx('div', {
                                            className: 'w-6 h-6 rounded border',
                                            style: {
                                              backgroundColor: chartStyle.table.borderColor,
                                            },
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  _jsxs('div', {
                                    children: [
                                      _jsx('label', {
                                        className: 'text-xs text-gray-600 mb-1 block',
                                        children: '\u8868\u5934\u80CC\u666F\u989C\u8272',
                                      }),
                                      _jsxs('div', {
                                        className: 'flex items-center space-x-2',
                                        children: [
                                          _jsx('input', {
                                            type: 'color',
                                            value: chartStyle.table.headerBgColor,
                                            onChange: e =>
                                              setChartStyle(prev => ({
                                                ...prev,
                                                table: {
                                                  ...prev.table,
                                                  headerBgColor: e.target.value,
                                                },
                                              })),
                                            className: 'w-8 h-8 rounded border',
                                          }),
                                          _jsx('div', {
                                            className: 'w-6 h-6 rounded border',
                                            style: {
                                              backgroundColor: chartStyle.table.headerBgColor,
                                            },
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  _jsxs('div', {
                                    children: [
                                      _jsx('h4', {
                                        className: 'text-sm font-medium text-gray-700 mb-2',
                                        children: '\u8868\u683C\u80CC\u666F\u8BBE\u7F6E',
                                      }),
                                      _jsxs('div', {
                                        className: 'space-y-3',
                                        children: [
                                          _jsxs('div', {
                                            className: 'flex items-center space-x-2',
                                            children: [
                                              _jsx('input', {
                                                type: 'checkbox',
                                                id: 'zebraStripe',
                                                checked: chartStyle.table.zebraStripe,
                                                onChange: e =>
                                                  setChartStyle(prev => ({
                                                    ...prev,
                                                    table: {
                                                      ...prev.table,
                                                      zebraStripe: e.target.checked,
                                                    },
                                                  })),
                                                className: 'w-4 h-4',
                                              }),
                                              _jsx('label', {
                                                htmlFor: 'zebraStripe',
                                                className: 'text-xs text-gray-600',
                                                children:
                                                  '\u542F\u7528\u6591\u9A6C\u7EB9\u80CC\u666F',
                                              }),
                                            ],
                                          }),
                                          chartStyle.table.zebraStripe
                                            ? _jsxs('div', {
                                                className: 'grid grid-cols-2 gap-2',
                                                children: [
                                                  _jsxs('div', {
                                                    children: [
                                                      _jsx('label', {
                                                        className:
                                                          'text-xs text-gray-600 mb-1 block',
                                                        children: '\u5076\u6570\u884C\u80CC\u666F',
                                                      }),
                                                      _jsxs('div', {
                                                        className: 'flex items-center space-x-2',
                                                        children: [
                                                          _jsx('input', {
                                                            type: 'color',
                                                            value: chartStyle.table.evenRowBgColor,
                                                            onChange: e =>
                                                              setChartStyle(prev => ({
                                                                ...prev,
                                                                table: {
                                                                  ...prev.table,
                                                                  evenRowBgColor: e.target.value,
                                                                },
                                                              })),
                                                            className: 'w-8 h-8 rounded border',
                                                          }),
                                                          _jsx('div', {
                                                            className: 'w-6 h-6 rounded border',
                                                            style: {
                                                              backgroundColor:
                                                                chartStyle.table.evenRowBgColor,
                                                            },
                                                          }),
                                                        ],
                                                      }),
                                                    ],
                                                  }),
                                                  _jsxs('div', {
                                                    children: [
                                                      _jsx('label', {
                                                        className:
                                                          'text-xs text-gray-600 mb-1 block',
                                                        children: '\u5947\u6570\u884C\u80CC\u666F',
                                                      }),
                                                      _jsxs('div', {
                                                        className: 'flex items-center space-x-2',
                                                        children: [
                                                          _jsx('input', {
                                                            type: 'color',
                                                            value: chartStyle.table.oddRowBgColor,
                                                            onChange: e =>
                                                              setChartStyle(prev => ({
                                                                ...prev,
                                                                table: {
                                                                  ...prev.table,
                                                                  oddRowBgColor: e.target.value,
                                                                },
                                                              })),
                                                            className: 'w-8 h-8 rounded border',
                                                          }),
                                                          _jsx('div', {
                                                            className: 'w-6 h-6 rounded border',
                                                            style: {
                                                              backgroundColor:
                                                                chartStyle.table.oddRowBgColor,
                                                            },
                                                          }),
                                                        ],
                                                      }),
                                                    ],
                                                  }),
                                                ],
                                              })
                                            : _jsxs('div', {
                                                children: [
                                                  _jsx('label', {
                                                    className: 'text-xs text-gray-600 mb-1 block',
                                                    children:
                                                      '\u7EDF\u4E00\u80CC\u666F\u989C\u8272',
                                                  }),
                                                  _jsxs('div', {
                                                    className: 'flex items-center space-x-2',
                                                    children: [
                                                      _jsx('input', {
                                                        type: 'color',
                                                        value: chartStyle.table.contentBgColor,
                                                        onChange: e =>
                                                          setChartStyle(prev => ({
                                                            ...prev,
                                                            table: {
                                                              ...prev.table,
                                                              contentBgColor: e.target.value,
                                                            },
                                                          })),
                                                        className: 'w-8 h-8 rounded border',
                                                      }),
                                                      _jsx('div', {
                                                        className: 'w-6 h-6 rounded border',
                                                        style: {
                                                          backgroundColor:
                                                            chartStyle.table.contentBgColor,
                                                        },
                                                      }),
                                                    ],
                                                  }),
                                                ],
                                              }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  _jsxs('div', {
                                    children: [
                                      _jsx('h4', {
                                        className: 'text-sm font-medium text-gray-700 mb-2',
                                        children: '\u6587\u5B57\u5BF9\u9F50',
                                      }),
                                      _jsxs('div', {
                                        className: 'space-y-3',
                                        children: [
                                          _jsxs('div', {
                                            children: [
                                              _jsx('label', {
                                                className: 'text-xs text-gray-600 mb-1 block',
                                                children: '\u8868\u5934\u5BF9\u9F50',
                                              }),
                                              _jsxs('div', {
                                                className: 'flex space-x-2',
                                                children: [
                                                  _jsx(Button, {
                                                    variant:
                                                      chartStyle.table.headerTextAlign === 'left'
                                                        ? 'default'
                                                        : 'outline',
                                                    size: 'sm',
                                                    onClick: () =>
                                                      setChartStyle(prev => ({
                                                        ...prev,
                                                        table: {
                                                          ...prev.table,
                                                          headerTextAlign: 'left',
                                                        },
                                                      })),
                                                    className: 'flex-1 text-xs',
                                                    children: '\u5DE6\u5BF9\u9F50',
                                                  }),
                                                  _jsx(Button, {
                                                    variant:
                                                      chartStyle.table.headerTextAlign === 'center'
                                                        ? 'default'
                                                        : 'outline',
                                                    size: 'sm',
                                                    onClick: () =>
                                                      setChartStyle(prev => ({
                                                        ...prev,
                                                        table: {
                                                          ...prev.table,
                                                          headerTextAlign: 'center',
                                                        },
                                                      })),
                                                    className: 'flex-1 text-xs',
                                                    children: '\u5C45\u4E2D',
                                                  }),
                                                  _jsx(Button, {
                                                    variant:
                                                      chartStyle.table.headerTextAlign === 'right'
                                                        ? 'default'
                                                        : 'outline',
                                                    size: 'sm',
                                                    onClick: () =>
                                                      setChartStyle(prev => ({
                                                        ...prev,
                                                        table: {
                                                          ...prev.table,
                                                          headerTextAlign: 'right',
                                                        },
                                                      })),
                                                    className: 'flex-1 text-xs',
                                                    children: '\u53F3\u5BF9\u9F50',
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                          _jsxs('div', {
                                            children: [
                                              _jsx('label', {
                                                className: 'text-xs text-gray-600 mb-1 block',
                                                children: '\u5185\u5BB9\u5BF9\u9F50',
                                              }),
                                              _jsxs('div', {
                                                className: 'flex space-x-2',
                                                children: [
                                                  _jsx(Button, {
                                                    variant:
                                                      chartStyle.table.contentTextAlign === 'left'
                                                        ? 'default'
                                                        : 'outline',
                                                    size: 'sm',
                                                    onClick: () =>
                                                      setChartStyle(prev => ({
                                                        ...prev,
                                                        table: {
                                                          ...prev.table,
                                                          contentTextAlign: 'left',
                                                        },
                                                      })),
                                                    className: 'flex-1 text-xs',
                                                    children: '\u5DE6\u5BF9\u9F50',
                                                  }),
                                                  _jsx(Button, {
                                                    variant:
                                                      chartStyle.table.contentTextAlign === 'center'
                                                        ? 'default'
                                                        : 'outline',
                                                    size: 'sm',
                                                    onClick: () =>
                                                      setChartStyle(prev => ({
                                                        ...prev,
                                                        table: {
                                                          ...prev.table,
                                                          contentTextAlign: 'center',
                                                        },
                                                      })),
                                                    className: 'flex-1 text-xs',
                                                    children: '\u5C45\u4E2D',
                                                  }),
                                                  _jsx(Button, {
                                                    variant:
                                                      chartStyle.table.contentTextAlign === 'right'
                                                        ? 'default'
                                                        : 'outline',
                                                    size: 'sm',
                                                    onClick: () =>
                                                      setChartStyle(prev => ({
                                                        ...prev,
                                                        table: {
                                                          ...prev.table,
                                                          contentTextAlign: 'right',
                                                        },
                                                      })),
                                                    className: 'flex-1 text-xs',
                                                    children: '\u53F3\u5BF9\u9F50',
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  _jsxs('div', {
                                    children: [
                                      _jsx('h4', {
                                        className: 'text-sm font-medium text-gray-700 mb-2',
                                        children: '\u8868\u683C\u5C3A\u5BF8',
                                      }),
                                      _jsxs('div', {
                                        className: 'grid grid-cols-2 gap-2',
                                        children: [
                                          _jsxs('div', {
                                            children: [
                                              _jsx('label', {
                                                className: 'text-xs text-gray-600 mb-1 block',
                                                children: '\u5217\u5BBD (px)',
                                              }),
                                              _jsx(Input, {
                                                type: 'number',
                                                value: chartStyle.table.columnWidth,
                                                onChange: e =>
                                                  setChartStyle(prev => ({
                                                    ...prev,
                                                    table: {
                                                      ...prev.table,
                                                      columnWidth: parseInt(e.target.value) || 150,
                                                    },
                                                  })),
                                                className: 'text-xs',
                                                placeholder: '150',
                                                min: '50',
                                                max: '500',
                                              }),
                                            ],
                                          }),
                                          _jsxs('div', {
                                            children: [
                                              _jsx('label', {
                                                className: 'text-xs text-gray-600 mb-1 block',
                                                children: '\u884C\u9AD8 (px)',
                                              }),
                                              _jsx(Input, {
                                                type: 'number',
                                                value: chartStyle.table.rowHeight,
                                                onChange: e =>
                                                  setChartStyle(prev => ({
                                                    ...prev,
                                                    table: {
                                                      ...prev.table,
                                                      rowHeight: parseInt(e.target.value) || 40,
                                                    },
                                                  })),
                                                className: 'text-xs',
                                                placeholder: '40',
                                                min: '20',
                                                max: '100',
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            comparisonData.chartType === 'bar' &&
                              _jsxs('div', {
                                className: 'space-y-4',
                                children: [
                                  _jsxs('div', {
                                    children: [
                                      _jsx('h4', {
                                        className: 'text-sm font-medium text-gray-700 mb-2',
                                        children: '\u67F1\u5F62\u56FE\u6587\u5B57\u8BBE\u7F6E',
                                      }),
                                      _jsxs('div', {
                                        className: 'grid grid-cols-2 gap-2',
                                        children: [
                                          _jsxs('div', {
                                            children: [
                                              _jsx('label', {
                                                className: 'text-xs text-gray-600 mb-1 block',
                                                children: '\u6587\u5B57\u5927\u5C0F',
                                              }),
                                              _jsx(Input, {
                                                type: 'number',
                                                value: chartStyle.chart.barLabelFontSize,
                                                onChange: e =>
                                                  setChartStyle(prev => ({
                                                    ...prev,
                                                    chart: {
                                                      ...prev.chart,
                                                      barLabelFontSize:
                                                        parseInt(e.target.value) || 12,
                                                    },
                                                  })),
                                                className: 'text-xs',
                                                placeholder: '12px',
                                              }),
                                            ],
                                          }),
                                          _jsxs('div', {
                                            children: [
                                              _jsx('label', {
                                                className: 'text-xs text-gray-600 mb-1 block',
                                                children: '\u6587\u5B57\u989C\u8272',
                                              }),
                                              _jsxs('div', {
                                                className: 'flex items-center space-x-2',
                                                children: [
                                                  _jsx('input', {
                                                    type: 'color',
                                                    value: chartStyle.chart.barLabelColor,
                                                    onChange: e =>
                                                      setChartStyle(prev => ({
                                                        ...prev,
                                                        chart: {
                                                          ...prev.chart,
                                                          barLabelColor: e.target.value,
                                                        },
                                                      })),
                                                    className: 'w-8 h-8 rounded border',
                                                  }),
                                                  _jsx('div', {
                                                    className: 'w-6 h-6 rounded border',
                                                    style: {
                                                      backgroundColor:
                                                        chartStyle.chart.barLabelColor,
                                                    },
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  _jsxs('div', {
                                    children: [
                                      _jsx('h4', {
                                        className: 'text-sm font-medium text-gray-700 mb-2',
                                        children: '\u67F1\u5F62\u56FE\u989C\u8272',
                                      }),
                                      _jsxs('div', {
                                        className: 'space-y-3',
                                        children: [
                                          _jsxs('div', {
                                            children: [
                                              _jsx('label', {
                                                className: 'text-xs text-gray-600 mb-1 block',
                                                children: '\u914D\u8272\u65B9\u6848',
                                              }),
                                              _jsx('div', {
                                                className: 'grid grid-cols-2 gap-2',
                                                children: Object.entries(colorSchemes).map(
                                                  ([name, colors]) =>
                                                    _jsx(
                                                      Button,
                                                      {
                                                        variant:
                                                          JSON.stringify(
                                                            chartStyle.chart.colorScheme,
                                                          ) === JSON.stringify(colors)
                                                            ? 'default'
                                                            : 'outline',
                                                        size: 'sm',
                                                        onClick: () =>
                                                          setChartStyle(prev => ({
                                                            ...prev,
                                                            chart: {
                                                              ...prev.chart,
                                                              colorScheme: colors,
                                                            },
                                                          })),
                                                        className: 'text-xs h-8',
                                                        children:
                                                          name === 'default'
                                                            ? '默认'
                                                            : name === 'blue'
                                                              ? '蓝色'
                                                              : name === 'green'
                                                                ? '绿色'
                                                                : name === 'warm'
                                                                  ? '暖色'
                                                                  : name === 'cool'
                                                                    ? '冷色'
                                                                    : name === 'purple'
                                                                      ? '紫色'
                                                                      : name === 'rainbow'
                                                                        ? '彩虹'
                                                                        : name,
                                                      },
                                                      name,
                                                    ),
                                                ),
                                              }),
                                            ],
                                          }),
                                          _jsxs(Button, {
                                            variant: 'outline',
                                            size: 'sm',
                                            onClick: () => {
                                              const randomColors = generateRandomColors(5);
                                              setChartStyle(prev => ({
                                                ...prev,
                                                chart: { ...prev.chart, colorScheme: randomColors },
                                              }));
                                            },
                                            className: 'w-full',
                                            children: [
                                              _jsx(Shuffle, { className: 'w-4 h-4 mr-2' }),
                                              '\u968F\u673A\u989C\u8272',
                                            ],
                                          }),
                                          _jsxs('div', {
                                            children: [
                                              _jsx('label', {
                                                className: 'text-xs text-gray-600 mb-1 block',
                                                children: '\u5F53\u524D\u989C\u8272',
                                              }),
                                              _jsx('div', {
                                                className: 'flex space-x-1',
                                                children: chartStyle.chart.colorScheme.map(
                                                  (color, index) =>
                                                    _jsx(
                                                      'div',
                                                      {
                                                        className: 'w-6 h-6 rounded border',
                                                        style: { backgroundColor: color },
                                                        title: color,
                                                      },
                                                      index,
                                                    ),
                                                ),
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
                }),
              ],
            }),
          }),
          _jsx('div', {
            className: 'lg:col-span-1',
            children: _jsxs(Card, {
              children: [
                _jsx(CardHeader, {
                  children: _jsxs(CardTitle, {
                    className: 'flex items-center space-x-2',
                    children: [
                      _jsx(Search, { className: 'w-5 h-5' }),
                      _jsx('span', { children: '\u9009\u62E9\u4EA7\u54C1' }),
                    ],
                  }),
                }),
                _jsxs(CardContent, {
                  className: 'space-y-4',
                  children: [
                    _jsx(Input, {
                      placeholder: '\u641C\u7D22\u4EA7\u54C1...',
                      value: searchTerm,
                      onChange: e => setSearchTerm(e.target.value),
                      className: 'text-sm',
                    }),
                    _jsxs('div', {
                      className: 'flex flex-wrap gap-2',
                      children: [
                        _jsx(Button, {
                          variant: selectedCategory === 'all' ? 'default' : 'outline',
                          size: 'sm',
                          onClick: () => selectProductsByCategory('all'),
                          children: '\u54C1\u7C7B',
                        }),
                        availableCategories.map(category =>
                          _jsx(
                            Button,
                            {
                              variant: selectedCategory === category ? 'default' : 'outline',
                              size: 'sm',
                              onClick: () => selectProductsByCategory(category),
                              children: category,
                            },
                            category,
                          ),
                        ),
                      ],
                    }),
                    _jsx('div', {
                      className: 'max-h-64 overflow-y-auto space-y-2',
                      children: filteredProducts.map(product => {
                        const isSelected = comparisonData.selectedProducts.some(
                          p => p.id === product.id,
                        );
                        return _jsx(
                          'div',
                          {
                            className: `p-2 text-sm border rounded cursor-pointer transition-colors ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 text-blue-900'
                                : 'border-gray-200 hover:border-gray-300'
                            }`,
                            onClick: () => toggleProduct(product),
                            children: _jsxs('div', {
                              className: 'flex items-center justify-between',
                              children: [
                                _jsx('div', {
                                  className: 'truncate',
                                  children: _jsxs('div', {
                                    className: 'font-medium',
                                    children: [
                                      product.basicInfo.brand,
                                      ' ',
                                      product.basicInfo.modelName,
                                    ],
                                  }),
                                }),
                                isSelected &&
                                  _jsx(CheckCircle, {
                                    className: 'w-4 h-4 text-blue-500 flex-shrink-0',
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
          }),
          _jsx('div', {
            className: 'lg:col-span-1',
            children: _jsxs(Card, {
              children: [
                _jsx(CardHeader, {
                  children: _jsxs(CardTitle, {
                    className: 'flex items-center space-x-2',
                    children: [
                      _jsx(Settings, { className: 'w-5 h-5' }),
                      _jsx('span', { children: '\u9009\u62E9\u53C2\u6570' }),
                    ],
                  }),
                }),
                _jsx(CardContent, {
                  children:
                    availableParameters.length === 0
                      ? _jsx('div', {
                          className: 'text-center text-gray-500 py-8 text-sm',
                          children: '\u8BF7\u5148\u9009\u62E9\u4EA7\u54C1',
                        })
                      : _jsx('div', {
                          className: 'max-h-64 overflow-y-auto space-y-2',
                          children: availableParameters.map(param => {
                            const isSelected = comparisonData.selectedParameters.includes(param);
                            return _jsx(
                              'div',
                              {
                                className: `p-2 text-sm border rounded cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'border-green-500 bg-green-50 text-green-900'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`,
                                onClick: () => toggleParameter(param),
                                children: _jsxs('div', {
                                  className: 'flex items-center justify-between',
                                  children: [
                                    _jsx('span', { className: 'truncate', children: param }),
                                    isSelected &&
                                      _jsx(CheckCircle, {
                                        className: 'w-4 h-4 text-green-500 flex-shrink-0',
                                      }),
                                  ],
                                }),
                              },
                              param,
                            );
                          }),
                        }),
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
};
export default ComparisonGenerator;
