import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Edit,
  Trash2,
  Copy,
  Eye,
  Archive,
  Grid,
  List,
  FileText,
  Image,
  Package,
  Zap,
  Tag,
  SortAsc,
  Building2,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { cn } from '../../../lib/utils';
import useAppStore from '../../../stores/useAppStore';
import AssetForm from './AssetForm';
const AssetItem = ({ asset, viewMode, isSelected, onSelect, onEdit, onDelete, onCopy, onUse }) => {
  const isTextAsset = 'content' in asset;
  // 获取资产类型标签
  const getAssetTypeInfo = asset => {
    if (isTextAsset) {
      return {
        icon: FileText,
        label: '文本',
        color: 'bg-blue-500',
        lightColor: 'bg-blue-50 text-blue-700',
      };
    } else {
      const visualAsset = asset;
      return {
        icon: visualAsset.type === 'main' ? Image : visualAsset.type === 'scene' ? Package : Zap,
        label:
          visualAsset.type === 'main' ? '主图' : visualAsset.type === 'scene' ? '场景' : '图标',
        color:
          visualAsset.type === 'main'
            ? 'bg-purple-500'
            : visualAsset.type === 'scene'
              ? 'bg-green-500'
              : 'bg-orange-500',
        lightColor:
          visualAsset.type === 'main'
            ? 'bg-purple-50 text-purple-700'
            : visualAsset.type === 'scene'
              ? 'bg-green-50 text-green-700'
              : 'bg-orange-50 text-orange-700',
      };
    }
  };
  const typeInfo = getAssetTypeInfo(asset);
  const TypeIcon = typeInfo.icon;
  if (viewMode === 'list') {
    return _jsx(motion.div, {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      whileHover: { x: 4 },
      transition: { duration: 0.2 },
      children: _jsx(Card, {
        className: cn(
          'cursor-pointer transition-all duration-300 hover:shadow-xl group border-0',
          'bg-gradient-to-r from-white via-white to-gray-50/30',
          'hover:from-white hover:via-blue-50/20 hover:to-purple-50/20',
          isSelected &&
            'ring-2 ring-blue-500 shadow-xl bg-gradient-to-r from-blue-50/50 to-purple-50/50',
        ),
        onClick: onSelect,
        children: _jsx(CardContent, {
          className: 'p-6',
          children: _jsxs('div', {
            className: 'flex items-center justify-between',
            children: [
              _jsxs('div', {
                className: 'flex items-center space-x-4 flex-1',
                children: [
                  _jsxs('div', {
                    className: 'relative',
                    children: [
                      !isTextAsset && asset.url
                        ? _jsxs('div', {
                            className:
                              'w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shadow-inner',
                            children: [
                              _jsx('img', {
                                src: asset.url,
                                alt: asset.title,
                                className: 'w-full h-full object-cover',
                                onError: e => {
                                  e.currentTarget.style.display = 'none';
                                  const placeholder = e.currentTarget.nextElementSibling;
                                  if (placeholder) placeholder.style.display = 'flex';
                                },
                              }),
                              _jsx('div', {
                                className:
                                  'w-full h-full flex items-center justify-center text-gray-400 bg-gray-100',
                                style: { display: 'none' },
                                children: _jsx(TypeIcon, { className: 'w-8 h-8' }),
                              }),
                            ],
                          })
                        : _jsx('div', {
                            className: cn(
                              'w-16 h-16 rounded-xl flex items-center justify-center shadow-inner',
                              typeInfo.lightColor,
                            ),
                            children: _jsx(TypeIcon, { className: 'w-8 h-8' }),
                          }),
                      _jsx('div', {
                        className: cn(
                          'absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg',
                          typeInfo.color,
                        ),
                        children: _jsx(TypeIcon, { className: 'w-3 h-3' }),
                      }),
                    ],
                  }),
                  _jsxs('div', {
                    className: 'flex-1 min-w-0',
                    children: [
                      _jsxs('div', {
                        className: 'flex items-center space-x-3 mb-2',
                        children: [
                          _jsx('h3', {
                            className: 'font-bold text-lg text-gray-900 truncate',
                            children: asset.title,
                          }),
                          _jsx(Badge, {
                            variant: 'outline',
                            className: cn('shrink-0 border-0', typeInfo.lightColor),
                            children: typeInfo.label,
                          }),
                          asset.brand &&
                            _jsx(Badge, {
                              variant: 'secondary',
                              className: 'shrink-0 bg-gray-100 text-gray-700',
                              children: asset.brand,
                            }),
                          asset.productCategory &&
                            _jsx(Badge, {
                              variant: 'outline',
                              className: 'shrink-0 border-indigo-200 bg-indigo-50 text-indigo-700',
                              children: asset.productCategory,
                            }),
                        ],
                      }),
                      _jsx('p', {
                        className: 'text-gray-600 mb-2 text-sm',
                        children: asset.asset_category,
                      }),
                      isTextAsset &&
                        _jsxs('p', {
                          className: 'text-gray-500 text-sm line-clamp-2 mb-2',
                          children: [asset.content.substring(0, 120), '...'],
                        }),
                      _jsxs('div', {
                        className: 'flex items-center space-x-4 text-xs text-gray-500',
                        children: [
                          _jsxs('div', {
                            className: 'flex items-center space-x-1',
                            children: [
                              _jsx(FileText, { className: 'w-3 h-3' }),
                              _jsxs('span', {
                                children: [
                                  '\u66F4\u65B0\u4E8E ',
                                  new Date(asset.updated_at).toLocaleDateString('zh-CN'),
                                ],
                              }),
                            ],
                          }),
                          asset.tags &&
                            asset.tags.length > 0 &&
                            _jsxs('div', {
                              className: 'flex items-center space-x-1',
                              children: [
                                _jsx(Tag, { className: 'w-3 h-3' }),
                                _jsx('span', { children: asset.tags.slice(0, 2).join(', ') }),
                                asset.tags.length > 2 &&
                                  _jsxs('span', { children: ['+', asset.tags.length - 2] }),
                              ],
                            }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              _jsxs('div', {
                className:
                  'flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200',
                children: [
                  _jsxs(Button, {
                    variant: 'outline',
                    size: 'sm',
                    onClick: e => {
                      e.stopPropagation();
                      onUse();
                    },
                    className:
                      'bg-green-50 hover:bg-green-100 text-green-600 border-green-200 shadow-sm',
                    children: [_jsx(Eye, { className: 'w-4 h-4 mr-1' }), '\u4F7F\u7528'],
                  }),
                  _jsxs(Button, {
                    variant: 'outline',
                    size: 'sm',
                    onClick: e => {
                      e.stopPropagation();
                      onEdit();
                    },
                    className:
                      'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 shadow-sm',
                    children: [_jsx(Edit, { className: 'w-4 h-4 mr-1' }), '\u7F16\u8F91'],
                  }),
                  _jsx(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: e => {
                      e.stopPropagation();
                      onCopy();
                    },
                    className: 'hover:bg-gray-100',
                    children: _jsx(Copy, { className: 'w-4 h-4' }),
                  }),
                  _jsx(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: e => {
                      e.stopPropagation();
                      onDelete();
                    },
                    className: 'hover:bg-red-50 hover:text-red-600',
                    children: _jsx(Trash2, { className: 'w-4 h-4' }),
                  }),
                ],
              }),
            ],
          }),
        }),
      }),
    });
  }
  // Grid 视图
  return _jsx(motion.div, {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    whileHover: { scale: 1.02 },
    transition: { duration: 0.2 },
    children: _jsx(Card, {
      className: cn(
        'cursor-pointer transition-all duration-300 hover:shadow-2xl group border-0 h-full',
        'bg-gradient-to-br from-white via-white to-gray-50/50',
        'hover:from-white hover:via-blue-50/30 hover:to-purple-50/30',
        isSelected &&
          'ring-2 ring-blue-500 shadow-xl bg-gradient-to-br from-blue-50/50 to-purple-50/50',
      ),
      onClick: onSelect,
      children: _jsxs(CardContent, {
        className: 'p-6 h-full flex flex-col',
        children: [
          _jsxs('div', {
            className: 'relative mb-4',
            children: [
              !isTextAsset && asset.url
                ? _jsxs('div', {
                    className: 'w-full h-32 rounded-lg overflow-hidden bg-gray-100 shadow-inner',
                    children: [
                      _jsx('img', {
                        src: asset.url,
                        alt: asset.title,
                        className: 'w-full h-full object-cover',
                        onError: e => {
                          e.currentTarget.style.display = 'none';
                          const placeholder = e.currentTarget.nextElementSibling;
                          if (placeholder) placeholder.style.display = 'flex';
                        },
                      }),
                      _jsx('div', {
                        className:
                          'w-full h-full flex items-center justify-center text-gray-400 bg-gray-100',
                        style: { display: 'none' },
                        children: _jsx(TypeIcon, { className: 'w-12 h-12' }),
                      }),
                    ],
                  })
                : _jsx('div', {
                    className: cn(
                      'w-full h-32 rounded-lg flex items-center justify-center shadow-inner',
                      typeInfo.lightColor,
                    ),
                    children: _jsx(TypeIcon, { className: 'w-12 h-12' }),
                  }),
              _jsx('div', {
                className: cn(
                  'absolute top-3 right-3 px-2 py-1 rounded-full text-white text-xs font-bold shadow-lg',
                  typeInfo.color,
                ),
                children: typeInfo.label,
              }),
            ],
          }),
          _jsxs('div', {
            className: 'flex-1 flex flex-col',
            children: [
              _jsxs('div', {
                className: 'mb-3',
                children: [
                  _jsx('h3', {
                    className: 'font-bold text-lg text-gray-900 mb-2 line-clamp-2',
                    children: asset.title,
                  }),
                  _jsx('p', {
                    className: 'text-gray-600 text-sm mb-2',
                    children: asset.asset_category,
                  }),
                  isTextAsset &&
                    _jsxs('p', {
                      className: 'text-gray-500 text-sm line-clamp-3 mb-3',
                      children: [asset.content.substring(0, 100), '...'],
                    }),
                ],
              }),
              _jsxs('div', {
                className: 'flex flex-wrap gap-1 mb-3',
                children: [
                  asset.brand &&
                    _jsx(Badge, {
                      variant: 'secondary',
                      className: 'text-xs bg-gray-100 text-gray-700',
                      children: asset.brand,
                    }),
                  asset.productCategory &&
                    _jsx(Badge, {
                      variant: 'outline',
                      className: 'text-xs border-indigo-200 bg-indigo-50 text-indigo-700',
                      children: asset.productCategory,
                    }),
                  asset.tags &&
                    asset.tags
                      .slice(0, 2)
                      .map(tag =>
                        _jsx(
                          Badge,
                          { variant: 'outline', className: 'text-xs', children: tag },
                          tag,
                        ),
                      ),
                  asset.tags &&
                    asset.tags.length > 2 &&
                    _jsxs(Badge, {
                      variant: 'outline',
                      className: 'text-xs',
                      children: ['+', asset.tags.length - 2],
                    }),
                ],
              }),
              _jsxs('div', {
                className: 'flex items-center text-xs text-gray-500 mb-4',
                children: [
                  _jsx(FileText, { className: 'w-3 h-3 mr-1' }),
                  _jsx('span', {
                    children: new Date(asset.updated_at).toLocaleDateString('zh-CN'),
                  }),
                ],
              }),
              _jsxs('div', {
                className:
                  'flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200',
                children: [
                  _jsxs(Button, {
                    variant: 'outline',
                    size: 'sm',
                    onClick: e => {
                      e.stopPropagation();
                      onUse();
                    },
                    className:
                      'flex-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200 text-xs',
                    children: [_jsx(Eye, { className: 'w-3 h-3 mr-1' }), '\u4F7F\u7528'],
                  }),
                  _jsxs(Button, {
                    variant: 'outline',
                    size: 'sm',
                    onClick: e => {
                      e.stopPropagation();
                      onEdit();
                    },
                    className:
                      'flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 text-xs',
                    children: [_jsx(Edit, { className: 'w-3 h-3 mr-1' }), '\u7F16\u8F91'],
                  }),
                  _jsx(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: e => {
                      e.stopPropagation();
                      onCopy();
                    },
                    className: 'hover:bg-gray-100',
                    children: _jsx(Copy, { className: 'w-3 h-3' }),
                  }),
                  _jsx(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: e => {
                      e.stopPropagation();
                      onDelete();
                    },
                    className: 'hover:bg-red-50 hover:text-red-600',
                    children: _jsx(Trash2, { className: 'w-3 h-3' }),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    }),
  });
};
const AssetLibrary = () => {
  const { textAssets, visualAssets, products, actions } = useAppStore(state => ({
    textAssets: state.textAssets,
    visualAssets: state.visualAssets,
    products: state.products,
    actions: state.actions,
  }));
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ brand: 'all', productCategory: 'all' });
  const [sortBy, setSortBy] = useState('updated_at');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [newAssetType, setNewAssetType] = useState(null);
  const [selectedAssetIds, setSelectedAssetIds] = useState([]);
  // 合并所有资产
  const allAssets = useMemo(() => {
    return [...textAssets, ...visualAssets];
  }, [textAssets, visualAssets]);
  // 过滤和排序资产
  const filteredAndSortedAssets = useMemo(() => {
    let filtered = allAssets.filter(asset => {
      // 类型过滤
      if (activeTab === 'text' && !('content' in asset)) return false;
      if (activeTab === 'image' && 'content' in asset) return false;
      // 搜索过滤
      const matchesSearch =
        asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.asset_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        ('content' in asset && asset.content.toLowerCase().includes(searchTerm.toLowerCase()));
      if (!matchesSearch) return false;
      // 品牌过滤
      if (filters.brand !== 'all' && asset.brand !== filters.brand) return false;
      // 产品品类过滤
      if (filters.productCategory !== 'all' && asset.productCategory !== filters.productCategory)
        return false;
      return true;
    });
    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'updated_at':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });
    return filtered;
  }, [allAssets, searchTerm, activeTab, filters, sortBy]);
  // 统计数据
  const stats = useMemo(() => {
    const textCount = allAssets.filter(asset => 'content' in asset).length;
    const imageCount = allAssets.filter(asset => !('content' in asset)).length;
    const brands = new Set(allAssets.filter(asset => asset.brand).map(asset => asset.brand));
    const productCategories = new Set(
      allAssets.filter(asset => asset.productCategory).map(asset => asset.productCategory),
    );
    return {
      total: allAssets.length,
      text: textCount,
      image: imageCount,
      brands: brands.size,
      categories: productCategories.size,
      filtered: filteredAndSortedAssets.length,
    };
  }, [allAssets, filteredAndSortedAssets]);
  // 从产品库获取品牌和品类数据
  const { availableBrands, availableProductCategories } = useMemo(() => {
    const brands = new Set();
    const productCategories = new Set();
    // 从产品库获取
    products.forEach(product => {
      if (product.basicInfo.brand) brands.add(product.basicInfo.brand);
      productCategories.add(product.basicInfo.category);
    });
    return {
      availableBrands: Array.from(brands).sort(),
      availableProductCategories: Array.from(productCategories).sort(),
    };
  }, [products]);
  // 处理资产操作
  const handleAssetSelect = assetId => {
    setSelectedAssetIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(assetId)) {
        newSet.delete(assetId);
      } else {
        newSet.add(assetId);
      }
      return Array.from(newSet);
    });
  };
  const handleEditAsset = asset => {
    setEditingAsset(asset);
    setNewAssetType(null); // 清空新建类型
    setIsFormOpen(true);
  };
  const handleDeleteAsset = asset => {
    if (confirm(`确定要删除资产"${asset.title}" 吗？`)) {
      if ('content' in asset) {
        actions.deleteTextAsset(asset.id);
      } else {
        actions.deleteVisualAsset(asset.id);
      }
      setSelectedAssetIds(prev => prev.filter(id => id !== asset.id));
    }
  };
  const handleCopyAsset = asset => {
    const newAsset = {
      ...asset,
      id: `${asset.id}-copy-${Date.now()}`,
      title: `${asset.title} (副本)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if ('content' in newAsset) {
      actions.addTextAsset(newAsset);
    } else {
      actions.addVisualAsset(newAsset);
    }
  };
  const handleUseAsset = asset => {
    actions.insertAssetToEditor(asset);
  };
  const handleAddAsset = type => {
    setEditingAsset(null); // 清空编辑资产
    setNewAssetType(type);
    setIsFormOpen(true);
  };
  const handleFormSave = assetData => {
    console.log('AssetLibrary - 接收到的资产数据:', assetData);
    console.log('AssetLibrary - 当前编辑资产:', editingAsset);
    console.log('AssetLibrary - 新建资产类型:', newAssetType);
    try {
      if (editingAsset) {
        // 编辑现有资产
        console.log('AssetLibrary - 更新现有资产, ID:', editingAsset.id);
        if ('content' in editingAsset) {
          // 文本资产
          console.log('AssetLibrary - 更新文本资产');
          actions.updateTextAsset(editingAsset.id, assetData);
        } else {
          // 图片资产
          console.log('AssetLibrary - 更新图片资产');
          actions.updateVisualAsset(editingAsset.id, assetData);
        }
      } else if (newAssetType) {
        // 新建资产
        console.log('AssetLibrary - 创建新资产, 类型:', newAssetType);
        if (newAssetType === 'text') {
          console.log('AssetLibrary - 创建文本资产');
          actions.addTextAsset(assetData);
        } else {
          console.log('AssetLibrary - 创建图片资产');
          actions.addVisualAsset(assetData);
        }
      } else {
        console.error('AssetLibrary - 错误：没有编辑资产也没有新建类型');
        alert('保存失败：无法确定操作类型');
        return;
      }
      // 保存成功，关闭表单
      console.log('AssetLibrary - 资产保存成功，关闭表单');
      setIsFormOpen(false);
      setEditingAsset(null);
      setNewAssetType(null);
    } catch (error) {
      console.error('AssetLibrary - 保存资产时出错:', error);
      alert(`保存失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
  };
  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingAsset(null);
    setNewAssetType(null);
  };
  // 确定当前表单类型
  const getCurrentAssetType = () => {
    if (editingAsset) {
      return 'content' in editingAsset ? 'text' : 'image';
    }
    return newAssetType || 'text';
  };
  return _jsx('div', {
    className: 'min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30',
    children: _jsxs('div', {
      className: 'p-8',
      children: [
        _jsxs(motion.div, {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          className: 'mb-8',
          children: [
            _jsxs('div', {
              className: 'flex items-start justify-between mb-6',
              children: [
                _jsxs('div', {
                  children: [
                    _jsx('h1', {
                      className:
                        'text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2',
                      children: '\u7D20\u6750\u8D44\u4EA7\u5E93',
                    }),
                    _jsx('p', {
                      className: 'text-gray-600',
                      children:
                        '\u7BA1\u7406\u60A8\u7684\u5185\u5BB9\u8D44\u4EA7\uFF0C\u63D0\u5347\u521B\u4F5C\u6548\u7387',
                    }),
                  ],
                }),
                _jsxs('div', {
                  className: 'flex items-center space-x-3',
                  children: [
                    _jsxs(Button, {
                      variant: viewMode === 'grid' ? 'default' : 'outline',
                      size: 'sm',
                      onClick: () => setViewMode('grid'),
                      className: 'shadow-sm',
                      children: [_jsx(Grid, { className: 'w-4 h-4 mr-2' }), '\u7F51\u683C'],
                    }),
                    _jsxs(Button, {
                      variant: viewMode === 'list' ? 'default' : 'outline',
                      size: 'sm',
                      onClick: () => setViewMode('list'),
                      className: 'shadow-sm',
                      children: [_jsx(List, { className: 'w-4 h-4 mr-2' }), '\u5217\u8868'],
                    }),
                  ],
                }),
              ],
            }),
            _jsxs('div', {
              className: 'flex items-center justify-between',
              children: [
                _jsxs('div', {
                  className:
                    'flex items-center space-x-1 bg-white rounded-xl p-1 shadow-sm border border-gray-200',
                  children: [
                    _jsxs(Button, {
                      variant: activeTab === 'all' ? 'default' : 'ghost',
                      size: 'sm',
                      onClick: () => setActiveTab('all'),
                      className: 'flex items-center space-x-2 px-4 py-2 rounded-lg',
                      children: [
                        _jsx(Archive, { className: 'w-4 h-4' }),
                        _jsx('span', { children: '\u5168\u90E8' }),
                        _jsx(Badge, {
                          variant: 'secondary',
                          className: 'ml-1 text-xs px-2 bg-gray-100',
                          children: stats.total,
                        }),
                      ],
                    }),
                    _jsxs(Button, {
                      variant: activeTab === 'text' ? 'default' : 'ghost',
                      size: 'sm',
                      onClick: () => setActiveTab('text'),
                      className: 'flex items-center space-x-2 px-4 py-2 rounded-lg',
                      children: [
                        _jsx(FileText, { className: 'w-4 h-4' }),
                        _jsx('span', { children: '\u6587\u672C' }),
                        _jsx(Badge, {
                          variant: 'secondary',
                          className: 'ml-1 text-xs px-2 bg-gray-100',
                          children: stats.text,
                        }),
                      ],
                    }),
                    _jsxs(Button, {
                      variant: activeTab === 'image' ? 'default' : 'ghost',
                      size: 'sm',
                      onClick: () => setActiveTab('image'),
                      className: 'flex items-center space-x-2 px-4 py-2 rounded-lg',
                      children: [
                        _jsx(Image, { className: 'w-4 h-4' }),
                        _jsx('span', { children: '\u56FE\u7247' }),
                        _jsx(Badge, {
                          variant: 'secondary',
                          className: 'ml-1 text-xs px-2 bg-gray-100',
                          children: stats.image,
                        }),
                      ],
                    }),
                  ],
                }),
                _jsxs('div', {
                  className: 'flex items-center gap-2',
                  children: [
                    _jsxs(Button, {
                      onClick: () => handleAddAsset('text'),
                      className:
                        'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg',
                      children: [
                        _jsx(FileText, { className: 'w-4 h-4 mr-2' }),
                        '\u65B0\u5EFA\u6587\u672C',
                      ],
                    }),
                    _jsxs(Button, {
                      onClick: () => handleAddAsset('image'),
                      className:
                        'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg',
                      children: [
                        _jsx(Image, { className: 'w-4 h-4 mr-2' }),
                        '\u65B0\u5EFA\u56FE\u7247',
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        _jsxs(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 },
          className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-8',
          children: [
            _jsx(Card, {
              className:
                'bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg',
              children: _jsxs(CardContent, {
                className: 'p-4 text-center',
                children: [
                  _jsx('div', { className: 'text-2xl font-bold', children: stats.brands }),
                  _jsx('div', {
                    className: 'text-sm opacity-90',
                    children: '\u54C1\u724C\u6570\u91CF',
                  }),
                ],
              }),
            }),
            _jsx(Card, {
              className:
                'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-lg',
              children: _jsxs(CardContent, {
                className: 'p-4 text-center',
                children: [
                  _jsx('div', { className: 'text-2xl font-bold', children: stats.categories }),
                  _jsx('div', {
                    className: 'text-sm opacity-90',
                    children: '\u54C1\u7C7B\u6570\u91CF',
                  }),
                ],
              }),
            }),
            _jsx(Card, {
              className:
                'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg',
              children: _jsxs(CardContent, {
                className: 'p-4 text-center',
                children: [
                  _jsx('div', { className: 'text-2xl font-bold', children: stats.filtered }),
                  _jsx('div', {
                    className: 'text-sm opacity-90',
                    children: '\u7B5B\u9009\u7ED3\u679C',
                  }),
                ],
              }),
            }),
            _jsx(Card, {
              className:
                'bg-gradient-to-br from-rose-500 to-rose-600 text-white border-0 shadow-lg',
              children: _jsxs(CardContent, {
                className: 'p-4 text-center',
                children: [
                  _jsx('div', {
                    className: 'text-2xl font-bold',
                    children: filteredAndSortedAssets.length > 0 ? '有' : '无',
                  }),
                  _jsx('div', {
                    className: 'text-sm opacity-90',
                    children: '\u5339\u914D\u8D44\u4EA7',
                  }),
                ],
              }),
            }),
          ],
        }),
        _jsx(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.2 },
          children: _jsx(Card, {
            className: 'mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm',
            children: _jsx(CardContent, {
              className: 'p-4',
              children: _jsxs('div', {
                className: 'flex flex-col lg:flex-row items-center gap-4',
                children: [
                  _jsx('div', {
                    className: 'flex-1 w-full lg:w-auto',
                    children: _jsxs('div', {
                      className: 'relative',
                      children: [
                        _jsx(Search, {
                          className:
                            'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400',
                        }),
                        _jsx(Input, {
                          placeholder:
                            '\u641C\u7D22\u8D44\u4EA7\u6807\u9898\u3001\u5206\u7C7B\u3001\u6807\u7B7E\u6216\u5185\u5BB9...',
                          value: searchTerm,
                          onChange: e => setSearchTerm(e.target.value),
                          className: 'pl-9 w-full shadow-sm h-9',
                        }),
                      ],
                    }),
                  }),
                  _jsxs('div', {
                    className: 'flex items-center gap-2',
                    children: [
                      _jsxs(Select, {
                        value: filters.brand,
                        onValueChange: value => setFilters(prev => ({ ...prev, brand: value })),
                        children: [
                          _jsxs(SelectTrigger, {
                            className: 'w-28 bg-white shadow-sm h-9 text-xs',
                            children: [
                              _jsx(Building2, { className: 'w-3 h-3 mr-1' }),
                              _jsx(SelectValue, { placeholder: '\u54C1\u724C' }),
                            ],
                          }),
                          _jsxs(SelectContent, {
                            children: [
                              _jsx(SelectItem, {
                                value: 'all',
                                children: '\u5168\u90E8\u54C1\u724C',
                              }),
                              availableBrands.map(brand =>
                                _jsx(SelectItem, { value: brand, children: brand }, brand),
                              ),
                            ],
                          }),
                        ],
                      }),
                      _jsxs(Select, {
                        value: filters.productCategory,
                        onValueChange: value =>
                          setFilters(prev => ({ ...prev, productCategory: value })),
                        children: [
                          _jsxs(SelectTrigger, {
                            className: 'w-28 bg-white shadow-sm h-9 text-xs',
                            children: [
                              _jsx(Package, { className: 'w-3 h-3 mr-1' }),
                              _jsx(SelectValue, { placeholder: '\u54C1\u7C7B' }),
                            ],
                          }),
                          _jsxs(SelectContent, {
                            children: [
                              _jsx(SelectItem, {
                                value: 'all',
                                children: '\u5168\u90E8\u54C1\u7C7B',
                              }),
                              availableProductCategories.map(category =>
                                _jsx(SelectItem, { value: category, children: category }, category),
                              ),
                            ],
                          }),
                        ],
                      }),
                      _jsxs(Select, {
                        value: sortBy,
                        onValueChange: value => setSortBy(value),
                        children: [
                          _jsxs(SelectTrigger, {
                            className: 'w-28 bg-white shadow-sm h-9 text-xs',
                            children: [
                              _jsx(SortAsc, { className: 'w-3 h-3 mr-1' }),
                              _jsx(SelectValue, { placeholder: '\u6392\u5E8F' }),
                            ],
                          }),
                          _jsxs(SelectContent, {
                            children: [
                              _jsx(SelectItem, {
                                value: 'updated_at',
                                children: '\u6700\u8FD1\u66F4\u65B0',
                              }),
                              _jsx(SelectItem, {
                                value: 'created_at',
                                children: '\u521B\u5EFA\u65F6\u95F4',
                              }),
                              _jsx(SelectItem, {
                                value: 'title',
                                children: '\u6807\u9898\u6392\u5E8F',
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
          }),
        }),
        _jsx(AnimatePresence, {
          mode: 'wait',
          children:
            filteredAndSortedAssets.length === 0
              ? _jsxs(motion.div, {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  className: 'text-center py-20',
                  children: [
                    _jsx('div', {
                      className:
                        'bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6',
                      children: _jsx(Package, { className: 'w-12 h-12 text-gray-400' }),
                    }),
                    _jsx('h3', {
                      className: 'text-xl font-semibold text-gray-700 mb-3',
                      children: searchTerm ? '未找到匹配的资产' : '暂无资产',
                    }),
                    _jsx('p', {
                      className: 'text-gray-500 mb-8 max-w-md mx-auto',
                      children: searchTerm
                        ? '尝试调整搜索条件或筛选器，或创建新的资产'
                        : '开始创建您的第一个内容资产，构建强大的素材库',
                    }),
                    !searchTerm &&
                      _jsxs('div', {
                        className: 'flex items-center justify-center gap-4',
                        children: [
                          _jsxs(Button, {
                            onClick: () => handleAddAsset('text'),
                            className:
                              'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg',
                            children: [
                              _jsx(FileText, { className: 'w-4 h-4 mr-2' }),
                              '\u521B\u5EFA\u6587\u672C\u8D44\u4EA7',
                            ],
                          }),
                          _jsxs(Button, {
                            onClick: () => handleAddAsset('image'),
                            variant: 'outline',
                            className: 'shadow-lg',
                            children: [
                              _jsx(Image, { className: 'w-4 h-4 mr-2' }),
                              '\u521B\u5EFA\u56FE\u7247\u8D44\u4EA7',
                            ],
                          }),
                        ],
                      }),
                  ],
                })
              : _jsx(
                  motion.div,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                    className: cn(
                      'mb-8',
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                        : 'space-y-4',
                    ),
                    children: filteredAndSortedAssets.map((asset, index) =>
                      _jsx(
                        motion.div,
                        {
                          initial: { opacity: 0, y: 20 },
                          animate: { opacity: 1, y: 0 },
                          transition: { delay: index * 0.03 },
                          children: _jsx(AssetItem, {
                            asset: asset,
                            viewMode: viewMode,
                            isSelected: selectedAssetIds.includes(asset.id),
                            onSelect: () => handleAssetSelect(asset.id),
                            onEdit: () => handleEditAsset(asset),
                            onDelete: () => handleDeleteAsset(asset),
                            onCopy: () => handleCopyAsset(asset),
                            onUse: () => handleUseAsset(asset),
                          }),
                        },
                        asset.id,
                      ),
                    ),
                  },
                  `${viewMode}-${filteredAndSortedAssets.length}`,
                ),
        }),
        _jsx(AnimatePresence, {
          children:
            isFormOpen &&
            _jsx(motion.div, {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className:
                'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4',
              children: _jsx(motion.div, {
                initial: { opacity: 0, scale: 0.9, y: 20 },
                animate: { opacity: 1, scale: 1, y: 0 },
                exit: { opacity: 0, scale: 0.9, y: 20 },
                className: 'w-full max-w-2xl max-h-[90vh] overflow-y-auto',
                children: _jsx(AssetForm, {
                  asset: editingAsset,
                  assetType: getCurrentAssetType(),
                  onSave: handleFormSave,
                  onCancel: handleFormCancel,
                }),
              }),
            }),
        }),
      ],
    }),
  });
};
export default AssetLibrary;
