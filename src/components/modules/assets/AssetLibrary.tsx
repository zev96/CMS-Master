import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
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
  X,
  Layers,
  Building2,
  TrendingUp,
  Star,
  Clock,
  Filter,
  Download,
  Upload,
  Folder,
  LayoutGrid,
  Heart,
  ChevronDown,
  MoreHorizontal,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { cn } from '../../../lib/utils';
import useAppStore from '../../../stores/useAppStore';
import type { TextAsset, VisualAsset } from '../../../types';
import AssetForm from './AssetForm';

type AssetType = 'text' | 'image' | 'all';
type ViewMode = 'grid' | 'list';

interface AssetItemProps {
  asset: TextAsset | VisualAsset;
  viewMode: ViewMode;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onUse: () => void;
}

const AssetItem: React.FC<AssetItemProps> = ({
  asset,
  viewMode,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onCopy,
  onUse,
}) => {
  const isTextAsset = 'content' in asset;

  // 获取资产类型标签
  const getAssetTypeInfo = (asset: TextAsset | VisualAsset) => {
    if (isTextAsset) {
      return {
        icon: FileText,
        label: '文本',
        color: 'bg-blue-500',
        lightColor: 'bg-blue-50 text-blue-700',
      };
    } else {
      const visualAsset = asset as VisualAsset;
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
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className={cn(
            'cursor-pointer transition-all duration-300 hover:shadow-xl group border-0',
            'bg-gradient-to-r from-white via-white to-gray-50/30',
            'hover:from-white hover:via-blue-50/20 hover:to-purple-50/20',
            isSelected &&
              'ring-2 ring-blue-500 shadow-xl bg-gradient-to-r from-blue-50/50 to-purple-50/50',
          )}
          onClick={onSelect}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {/* 缩略图/图标 */}
                <div className="relative">
                  {!isTextAsset && (asset as VisualAsset).url ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shadow-inner">
                      <img
                        src={(asset as VisualAsset).url}
                        alt={asset.title}
                        className="w-full h-full object-cover"
                        onError={e => {
                          e.currentTarget.style.display = 'none';
                          const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                      <div
                        className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100"
                        style={{ display: 'none' }}
                      >
                        <TypeIcon className="w-8 h-8" />
                      </div>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        'w-16 h-16 rounded-xl flex items-center justify-center shadow-inner',
                        typeInfo.lightColor,
                      )}
                    >
                      <TypeIcon className="w-8 h-8" />
                    </div>
                  )}

                  {/* 类型标识 */}
                  <div
                    className={cn(
                      'absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg',
                      typeInfo.color,
                    )}
                  >
                    <TypeIcon className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-bold text-lg text-gray-900 truncate">{asset.title}</h3>
                    <Badge
                      variant="outline"
                      className={cn('shrink-0 border-0', typeInfo.lightColor)}
                    >
                      {typeInfo.label}
                    </Badge>
                    {asset.brand && (
                      <Badge variant="secondary" className="shrink-0 bg-gray-100 text-gray-700">
                        {asset.brand}
                      </Badge>
                    )}
                    {asset.productCategory && (
                      <Badge
                        variant="outline"
                        className="shrink-0 border-indigo-200 bg-indigo-50 text-indigo-700"
                      >
                        {asset.productCategory}
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-600 mb-2 text-sm">{asset.asset_category}</p>

                  {/* 内容预览 */}
                  {isTextAsset && (
                    <p className="text-gray-500 text-sm line-clamp-2 mb-2">
                      {(asset as TextAsset).content.substring(0, 120)}...
                    </p>
                  )}

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>更新于 {new Date(asset.updated_at).toLocaleDateString('zh-CN')}</span>
                    </div>
                    {asset.tags && asset.tags.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Tag className="w-3 h-3" />
                        <span>{asset.tags.slice(0, 2).join(', ')}</span>
                        {asset.tags.length > 2 && <span>+{asset.tags.length - 2}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    onUse();
                  }}
                  className="bg-green-50 hover:bg-green-100 text-green-600 border-green-200 shadow-sm"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  使用
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 shadow-sm"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  编辑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    onCopy();
                  }}
                  className="hover:bg-gray-100"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Grid 视图
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'cursor-pointer transition-all duration-300 hover:shadow-2xl group border-0 h-full',
          'bg-gradient-to-br from-white via-white to-gray-50/50',
          'hover:from-white hover:via-blue-50/30 hover:to-purple-50/30',
          isSelected &&
            'ring-2 ring-blue-500 shadow-xl bg-gradient-to-br from-blue-50/50 to-purple-50/50',
        )}
        onClick={onSelect}
      >
        <CardContent className="p-6 h-full flex flex-col">
          {/* 顶部：缩略图或图标 */}
          <div className="relative mb-4">
            {!isTextAsset && (asset as VisualAsset).url ? (
              <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 shadow-inner">
                <img
                  src={(asset as VisualAsset).url}
                  alt={asset.title}
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.currentTarget.style.display = 'none';
                    const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
                <div
                  className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100"
                  style={{ display: 'none' }}
                >
                  <TypeIcon className="w-12 h-12" />
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  'w-full h-32 rounded-lg flex items-center justify-center shadow-inner',
                  typeInfo.lightColor,
                )}
              >
                <TypeIcon className="w-12 h-12" />
              </div>
            )}

            {/* 类型标识 */}
            <div
              className={cn(
                'absolute top-3 right-3 px-2 py-1 rounded-full text-white text-xs font-bold shadow-lg',
                typeInfo.color,
              )}
            >
              {typeInfo.label}
            </div>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 flex flex-col">
            <div className="mb-3">
              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{asset.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{asset.asset_category}</p>

              {/* 内容预览 - 仅文本资产 */}
              {isTextAsset && (
                <p className="text-gray-500 text-sm line-clamp-3 mb-3">
                  {(asset as TextAsset).content.substring(0, 100)}...
                </p>
              )}
            </div>

            {/* 标签区域 */}
            <div className="flex flex-wrap gap-1 mb-3">
              {asset.brand && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  {asset.brand}
                </Badge>
              )}
              {asset.productCategory && (
                <Badge
                  variant="outline"
                  className="text-xs border-indigo-200 bg-indigo-50 text-indigo-700"
                >
                  {asset.productCategory}
                </Badge>
              )}
              {asset.tags &&
                asset.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              {asset.tags && asset.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{asset.tags.length - 2}
                </Badge>
              )}
            </div>

            {/* 时间信息 */}
            <div className="flex items-center text-xs text-gray-500 mb-4">
              <FileText className="w-3 h-3 mr-1" />
              <span>{new Date(asset.updated_at).toLocaleDateString('zh-CN')}</span>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <Button
                variant="outline"
                size="sm"
                onClick={e => {
                  e.stopPropagation();
                  onUse();
                }}
                className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200 text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                使用
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={e => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 text-xs"
              >
                <Edit className="w-3 h-3 mr-1" />
                编辑
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={e => {
                  e.stopPropagation();
                  onCopy();
                }}
                className="hover:bg-gray-100"
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={e => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AssetLibrary: React.FC = () => {
  const { textAssets, visualAssets, products, actions } = useAppStore(state => ({
    textAssets: state.textAssets,
    visualAssets: state.visualAssets,
    products: state.products,
    actions: state.actions,
  }));

  const [activeTab, setActiveTab] = useState<AssetType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ brand: 'all', productCategory: 'all' });
  const [sortBy, setSortBy] = useState<'updated_at' | 'created_at' | 'title'>('updated_at');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<TextAsset | VisualAsset | null>(null);
  const [newAssetType, setNewAssetType] = useState<'text' | 'image' | null>(null);

  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);

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
    const brands = new Set(allAssets.filter(asset => asset.brand).map(asset => asset.brand!));
    const productCategories = new Set(
      allAssets.filter(asset => asset.productCategory).map(asset => asset.productCategory!),
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
    const brands = new Set<string>();
    const productCategories = new Set<string>();

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
  const handleAssetSelect = (assetId: string) => {
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

  const handleEditAsset = (asset: TextAsset | VisualAsset) => {
    setEditingAsset(asset);
    setNewAssetType(null); // 清空新建类型
    setIsFormOpen(true);
  };

  const handleDeleteAsset = (asset: TextAsset | VisualAsset) => {
    if (confirm(`确定要删除资产"${asset.title}" 吗？`)) {
      if ('content' in asset) {
        actions.deleteTextAsset(asset.id);
      } else {
        actions.deleteVisualAsset(asset.id);
      }
      setSelectedAssetIds(prev => prev.filter(id => id !== asset.id));
    }
  };

  const handleCopyAsset = (asset: TextAsset | VisualAsset) => {
    const newAsset = {
      ...asset,
      id: `${asset.id}-copy-${Date.now()}`,
      title: `${asset.title} (副本)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if ('content' in newAsset) {
      actions.addTextAsset(newAsset as TextAsset);
    } else {
      actions.addVisualAsset(newAsset as VisualAsset);
    }
  };

  const handleUseAsset = (asset: TextAsset | VisualAsset) => {
    actions.insertAssetToEditor(asset);
  };

  const handleAddAsset = (type: 'text' | 'image') => {
    setEditingAsset(null); // 清空编辑资产
    setNewAssetType(type);
    setIsFormOpen(true);
  };

  const handleFormSave = (assetData: any) => {
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
  const getCurrentAssetType = (): 'text' | 'image' => {
    if (editingAsset) {
      return 'content' in editingAsset ? 'text' : 'image';
    }
    return newAssetType || 'text';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="p-8">
        {/* 页面标题和导航 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                素材资产库
              </h1>
              <p className="text-gray-600">管理您的内容资产，提升创作效率</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="shadow-sm"
              >
                <Grid className="w-4 h-4 mr-2" />
                网格
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="shadow-sm"
              >
                <List className="w-4 h-4 mr-2" />
                列表
              </Button>
            </div>
          </div>

          {/* 资产类型导航选项卡 - 集成在标题区域 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              <Button
                variant={activeTab === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('all')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg"
              >
                <Archive className="w-4 h-4" />
                <span>全部</span>
                <Badge variant="secondary" className="ml-1 text-xs px-2 bg-gray-100">
                  {stats.total}
                </Badge>
              </Button>
              <Button
                variant={activeTab === 'text' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('text')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg"
              >
                <FileText className="w-4 h-4" />
                <span>文本</span>
                <Badge variant="secondary" className="ml-1 text-xs px-2 bg-gray-100">
                  {stats.text}
                </Badge>
              </Button>
              <Button
                variant={activeTab === 'image' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('image')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg"
              >
                <Image className="w-4 h-4" />
                <span>图片</span>
                <Badge variant="secondary" className="ml-1 text-xs px-2 bg-gray-100">
                  {stats.image}
                </Badge>
              </Button>
            </div>

            {/* 新建按钮移到这里 */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleAddAsset('text')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              >
                <FileText className="w-4 h-4 mr-2" />
                新建文本
              </Button>
              <Button
                onClick={() => handleAddAsset('image')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg"
              >
                <Image className="w-4 h-4 mr-2" />
                新建图片
              </Button>
            </div>
          </div>
        </motion.div>

        {/* 统计卡片 - 简化版本 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.brands}</div>
              <div className="text-sm opacity-90">品牌数量</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.categories}</div>
              <div className="text-sm opacity-90">品类数量</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.filtered}</div>
              <div className="text-sm opacity-90">筛选结果</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-rose-500 to-rose-600 text-white border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {filteredAndSortedAssets.length > 0 ? '有' : '无'}
              </div>
              <div className="text-sm opacity-90">匹配资产</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 搜索和筛选区域 - 紧凑版本 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row items-center gap-4">
                {/* 搜索框 */}
                <div className="flex-1 w-full lg:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="搜索资产标题、分类、标签或内容..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-9 w-full shadow-sm h-9"
                    />
                  </div>
                </div>

                {/* 筛选器和排序 */}
                <div className="flex items-center gap-2">
                  {/* 品牌筛选 */}
                  <Select
                    value={filters.brand}
                    onValueChange={value => setFilters(prev => ({ ...prev, brand: value }))}
                  >
                    <SelectTrigger className="w-28 bg-white shadow-sm h-9 text-xs">
                      <Building2 className="w-3 h-3 mr-1" />
                      <SelectValue placeholder="品牌" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部品牌</SelectItem>
                      {availableBrands.map(brand => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* 产品品类筛选 */}
                  <Select
                    value={filters.productCategory}
                    onValueChange={value =>
                      setFilters(prev => ({ ...prev, productCategory: value }))
                    }
                  >
                    <SelectTrigger className="w-28 bg-white shadow-sm h-9 text-xs">
                      <Package className="w-3 h-3 mr-1" />
                      <SelectValue placeholder="品类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部品类</SelectItem>
                      {availableProductCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* 排序 */}
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-28 bg-white shadow-sm h-9 text-xs">
                      <SortAsc className="w-3 h-3 mr-1" />
                      <SelectValue placeholder="排序" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="updated_at">最近更新</SelectItem>
                      <SelectItem value="created_at">创建时间</SelectItem>
                      <SelectItem value="title">标题排序</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 资产列表 */}
        <AnimatePresence mode="wait">
          {filteredAndSortedAssets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                {searchTerm ? '未找到匹配的资产' : '暂无资产'}
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {searchTerm
                  ? '尝试调整搜索条件或筛选器，或创建新的资产'
                  : '开始创建您的第一个内容资产，构建强大的素材库'}
              </p>
              {!searchTerm && (
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={() => handleAddAsset('text')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    创建文本资产
                  </Button>
                  <Button
                    onClick={() => handleAddAsset('image')}
                    variant="outline"
                    className="shadow-lg"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    创建图片资产
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={`${viewMode}-${filteredAndSortedAssets.length}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                'mb-8',
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4',
              )}
            >
              {filteredAndSortedAssets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <AssetItem
                    asset={asset}
                    viewMode={viewMode}
                    isSelected={selectedAssetIds.includes(asset.id)}
                    onSelect={() => handleAssetSelect(asset.id)}
                    onEdit={() => handleEditAsset(asset)}
                    onDelete={() => handleDeleteAsset(asset)}
                    onCopy={() => handleCopyAsset(asset)}
                    onUse={() => handleUseAsset(asset)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 资产表单弹窗 */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <AssetForm
                  asset={editingAsset}
                  assetType={getCurrentAssetType()}
                  onSave={handleFormSave}
                  onCancel={handleFormCancel}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AssetLibrary;
