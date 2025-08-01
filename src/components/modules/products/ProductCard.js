import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, Tag, Package } from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent } from '../../ui/card';
import { cn } from '../../../lib/utils';
// 品牌颜色映射
const getBrandColor = brand => {
  const colors = {
    希喂: 'bg-gradient-to-br from-blue-500 to-blue-600',
    戴森: 'bg-gradient-to-br from-purple-500 to-purple-600',
    小米: 'bg-gradient-to-br from-orange-500 to-orange-600',
    美的: 'bg-gradient-to-br from-red-500 to-red-600',
    追觅: 'bg-gradient-to-br from-green-500 to-green-600',
  };
  return colors[brand] || 'bg-gradient-to-br from-gray-500 to-gray-600';
};
// 获取品类颜色
const getCategoryColor = category => {
  const colors = {
    吸尘器: 'bg-blue-50 text-blue-700 border-blue-200',
    宠物空气净化器: 'bg-green-50 text-green-700 border-green-200',
    猫砂盆: 'bg-purple-50 text-purple-700 border-purple-200',
    猫粮: 'bg-orange-50 text-orange-700 border-orange-200',
    空气净化器: 'bg-teal-50 text-teal-700 border-teal-200',
    冻干: 'bg-red-50 text-red-700 border-red-200',
    猫罐头: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };
  return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
};
const ProductCard = ({ product, onEdit, onDelete, onView, className }) => {
  return _jsx(motion.div, {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    whileHover: { y: -2, scale: 1.02 },
    transition: { duration: 0.2 },
    className: cn('group', className),
    children: _jsxs(Card, {
      className:
        'relative overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer aspect-[4/3]',
      children: [
        _jsxs('div', {
          className:
            'absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10',
          children: [
            _jsx(Button, {
              variant: 'ghost',
              size: 'sm',
              onClick: e => {
                e.stopPropagation();
                onView();
              },
              className:
                'h-7 w-7 p-0 bg-white/90 backdrop-blur-sm hover:bg-white hover:text-blue-600 shadow-sm',
              title: '\u67E5\u770B\u8BE6\u60C5',
              children: _jsx(Eye, { className: 'w-3.5 h-3.5' }),
            }),
            _jsx(Button, {
              variant: 'ghost',
              size: 'sm',
              onClick: e => {
                e.stopPropagation();
                onEdit();
              },
              className:
                'h-7 w-7 p-0 bg-white/90 backdrop-blur-sm hover:bg-white hover:text-green-600 shadow-sm',
              title: '\u7F16\u8F91\u4EA7\u54C1',
              children: _jsx(Edit, { className: 'w-3.5 h-3.5' }),
            }),
            _jsx(Button, {
              variant: 'ghost',
              size: 'sm',
              onClick: e => {
                e.stopPropagation();
                onDelete();
              },
              className:
                'h-7 w-7 p-0 bg-white/90 backdrop-blur-sm hover:bg-white hover:text-red-600 shadow-sm',
              title: '\u5220\u9664\u4EA7\u54C1',
              children: _jsx(Trash2, { className: 'w-3.5 h-3.5' }),
            }),
          ],
        }),
        _jsxs(CardContent, {
          className: 'p-4 h-full flex flex-col justify-between',
          onClick: onView,
          children: [
            _jsxs('div', {
              className: 'flex items-center justify-between mb-3',
              children: [
                _jsx('div', {
                  className: cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md',
                    getBrandColor(product.basicInfo.brand),
                  ),
                  children: product.basicInfo.brand.charAt(0),
                }),
                _jsxs(Badge, {
                  className: cn(
                    'text-xs px-2 py-1 font-medium border',
                    getCategoryColor(product.basicInfo.category),
                  ),
                  children: [
                    _jsx(Package, { className: 'w-3 h-3 mr-1' }),
                    product.basicInfo.category,
                  ],
                }),
              ],
            }),
            _jsxs('div', {
              className: 'flex-1 flex flex-col justify-center space-y-2',
              children: [
                _jsx('h3', {
                  className:
                    'font-bold text-lg text-gray-900 line-clamp-2 text-center leading-tight group-hover:text-blue-600 transition-colors',
                  children: product.basicInfo.modelName,
                }),
                _jsx('p', {
                  className: 'text-sm text-gray-600 text-center font-medium',
                  children: product.basicInfo.brand,
                }),
              ],
            }),
            _jsx('div', {
              className: 'mt-3 pt-3 border-t border-gray-100',
              children: _jsxs('div', {
                className:
                  'flex items-center justify-center space-x-2 text-xs text-gray-500 group-hover:text-blue-600 transition-colors',
                children: [
                  _jsx(Tag, { className: 'w-3 h-3' }),
                  _jsx('span', { children: '\u70B9\u51FB\u67E5\u770B\u8BE6\u60C5' }),
                ],
              }),
            }),
          ],
        }),
        _jsx('div', {
          className:
            'absolute inset-0 border-2 border-blue-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none',
        }),
      ],
    }),
  });
};
export default ProductCard;
