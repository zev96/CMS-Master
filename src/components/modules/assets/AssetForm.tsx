import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, FileText, Image, Tag, Folder } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { cn } from '../../../lib/utils';
import useAppStore from '../../../stores/useAppStore';
import type { TextAsset, VisualAsset, ProductCategory } from '../../../types';

interface AssetFormProps {
  asset?: TextAsset | VisualAsset;
  assetType: 'text' | 'image';
  onSave: (assetData: any) => void;
  onCancel: () => void;
  className?: string;
}

const AssetForm: React.FC<AssetFormProps> = ({ asset, assetType, onSave, onCancel, className }) => {
  // 从store获取产品数据，用于联通品牌和品类
  const { products, isLoading } = useAppStore(state => ({
    products: state.products,
    isLoading: state.isLoading,
  }));

  const [formData, setFormData] = useState({
    title: '',
    asset_category: '',
    productCategory: '' as ProductCategory | '',
    sub_category: '',
    content: '', // 仅文本素材使用
    url: '', // 仅图片素材使用
    brand: '',
    tags: [] as string[],
    type: 'main' as 'main' | 'scene' | 'icon', // 仅图片素材使用
  });

  const [newTag, setNewTag] = useState('');

  // 从产品库动态获取品牌列表
  const availableBrands = React.useMemo(() => {
    const brands = new Set<string>();
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
  const availableProductCategories: ProductCategory[] = React.useMemo(() => {
    const categories = new Set<ProductCategory>();
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
  const subCategoryMap: Record<string, string[]> = {
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

  const handleSubmit = (e: React.FormEvent) => {
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
      } as Omit<TextAsset, 'id' | 'created_at' | 'updated_at'>;
    } else {
      assetData = {
        ...baseAssetData,
        url: formData.url.trim(),
        type: formData.type,
      } as Omit<VisualAsset, 'id' | 'created_at' | 'updated_at'>;
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

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn('w-full max-w-2xl mx-auto', className)}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {assetType === 'text' ? (
                <FileText className="w-5 h-5" />
              ) : (
                <Image className="w-5 h-5" />
              )}
              <span>
                {asset ? '编辑' : '新建'}
                {assetType === 'text' ? '文本' : '图片'}资产
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  标题 <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="输入素材标题"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    资产分类 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.asset_category}
                    onChange={e => {
                      setFormData(prev => ({
                        ...prev,
                        asset_category: e.target.value,
                        sub_category: '', // 重置子分类
                      }));
                    }}
                    className="w-full p-2 border rounded"
                  >
                    <option value="" disabled>
                      选择资产分类
                    </option>
                    {assetType === 'text'
                      ? textAssetCategories.map(cat => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))
                      : imageAssetCategories.map(cat => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">品类</label>
                  <select
                    value={formData.productCategory}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        productCategory: e.target.value as ProductCategory,
                      }))
                    }
                    className="w-full p-2 border rounded"
                    disabled={isLoading}
                  >
                    <option value="">
                      {isLoading
                        ? '加载中...'
                        : availableProductCategories.length === 0
                          ? '暂无品类数据'
                          : '选择品类'}
                    </option>
                    {availableProductCategories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    关联产品库的品类，便于筛选和管理{' '}
                    {availableProductCategories.length > 0 &&
                      `(${availableProductCategories.length}个可选)`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">子分类</label>
                  <select
                    value={formData.sub_category}
                    onChange={e => setFormData(prev => ({ ...prev, sub_category: e.target.value }))}
                    className="w-full p-2 border rounded"
                    disabled={!formData.asset_category || !subCategoryMap[formData.asset_category]}
                  >
                    <option value="">选择子分类</option>
                    {formData.asset_category &&
                      subCategoryMap[formData.asset_category]?.map(sub => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">品牌</label>
                  <select
                    value={formData.brand}
                    onChange={e => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full p-2 border rounded"
                    disabled={isLoading}
                  >
                    <option value="">
                      {isLoading
                        ? '加载中...'
                        : availableBrands.length === 0
                          ? '暂无品牌数据'
                          : '选择品牌'}
                    </option>
                    {availableBrands.map(b => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    关联产品库的品牌，自动同步更新{' '}
                    {availableBrands.length > 0 && `(${availableBrands.length}个可选)`}
                  </p>
                </div>
              </div>
            </div>

            {/* 条件渲染的字段 */}
            {assetType === 'text' ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    资产内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="输入文字资产内容..."
                    className="w-full p-2 border rounded min-h-[150px]"
                    rows={6}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    图片URL <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.url}
                    onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="输入图片链接, 如: https://example.com/image.jpg"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    支持jpg、png、gif、webp等格式。建议使用在线图片链接,确保可访问。
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">图片类型</label>
                  <div className="flex items-center space-x-4">
                    {(['main', 'scene', 'icon'] as const).map(type => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="imageType"
                          value={type}
                          checked={formData.type === type}
                          onChange={() => setFormData(prev => ({ ...prev, type }))}
                        />
                        <span>
                          {type === 'main' ? '主图' : type === 'scene' ? '场景图' : '图标'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 标签管理 */}
            <div>
              <label className="text-sm font-medium mb-2 block">标签</label>
              <div className="flex items-center gap-2">
                <Input
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="输入新标签后按回车添加"
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} variant="outline">
                  添加
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* 表单操作按钮 */}
            <div className="flex justify-end items-center space-x-3 pt-4">
              <Button type="button" variant="ghost" onClick={onCancel}>
                取消
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Save className="w-4 h-4 mr-2" />
                保存资产
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AssetForm;
