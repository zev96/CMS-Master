import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  FileText,
  Image,
  Archive,
  GripVertical,
  X,
  Filter,
  Tag as TagIcon,
  Package,
  Building2,
  Layers,
  Sparkles,
  Clock,
  Star,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { cn } from '../../../lib/utils';
import useAppStore from '../../../stores/useAppStore';
import type { TextAsset, VisualAsset } from '../../../types';

interface AssetPickerProps {
  className?: string;
}

interface DraggableAssetItemProps {
  asset: TextAsset | VisualAsset;
  onUse: () => void;
}

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

const DraggableAssetItem: React.FC<DraggableAssetItemProps> = ({ asset, onUse }) => {
  const isTextAsset = 'content' in asset;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(asset));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // 获取资产样式
  const getAssetStyle = () => {
    // 优先使用内容分类的样式
    if (ASSET_CATEGORIES.content[asset.asset_category as keyof typeof ASSET_CATEGORIES.content]) {
      return ASSET_CATEGORIES.content[
        asset.asset_category as keyof typeof ASSET_CATEGORIES.content
      ];
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

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 group hover:scale-[1.02] hover:border-blue-300"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="flex-shrink-0">
          <div
            className={cn('w-8 h-8 rounded-lg flex items-center justify-center', assetStyle.color)}
          >
            <AssetIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-sm truncate mb-2">{asset.title}</h4>

          <div className="flex items-center flex-wrap gap-1 mb-2">
            <Badge variant="outline" className={cn('text-xs px-2 py-0.5', assetStyle.color)}>
              {asset.asset_category}
            </Badge>
            {asset.brand && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {asset.brand}
              </Badge>
            )}
            {asset.productCategory && (
              <Badge
                variant="outline"
                className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 border-blue-200"
              >
                {asset.productCategory}
              </Badge>
            )}
          </div>

          <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {isTextAsset
              ? (asset as TextAsset).content.substring(0, 60) + '...'
              : `${asset.asset_category} · 图片素材`}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {asset.tags?.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5 bg-gray-50">
                  {tag}
                </Badge>
              ))}
            </div>

            <Button
              size="sm"
              onClick={onUse}
              className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700"
            >
              使用
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AssetPicker: React.FC<AssetPickerProps> = ({ className }) => {
  const { textAssets, visualAssets, products, actions } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'text' | 'image'>('all');

  // 筛选器状态 - 改为下拉选择器
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('all');
  const [selectedContentCategory, setSelectedContentCategory] = useState<string>('all');

  // 合并所有素材
  const allAssets = useMemo(() => {
    return [...textAssets, ...visualAssets];
  }, [textAssets, visualAssets]);

  // 从产品库同步获取筛选选项
  const filterOptions = useMemo(() => {
    const brands = new Set<string>();
    const productCategories = new Set<string>();
    const contentCategories = new Set<string>();

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
        const matchContent =
          isTextAsset && (asset as TextAsset).content.toLowerCase().includes(query);

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

  const handleUseAsset = (asset: TextAsset | VisualAsset) => {
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
    const handleChartDrop = (event: Event) => {
      const dragEvent = event as DragEvent;
      dragEvent.preventDefault();

      try {
        const data = dragEvent.dataTransfer?.getData('application/json');
        if (data) {
          const draggedItem = JSON.parse(data);

          if (draggedItem.type === 'chart') {
            if ((window as any).insertChartToContentEditor) {
              (window as any).insertChartToContentEditor(
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

    const handleDragOver = (event: Event) => {
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

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Archive className="w-4 h-4" />
            <span>素材库</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount} 项筛选
              </Badge>
            )}
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3 mr-1" />
              清空
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-3 space-y-3 overflow-hidden flex flex-col">
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            placeholder="搜索素材..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-7 h-8 text-xs"
          />
        </div>

        {/* 类型快速选择 */}
        <div className="flex space-x-1">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('all')}
            className="flex-1 h-7 text-xs"
          >
            全部
          </Button>
          <Button
            variant={selectedType === 'text' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('text')}
            className="flex-1 h-7 text-xs"
          >
            <FileText className="w-3 h-3 mr-1" />
            文本
          </Button>
          <Button
            variant={selectedType === 'image' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('image')}
            className="flex-1 h-7 text-xs"
          >
            <Image className="w-3 h-3 mr-1" />
            图片
          </Button>
        </div>

        {/* 筛选器区域 */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium flex items-center">
            <Filter className="w-3 h-3 mr-1" />
            筛选条件
          </div>

          {/* 产品品类筛选 */}
          {filterOptions.productCategories.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">产品品类</div>
              <Select value={selectedProductCategory} onValueChange={setSelectedProductCategory}>
                <SelectTrigger className="h-7 text-xs">
                  <Package className="w-3 h-3 mr-1" />
                  <SelectValue placeholder="选择产品品类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部品类</SelectItem>
                  {filterOptions.productCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center space-x-2">
                        <Package className="w-3 h-3" />
                        <span>{category}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 品牌筛选 */}
          {filterOptions.brands.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">品牌</div>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="h-7 text-xs">
                  <Building2 className="w-3 h-3 mr-1" />
                  <SelectValue placeholder="选择品牌" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部品牌</SelectItem>
                  {filterOptions.brands.map(brand => (
                    <SelectItem key={brand} value={brand}>
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-3 h-3" />
                        <span>{brand}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 内容分类筛选 */}
          {filterOptions.contentCategories.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">内容分类</div>
              <Select value={selectedContentCategory} onValueChange={setSelectedContentCategory}>
                <SelectTrigger className="h-7 text-xs">
                  <Layers className="w-3 h-3 mr-1" />
                  <SelectValue placeholder="选择内容分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  {filterOptions.contentCategories.map(category => {
                    const categoryConfig =
                      ASSET_CATEGORIES.content[category as keyof typeof ASSET_CATEGORIES.content];
                    const CategoryIcon = categoryConfig?.icon || Layers;

                    return (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center space-x-2">
                          <CategoryIcon className="w-3 h-3" />
                          <span>{category}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* 当前筛选状态显示 */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">当前筛选</div>
            <div className="flex flex-wrap gap-1">
              {selectedType !== 'all' && (
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  类型: {ASSET_CATEGORIES.types[selectedType].label}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setSelectedType('all')}
                  />
                </Badge>
              )}
              {selectedProductCategory !== 'all' && (
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  品类: {selectedProductCategory}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setSelectedProductCategory('all')}
                  />
                </Badge>
              )}
              {selectedBrand !== 'all' && (
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  品牌: {selectedBrand}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setSelectedBrand('all')}
                  />
                </Badge>
              )}
              {selectedContentCategory !== 'all' && (
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  分类: {selectedContentCategory}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setSelectedContentCategory('all')}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* 素材列表 */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Archive className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs mb-2">{hasActiveFilters ? '未找到匹配的素材' : '暂无素材'}</p>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-6 px-2 text-xs"
                >
                  清空筛选条件
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="text-xs text-muted-foreground mb-2 flex items-center justify-between">
                <span>找到 {filteredAssets.length} 个素材</span>
                {hasActiveFilters && <span className="text-blue-600">已筛选</span>}
              </div>
              {filteredAssets.map(asset => (
                <DraggableAssetItem
                  key={asset.id}
                  asset={asset}
                  onUse={() => handleUseAsset(asset)}
                />
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetPicker;
