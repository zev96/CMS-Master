import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { cn } from '../../../lib/utils';
import { Search, Check, Package, ChevronRight, Filter } from 'lucide-react';
const ProductSelector = ({ products, selectedProducts, onSelectionChange, onNext }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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
  const handleProductToggle = product => {
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
  return _jsxs(Card, {
    className: 'w-full',
    children: [
      _jsxs(CardHeader, {
        children: [
          _jsxs(CardTitle, {
            className: 'flex items-center space-x-2',
            children: [
              _jsx(Package, { className: 'w-5 h-5' }),
              _jsx('span', { children: '\u9009\u62E9\u8981\u5BF9\u6BD4\u7684\u4EA7\u54C1' }),
              _jsxs(Badge, {
                variant: 'secondary',
                children: ['\u5DF2\u9009\u62E9 ', selectedProducts.length, '/5'],
              }),
            ],
          }),
          _jsx('p', {
            className: 'text-sm text-muted-foreground',
            children:
              '\u8BF7\u9009\u62E92-5\u4E2A\u4EA7\u54C1\u8FDB\u884C\u53C2\u6570\u5BF9\u6BD4\u5206\u6790',
          }),
        ],
      }),
      _jsxs(CardContent, {
        className: 'space-y-6',
        children: [
          _jsxs('div', {
            className: 'flex flex-col sm:flex-row gap-4',
            children: [
              _jsxs('div', {
                className: 'flex-1 relative',
                children: [
                  _jsx(Search, {
                    className:
                      'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground',
                  }),
                  _jsx(Input, {
                    placeholder: '\u641C\u7D22\u4EA7\u54C1\u540D\u79F0\u6216\u54C1\u724C...',
                    value: searchQuery,
                    onChange: e => setSearchQuery(e.target.value),
                    className: 'pl-10',
                  }),
                ],
              }),
              _jsxs('div', {
                className: 'flex items-center space-x-2',
                children: [
                  _jsx(Filter, { className: 'w-4 h-4 text-muted-foreground' }),
                  _jsx('select', {
                    value: selectedCategory,
                    onChange: e => setSelectedCategory(e.target.value),
                    className: 'px-3 py-2 border rounded-md text-sm bg-background',
                    children: categories.map(category =>
                      _jsx(
                        'option',
                        { value: category, children: category === 'all' ? '全部分类' : category },
                        category,
                      ),
                    ),
                  }),
                ],
              }),
            ],
          }),
          selectedProducts.length > 0 &&
            _jsxs('div', {
              className: 'space-y-3',
              children: [
                _jsx('h4', {
                  className: 'font-medium text-sm text-muted-foreground',
                  children: '\u5DF2\u9009\u62E9\u7684\u4EA7\u54C1',
                }),
                _jsx('div', {
                  className: 'flex flex-wrap gap-2',
                  children: selectedProducts.map(product =>
                    _jsxs(
                      Badge,
                      {
                        variant: 'default',
                        className:
                          'flex items-center space-x-2 px-3 py-1 cursor-pointer hover:bg-primary/80',
                        onClick: () => handleProductToggle(product),
                        children: [
                          _jsx('span', { children: product.basicInfo.modelName }),
                          _jsx(Check, { className: 'w-3 h-3' }),
                        ],
                      },
                      product.id,
                    ),
                  ),
                }),
              ],
            }),
          _jsxs('div', {
            className: 'space-y-3',
            children: [
              _jsxs('h4', {
                className: 'font-medium text-sm text-muted-foreground',
                children: ['\u53EF\u9009\u4EA7\u54C1 (', filteredProducts.length, ')'],
              }),
              _jsx('div', {
                className:
                  'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto',
                children: filteredProducts.map(product => {
                  const isSelected = selectedProducts.some(p => p.id === product.id);
                  return _jsx(
                    'div',
                    {
                      className: cn(
                        'p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md',
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:border-primary/50',
                      ),
                      onClick: () => handleProductToggle(product),
                      children: _jsxs('div', {
                        className: 'flex items-start justify-between',
                        children: [
                          _jsx('div', {
                            className: 'flex-1 min-w-0',
                            children: _jsxs('div', {
                              className: 'space-y-2',
                              children: [
                                _jsx('h4', {
                                  className: 'font-semibold text-gray-900',
                                  children: product.basicInfo.modelName,
                                }),
                                _jsxs('p', {
                                  className: 'text-sm text-gray-600',
                                  children: [
                                    product.basicInfo.brand,
                                    ' \u2022 ',
                                    product.basicInfo.category,
                                  ],
                                }),
                                product.parameters &&
                                  Object.entries(product.parameters)
                                    .slice(0, 2)
                                    .map(([key, value]) =>
                                      _jsxs(
                                        'div',
                                        {
                                          className: 'text-xs text-gray-500',
                                          children: [
                                            _jsxs('span', {
                                              className: 'font-medium',
                                              children: [key, ':'],
                                            }),
                                            ' ',
                                            String(value),
                                          ],
                                        },
                                        key,
                                      ),
                                    ),
                              ],
                            }),
                          }),
                          _jsx('div', {
                            className: cn(
                              'w-5 h-5 rounded-full border-2 flex items-center justify-center ml-3 flex-shrink-0',
                              isSelected
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-gray-300',
                            ),
                            children: isSelected && _jsx(Check, { className: 'w-3 h-3' }),
                          }),
                        ],
                      }),
                    },
                    product.id,
                  );
                }),
              }),
              filteredProducts.length === 0 &&
                _jsxs('div', {
                  className: 'text-center py-8 text-muted-foreground',
                  children: [
                    _jsx(Package, { className: 'w-12 h-12 mx-auto mb-3 opacity-50' }),
                    _jsx('p', { children: '\u672A\u627E\u5230\u5339\u914D\u7684\u4EA7\u54C1' }),
                    _jsx('p', {
                      className: 'text-sm',
                      children: '\u8BF7\u5C1D\u8BD5\u8C03\u6574\u641C\u7D22\u6761\u4EF6',
                    }),
                  ],
                }),
            ],
          }),
          _jsxs('div', {
            className: 'flex items-center justify-between pt-4 border-t',
            children: [
              _jsx('div', {
                className: 'text-sm text-muted-foreground',
                children:
                  selectedProducts.length < 2
                    ? `还需要选择 ${2 - selectedProducts.length} 个产品`
                    : '可以进行下一步',
              }),
              _jsxs(Button, {
                onClick: onNext,
                disabled: !canProceed,
                className: 'flex items-center space-x-2',
                children: [
                  _jsx('span', { children: '\u4E0B\u4E00\u6B65\uFF1A\u9009\u62E9\u53C2\u6570' }),
                  _jsx(ChevronRight, { className: 'w-4 h-4' }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
export default ProductSelector;
