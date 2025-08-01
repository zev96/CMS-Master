import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, FileText, Image } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { cn } from '../../../lib/utils';
import useAppStore from '../../../stores/useAppStore';
const AssetForm = ({ asset, assetType, onSave, onCancel, className }) => {
  // 从store获取产品数据，用于联通品牌和品类
  const { products, isLoading } = useAppStore(state => ({
    products: state.products,
    isLoading: state.isLoading,
  }));
  const [formData, setFormData] = useState({
    title: '',
    asset_category: '',
    productCategory: '',
    sub_category: '',
    content: '', // 仅文本素材使用
    url: '', // 仅图片素材使用
    brand: '',
    tags: [],
    type: 'main', // 仅图片素材使用
  });
  const [newTag, setNewTag] = useState('');
  // 从产品库动态获取品牌列表
  const availableBrands = React.useMemo(() => {
    const brands = new Set();
    products.forEach(product => {
      if (product.basicInfo.brand) {
        brands.add(product.basicInfo.brand);
      }
    });
    const result = Array.from(brands).sort();
    console.log('🔍 AssetForm - 可用品牌列表:', result, '产品数量:', products.length);
    return result;
  }, [products]);
  // 从产品库动态获取品类列表
  const availableProductCategories = React.useMemo(() => {
    const categories = new Set();
    products.forEach(product => {
      categories.add(product.basicInfo.category);
    });
    const result = Array.from(categories).sort();
    console.log('🔍 AssetForm - 可用品类列表:', result, '产品数量:', products.length);
    return result;
  }, [products]);
  // 素材分类（与产品品类分离）
  const textAssetCategories = [
    '行业分析',
    '产品介绍',
    '技术解析',
    '使用指南',
    '对比评测',
    '购买建议',
  ];
  const imageAssetCategories = ['产品图片', '场景图片', '图标素材', '图表素材', '装饰图片'];
  // 子分类映射
  const subCategoryMap = {
    行业分析: ['发展趋势', '市场分析', '需求分析', '竞争格局'],
    产品介绍: ['品牌故事', '产品特色', '特色功能', '规格参数'],
    技术解析: ['核心技术', '电机原理', '过滤技术', '创新技术'],
    使用指南: ['操作说明', '维护保养', '常见问题', '选购指南'],
    对比评测: ['横向对比', '性能测试', '优缺点分析', '选择建议'],
    购买建议: ['价格分析', '性价比评估', '购买渠道', '选购要点'],
    产品图片: ['产品图', '对比图', '细节图', '包装图'],
    场景图片: ['使用场景', '家居环境', '清洁效果', '生活应用'],
    图标素材: ['功能图标', '标识图标', '装饰图标', '按钮图标'],
    图表素材: ['性能图表', '数据对比', '统计图表', '流程图'],
    装饰图片: ['背景图', '分割线', '装饰元素', '边框'],
  };
  // 初始化表单数据
  useEffect(() => {
    if (asset) {
      setFormData({
        title: asset.title,
        asset_category: asset.asset_category || '',
        productCategory: asset.productCategory || '',
        sub_category: asset.sub_category || '',
        content: 'content' in asset ? asset.content : '',
        url: 'url' in asset ? asset.url : '',
        brand: asset.brand || '',
        tags: asset.tags || [],
        type: 'type' in asset ? asset.type : 'main',
      });
    }
  }, [asset]);
  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('请输入资产标题');
      return;
    }
    if (!formData.asset_category.trim()) {
      alert('请选择资产分类');
      return;
    }
    if (assetType === 'text' && !formData.content.trim()) {
      alert('请输入资产内容');
      return;
    }
    if (assetType === 'image' && !formData.url.trim()) {
      alert('请输入图片URL');
      return;
    }
    // 构建完整的资产数据结构
    const baseAssetData = {
      title: formData.title.trim(),
      asset_category: formData.asset_category,
      productCategory: formData.productCategory || undefined,
      sub_category: formData.sub_category || undefined,
      brand: formData.brand || undefined,
      tags: formData.tags || [],
    };
    let assetData;
    if (assetType === 'text') {
      assetData = {
        ...baseAssetData,
        content: formData.content.trim(),
      };
    } else {
      assetData = {
        ...baseAssetData,
        url: formData.url.trim(),
        type: formData.type,
      };
    }
    // 如果是编辑现有资产，保留原有的id和时间戳
    if (asset) {
      assetData = {
        ...assetData,
        id: asset.id,
        created_at: asset.created_at,
        // updated_at 会在store中自动更新
      };
    }
    console.log('AssetForm - 提交的资产数据:', assetData);
    console.log('AssetForm - 是否为编辑模式:', !!asset);
    console.log('AssetForm - 资产类型:', assetType);
    onSave(assetData);
  };
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };
  const removeTag = tagToRemove => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };
  return _jsx(motion.div, {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    className: cn('w-full max-w-2xl mx-auto', className),
    children: _jsxs(Card, {
      children: [
        _jsx(CardHeader, {
          children: _jsxs(CardTitle, {
            className: 'flex items-center justify-between',
            children: [
              _jsxs('div', {
                className: 'flex items-center space-x-2',
                children: [
                  assetType === 'text'
                    ? _jsx(FileText, { className: 'w-5 h-5' })
                    : _jsx(Image, { className: 'w-5 h-5' }),
                  _jsxs('span', {
                    children: [
                      asset ? '编辑' : '新建',
                      assetType === 'text' ? '文本' : '图片',
                      '\u8D44\u4EA7',
                    ],
                  }),
                ],
              }),
              _jsx(Button, {
                variant: 'ghost',
                size: 'sm',
                onClick: onCancel,
                children: _jsx(X, { className: 'w-4 h-4' }),
              }),
            ],
          }),
        }),
        _jsx(CardContent, {
          children: _jsxs('form', {
            onSubmit: handleSubmit,
            className: 'space-y-6',
            children: [
              _jsxs('div', {
                className: 'space-y-4',
                children: [
                  _jsxs('div', {
                    children: [
                      _jsxs('label', {
                        className: 'text-sm font-medium mb-2 block',
                        children: [
                          '\u6807\u9898 ',
                          _jsx('span', { className: 'text-red-500', children: '*' }),
                        ],
                      }),
                      _jsx(Input, {
                        value: formData.title,
                        onChange: e => setFormData(prev => ({ ...prev, title: e.target.value })),
                        placeholder: '\u8F93\u5165\u7D20\u6750\u6807\u9898',
                        className: 'w-full',
                      }),
                    ],
                  }),
                  _jsxs('div', {
                    className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
                    children: [
                      _jsxs('div', {
                        children: [
                          _jsxs('label', {
                            className: 'text-sm font-medium mb-2 block',
                            children: [
                              '\u8D44\u4EA7\u5206\u7C7B ',
                              _jsx('span', { className: 'text-red-500', children: '*' }),
                            ],
                          }),
                          _jsxs('select', {
                            value: formData.asset_category,
                            onChange: e => {
                              setFormData(prev => ({
                                ...prev,
                                asset_category: e.target.value,
                                sub_category: '', // 重置子分类
                              }));
                            },
                            className: 'w-full p-2 border rounded',
                            children: [
                              _jsx('option', {
                                value: '',
                                disabled: true,
                                children: '\u9009\u62E9\u8D44\u4EA7\u5206\u7C7B',
                              }),
                              assetType === 'text'
                                ? textAssetCategories.map(cat =>
                                    _jsx('option', { value: cat, children: cat }, cat),
                                  )
                                : imageAssetCategories.map(cat =>
                                    _jsx('option', { value: cat, children: cat }, cat),
                                  ),
                            ],
                          }),
                        ],
                      }),
                      _jsxs('div', {
                        children: [
                          _jsx('label', {
                            className: 'text-sm font-medium mb-2 block',
                            children: '\u54C1\u7C7B',
                          }),
                          _jsxs('select', {
                            value: formData.productCategory,
                            onChange: e =>
                              setFormData(prev => ({ ...prev, productCategory: e.target.value })),
                            className: 'w-full p-2 border rounded',
                            disabled: isLoading,
                            children: [
                              _jsx('option', {
                                value: '',
                                children: isLoading
                                  ? '加载中...'
                                  : availableProductCategories.length === 0
                                    ? '暂无品类数据'
                                    : '选择品类',
                              }),
                              availableProductCategories.map(cat =>
                                _jsx('option', { value: cat, children: cat }, cat),
                              ),
                            ],
                          }),
                          _jsxs('p', {
                            className: 'text-xs text-gray-500 mt-1',
                            children: [
                              '\u5173\u8054\u4EA7\u54C1\u5E93\u7684\u54C1\u7C7B\uFF0C\u4FBF\u4E8E\u7B5B\u9009\u548C\u7BA1\u7406 ',
                              availableProductCategories.length > 0 &&
                                `(${availableProductCategories.length}个可选)`,
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  _jsxs('div', {
                    className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
                    children: [
                      _jsxs('div', {
                        children: [
                          _jsx('label', {
                            className: 'text-sm font-medium mb-2 block',
                            children: '\u5B50\u5206\u7C7B',
                          }),
                          _jsxs('select', {
                            value: formData.sub_category,
                            onChange: e =>
                              setFormData(prev => ({ ...prev, sub_category: e.target.value })),
                            className: 'w-full p-2 border rounded',
                            disabled:
                              !formData.asset_category || !subCategoryMap[formData.asset_category],
                            children: [
                              _jsx('option', {
                                value: '',
                                children: '\u9009\u62E9\u5B50\u5206\u7C7B',
                              }),
                              formData.asset_category &&
                                subCategoryMap[formData.asset_category]?.map(sub =>
                                  _jsx('option', { value: sub, children: sub }, sub),
                                ),
                            ],
                          }),
                        ],
                      }),
                      _jsxs('div', {
                        children: [
                          _jsx('label', {
                            className: 'text-sm font-medium mb-2 block',
                            children: '\u54C1\u724C',
                          }),
                          _jsxs('select', {
                            value: formData.brand,
                            onChange: e =>
                              setFormData(prev => ({ ...prev, brand: e.target.value })),
                            className: 'w-full p-2 border rounded',
                            disabled: isLoading,
                            children: [
                              _jsx('option', {
                                value: '',
                                children: isLoading
                                  ? '加载中...'
                                  : availableBrands.length === 0
                                    ? '暂无品牌数据'
                                    : '选择品牌',
                              }),
                              availableBrands.map(b =>
                                _jsx('option', { value: b, children: b }, b),
                              ),
                            ],
                          }),
                          _jsxs('p', {
                            className: 'text-xs text-gray-500 mt-1',
                            children: [
                              '\u5173\u8054\u4EA7\u54C1\u5E93\u7684\u54C1\u724C\uFF0C\u81EA\u52A8\u540C\u6B65\u66F4\u65B0 ',
                              availableBrands.length > 0 && `(${availableBrands.length}个可选)`,
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              assetType === 'text'
                ? _jsx('div', {
                    className: 'space-y-4',
                    children: _jsxs('div', {
                      children: [
                        _jsxs('label', {
                          className: 'text-sm font-medium mb-2 block',
                          children: [
                            '\u8D44\u4EA7\u5185\u5BB9 ',
                            _jsx('span', { className: 'text-red-500', children: '*' }),
                          ],
                        }),
                        _jsx('textarea', {
                          value: formData.content,
                          onChange: e =>
                            setFormData(prev => ({ ...prev, content: e.target.value })),
                          placeholder: '\u8F93\u5165\u6587\u5B57\u8D44\u4EA7\u5185\u5BB9...',
                          className: 'w-full p-2 border rounded min-h-[150px]',
                          rows: 6,
                        }),
                      ],
                    }),
                  })
                : _jsxs('div', {
                    className: 'space-y-4',
                    children: [
                      _jsxs('div', {
                        children: [
                          _jsxs('label', {
                            className: 'text-sm font-medium mb-2 block',
                            children: [
                              '\u56FE\u7247URL ',
                              _jsx('span', { className: 'text-red-500', children: '*' }),
                            ],
                          }),
                          _jsx(Input, {
                            value: formData.url,
                            onChange: e => setFormData(prev => ({ ...prev, url: e.target.value })),
                            placeholder:
                              '\u8F93\u5165\u56FE\u7247\u94FE\u63A5, \u5982: https://example.com/image.jpg',
                            className: 'w-full',
                          }),
                          _jsx('p', {
                            className: 'text-xs text-gray-500 mt-1',
                            children:
                              '\u652F\u6301jpg\u3001png\u3001gif\u3001webp\u7B49\u683C\u5F0F\u3002\u5EFA\u8BAE\u4F7F\u7528\u5728\u7EBF\u56FE\u7247\u94FE\u63A5,\u786E\u4FDD\u53EF\u8BBF\u95EE\u3002',
                          }),
                        ],
                      }),
                      _jsxs('div', {
                        children: [
                          _jsx('label', {
                            className: 'text-sm font-medium mb-2 block',
                            children: '\u56FE\u7247\u7C7B\u578B',
                          }),
                          _jsx('div', {
                            className: 'flex items-center space-x-4',
                            children: ['main', 'scene', 'icon'].map(type =>
                              _jsxs(
                                'label',
                                {
                                  className: 'flex items-center space-x-2 cursor-pointer',
                                  children: [
                                    _jsx('input', {
                                      type: 'radio',
                                      name: 'imageType',
                                      value: type,
                                      checked: formData.type === type,
                                      onChange: () => setFormData(prev => ({ ...prev, type })),
                                    }),
                                    _jsx('span', {
                                      children:
                                        type === 'main'
                                          ? '主图'
                                          : type === 'scene'
                                            ? '场景图'
                                            : '图标',
                                    }),
                                  ],
                                },
                                type,
                              ),
                            ),
                          }),
                        ],
                      }),
                    ],
                  }),
              _jsxs('div', {
                children: [
                  _jsx('label', {
                    className: 'text-sm font-medium mb-2 block',
                    children: '\u6807\u7B7E',
                  }),
                  _jsxs('div', {
                    className: 'flex items-center gap-2',
                    children: [
                      _jsx(Input, {
                        value: newTag,
                        onChange: e => setNewTag(e.target.value),
                        onKeyDown: e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                          }
                        },
                        placeholder:
                          '\u8F93\u5165\u65B0\u6807\u7B7E\u540E\u6309\u56DE\u8F66\u6DFB\u52A0',
                        className: 'flex-1',
                      }),
                      _jsx(Button, {
                        type: 'button',
                        onClick: addTag,
                        variant: 'outline',
                        children: '\u6DFB\u52A0',
                      }),
                    ],
                  }),
                  _jsx('div', {
                    className: 'flex flex-wrap gap-2 mt-3',
                    children: formData.tags.map(tag =>
                      _jsxs(
                        Badge,
                        {
                          variant: 'secondary',
                          className: 'flex items-center gap-1',
                          children: [
                            tag,
                            _jsx('button', {
                              type: 'button',
                              onClick: () => removeTag(tag),
                              className: 'ml-1 text-red-500 hover:text-red-700',
                              children: _jsx(X, { className: 'w-3 h-3' }),
                            }),
                          ],
                        },
                        tag,
                      ),
                    ),
                  }),
                ],
              }),
              _jsxs('div', {
                className: 'flex justify-end items-center space-x-3 pt-4',
                children: [
                  _jsx(Button, {
                    type: 'button',
                    variant: 'ghost',
                    onClick: onCancel,
                    children: '\u53D6\u6D88',
                  }),
                  _jsxs(Button, {
                    type: 'submit',
                    className: 'bg-gradient-to-r from-blue-600 to-purple-600',
                    children: [
                      _jsx(Save, { className: 'w-4 h-4 mr-2' }),
                      '\u4FDD\u5B58\u8D44\u4EA7',
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
      ],
    }),
  });
};
export default AssetForm;
