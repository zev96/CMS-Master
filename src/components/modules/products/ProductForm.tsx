import React, { useState, useEffect } from 'react';
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
import { Badge } from '../../ui/badge';
import { cn } from '../../../lib/utils';
import type {
  Product,
  ProductFormData,
  BasicInfo,
  ProductParameters,
  ProductCategory,
} from '../../../types';

interface ProductFormProps {
  product?: Product;
  onSave: (data: ProductFormData) => void;
  onCancel: () => void;
  className?: string;
}

type TabKey = 'basic' | 'parameters' | 'features';

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const tabs: Tab[] = [
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

const productCategories: ProductCategory[] = [
  '吸尘器',
  '宠物空气净化器',
  '猫砂盆',
  '猫粮',
  '空气净化器',
  '冻干',
  '猫罐头',
];

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel, className }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('basic');
  const [formData, setFormData] = useState<ProductFormData>({
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
  const [editingParam, setEditingParam] = useState<string | null>(null);
  const [editParamValue, setEditParamValue] = useState('');

  // 特性编辑状态
  const [editingFeature, setEditingFeature] = useState<number | null>(null);
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
  const updateBasicInfo = (field: keyof BasicInfo, value: any) => {
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
  const removeParameter = (key: string) => {
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
  const startEditParameter = (key: string, value: string | number) => {
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
  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // 开始编辑特性
  const startEditFeature = (index: number, value: string) => {
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
  const validateForm = (): boolean => {
    const { basicInfo } = formData;
    return !!(
      basicInfo.brand?.trim() &&
      basicInfo.modelName?.trim() &&
      basicInfo.price > 0 &&
      basicInfo.description?.trim()
    );
  };

  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  // 渲染基本参数页面
  const renderBasicTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">品牌 *</label>
          <Input
            value={formData.basicInfo.brand}
            onChange={e => updateBasicInfo('brand', e.target.value)}
            placeholder="请输入品牌名称"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">型号 *</label>
          <Input
            value={formData.basicInfo.modelName}
            onChange={e => updateBasicInfo('modelName', e.target.value)}
            placeholder="请输入产品型号"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">价格 *</label>
          <Input
            type="number"
            value={formData.basicInfo.price}
            onChange={e => updateBasicInfo('price', Number(e.target.value))}
            placeholder="请输入价格"
            className="h-11"
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">品类 *</label>
          <Select
            value={formData.basicInfo.category}
            onValueChange={(value: ProductCategory) => updateBasicInfo('category', value)}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="选择品类" />
            </SelectTrigger>
            <SelectContent>
              {productCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">产品描述 *</label>
        <textarea
          value={formData.basicInfo.description}
          onChange={e => updateBasicInfo('description', e.target.value)}
          placeholder="请输入产品描述"
          className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
    </motion.div>
  );

  // 渲染产品参数页面
  const renderParametersTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">添加自定义参数</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            value={newParamKey}
            onChange={e => setNewParamKey(e.target.value)}
            placeholder="参数名称"
            className="h-10"
          />
          <Input
            value={newParamValue}
            onChange={e => setNewParamValue(e.target.value)}
            placeholder="参数值"
            className="h-10"
          />
          <Button
            type="button"
            onClick={addParameter}
            disabled={!newParamKey.trim() || !newParamValue.trim()}
            className="h-10 gradient-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加参数
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">已添加的参数</h3>
        {Object.keys(formData.parameters).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>还没有添加任何参数</p>
            <p className="text-sm">使用上方的表单添加产品参数</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(formData.parameters).map(([key, value]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-white border border-gray-200 rounded-lg card-hover"
              >
                {editingParam === key ? (
                  // 编辑模式
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
                        {key}
                      </div>
                      <span className="text-gray-400">→</span>
                      <Input
                        value={editParamValue}
                        onChange={e => setEditParamValue(e.target.value)}
                        placeholder="输入新的参数值"
                        className="flex-1"
                        autoFocus
                        onKeyPress={e => {
                          if (e.key === 'Enter') {
                            saveParameterEdit();
                          } else if (e.key === 'Escape') {
                            cancelParameterEdit();
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={saveParameterEdit}
                        disabled={!editParamValue.trim()}
                        className="gradient-success"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        保存
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={cancelParameterEdit}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        取消
                      </Button>
                    </div>
                  </div>
                ) : (
                  // 显示模式
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">{key}</div>
                      <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md inline-block">
                        {value}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditParameter(key, value)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="编辑参数"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeParameter(key)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="删除参数"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  // 渲染产品特性页面
  const renderFeaturesTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
        <h3 className="font-medium text-green-900 mb-2">添加产品特性</h3>
        <div className="flex gap-3">
          <Input
            value={newFeature}
            onChange={e => setNewFeature(e.target.value)}
            placeholder="输入产品特性"
            className="h-10 flex-1"
            onKeyPress={e => e.key === 'Enter' && addFeature()}
          />
          <Button
            type="button"
            onClick={addFeature}
            disabled={!newFeature.trim()}
            className="h-10 gradient-success"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加特性
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">产品特性列表</h3>
        {formData.features.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>还没有添加任何特性</p>
            <p className="text-sm">添加产品的亮点和特色功能</p>
          </div>
        ) : (
          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-white border border-gray-200 rounded-lg card-hover"
              >
                {editingFeature === index ? (
                  // 编辑模式
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                      <Input
                        value={editFeatureValue}
                        onChange={e => setEditFeatureValue(e.target.value)}
                        placeholder="输入产品特性"
                        className="flex-1"
                        autoFocus
                        onKeyPress={e => {
                          if (e.key === 'Enter') {
                            saveFeatureEdit();
                          } else if (e.key === 'Escape') {
                            cancelFeatureEdit();
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={saveFeatureEdit}
                        disabled={!editFeatureValue.trim()}
                        className="gradient-success"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        保存
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={cancelFeatureEdit}>
                        <XCircle className="w-4 h-4 mr-1" />
                        取消
                      </Button>
                    </div>
                  </div>
                ) : (
                  // 显示模式
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-2 h-2 bg-gradient-primary rounded-full mr-3"></div>
                      <span className="text-gray-900">{feature}</span>
                    </div>
                    <div className="flex items-center space-x-1 ml-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditFeature(index, feature)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="编辑特性"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="删除特性"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <Card className="shadow-xl border-0 overflow-hidden">
        {/* 头部 */}
        <CardHeader className="gradient-primary text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center">
                <Package className="w-6 h-6 mr-2" />
                {product ? '编辑产品' : '新建产品'}
              </CardTitle>
              <p className="text-blue-100 mt-1">{product ? '修改产品信息' : '创建新的产品档案'}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        {/* 选项卡导航 */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-white text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <div>{tab.label}</div>
                    <div className="text-xs text-gray-500">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 表单内容 */}
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {activeTab === 'basic' && renderBasicTab()}
              {activeTab === 'parameters' && renderParametersTab()}
              {activeTab === 'features' && renderFeaturesTab()}
            </AnimatePresence>

            {/* 底部操作按钮 */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                取消
              </Button>

              <div className="flex items-center space-x-3">
                {/* 表单验证状态指示 */}
                {validateForm() ? (
                  <div className="flex items-center text-green-600 text-sm">
                    <Check className="w-4 h-4 mr-1" />
                    表单验证通过
                  </div>
                ) : (
                  <div className="text-red-600 text-sm">请完善必填信息</div>
                )}

                <Button type="submit" disabled={!validateForm()} className="gradient-primary px-6">
                  <Save className="w-4 h-4 mr-2" />
                  {product ? '更新产品' : '创建产品'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
