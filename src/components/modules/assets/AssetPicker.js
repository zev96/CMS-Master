import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  FileText,
  Image,
  Archive,
  GripVertical,
  X,
  Filter,
  Package,
  Building2,
  Layers,
  Sparkles,
  Star,
} from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { cn } from '../../../lib/utils';
import useAppStore from '../../../stores/useAppStore';
// 简化的资产分类配置
const ASSET_CATEGORIES = {
  // 资产类型
  types: {
    text: { label: '文本素材', icon: FileText, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    image: { label: '图片素材', icon: Image, color: 'bg-green-50 text-green-700 border-green-200' },
  },
  // 内容分类 - 更直观的分类方式
  content: {
    产品介绍: { icon: Package, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    使用指南: { icon: FileText, color: 'bg-orange-50 text-orange-700 border-orange-200' },
    技术解析: { icon: Sparkles, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    对比评测: { icon: Star, color: 'bg-pink-50 text-pink-700 border-pink-200' },
    产品图片: { icon: Image, color: 'bg-red-50 text-red-700 border-red-200' },
    场景图片: { icon: Image, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    图标素材: { icon: Sparkles, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    图表素材: { icon: Package, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  },
};
const DraggableAssetItem = ({ asset, onUse }) => {
  const isTextAsset = 'content' in asset;
  const handleDragStart = e => {
    e.dataTransfer.setData('application/json', JSON.stringify(asset));
    e.dataTransfer.effectAllowed = 'copy';
  };
  // 获取资产样式
  const getAssetStyle = () => {
    // 优先使用内容分类的样式
    if (ASSET_CATEGORIES.content[asset.asset_category]) {
      return ASSET_CATEGORIES.content[asset.asset_category];
    }
    // 默认样式
    return {
      icon: isTextAsset ? FileText : Image,
      color: isTextAsset
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-green-50 text-green-700 border-green-200',
    };
  };
  const assetStyle = getAssetStyle();
  const AssetIcon = assetStyle.icon;
  return _jsx('div', {
    draggable: true,
    onDragStart: handleDragStart,
    className:
      'bg-white border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 group hover:scale-[1.02] hover:border-blue-300',
    children: _jsxs('div', {
      className: 'flex items-start space-x-3',
      children: [
        _jsx('div', {
          className: 'flex-shrink-0 mt-1',
          children: _jsx(GripVertical, {
            className:
              'w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity',
          }),
        }),
        _jsx('div', {
          className: 'flex-shrink-0',
          children: _jsx('div', {
            className: cn('w-8 h-8 rounded-lg flex items-center justify-center', assetStyle.color),
            children: _jsx(AssetIcon, { className: 'w-4 h-4' }),
          }),
        }),
        _jsxs('div', {
          className: 'min-w-0 flex-1',
          children: [
            _jsx('h4', { className: 'font-medium text-sm truncate mb-2', children: asset.title }),
            _jsxs('div', {
              className: 'flex items-center flex-wrap gap-1 mb-2',
              children: [
                _jsx(Badge, {
                  variant: 'outline',
                  className: cn('text-xs px-2 py-0.5', assetStyle.color),
                  children: asset.asset_category,
                }),
                asset.brand &&
                  _jsx(Badge, {
                    variant: 'secondary',
                    className: 'text-xs px-2 py-0.5',
                    children: asset.brand,
                  }),
                asset.productCategory &&
                  _jsx(Badge, {
                    variant: 'outline',
                    className: 'text-xs px-2 py-0.5 bg-blue-50 text-blue-600 border-blue-200',
                    children: asset.productCategory,
                  }),
              ],
            }),
            _jsx('div', {
              className: 'text-xs text-muted-foreground line-clamp-2 mb-2',
              children: isTextAsset
                ? asset.content.substring(0, 60) + '...'
                : `${asset.asset_category} · 图片素材`,
            }),
            _jsxs('div', {
              className: 'flex items-center justify-between',
              children: [
                _jsx('div', {
                  className: 'flex flex-wrap gap-1',
                  children: asset.tags
                    ?.slice(0, 2)
                    .map((tag, index) =>
                      _jsx(
                        Badge,
                        {
                          variant: 'outline',
                          className: 'text-xs px-1.5 py-0.5 bg-gray-50',
                          children: tag,
                        },
                        index,
                      ),
                    ),
                }),
                _jsx(Button, {
                  size: 'sm',
                  onClick: onUse,
                  className: 'h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700',
                  children: '\u4F7F\u7528',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
};
const AssetPicker = ({ className }) => {
  const { textAssets, visualAssets, products, actions } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  // 筛选器状态 - 改为下拉选择器
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedProductCategory, setSelectedProductCategory] = useState('all');
  const [selectedContentCategory, setSelectedContentCategory] = useState('all');
  // 合并所有素材
  const allAssets = useMemo(() => {
    return [...textAssets, ...visualAssets];
  }, [textAssets, visualAssets]);
  // 从产品库同步获取筛选选项
  const filterOptions = useMemo(() => {
    const brands = new Set();
    const productCategories = new Set();
    const contentCategories = new Set();
    // 从产品库获取品牌和品类
    products.forEach(product => {
      if (product.basicInfo.brand) {
        brands.add(product.basicInfo.brand);
      }
      if (product.basicInfo.category) {
        productCategories.add(product.basicInfo.category);
      }
    });
    // 从素材库获取内容分类
    allAssets.forEach(asset => {
      contentCategories.add(asset.asset_category);
      if (asset.brand) brands.add(asset.brand);
      if (asset.productCategory) productCategories.add(asset.productCategory);
    });
    return {
      brands: Array.from(brands).sort(),
      productCategories: Array.from(productCategories).sort(),
      contentCategories: Array.from(contentCategories).sort(),
    };
  }, [allAssets, products]);
  // 过滤素材
  const filteredAssets = useMemo(() => {
    return allAssets.filter(asset => {
      const isTextAsset = 'content' in asset;
      // 类型筛选
      if (selectedType === 'text' && !isTextAsset) return false;
      if (selectedType === 'image' && isTextAsset) return false;
      // 品牌筛选
      if (selectedBrand !== 'all' && asset.brand !== selectedBrand) return false;
      // 产品品类筛选
      if (selectedProductCategory !== 'all' && asset.productCategory !== selectedProductCategory)
        return false;
      // 内容分类筛选
      if (selectedContentCategory !== 'all' && asset.asset_category !== selectedContentCategory)
        return false;
      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchTitle = asset.title.toLowerCase().includes(query);
        const matchCategory = asset.asset_category.toLowerCase().includes(query);
        const matchBrand = asset.brand?.toLowerCase().includes(query);
        const matchProductCategory = asset.productCategory?.toLowerCase().includes(query);
        const matchTags = asset.tags?.some(tag => tag.toLowerCase().includes(query));
        const matchContent = isTextAsset && asset.content.toLowerCase().includes(query);
        return (
          matchTitle ||
          matchCategory ||
          matchBrand ||
          matchProductCategory ||
          matchTags ||
          matchContent
        );
      }
      return true;
    });
  }, [
    allAssets,
    selectedType,
    selectedBrand,
    selectedProductCategory,
    selectedContentCategory,
    searchQuery,
  ]);
  const handleUseAsset = asset => {
    actions.insertAssetToEditor(asset);
  };
  const clearAllFilters = () => {
    setSelectedType('all');
    setSelectedBrand('all');
    setSelectedProductCategory('all');
    setSelectedContentCategory('all');
    setSearchQuery('');
  };
  // 检查是否有活跃的筛选器
  const hasActiveFilters =
    selectedType !== 'all' ||
    selectedBrand !== 'all' ||
    selectedProductCategory !== 'all' ||
    selectedContentCategory !== 'all' ||
    searchQuery;
  // 获取活跃筛选器的数量
  const activeFiltersCount = [
    selectedType !== 'all',
    selectedBrand !== 'all',
    selectedProductCategory !== 'all',
    selectedContentCategory !== 'all',
  ].filter(Boolean).length;
  // 拖拽处理
  useEffect(() => {
    const handleChartDrop = event => {
      const dragEvent = event;
      dragEvent.preventDefault();
      try {
        const data = dragEvent.dataTransfer?.getData('application/json');
        if (data) {
          const draggedItem = JSON.parse(data);
          if (draggedItem.type === 'chart') {
            if (window.insertChartToContentEditor) {
              window.insertChartToContentEditor(
                draggedItem.url,
                draggedItem.title,
                draggedItem.chartType || draggedItem.data?.type,
              );
            }
          }
        }
      } catch (error) {
        console.error('处理图表拖拽失败:', error);
      }
    };
    const handleDragOver = event => {
      event.preventDefault();
    };
    const editor = document.querySelector('[contenteditable="true"]');
    if (editor) {
      editor.addEventListener('drop', handleChartDrop);
      editor.addEventListener('dragover', handleDragOver);
      return () => {
        editor.removeEventListener('drop', handleChartDrop);
        editor.removeEventListener('dragover', handleDragOver);
      };
    }
  }, []);
  return _jsxs(Card, {
    className: cn('h-full flex flex-col', className),
    children: [
      _jsx(CardHeader, {
        className: 'pb-3',
        children: _jsxs(CardTitle, {
          className: 'text-sm flex items-center justify-between',
          children: [
            _jsxs('div', {
              className: 'flex items-center space-x-2',
              children: [
                _jsx(Archive, { className: 'w-4 h-4' }),
                _jsx('span', { children: '\u7D20\u6750\u5E93' }),
                activeFiltersCount > 0 &&
                  _jsxs(Badge, {
                    variant: 'secondary',
                    className: 'text-xs',
                    children: [activeFiltersCount, ' \u9879\u7B5B\u9009'],
                  }),
              ],
            }),
            hasActiveFilters &&
              _jsxs(Button, {
                variant: 'ghost',
                size: 'sm',
                onClick: clearAllFilters,
                className: 'h-6 px-2 text-xs text-muted-foreground hover:text-foreground',
                children: [_jsx(X, { className: 'w-3 h-3 mr-1' }), '\u6E05\u7A7A'],
              }),
          ],
        }),
      }),
      _jsxs(CardContent, {
        className: 'flex-1 p-3 space-y-3 overflow-hidden flex flex-col',
        children: [
          _jsxs('div', {
            className: 'relative',
            children: [
              _jsx(Search, {
                className:
                  'absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground',
              }),
              _jsx(Input, {
                placeholder: '\u641C\u7D22\u7D20\u6750...',
                value: searchQuery,
                onChange: e => setSearchQuery(e.target.value),
                className: 'pl-7 h-8 text-xs',
              }),
            ],
          }),
          _jsxs('div', {
            className: 'flex space-x-1',
            children: [
              _jsx(Button, {
                variant: selectedType === 'all' ? 'default' : 'outline',
                size: 'sm',
                onClick: () => setSelectedType('all'),
                className: 'flex-1 h-7 text-xs',
                children: '\u5168\u90E8',
              }),
              _jsxs(Button, {
                variant: selectedType === 'text' ? 'default' : 'outline',
                size: 'sm',
                onClick: () => setSelectedType('text'),
                className: 'flex-1 h-7 text-xs',
                children: [_jsx(FileText, { className: 'w-3 h-3 mr-1' }), '\u6587\u672C'],
              }),
              _jsxs(Button, {
                variant: selectedType === 'image' ? 'default' : 'outline',
                size: 'sm',
                onClick: () => setSelectedType('image'),
                className: 'flex-1 h-7 text-xs',
                children: [_jsx(Image, { className: 'w-3 h-3 mr-1' }), '\u56FE\u7247'],
              }),
            ],
          }),
          _jsxs('div', {
            className: 'space-y-2',
            children: [
              _jsxs('div', {
                className: 'text-xs text-muted-foreground font-medium flex items-center',
                children: [_jsx(Filter, { className: 'w-3 h-3 mr-1' }), '\u7B5B\u9009\u6761\u4EF6'],
              }),
              filterOptions.productCategories.length > 0 &&
                _jsxs('div', {
                  className: 'space-y-1',
                  children: [
                    _jsx('div', {
                      className: 'text-xs text-muted-foreground',
                      children: '\u4EA7\u54C1\u54C1\u7C7B',
                    }),
                    _jsxs(Select, {
                      value: selectedProductCategory,
                      onValueChange: setSelectedProductCategory,
                      children: [
                        _jsxs(SelectTrigger, {
                          className: 'h-7 text-xs',
                          children: [
                            _jsx(Package, { className: 'w-3 h-3 mr-1' }),
                            _jsx(SelectValue, {
                              placeholder: '\u9009\u62E9\u4EA7\u54C1\u54C1\u7C7B',
                            }),
                          ],
                        }),
                        _jsxs(SelectContent, {
                          children: [
                            _jsx(SelectItem, {
                              value: 'all',
                              children: '\u5168\u90E8\u54C1\u7C7B',
                            }),
                            filterOptions.productCategories.map(category =>
                              _jsx(
                                SelectItem,
                                {
                                  value: category,
                                  children: _jsxs('div', {
                                    className: 'flex items-center space-x-2',
                                    children: [
                                      _jsx(Package, { className: 'w-3 h-3' }),
                                      _jsx('span', { children: category }),
                                    ],
                                  }),
                                },
                                category,
                              ),
                            ),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              filterOptions.brands.length > 0 &&
                _jsxs('div', {
                  className: 'space-y-1',
                  children: [
                    _jsx('div', {
                      className: 'text-xs text-muted-foreground',
                      children: '\u54C1\u724C',
                    }),
                    _jsxs(Select, {
                      value: selectedBrand,
                      onValueChange: setSelectedBrand,
                      children: [
                        _jsxs(SelectTrigger, {
                          className: 'h-7 text-xs',
                          children: [
                            _jsx(Building2, { className: 'w-3 h-3 mr-1' }),
                            _jsx(SelectValue, { placeholder: '\u9009\u62E9\u54C1\u724C' }),
                          ],
                        }),
                        _jsxs(SelectContent, {
                          children: [
                            _jsx(SelectItem, {
                              value: 'all',
                              children: '\u5168\u90E8\u54C1\u724C',
                            }),
                            filterOptions.brands.map(brand =>
                              _jsx(
                                SelectItem,
                                {
                                  value: brand,
                                  children: _jsxs('div', {
                                    className: 'flex items-center space-x-2',
                                    children: [
                                      _jsx(Building2, { className: 'w-3 h-3' }),
                                      _jsx('span', { children: brand }),
                                    ],
                                  }),
                                },
                                brand,
                              ),
                            ),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              filterOptions.contentCategories.length > 0 &&
                _jsxs('div', {
                  className: 'space-y-1',
                  children: [
                    _jsx('div', {
                      className: 'text-xs text-muted-foreground',
                      children: '\u5185\u5BB9\u5206\u7C7B',
                    }),
                    _jsxs(Select, {
                      value: selectedContentCategory,
                      onValueChange: setSelectedContentCategory,
                      children: [
                        _jsxs(SelectTrigger, {
                          className: 'h-7 text-xs',
                          children: [
                            _jsx(Layers, { className: 'w-3 h-3 mr-1' }),
                            _jsx(SelectValue, {
                              placeholder: '\u9009\u62E9\u5185\u5BB9\u5206\u7C7B',
                            }),
                          ],
                        }),
                        _jsxs(SelectContent, {
                          children: [
                            _jsx(SelectItem, {
                              value: 'all',
                              children: '\u5168\u90E8\u5206\u7C7B',
                            }),
                            filterOptions.contentCategories.map(category => {
                              const categoryConfig = ASSET_CATEGORIES.content[category];
                              const CategoryIcon = categoryConfig?.icon || Layers;
                              return _jsx(
                                SelectItem,
                                {
                                  value: category,
                                  children: _jsxs('div', {
                                    className: 'flex items-center space-x-2',
                                    children: [
                                      _jsx(CategoryIcon, { className: 'w-3 h-3' }),
                                      _jsx('span', { children: category }),
                                    ],
                                  }),
                                },
                                category,
                              );
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
            ],
          }),
          hasActiveFilters &&
            _jsxs('div', {
              className: 'space-y-2',
              children: [
                _jsx('div', {
                  className: 'text-xs text-muted-foreground',
                  children: '\u5F53\u524D\u7B5B\u9009',
                }),
                _jsxs('div', {
                  className: 'flex flex-wrap gap-1',
                  children: [
                    selectedType !== 'all' &&
                      _jsxs(Badge, {
                        variant: 'secondary',
                        className: 'text-xs px-2 py-1',
                        children: [
                          '\u7C7B\u578B: ',
                          ASSET_CATEGORIES.types[selectedType].label,
                          _jsx(X, {
                            className: 'w-3 h-3 ml-1 cursor-pointer',
                            onClick: () => setSelectedType('all'),
                          }),
                        ],
                      }),
                    selectedProductCategory !== 'all' &&
                      _jsxs(Badge, {
                        variant: 'secondary',
                        className: 'text-xs px-2 py-1',
                        children: [
                          '\u54C1\u7C7B: ',
                          selectedProductCategory,
                          _jsx(X, {
                            className: 'w-3 h-3 ml-1 cursor-pointer',
                            onClick: () => setSelectedProductCategory('all'),
                          }),
                        ],
                      }),
                    selectedBrand !== 'all' &&
                      _jsxs(Badge, {
                        variant: 'secondary',
                        className: 'text-xs px-2 py-1',
                        children: [
                          '\u54C1\u724C: ',
                          selectedBrand,
                          _jsx(X, {
                            className: 'w-3 h-3 ml-1 cursor-pointer',
                            onClick: () => setSelectedBrand('all'),
                          }),
                        ],
                      }),
                    selectedContentCategory !== 'all' &&
                      _jsxs(Badge, {
                        variant: 'secondary',
                        className: 'text-xs px-2 py-1',
                        children: [
                          '\u5206\u7C7B: ',
                          selectedContentCategory,
                          _jsx(X, {
                            className: 'w-3 h-3 ml-1 cursor-pointer',
                            onClick: () => setSelectedContentCategory('all'),
                          }),
                        ],
                      }),
                  ],
                }),
              ],
            }),
          _jsx('div', {
            className: 'flex-1 overflow-y-auto space-y-2',
            children:
              filteredAssets.length === 0
                ? _jsxs('div', {
                    className: 'text-center py-8 text-muted-foreground',
                    children: [
                      _jsx(Archive, { className: 'w-8 h-8 mx-auto mb-2 opacity-50' }),
                      _jsx('p', {
                        className: 'text-xs mb-2',
                        children: hasActiveFilters ? '未找到匹配的素材' : '暂无素材',
                      }),
                      hasActiveFilters &&
                        _jsx(Button, {
                          variant: 'ghost',
                          size: 'sm',
                          onClick: clearAllFilters,
                          className: 'h-6 px-2 text-xs',
                          children: '\u6E05\u7A7A\u7B5B\u9009\u6761\u4EF6',
                        }),
                    ],
                  })
                : _jsxs(_Fragment, {
                    children: [
                      _jsxs('div', {
                        className:
                          'text-xs text-muted-foreground mb-2 flex items-center justify-between',
                        children: [
                          _jsxs('span', {
                            children: [
                              '\u627E\u5230 ',
                              filteredAssets.length,
                              ' \u4E2A\u7D20\u6750',
                            ],
                          }),
                          hasActiveFilters &&
                            _jsx('span', {
                              className: 'text-blue-600',
                              children: '\u5DF2\u7B5B\u9009',
                            }),
                        ],
                      }),
                      filteredAssets.map(asset =>
                        _jsx(
                          DraggableAssetItem,
                          { asset: asset, onUse: () => handleUseAsset(asset) },
                          asset.id,
                        ),
                      ),
                    ],
                  }),
          }),
        ],
      }),
    ],
  });
};
export default AssetPicker;
