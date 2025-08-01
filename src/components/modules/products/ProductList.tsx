import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  SortAsc,
  SortDesc,
  Package,
  Eye,
  Edit,
  Trash2,
  Star,
  TrendingUp,
} from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import useAppStore from '../../../stores/useAppStore';
import ProductCard from './ProductCard';
import type { Product, ProductCategory } from '../../../types';

type SortField = 'name' | 'brand' | 'price' | 'createdAt';
type SortOrder = 'asc' | 'desc';

interface FilterState {
  search: string;
  brand: string;
  category: string;
}

const ProductList: React.FC = () => {
  const { products, actions } = useAppStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // 过滤状态
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    brand: 'all',
    category: 'all',
  });

  // 获取唯一的品牌列表
  const brands = useMemo(() => {
    const brandSet = new Set(
      products.filter(p => p && p.basicInfo && p.basicInfo.brand).map(p => p.basicInfo.brand),
    );
    return Array.from(brandSet).sort();
  }, [products]);

  // 产品品类列表
  const productCategories: ProductCategory[] = [
    '吸尘器',
    '宠物空气净化器',
    '猫砂盆',
    '猫粮',
    '空气净化器',
    '冻干',
    '猫罐头',
  ];

  // 过滤和排序产品
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // 首先检查产品对象的有效性
      if (!product || !product.basicInfo) return false;

      const matchesSearch =
        !filters.search ||
        (product.basicInfo.modelName || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (product.basicInfo.brand || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (product.basicInfo.description || '')
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        (product.features || []).some(feature =>
          feature.toLowerCase().includes(filters.search.toLowerCase()),
        );

      const matchesBrand = filters.brand === 'all' || product.basicInfo.brand === filters.brand;
      const matchesCategory =
        filters.category === 'all' || product.basicInfo.category === filters.category;

      return matchesSearch && matchesBrand && matchesCategory;
    });

    // 排序
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.basicInfo.modelName;
          bValue = b.basicInfo.modelName;
          break;
        case 'brand':
          aValue = a.basicInfo.brand;
          bValue = b.basicInfo.brand;
          break;
        case 'price':
          aValue = a.basicInfo.price;
          bValue = b.basicInfo.price;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, filters, sortField, sortOrder]);

  // 处理过滤器变更
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // 产品操作处理
  const handleProductClick = (product: Product) => {
    actions.showProductDetail(product.id);
  };

  const handleEditProduct = (product: Product) => {
    actions.showProductForm(product.id);
  };

  const handleDeleteProduct = (product: Product) => {
    if (confirm(`确定要删除产品 ${product.basicInfo.brand} ${product.basicInfo.modelName} 吗？`)) {
      actions.deleteProduct(product.id);
    }
  };

  const handleViewProduct = (product: Product) => {
    actions.showProductDetail(product.id);
  };

  // 网格产品卡片组件
  const GridProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <ProductCard
        product={product}
        onView={() => handleViewProduct(product)}
        onEdit={() => handleEditProduct(product)}
        onDelete={() => handleDeleteProduct(product)}
      />
    </motion.div>
  );

  // 列表视图组件
  const ProductListItem: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
    const parameterCount = Object.keys(product.parameters).length;
    const featureCount = product.features.length;

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card className="hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.basicInfo.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {product.basicInfo.brand}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                  {product.basicInfo.modelName}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {product.basicInfo.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Package className="w-4 h-4" />
                    <span>{parameterCount} 参数</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{featureCount} 特性</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-2xl font-bold text-primary">
                      ¥{product.basicInfo.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleViewProduct(product)}>
                  <Eye className="w-4 h-4 mr-1" />
                  查看
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                  <Edit className="w-4 h-4 mr-1" />
                  编辑
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteProduct(product)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-none space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            产品资料库
          </h1>
          <p className="text-muted-foreground mt-1">
            管理您的产品信息，包括基本参数、产品参数和产品特性
          </p>
        </div>
        <Button onClick={() => actions.showProductForm()} size="lg" className="shadow-lg">
          <Plus className="w-5 h-5 mr-2" />
          新建产品
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{products.length}</div>
                <div className="text-sm text-muted-foreground">总产品数</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{brands.length}</div>
                <div className="text-sm text-muted-foreground">品牌数量</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <LayoutGrid className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{productCategories.length}</div>
                <div className="text-sm text-muted-foreground">品类</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{filteredAndSortedProducts.length}</div>
                <div className="text-sm text-muted-foreground">筛选结果</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 工具栏 */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* 搜索框 */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索产品型号、品牌、描述或特性..."
                value={filters.search}
                onChange={e => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 视图切换 */}
            <div className="flex items-center space-x-1 border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 过滤器和排序 */}
          <div className="flex items-center space-x-4">
            <Select
              value={filters.brand}
              onValueChange={value => handleFilterChange('brand', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="选择品牌" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部品牌</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.category}
              onValueChange={value => handleFilterChange('category', value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="选择品类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">品类</SelectItem>
                {productCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortField} onValueChange={value => setSortField(value as SortField)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">创建时间</SelectItem>
                <SelectItem value="name">产品名称</SelectItem>
                <SelectItem value="brand">品牌</SelectItem>
                <SelectItem value="price">价格</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 产品列表 */}
      <AnimatePresence mode="wait">
        {filteredAndSortedProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">暂无产品</h3>
            <p className="text-muted-foreground mb-6">
              {filters.search || filters.brand !== 'all' || filters.category !== 'all'
                ? '没有找到符合条件的产品，请调整筛选条件'
                : '还没有添加任何产品，点击上方按钮创建第一个产品'}
            </p>
            <Button onClick={() => actions.showProductForm()}>
              <Plus className="w-4 h-4 mr-2" />
              新建产品
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4'
                : 'space-y-4'
            }
          >
            {filteredAndSortedProducts.map((product, index) =>
              viewMode === 'grid' ? (
                <GridProductCard key={product.id} product={product} index={index} />
              ) : (
                <ProductListItem key={product.id} product={product} index={index} />
              ),
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductList;
