import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  X,
  Plus,
  Trash2,
  Package,
  Settings,
  Star,
  Info,
  Sparkles,
  ArrowLeft,
  Check,
  Edit,
  XCircle,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { cn } from '../../../lib/utils';
const tabs = [
  {
    key: 'basic',
    label: '基本参数',
    icon: Info,
    description: '产品的基础信息',
  },
  {
    key: 'parameters',
    label: '产品参数',
    icon: Settings,
    description: '自定义产品技术参数',
  },
  {
    key: 'features',
    label: '产品特性',
    icon: Sparkles,
    description: '产品的亮点特性',
  },
];
const productCategories = [
  '吸尘器',
  '宠物空气净化器',
  '猫砂盆',
  '猫粮',
  '空气净化器',
  '冻干',
  '猫罐头',
];
const ProductForm = ({ product, onSave, onCancel, className }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    basicInfo: {
      brand: '',
      modelName: '',
      price: 0,
      category: '吸尘器',
      description: '',
    },
    parameters: {},
    features: [],
  });
  // 参数和特性的临时输入状态
  const [newParamKey, setNewParamKey] = useState('');
  const [newParamValue, setNewParamValue] = useState('');
  const [newFeature, setNewFeature] = useState('');
  // 参数编辑状态
  const [editingParam, setEditingParam] = useState(null);
  const [editParamValue, setEditParamValue] = useState('');
  // 特性编辑状态
  const [editingFeature, setEditingFeature] = useState(null);
  const [editFeatureValue, setEditFeatureValue] = useState('');
  // 初始化表单数据
  useEffect(() => {
    if (product) {
      setFormData({
        basicInfo: { ...product.basicInfo },
        parameters: { ...product.parameters },
        features: [...product.features],
      });
    }
  }, [product]);
  // 更新基本信息
  const updateBasicInfo = (field, value) => {
    setFormData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [field]: value,
      },
    }));
  };
  // 添加产品参数
  const addParameter = () => {
    if (newParamKey.trim() && newParamValue.trim()) {
      setFormData(prev => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          [newParamKey.trim()]: isNaN(Number(newParamValue))
            ? newParamValue.trim()
            : Number(newParamValue),
        },
      }));
      setNewParamKey('');
      setNewParamValue('');
    }
  };
  // 删除产品参数
  const removeParameter = key => {
    setFormData(prev => {
      const newParams = { ...prev.parameters };
      delete newParams[key];
      return {
        ...prev,
        parameters: newParams,
      };
    });
  };
  // 开始编辑参数
  const startEditParameter = (key, value) => {
    setEditingParam(key);
    setEditParamValue(String(value));
  };
  // 保存参数编辑
  const saveParameterEdit = () => {
    if (editingParam && editParamValue.trim()) {
      setFormData(prev => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          [editingParam]: isNaN(Number(editParamValue))
            ? editParamValue.trim()
            : Number(editParamValue),
        },
      }));
      setEditingParam(null);
      setEditParamValue('');
    }
  };
  // 取消参数编辑
  const cancelParameterEdit = () => {
    setEditingParam(null);
    setEditParamValue('');
  };
  // 添加产品特性
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };
  // 删除产品特性
  const removeFeature = index => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };
  // 开始编辑特性
  const startEditFeature = (index, value) => {
    setEditingFeature(index);
    setEditFeatureValue(value);
  };
  // 保存特性编辑
  const saveFeatureEdit = () => {
    if (editingFeature !== null && editFeatureValue.trim()) {
      setFormData(prev => ({
        ...prev,
        features: prev.features.map((feature, index) =>
          index === editingFeature ? editFeatureValue.trim() : feature,
        ),
      }));
      setEditingFeature(null);
      setEditFeatureValue('');
    }
  };
  // 取消特性编辑
  const cancelFeatureEdit = () => {
    setEditingFeature(null);
    setEditFeatureValue('');
  };
  // 表单验证
  const validateForm = () => {
    const { basicInfo } = formData;
    return !!(
      basicInfo.brand?.trim() &&
      basicInfo.modelName?.trim() &&
      basicInfo.price > 0 &&
      basicInfo.description?.trim()
    );
  };
  // 提交表单
  const handleSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };
  // 渲染基本参数页面
  const renderBasicTab = () =>
    _jsxs(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      className: 'space-y-6',
      children: [
        _jsxs('div', {
          className: 'grid grid-cols-1 md:grid-cols-2 gap-6',
          children: [
            _jsxs('div', {
              className: 'space-y-2',
              children: [
                _jsx('label', {
                  className: 'text-sm font-medium text-gray-700',
                  children: '\u54C1\u724C *',
                }),
                _jsx(Input, {
                  value: formData.basicInfo.brand,
                  onChange: e => updateBasicInfo('brand', e.target.value),
                  placeholder: '\u8BF7\u8F93\u5165\u54C1\u724C\u540D\u79F0',
                  className: 'h-11',
                }),
              ],
            }),
            _jsxs('div', {
              className: 'space-y-2',
              children: [
                _jsx('label', {
                  className: 'text-sm font-medium text-gray-700',
                  children: '\u578B\u53F7 *',
                }),
                _jsx(Input, {
                  value: formData.basicInfo.modelName,
                  onChange: e => updateBasicInfo('modelName', e.target.value),
                  placeholder: '\u8BF7\u8F93\u5165\u4EA7\u54C1\u578B\u53F7',
                  className: 'h-11',
                }),
              ],
            }),
            _jsxs('div', {
              className: 'space-y-2',
              children: [
                _jsx('label', {
                  className: 'text-sm font-medium text-gray-700',
                  children: '\u4EF7\u683C *',
                }),
                _jsx(Input, {
                  type: 'number',
                  value: formData.basicInfo.price,
                  onChange: e => updateBasicInfo('price', Number(e.target.value)),
                  placeholder: '\u8BF7\u8F93\u5165\u4EF7\u683C',
                  className: 'h-11',
                  min: '0',
                  step: '0.01',
                }),
              ],
            }),
            _jsxs('div', {
              className: 'space-y-2',
              children: [
                _jsx('label', {
                  className: 'text-sm font-medium text-gray-700',
                  children: '\u54C1\u7C7B *',
                }),
                _jsxs(Select, {
                  value: formData.basicInfo.category,
                  onValueChange: value => updateBasicInfo('category', value),
                  children: [
                    _jsx(SelectTrigger, {
                      className: 'h-11',
                      children: _jsx(SelectValue, { placeholder: '\u9009\u62E9\u54C1\u7C7B' }),
                    }),
                    _jsx(SelectContent, {
                      children: productCategories.map(category =>
                        _jsx(SelectItem, { value: category, children: category }, category),
                      ),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        _jsxs('div', {
          className: 'space-y-2',
          children: [
            _jsx('label', {
              className: 'text-sm font-medium text-gray-700',
              children: '\u4EA7\u54C1\u63CF\u8FF0 *',
            }),
            _jsx('textarea', {
              value: formData.basicInfo.description,
              onChange: e => updateBasicInfo('description', e.target.value),
              placeholder: '\u8BF7\u8F93\u5165\u4EA7\u54C1\u63CF\u8FF0',
              className:
                'w-full min-h-[120px] p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent',
            }),
          ],
        }),
      ],
    });
  // 渲染产品参数页面
  const renderParametersTab = () =>
    _jsxs(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      className: 'space-y-6',
      children: [
        _jsxs('div', {
          className:
            'bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200',
          children: [
            _jsx('h3', {
              className: 'font-medium text-blue-900 mb-2',
              children: '\u6DFB\u52A0\u81EA\u5B9A\u4E49\u53C2\u6570',
            }),
            _jsxs('div', {
              className: 'grid grid-cols-1 md:grid-cols-3 gap-3',
              children: [
                _jsx(Input, {
                  value: newParamKey,
                  onChange: e => setNewParamKey(e.target.value),
                  placeholder: '\u53C2\u6570\u540D\u79F0',
                  className: 'h-10',
                }),
                _jsx(Input, {
                  value: newParamValue,
                  onChange: e => setNewParamValue(e.target.value),
                  placeholder: '\u53C2\u6570\u503C',
                  className: 'h-10',
                }),
                _jsxs(Button, {
                  type: 'button',
                  onClick: addParameter,
                  disabled: !newParamKey.trim() || !newParamValue.trim(),
                  className: 'h-10 gradient-primary',
                  children: [_jsx(Plus, { className: 'w-4 h-4 mr-2' }), '\u6DFB\u52A0\u53C2\u6570'],
                }),
              ],
            }),
          ],
        }),
        _jsxs('div', {
          className: 'space-y-3',
          children: [
            _jsx('h3', {
              className: 'font-medium text-gray-900',
              children: '\u5DF2\u6DFB\u52A0\u7684\u53C2\u6570',
            }),
            Object.keys(formData.parameters).length === 0
              ? _jsxs('div', {
                  className: 'text-center py-8 text-gray-500',
                  children: [
                    _jsx(Settings, { className: 'w-12 h-12 mx-auto mb-2 text-gray-300' }),
                    _jsx('p', {
                      children: '\u8FD8\u6CA1\u6709\u6DFB\u52A0\u4EFB\u4F55\u53C2\u6570',
                    }),
                    _jsx('p', {
                      className: 'text-sm',
                      children:
                        '\u4F7F\u7528\u4E0A\u65B9\u7684\u8868\u5355\u6DFB\u52A0\u4EA7\u54C1\u53C2\u6570',
                    }),
                  ],
                })
              : _jsx('div', {
                  className: 'grid grid-cols-1 gap-3',
                  children: Object.entries(formData.parameters).map(([key, value]) =>
                    _jsx(
                      motion.div,
                      {
                        initial: { opacity: 0, scale: 0.9 },
                        animate: { opacity: 1, scale: 1 },
                        className: 'p-4 bg-white border border-gray-200 rounded-lg card-hover',
                        children:
                          editingParam === key
                            ? // 编辑模式
                              _jsxs('div', {
                                className: 'space-y-3',
                                children: [
                                  _jsxs('div', {
                                    className: 'flex items-center space-x-2',
                                    children: [
                                      _jsx('div', {
                                        className:
                                          'font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md border',
                                        children: key,
                                      }),
                                      _jsx('span', {
                                        className: 'text-gray-400',
                                        children: '\u2192',
                                      }),
                                      _jsx(Input, {
                                        value: editParamValue,
                                        onChange: e => setEditParamValue(e.target.value),
                                        placeholder: '\u8F93\u5165\u65B0\u7684\u53C2\u6570\u503C',
                                        className: 'flex-1',
                                        autoFocus: true,
                                        onKeyPress: e => {
                                          if (e.key === 'Enter') {
                                            saveParameterEdit();
                                          } else if (e.key === 'Escape') {
                                            cancelParameterEdit();
                                          }
                                        },
                                      }),
                                    ],
                                  }),
                                  _jsxs('div', {
                                    className: 'flex items-center space-x-2',
                                    children: [
                                      _jsxs(Button, {
                                        type: 'button',
                                        size: 'sm',
                                        onClick: saveParameterEdit,
                                        disabled: !editParamValue.trim(),
                                        className: 'gradient-success',
                                        children: [
                                          _jsx(Check, { className: 'w-4 h-4 mr-1' }),
                                          '\u4FDD\u5B58',
                                        ],
                                      }),
                                      _jsxs(Button, {
                                        type: 'button',
                                        variant: 'outline',
                                        size: 'sm',
                                        onClick: cancelParameterEdit,
                                        children: [
                                          _jsx(XCircle, { className: 'w-4 h-4 mr-1' }),
                                          '\u53D6\u6D88',
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              })
                            : // 显示模式
                              _jsxs('div', {
                                className: 'flex items-center justify-between',
                                children: [
                                  _jsxs('div', {
                                    className: 'flex-1',
                                    children: [
                                      _jsx('div', {
                                        className: 'font-medium text-gray-900 mb-1',
                                        children: key,
                                      }),
                                      _jsx('div', {
                                        className:
                                          'text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md inline-block',
                                        children: value,
                                      }),
                                    ],
                                  }),
                                  _jsxs('div', {
                                    className: 'flex items-center space-x-1 ml-4',
                                    children: [
                                      _jsx(Button, {
                                        type: 'button',
                                        variant: 'ghost',
                                        size: 'sm',
                                        onClick: () => startEditParameter(key, value),
                                        className:
                                          'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
                                        title: '\u7F16\u8F91\u53C2\u6570',
                                        children: _jsx(Edit, { className: 'w-4 h-4' }),
                                      }),
                                      _jsx(Button, {
                                        type: 'button',
                                        variant: 'ghost',
                                        size: 'sm',
                                        onClick: () => removeParameter(key),
                                        className:
                                          'text-red-600 hover:text-red-700 hover:bg-red-50',
                                        title: '\u5220\u9664\u53C2\u6570',
                                        children: _jsx(Trash2, { className: 'w-4 h-4' }),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                      },
                      key,
                    ),
                  ),
                }),
          ],
        }),
      ],
    });
  // 渲染产品特性页面
  const renderFeaturesTab = () =>
    _jsxs(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      className: 'space-y-6',
      children: [
        _jsxs('div', {
          className:
            'bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200',
          children: [
            _jsx('h3', {
              className: 'font-medium text-green-900 mb-2',
              children: '\u6DFB\u52A0\u4EA7\u54C1\u7279\u6027',
            }),
            _jsxs('div', {
              className: 'flex gap-3',
              children: [
                _jsx(Input, {
                  value: newFeature,
                  onChange: e => setNewFeature(e.target.value),
                  placeholder: '\u8F93\u5165\u4EA7\u54C1\u7279\u6027',
                  className: 'h-10 flex-1',
                  onKeyPress: e => e.key === 'Enter' && addFeature(),
                }),
                _jsxs(Button, {
                  type: 'button',
                  onClick: addFeature,
                  disabled: !newFeature.trim(),
                  className: 'h-10 gradient-success',
                  children: [_jsx(Plus, { className: 'w-4 h-4 mr-2' }), '\u6DFB\u52A0\u7279\u6027'],
                }),
              ],
            }),
          ],
        }),
        _jsxs('div', {
          className: 'space-y-3',
          children: [
            _jsx('h3', {
              className: 'font-medium text-gray-900',
              children: '\u4EA7\u54C1\u7279\u6027\u5217\u8868',
            }),
            formData.features.length === 0
              ? _jsxs('div', {
                  className: 'text-center py-8 text-gray-500',
                  children: [
                    _jsx(Star, { className: 'w-12 h-12 mx-auto mb-2 text-gray-300' }),
                    _jsx('p', {
                      children: '\u8FD8\u6CA1\u6709\u6DFB\u52A0\u4EFB\u4F55\u7279\u6027',
                    }),
                    _jsx('p', {
                      className: 'text-sm',
                      children:
                        '\u6DFB\u52A0\u4EA7\u54C1\u7684\u4EAE\u70B9\u548C\u7279\u8272\u529F\u80FD',
                    }),
                  ],
                })
              : _jsx('div', {
                  className: 'space-y-2',
                  children: formData.features.map((feature, index) =>
                    _jsx(
                      motion.div,
                      {
                        initial: { opacity: 0, x: -20 },
                        animate: { opacity: 1, x: 0 },
                        className: 'p-4 bg-white border border-gray-200 rounded-lg card-hover',
                        children:
                          editingFeature === index
                            ? // 编辑模式
                              _jsxs('div', {
                                className: 'space-y-3',
                                children: [
                                  _jsxs('div', {
                                    className: 'flex items-center space-x-2',
                                    children: [
                                      _jsx('div', {
                                        className: 'w-2 h-2 bg-gradient-primary rounded-full',
                                      }),
                                      _jsx(Input, {
                                        value: editFeatureValue,
                                        onChange: e => setEditFeatureValue(e.target.value),
                                        placeholder: '\u8F93\u5165\u4EA7\u54C1\u7279\u6027',
                                        className: 'flex-1',
                                        autoFocus: true,
                                        onKeyPress: e => {
                                          if (e.key === 'Enter') {
                                            saveFeatureEdit();
                                          } else if (e.key === 'Escape') {
                                            cancelFeatureEdit();
                                          }
                                        },
                                      }),
                                    ],
                                  }),
                                  _jsxs('div', {
                                    className: 'flex items-center space-x-2',
                                    children: [
                                      _jsxs(Button, {
                                        type: 'button',
                                        size: 'sm',
                                        onClick: saveFeatureEdit,
                                        disabled: !editFeatureValue.trim(),
                                        className: 'gradient-success',
                                        children: [
                                          _jsx(Check, { className: 'w-4 h-4 mr-1' }),
                                          '\u4FDD\u5B58',
                                        ],
                                      }),
                                      _jsxs(Button, {
                                        type: 'button',
                                        variant: 'outline',
                                        size: 'sm',
                                        onClick: cancelFeatureEdit,
                                        children: [
                                          _jsx(XCircle, { className: 'w-4 h-4 mr-1' }),
                                          '\u53D6\u6D88',
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              })
                            : // 显示模式
                              _jsxs('div', {
                                className: 'flex items-center justify-between',
                                children: [
                                  _jsxs('div', {
                                    className: 'flex items-center flex-1',
                                    children: [
                                      _jsx('div', {
                                        className: 'w-2 h-2 bg-gradient-primary rounded-full mr-3',
                                      }),
                                      _jsx('span', {
                                        className: 'text-gray-900',
                                        children: feature,
                                      }),
                                    ],
                                  }),
                                  _jsxs('div', {
                                    className: 'flex items-center space-x-1 ml-4',
                                    children: [
                                      _jsx(Button, {
                                        type: 'button',
                                        variant: 'ghost',
                                        size: 'sm',
                                        onClick: () => startEditFeature(index, feature),
                                        className:
                                          'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
                                        title: '\u7F16\u8F91\u7279\u6027',
                                        children: _jsx(Edit, { className: 'w-4 h-4' }),
                                      }),
                                      _jsx(Button, {
                                        type: 'button',
                                        variant: 'ghost',
                                        size: 'sm',
                                        onClick: () => removeFeature(index),
                                        className:
                                          'text-red-600 hover:text-red-700 hover:bg-red-50',
                                        title: '\u5220\u9664\u7279\u6027',
                                        children: _jsx(Trash2, { className: 'w-4 h-4' }),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                      },
                      index,
                    ),
                  ),
                }),
          ],
        }),
      ],
    });
  return _jsx('div', {
    className: cn('max-w-4xl mx-auto', className),
    children: _jsxs(Card, {
      className: 'shadow-xl border-0 overflow-hidden',
      children: [
        _jsx(CardHeader, {
          className: 'gradient-primary text-white',
          children: _jsxs('div', {
            className: 'flex items-center justify-between',
            children: [
              _jsxs('div', {
                children: [
                  _jsxs(CardTitle, {
                    className: 'text-xl font-bold flex items-center',
                    children: [
                      _jsx(Package, { className: 'w-6 h-6 mr-2' }),
                      product ? '编辑产品' : '新建产品',
                    ],
                  }),
                  _jsx('p', {
                    className: 'text-blue-100 mt-1',
                    children: product ? '修改产品信息' : '创建新的产品档案',
                  }),
                ],
              }),
              _jsx(Button, {
                type: 'button',
                variant: 'ghost',
                size: 'sm',
                onClick: onCancel,
                className: 'text-white hover:bg-white/20',
                children: _jsx(X, { className: 'w-5 h-5' }),
              }),
            ],
          }),
        }),
        _jsx('div', {
          className: 'border-b border-gray-200 bg-gray-50',
          children: _jsx('div', {
            className: 'flex',
            children: tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return _jsxs(
                'button',
                {
                  onClick: () => setActiveTab(tab.key),
                  className: cn(
                    'flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-white text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                  ),
                  children: [
                    _jsx(Icon, { className: 'w-4 h-4 mr-2' }),
                    _jsxs('div', {
                      className: 'text-left',
                      children: [
                        _jsx('div', { children: tab.label }),
                        _jsx('div', {
                          className: 'text-xs text-gray-500',
                          children: tab.description,
                        }),
                      ],
                    }),
                  ],
                },
                tab.key,
              );
            }),
          }),
        }),
        _jsx(CardContent, {
          className: 'p-6',
          children: _jsxs('form', {
            onSubmit: handleSubmit,
            children: [
              _jsxs(AnimatePresence, {
                mode: 'wait',
                children: [
                  activeTab === 'basic' && renderBasicTab(),
                  activeTab === 'parameters' && renderParametersTab(),
                  activeTab === 'features' && renderFeaturesTab(),
                ],
              }),
              _jsxs('div', {
                className: 'flex items-center justify-between mt-8 pt-6 border-t border-gray-200',
                children: [
                  _jsxs(Button, {
                    type: 'button',
                    variant: 'outline',
                    onClick: onCancel,
                    className: 'flex items-center',
                    children: [_jsx(ArrowLeft, { className: 'w-4 h-4 mr-2' }), '\u53D6\u6D88'],
                  }),
                  _jsxs('div', {
                    className: 'flex items-center space-x-3',
                    children: [
                      validateForm()
                        ? _jsxs('div', {
                            className: 'flex items-center text-green-600 text-sm',
                            children: [
                              _jsx(Check, { className: 'w-4 h-4 mr-1' }),
                              '\u8868\u5355\u9A8C\u8BC1\u901A\u8FC7',
                            ],
                          })
                        : _jsx('div', {
                            className: 'text-red-600 text-sm',
                            children: '\u8BF7\u5B8C\u5584\u5FC5\u586B\u4FE1\u606F',
                          }),
                      _jsxs(Button, {
                        type: 'submit',
                        disabled: !validateForm(),
                        className: 'gradient-primary px-6',
                        children: [
                          _jsx(Save, { className: 'w-4 h-4 mr-2' }),
                          product ? '更新产品' : '创建产品',
                        ],
                      }),
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
export default ProductForm;
