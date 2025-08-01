import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useMemo } from 'react';
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
import { Card, CardContent } from '../../ui/card';
import useAppStore from '../../../stores/useAppStore';
import ProductCard from './ProductCard';
const ProductList = () => {
  const { products, actions } = useAppStore();
  const [viewMode, setViewMode] = useState('grid');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  // 过滤状态
  const [filters, setFilters] = useState({
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
  const productCategories = [
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
      let aValue, bValue;
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
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  // 产品操作处理
  const handleProductClick = product => {
    actions.showProductDetail(product.id);
  };
  const handleEditProduct = product => {
    actions.showProductForm(product.id);
  };
  const handleDeleteProduct = product => {
    if (confirm(`确定要删除产品 ${product.basicInfo.brand} ${product.basicInfo.modelName} 吗？`)) {
      actions.deleteProduct(product.id);
    }
  };
  const handleViewProduct = product => {
    actions.showProductDetail(product.id);
  };
  // 网格产品卡片组件
  const GridProductCard = ({ product, index }) =>
    _jsx(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.05 },
      children: _jsx(ProductCard, {
        product: product,
        onView: () => handleViewProduct(product),
        onEdit: () => handleEditProduct(product),
        onDelete: () => handleDeleteProduct(product),
      }),
    });
  // 列表视图组件
  const ProductListItem = ({ product, index }) => {
    const parameterCount = Object.keys(product.parameters).length;
    const featureCount = product.features.length;
    return _jsx(motion.div, {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: index * 0.05 },
      children: _jsx(Card, {
        className: 'hover:shadow-md transition-all duration-200',
        children: _jsx(CardContent, {
          className: 'p-4',
          children: _jsxs('div', {
            className: 'flex items-center space-x-4',
            children: [
              _jsxs('div', {
                className: 'flex-1 min-w-0',
                children: [
                  _jsxs('div', {
                    className: 'flex items-center space-x-2 mb-2',
                    children: [
                      _jsx(Badge, {
                        variant: 'secondary',
                        className: 'text-xs',
                        children: product.basicInfo.category,
                      }),
                      _jsx(Badge, {
                        variant: 'outline',
                        className: 'text-xs',
                        children: product.basicInfo.brand,
                      }),
                    ],
                  }),
                  _jsx('h3', {
                    className: 'font-semibold text-lg mb-1 line-clamp-1',
                    children: product.basicInfo.modelName,
                  }),
                  _jsx('p', {
                    className: 'text-sm text-muted-foreground line-clamp-2 mb-2',
                    children: product.basicInfo.description,
                  }),
                  _jsxs('div', {
                    className: 'flex items-center space-x-4 text-sm text-muted-foreground',
                    children: [
                      _jsxs('div', {
                        className: 'flex items-center space-x-1',
                        children: [
                          _jsx(Package, { className: 'w-4 h-4' }),
                          _jsxs('span', { children: [parameterCount, ' \u53C2\u6570'] }),
                        ],
                      }),
                      _jsxs('div', {
                        className: 'flex items-center space-x-1',
                        children: [
                          _jsx(Star, { className: 'w-4 h-4' }),
                          _jsxs('span', { children: [featureCount, ' \u7279\u6027'] }),
                        ],
                      }),
                      _jsxs('div', {
                        className: 'flex items-center space-x-1',
                        children: [
                          _jsx(TrendingUp, { className: 'w-4 h-4' }),
                          _jsxs('span', {
                            className: 'text-2xl font-bold text-primary',
                            children: ['\u00A5', product.basicInfo.price.toLocaleString()],
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
                    size: 'sm',
                    variant: 'outline',
                    onClick: () => handleViewProduct(product),
                    children: [_jsx(Eye, { className: 'w-4 h-4 mr-1' }), '\u67E5\u770B'],
                  }),
                  _jsxs(Button, {
                    size: 'sm',
                    variant: 'outline',
                    onClick: () => handleEditProduct(product),
                    children: [_jsx(Edit, { className: 'w-4 h-4 mr-1' }), '\u7F16\u8F91'],
                  }),
                  _jsx(Button, {
                    size: 'sm',
                    variant: 'outline',
                    onClick: () => handleDeleteProduct(product),
                    className: 'text-destructive hover:text-destructive',
                    children: _jsx(Trash2, { className: 'w-4 h-4' }),
                  }),
                ],
              }),
            ],
          }),
        }),
      }),
    });
  };
  return _jsxs('div', {
    className: 'w-full max-w-none space-y-6',
    children: [
      _jsxs('div', {
        className: 'flex items-center justify-between',
        children: [
          _jsxs('div', {
            children: [
              _jsx('h1', {
                className:
                  'text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent',
                children: '\u4EA7\u54C1\u8D44\u6599\u5E93',
              }),
              _jsx('p', {
                className: 'text-muted-foreground mt-1',
                children:
                  '\u7BA1\u7406\u60A8\u7684\u4EA7\u54C1\u4FE1\u606F\uFF0C\u5305\u62EC\u57FA\u672C\u53C2\u6570\u3001\u4EA7\u54C1\u53C2\u6570\u548C\u4EA7\u54C1\u7279\u6027',
              }),
            ],
          }),
          _jsxs(Button, {
            onClick: () => actions.showProductForm(),
            size: 'lg',
            className: 'shadow-lg',
            children: [_jsx(Plus, { className: 'w-5 h-5 mr-2' }), '\u65B0\u5EFA\u4EA7\u54C1'],
          }),
        ],
      }),
      _jsxs('div', {
        className: 'grid grid-cols-1 md:grid-cols-4 gap-4',
        children: [
          _jsx(Card, {
            children: _jsx(CardContent, {
              className: 'p-4',
              children: _jsxs('div', {
                className: 'flex items-center space-x-2',
                children: [
                  _jsx(Package, { className: 'w-8 h-8 text-primary' }),
                  _jsxs('div', {
                    children: [
                      _jsx('div', { className: 'text-2xl font-bold', children: products.length }),
                      _jsx('div', {
                        className: 'text-sm text-muted-foreground',
                        children: '\u603B\u4EA7\u54C1\u6570',
                      }),
                    ],
                  }),
                ],
              }),
            }),
          }),
          _jsx(Card, {
            children: _jsx(CardContent, {
              className: 'p-4',
              children: _jsxs('div', {
                className: 'flex items-center space-x-2',
                children: [
                  _jsx(Filter, { className: 'w-8 h-8 text-green-500' }),
                  _jsxs('div', {
                    children: [
                      _jsx('div', { className: 'text-2xl font-bold', children: brands.length }),
                      _jsx('div', {
                        className: 'text-sm text-muted-foreground',
                        children: '\u54C1\u724C\u6570\u91CF',
                      }),
                    ],
                  }),
                ],
              }),
            }),
          }),
          _jsx(Card, {
            children: _jsx(CardContent, {
              className: 'p-4',
              children: _jsxs('div', {
                className: 'flex items-center space-x-2',
                children: [
                  _jsx(LayoutGrid, { className: 'w-8 h-8 text-blue-500' }),
                  _jsxs('div', {
                    children: [
                      _jsx('div', {
                        className: 'text-2xl font-bold',
                        children: productCategories.length,
                      }),
                      _jsx('div', {
                        className: 'text-sm text-muted-foreground',
                        children: '\u54C1\u7C7B',
                      }),
                    ],
                  }),
                ],
              }),
            }),
          }),
          _jsx(Card, {
            children: _jsx(CardContent, {
              className: 'p-4',
              children: _jsxs('div', {
                className: 'flex items-center space-x-2',
                children: [
                  _jsx(TrendingUp, { className: 'w-8 h-8 text-orange-500' }),
                  _jsxs('div', {
                    children: [
                      _jsx('div', {
                        className: 'text-2xl font-bold',
                        children: filteredAndSortedProducts.length,
                      }),
                      _jsx('div', {
                        className: 'text-sm text-muted-foreground',
                        children: '\u7B5B\u9009\u7ED3\u679C',
                      }),
                    ],
                  }),
                ],
              }),
            }),
          }),
        ],
      }),
      _jsx(Card, {
        children: _jsxs(CardContent, {
          className: 'p-4 space-y-4',
          children: [
            _jsxs('div', {
              className: 'flex items-center space-x-4',
              children: [
                _jsxs('div', {
                  className: 'relative flex-1',
                  children: [
                    _jsx(Search, {
                      className:
                        'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground',
                    }),
                    _jsx(Input, {
                      placeholder:
                        '\u641C\u7D22\u4EA7\u54C1\u578B\u53F7\u3001\u54C1\u724C\u3001\u63CF\u8FF0\u6216\u7279\u6027...',
                      value: filters.search,
                      onChange: e => handleFilterChange('search', e.target.value),
                      className: 'pl-10',
                    }),
                  ],
                }),
                _jsxs('div', {
                  className: 'flex items-center space-x-1 border rounded-md',
                  children: [
                    _jsx(Button, {
                      variant: viewMode === 'grid' ? 'default' : 'ghost',
                      size: 'sm',
                      onClick: () => setViewMode('grid'),
                      children: _jsx(LayoutGrid, { className: 'w-4 h-4' }),
                    }),
                    _jsx(Button, {
                      variant: viewMode === 'list' ? 'default' : 'ghost',
                      size: 'sm',
                      onClick: () => setViewMode('list'),
                      children: _jsx(List, { className: 'w-4 h-4' }),
                    }),
                  ],
                }),
              ],
            }),
            _jsxs('div', {
              className: 'flex items-center space-x-4',
              children: [
                _jsxs(Select, {
                  value: filters.brand,
                  onValueChange: value => handleFilterChange('brand', value),
                  children: [
                    _jsx(SelectTrigger, {
                      className: 'w-40',
                      children: _jsx(SelectValue, { placeholder: '\u9009\u62E9\u54C1\u724C' }),
                    }),
                    _jsxs(SelectContent, {
                      children: [
                        _jsx(SelectItem, { value: 'all', children: '\u5168\u90E8\u54C1\u724C' }),
                        brands.map(brand =>
                          _jsx(SelectItem, { value: brand, children: brand }, brand),
                        ),
                      ],
                    }),
                  ],
                }),
                _jsxs(Select, {
                  value: filters.category,
                  onValueChange: value => handleFilterChange('category', value),
                  children: [
                    _jsx(SelectTrigger, {
                      className: 'w-48',
                      children: _jsx(SelectValue, { placeholder: '\u9009\u62E9\u54C1\u7C7B' }),
                    }),
                    _jsxs(SelectContent, {
                      children: [
                        _jsx(SelectItem, { value: 'all', children: '\u54C1\u7C7B' }),
                        productCategories.map(category =>
                          _jsx(SelectItem, { value: category, children: category }, category),
                        ),
                      ],
                    }),
                  ],
                }),
                _jsxs(Select, {
                  value: sortField,
                  onValueChange: value => setSortField(value),
                  children: [
                    _jsx(SelectTrigger, { className: 'w-32', children: _jsx(SelectValue, {}) }),
                    _jsxs(SelectContent, {
                      children: [
                        _jsx(SelectItem, {
                          value: 'createdAt',
                          children: '\u521B\u5EFA\u65F6\u95F4',
                        }),
                        _jsx(SelectItem, { value: 'name', children: '\u4EA7\u54C1\u540D\u79F0' }),
                        _jsx(SelectItem, { value: 'brand', children: '\u54C1\u724C' }),
                        _jsx(SelectItem, { value: 'price', children: '\u4EF7\u683C' }),
                      ],
                    }),
                  ],
                }),
                _jsx(Button, {
                  variant: 'outline',
                  size: 'sm',
                  onClick: () => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'),
                  children:
                    sortOrder === 'asc'
                      ? _jsx(SortAsc, { className: 'w-4 h-4' })
                      : _jsx(SortDesc, { className: 'w-4 h-4' }),
                }),
              ],
            }),
          ],
        }),
      }),
      _jsx(AnimatePresence, {
        mode: 'wait',
        children:
          filteredAndSortedProducts.length === 0
            ? _jsxs(motion.div, {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                className: 'text-center py-16',
                children: [
                  _jsx(Package, { className: 'w-16 h-16 mx-auto text-muted-foreground mb-4' }),
                  _jsx('h3', {
                    className: 'text-xl font-semibold mb-2',
                    children: '\u6682\u65E0\u4EA7\u54C1',
                  }),
                  _jsx('p', {
                    className: 'text-muted-foreground mb-6',
                    children:
                      filters.search || filters.brand !== 'all' || filters.category !== 'all'
                        ? '没有找到符合条件的产品，请调整筛选条件'
                        : '还没有添加任何产品，点击上方按钮创建第一个产品',
                  }),
                  _jsxs(Button, {
                    onClick: () => actions.showProductForm(),
                    children: [
                      _jsx(Plus, { className: 'w-4 h-4 mr-2' }),
                      '\u65B0\u5EFA\u4EA7\u54C1',
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
                  className:
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4'
                      : 'space-y-4',
                  children: filteredAndSortedProducts.map((product, index) =>
                    viewMode === 'grid'
                      ? _jsx(GridProductCard, { product: product, index: index }, product.id)
                      : _jsx(ProductListItem, { product: product, index: index }, product.id),
                  ),
                },
                viewMode,
              ),
      }),
    ],
  });
};
export default ProductList;
