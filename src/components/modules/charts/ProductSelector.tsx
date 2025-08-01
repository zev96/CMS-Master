import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { cn } from '../../../lib/utils';
import { Search, Check, Package, ChevronRight, Filter } from 'lucide-react';
import type { Product } from '../../../types';

interface ProductSelectorProps {
  products: Product[];
  selectedProducts: Product[];
  onSelectionChange: (products: Product[]) => void;
  onNext: () => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProducts,
  onSelectionChange,
  onNext,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 获取所有类别
  const categories = ['all', ...new Set(products.map(p => p.basicInfo.category || '未分类'))];

  // 过滤产品
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.basicInfo.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.basicInfo.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.basicInfo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 处理产品选择
  const handleProductToggle = (product: Product) => {
    const isSelected = selectedProducts.some(p => p.id === product.id);

    if (isSelected) {
      onSelectionChange(selectedProducts.filter(p => p.id !== product.id));
    } else {
      if (selectedProducts.length >= 5) {
        alert('最多只能选择5个产品进行对比');
        return;
      }
      onSelectionChange([...selectedProducts, product]);
    }
  };

  // 检查是否可以进入下一步
  const canProceed = selectedProducts.length >= 2;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="w-5 h-5" />
          <span>选择要对比的产品</span>
          <Badge variant="secondary">已选择 {selectedProducts.length}/5</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">请选择2-5个产品进行参数对比分析</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 搜索和筛选栏 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索产品名称或品牌..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm bg-background"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? '全部分类' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 已选择的产品 */}
        {selectedProducts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">已选择的产品</h4>
            <div className="flex flex-wrap gap-2">
              {selectedProducts.map(product => (
                <Badge
                  key={product.id}
                  variant="default"
                  className="flex items-center space-x-2 px-3 py-1 cursor-pointer hover:bg-primary/80"
                  onClick={() => handleProductToggle(product)}
                >
                  <span>{product.basicInfo.modelName}</span>
                  <Check className="w-3 h-3" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 产品列表 */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">
            可选产品 ({filteredProducts.length})
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {filteredProducts.map(product => {
              const isSelected = selectedProducts.some(p => p.id === product.id);

              return (
                <div
                  key={product.id}
                  className={cn(
                    'p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/50',
                  )}
                  onClick={() => handleProductToggle(product)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">
                          {product.basicInfo.modelName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {product.basicInfo.brand} • {product.basicInfo.category}
                        </p>

                        {/* 显示前两个参数 */}
                        {product.parameters &&
                          Object.entries(product.parameters)
                            .slice(0, 2)
                            .map(([key, value]) => (
                              <div key={key} className="text-xs text-gray-500">
                                <span className="font-medium">{key}:</span> {String(value)}
                              </div>
                            ))}
                      </div>
                    </div>

                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center ml-3 flex-shrink-0',
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-gray-300',
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>未找到匹配的产品</p>
              <p className="text-sm">请尝试调整搜索条件</p>
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedProducts.length < 2
              ? `还需要选择 ${2 - selectedProducts.length} 个产品`
              : '可以进行下一步'}
          </div>

          <Button onClick={onNext} disabled={!canProceed} className="flex items-center space-x-2">
            <span>下一步：选择参数</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSelector;
