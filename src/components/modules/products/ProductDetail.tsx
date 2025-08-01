import React from 'react';
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
import type { Product } from '../../../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  onEdit,
  onDelete,
  className,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
    }).format(price);
  };

  const getBrandColor = (brand: string) => {
    const brandColors: Record<string, string> = {
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

  const getCategoryIcon = (category: string) => {
    const categoryIcons: Record<string, React.ReactNode> = {
      吸尘器: <Zap className="w-5 h-5" />,
      宠物空气净化器: <Shield className="w-5 h-5" />,
      空气净化器: <Shield className="w-5 h-5" />,
      猫砂盆: <Package className="w-5 h-5" />,
      猫粮: <Heart className="w-5 h-5" />,
      冻干: <Star className="w-5 h-5" />,
      猫罐头: <Package className="w-5 h-5" />,
    };
    return categoryIcons[category] || <Package className="w-5 h-5" />;
  };

  const handleCopyProduct = () => {
    const productInfo = `${product.basicInfo.brand} ${product.basicInfo.modelName} - ${formatPrice(product.basicInfo.price)}`;
    navigator.clipboard.writeText(productInfo);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={cn('w-full max-w-none space-y-8', className)}>
      {/* 顶部操作栏 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center space-x-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回产品列表</span>
        </Button>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleCopyProduct}>
            <Copy className="w-4 h-4 mr-2" />
            复制信息
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            分享
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            编辑
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            删除
          </Button>
        </div>
      </motion.div>

      {/* 产品头部信息 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-0 shadow-xl">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4 flex-1">
                <div className="flex items-center space-x-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg',
                      getBrandColor(product.basicInfo.brand),
                    )}
                  >
                    {getCategoryIcon(product.basicInfo.category)}
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {product.basicInfo.modelName}
                    </h1>
                    <div className="flex items-center space-x-3 mt-2">
                      <Badge
                        variant="secondary"
                        className={cn(
                          'bg-gradient-to-r text-white border-0 shadow-sm',
                          getBrandColor(product.basicInfo.brand),
                        )}
                      >
                        {product.basicInfo.brand}
                      </Badge>
                      <Badge variant="outline" className="bg-white/80">
                        {product.basicInfo.category}
                      </Badge>
                    </div>
                  </div>
                </div>

                {product.basicInfo.description && (
                  <div className="bg-white/60 rounded-lg p-4 border border-white/50">
                    <p className="text-gray-700 leading-relaxed">{product.basicInfo.description}</p>
                  </div>
                )}
              </div>

              <div className="text-right ml-8">
                <div className="bg-white/80 rounded-xl p-6 shadow-lg border border-white/50">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {formatPrice(product.basicInfo.price)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">参考价格</div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* 详细信息网格 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* 基本信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-700">
                <Info className="w-5 h-5" />
                <span>基本参数</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-sm font-medium text-gray-600">品牌</span>
                  <span className="font-semibold text-gray-900">{product.basicInfo.brand}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-sm font-medium text-gray-600">型号</span>
                  <span className="font-semibold text-gray-900">{product.basicInfo.modelName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-sm font-medium text-gray-600">品类</span>
                  <span className="font-semibold text-gray-900">{product.basicInfo.category}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">价格</span>
                  <span className="font-bold text-blue-600">
                    {formatPrice(product.basicInfo.price)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-500 pt-4 border-t border-blue-100">
                <Calendar className="w-4 h-4" />
                <span>创建于 {formatDate(product.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 产品参数 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1 xl:col-span-2"
        >
          <Card className="h-full bg-gradient-to-br from-white to-green-50/50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <Settings className="w-5 h-5" />
                <span>产品参数</span>
                <Badge variant="outline" className="ml-auto">
                  {Object.keys(product.parameters).length} 项参数
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(product.parameters).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.parameters).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white/60 rounded-lg p-3 border border-green-100"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">{key}</span>
                        <span className="font-semibold text-gray-900">
                          {typeof value === 'number' ? value.toLocaleString() : value}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">暂无产品参数</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={onEdit}>
                    <Settings className="w-4 h-4 mr-2" />
                    添加参数
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 产品特性 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 xl:col-span-3"
        >
          <Card className="bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-purple-700">
                <Star className="w-5 h-5" />
                <span>产品特性</span>
                <Badge variant="outline" className="ml-auto">
                  {product.features.length} 项特性
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.features.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white/60 rounded-lg p-4 border border-purple-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 mt-2 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-800 leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">暂无产品特性</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={onEdit}>
                    <Star className="w-4 h-4 mr-2" />
                    添加特性
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 操作统计和快捷操作 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">最后更新: {formatDate(product.updatedAt)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">产品ID: {product.id}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  添加到对比
                </Button>
                <Button variant="outline" size="sm">
                  <Tag className="w-4 h-4 mr-2" />
                  生成内容
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
