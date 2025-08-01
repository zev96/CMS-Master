import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Tag,
  Package,
  Star,
  Zap,
  Shield,
  Clock,
  Info,
  Settings,
  Heart,
  Share2,
  Eye,
  BarChart3,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { cn } from '../../../lib/utils';
const ProductDetail = ({ product, onBack, onEdit, onDelete, className }) => {
  const formatPrice = price => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
    }).format(price);
  };
  const getBrandColor = brand => {
    const brandColors = {
      戴森: 'from-blue-500 to-blue-600',
      小米: 'from-orange-500 to-orange-600',
      美的: 'from-red-500 to-red-600',
      希喂: 'from-purple-500 to-purple-600',
      追觅: 'from-green-500 to-green-600',
      皇家: 'from-amber-500 to-amber-600',
      渴望: 'from-emerald-500 to-emerald-600',
    };
    return brandColors[brand] || 'from-gray-500 to-gray-600';
  };
  const getCategoryIcon = category => {
    const categoryIcons = {
      吸尘器: _jsx(Zap, { className: 'w-5 h-5' }),
      宠物空气净化器: _jsx(Shield, { className: 'w-5 h-5' }),
      空气净化器: _jsx(Shield, { className: 'w-5 h-5' }),
      猫砂盆: _jsx(Package, { className: 'w-5 h-5' }),
      猫粮: _jsx(Heart, { className: 'w-5 h-5' }),
      冻干: _jsx(Star, { className: 'w-5 h-5' }),
      猫罐头: _jsx(Package, { className: 'w-5 h-5' }),
    };
    return categoryIcons[category] || _jsx(Package, { className: 'w-5 h-5' });
  };
  const handleCopyProduct = () => {
    const productInfo = `${product.basicInfo.brand} ${product.basicInfo.modelName} - ${formatPrice(product.basicInfo.price)}`;
    navigator.clipboard.writeText(productInfo);
  };
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  return _jsxs('div', {
    className: cn('w-full max-w-none space-y-8', className),
    children: [
      _jsxs(motion.div, {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        className: 'flex items-center justify-between',
        children: [
          _jsxs(Button, {
            variant: 'ghost',
            onClick: onBack,
            className:
              'flex items-center space-x-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50',
            children: [
              _jsx(ArrowLeft, { className: 'w-4 h-4' }),
              _jsx('span', { children: '\u8FD4\u56DE\u4EA7\u54C1\u5217\u8868' }),
            ],
          }),
          _jsxs('div', {
            className: 'flex items-center space-x-2',
            children: [
              _jsxs(Button, {
                variant: 'outline',
                size: 'sm',
                onClick: handleCopyProduct,
                children: [_jsx(Copy, { className: 'w-4 h-4 mr-2' }), '\u590D\u5236\u4FE1\u606F'],
              }),
              _jsxs(Button, {
                variant: 'outline',
                size: 'sm',
                children: [_jsx(Share2, { className: 'w-4 h-4 mr-2' }), '\u5206\u4EAB'],
              }),
              _jsxs(Button, {
                variant: 'outline',
                size: 'sm',
                onClick: onEdit,
                children: [_jsx(Edit, { className: 'w-4 h-4 mr-2' }), '\u7F16\u8F91'],
              }),
              _jsxs(Button, {
                variant: 'destructive',
                size: 'sm',
                onClick: onDelete,
                children: [_jsx(Trash2, { className: 'w-4 h-4 mr-2' }), '\u5220\u9664'],
              }),
            ],
          }),
        ],
      }),
      _jsx(motion.div, {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { delay: 0.1 },
        children: _jsx(Card, {
          className:
            'overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-0 shadow-xl',
          children: _jsx(CardHeader, {
            className: 'pb-6',
            children: _jsxs('div', {
              className: 'flex items-start justify-between',
              children: [
                _jsxs('div', {
                  className: 'space-y-4 flex-1',
                  children: [
                    _jsxs('div', {
                      className: 'flex items-center space-x-4',
                      children: [
                        _jsx('div', {
                          className: cn(
                            'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg',
                            getBrandColor(product.basicInfo.brand),
                          ),
                          children: getCategoryIcon(product.basicInfo.category),
                        }),
                        _jsxs('div', {
                          children: [
                            _jsx('h1', {
                              className:
                                'text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent',
                              children: product.basicInfo.modelName,
                            }),
                            _jsxs('div', {
                              className: 'flex items-center space-x-3 mt-2',
                              children: [
                                _jsx(Badge, {
                                  variant: 'secondary',
                                  className: cn(
                                    'bg-gradient-to-r text-white border-0 shadow-sm',
                                    getBrandColor(product.basicInfo.brand),
                                  ),
                                  children: product.basicInfo.brand,
                                }),
                                _jsx(Badge, {
                                  variant: 'outline',
                                  className: 'bg-white/80',
                                  children: product.basicInfo.category,
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    product.basicInfo.description &&
                      _jsx('div', {
                        className: 'bg-white/60 rounded-lg p-4 border border-white/50',
                        children: _jsx('p', {
                          className: 'text-gray-700 leading-relaxed',
                          children: product.basicInfo.description,
                        }),
                      }),
                  ],
                }),
                _jsx('div', {
                  className: 'text-right ml-8',
                  children: _jsxs('div', {
                    className: 'bg-white/80 rounded-xl p-6 shadow-lg border border-white/50',
                    children: [
                      _jsx('div', {
                        className:
                          'text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
                        children: formatPrice(product.basicInfo.price),
                      }),
                      _jsx('div', {
                        className: 'text-sm text-gray-600 mt-1',
                        children: '\u53C2\u8003\u4EF7\u683C',
                      }),
                    ],
                  }),
                }),
              ],
            }),
          }),
        }),
      }),
      _jsxs('div', {
        className: 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6',
        children: [
          _jsx(motion.div, {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.2 },
            children: _jsxs(Card, {
              className: 'h-full bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-lg',
              children: [
                _jsx(CardHeader, {
                  children: _jsxs(CardTitle, {
                    className: 'flex items-center space-x-2 text-blue-700',
                    children: [
                      _jsx(Info, { className: 'w-5 h-5' }),
                      _jsx('span', { children: '\u57FA\u672C\u53C2\u6570' }),
                    ],
                  }),
                }),
                _jsxs(CardContent, {
                  className: 'space-y-4',
                  children: [
                    _jsxs('div', {
                      className: 'space-y-3',
                      children: [
                        _jsxs('div', {
                          className:
                            'flex justify-between items-center py-2 border-b border-blue-100',
                          children: [
                            _jsx('span', {
                              className: 'text-sm font-medium text-gray-600',
                              children: '\u54C1\u724C',
                            }),
                            _jsx('span', {
                              className: 'font-semibold text-gray-900',
                              children: product.basicInfo.brand,
                            }),
                          ],
                        }),
                        _jsxs('div', {
                          className:
                            'flex justify-between items-center py-2 border-b border-blue-100',
                          children: [
                            _jsx('span', {
                              className: 'text-sm font-medium text-gray-600',
                              children: '\u578B\u53F7',
                            }),
                            _jsx('span', {
                              className: 'font-semibold text-gray-900',
                              children: product.basicInfo.modelName,
                            }),
                          ],
                        }),
                        _jsxs('div', {
                          className:
                            'flex justify-between items-center py-2 border-b border-blue-100',
                          children: [
                            _jsx('span', {
                              className: 'text-sm font-medium text-gray-600',
                              children: '\u54C1\u7C7B',
                            }),
                            _jsx('span', {
                              className: 'font-semibold text-gray-900',
                              children: product.basicInfo.category,
                            }),
                          ],
                        }),
                        _jsxs('div', {
                          className: 'flex justify-between items-center py-2',
                          children: [
                            _jsx('span', {
                              className: 'text-sm font-medium text-gray-600',
                              children: '\u4EF7\u683C',
                            }),
                            _jsx('span', {
                              className: 'font-bold text-blue-600',
                              children: formatPrice(product.basicInfo.price),
                            }),
                          ],
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      className:
                        'flex items-center space-x-2 text-sm text-gray-500 pt-4 border-t border-blue-100',
                      children: [
                        _jsx(Calendar, { className: 'w-4 h-4' }),
                        _jsxs('span', {
                          children: ['\u521B\u5EFA\u4E8E ', formatDate(product.createdAt)],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
          _jsx(motion.div, {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3 },
            className: 'lg:col-span-1 xl:col-span-2',
            children: _jsxs(Card, {
              className: 'h-full bg-gradient-to-br from-white to-green-50/50 border-0 shadow-lg',
              children: [
                _jsx(CardHeader, {
                  children: _jsxs(CardTitle, {
                    className: 'flex items-center space-x-2 text-green-700',
                    children: [
                      _jsx(Settings, { className: 'w-5 h-5' }),
                      _jsx('span', { children: '\u4EA7\u54C1\u53C2\u6570' }),
                      _jsxs(Badge, {
                        variant: 'outline',
                        className: 'ml-auto',
                        children: [Object.keys(product.parameters).length, ' \u9879\u53C2\u6570'],
                      }),
                    ],
                  }),
                }),
                _jsx(CardContent, {
                  children:
                    Object.keys(product.parameters).length > 0
                      ? _jsx('div', {
                          className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
                          children: Object.entries(product.parameters).map(([key, value], index) =>
                            _jsx(
                              motion.div,
                              {
                                initial: { opacity: 0, x: -20 },
                                animate: { opacity: 1, x: 0 },
                                transition: { delay: 0.1 * index },
                                className: 'bg-white/60 rounded-lg p-3 border border-green-100',
                                children: _jsxs('div', {
                                  className: 'flex justify-between items-center',
                                  children: [
                                    _jsx('span', {
                                      className: 'text-sm font-medium text-gray-600',
                                      children: key,
                                    }),
                                    _jsx('span', {
                                      className: 'font-semibold text-gray-900',
                                      children:
                                        typeof value === 'number' ? value.toLocaleString() : value,
                                    }),
                                  ],
                                }),
                              },
                              key,
                            ),
                          ),
                        })
                      : _jsxs('div', {
                          className: 'text-center py-8',
                          children: [
                            _jsx(Settings, { className: 'w-12 h-12 text-gray-300 mx-auto mb-3' }),
                            _jsx('p', {
                              className: 'text-gray-500',
                              children: '\u6682\u65E0\u4EA7\u54C1\u53C2\u6570',
                            }),
                            _jsxs(Button, {
                              variant: 'outline',
                              size: 'sm',
                              className: 'mt-3',
                              onClick: onEdit,
                              children: [
                                _jsx(Settings, { className: 'w-4 h-4 mr-2' }),
                                '\u6DFB\u52A0\u53C2\u6570',
                              ],
                            }),
                          ],
                        }),
                }),
              ],
            }),
          }),
          _jsx(motion.div, {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.4 },
            className: 'lg:col-span-2 xl:col-span-3',
            children: _jsxs(Card, {
              className: 'bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-lg',
              children: [
                _jsx(CardHeader, {
                  children: _jsxs(CardTitle, {
                    className: 'flex items-center space-x-2 text-purple-700',
                    children: [
                      _jsx(Star, { className: 'w-5 h-5' }),
                      _jsx('span', { children: '\u4EA7\u54C1\u7279\u6027' }),
                      _jsxs(Badge, {
                        variant: 'outline',
                        className: 'ml-auto',
                        children: [product.features.length, ' \u9879\u7279\u6027'],
                      }),
                    ],
                  }),
                }),
                _jsx(CardContent, {
                  children:
                    product.features.length > 0
                      ? _jsx('div', {
                          className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
                          children: product.features.map((feature, index) =>
                            _jsx(
                              motion.div,
                              {
                                initial: { opacity: 0, scale: 0.9 },
                                animate: { opacity: 1, scale: 1 },
                                transition: { delay: 0.1 * index },
                                className:
                                  'bg-white/60 rounded-lg p-4 border border-purple-100 hover:shadow-md transition-shadow',
                                children: _jsxs('div', {
                                  className: 'flex items-start space-x-3',
                                  children: [
                                    _jsx('div', {
                                      className:
                                        'w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 mt-2 flex-shrink-0',
                                    }),
                                    _jsx('span', {
                                      className:
                                        'text-sm font-medium text-gray-800 leading-relaxed',
                                      children: feature,
                                    }),
                                  ],
                                }),
                              },
                              index,
                            ),
                          ),
                        })
                      : _jsxs('div', {
                          className: 'text-center py-8',
                          children: [
                            _jsx(Star, { className: 'w-12 h-12 text-gray-300 mx-auto mb-3' }),
                            _jsx('p', {
                              className: 'text-gray-500',
                              children: '\u6682\u65E0\u4EA7\u54C1\u7279\u6027',
                            }),
                            _jsxs(Button, {
                              variant: 'outline',
                              size: 'sm',
                              className: 'mt-3',
                              onClick: onEdit,
                              children: [
                                _jsx(Star, { className: 'w-4 h-4 mr-2' }),
                                '\u6DFB\u52A0\u7279\u6027',
                              ],
                            }),
                          ],
                        }),
                }),
              ],
            }),
          }),
        ],
      }),
      _jsx(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.5 },
        children: _jsx(Card, {
          className: 'bg-gradient-to-r from-gray-50 to-gray-100/50 border-0 shadow-lg',
          children: _jsx(CardContent, {
            className: 'pt-6',
            children: _jsxs('div', {
              className: 'flex items-center justify-between',
              children: [
                _jsxs('div', {
                  className: 'flex items-center space-x-6',
                  children: [
                    _jsxs('div', {
                      className: 'flex items-center space-x-2 text-gray-600',
                      children: [
                        _jsx(Eye, { className: 'w-4 h-4' }),
                        _jsxs('span', {
                          className: 'text-sm',
                          children: ['\u6700\u540E\u66F4\u65B0: ', formatDate(product.updatedAt)],
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      className: 'flex items-center space-x-2 text-gray-600',
                      children: [
                        _jsx(Clock, { className: 'w-4 h-4' }),
                        _jsxs('span', {
                          className: 'text-sm',
                          children: ['\u4EA7\u54C1ID: ', product.id],
                        }),
                      ],
                    }),
                  ],
                }),
                _jsxs('div', {
                  className: 'flex items-center space-x-2',
                  children: [
                    _jsxs(Button, {
                      variant: 'outline',
                      size: 'sm',
                      children: [
                        _jsx(BarChart3, { className: 'w-4 h-4 mr-2' }),
                        '\u6DFB\u52A0\u5230\u5BF9\u6BD4',
                      ],
                    }),
                    _jsxs(Button, {
                      variant: 'outline',
                      size: 'sm',
                      children: [
                        _jsx(Tag, { className: 'w-4 h-4 mr-2' }),
                        '\u751F\u6210\u5185\u5BB9',
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
        }),
      }),
    ],
  });
};
export default ProductDetail;
