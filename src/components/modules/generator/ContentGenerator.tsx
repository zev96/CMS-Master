import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Settings,
  RefreshCw,
  FileText,
  CheckCircle,
  AlertCircle,
  Wand2,
  Target,
  Lightbulb,
  Database,
  ArrowRight,
  Save,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { cn } from '../../../lib/utils';
import useAppStore from '../../../stores/useAppStore';
import type { Template, Product, ArticleContent } from '../../../types';

interface GenerationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}

interface GenerationConfig {
  templateId: string;
  selectedProducts: string[];
  targetAudience: 'general' | 'expert' | 'beginner';
  articleLength: 'short' | 'medium' | 'long';
  tone: 'professional' | 'casual' | 'technical';
  includeComparison: boolean;
  includePricing: boolean;
  includeSpecs: boolean;
}

const ContentGenerator: React.FC = () => {
  const { templates, products, actions } = useAppStore();
  const [config, setConfig] = useState<GenerationConfig>({
    templateId: '',
    selectedProducts: [],
    targetAudience: 'general',
    articleLength: 'medium',
    tone: 'professional',
    includeComparison: false,
    includePricing: true,
    includeSpecs: true,
  });

  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<Partial<ArticleContent> | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // 初始化生成步骤
  useEffect(() => {
    const selectedTemplate = templates.find(t => t.id === config.templateId);
    if (selectedTemplate) {
      const steps: GenerationStep[] = [
        {
          id: 'analyze',
          title: '分析产品数据',
          description: '提取产品特性和关键信息',
          status: 'pending',
          progress: 0,
        },
        {
          id: 'structure',
          title: '构建文章结构',
          description: '基于模板创建章节框架',
          status: 'pending',
          progress: 0,
        },
        ...selectedTemplate.structure.map(section => ({
          id: `content-${section.id}`,
          title: `生成：${section.title}`,
          description: `为"${section.title}"章节生成内容`,
          status: 'pending' as const,
          progress: 0,
        })),
        {
          id: 'optimize',
          title: '内容优化',
          description: '调整语言风格和结构',
          status: 'pending',
          progress: 0,
        },
        {
          id: 'finalize',
          title: '生成完成',
          description: '文章生成完毕，可以编辑',
          status: 'pending',
          progress: 0,
        },
      ];
      setGenerationSteps(steps);
    }
  }, [config.templateId, templates]);

  // 开始生成内容
  const startGeneration = async () => {
    if (!config.templateId || config.selectedProducts.length === 0) {
      alert('请选择模板和产品');
      return;
    }

    setIsGenerating(true);
    setCurrentStep(0);

    try {
      // 模拟生成过程
      for (let i = 0; i < generationSteps.length; i++) {
        setCurrentStep(i);

        // 更新当前步骤状态
        setGenerationSteps(prev =>
          prev.map((step, index) =>
            index === i
              ? { ...step, status: 'processing', progress: 0 }
              : index < i
                ? { ...step, status: 'completed', progress: 100 }
                : step,
          ),
        );

        // 模拟进度更新
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setGenerationSteps(prev =>
            prev.map((step, index) => (index === i ? { ...step, progress } : step)),
          );
        }

        // 标记步骤完成
        setGenerationSteps(prev =>
          prev.map((step, index) =>
            index === i ? { ...step, status: 'completed', progress: 100 } : step,
          ),
        );
      }

      // 生成完成，创建文章内容
      const template = templates.find(t => t.id === config.templateId)!;
      const selectedProducts = products.filter(p => config.selectedProducts.includes(p.id));

      const article: Partial<ArticleContent> = {
        title: generateArticleTitle(template, selectedProducts),
        subtitle: generateArticleSubtitle(template, selectedProducts),
        template_id: template.id,
        sections: template.structure.map(section => ({
          id: section.id,
          title: section.title,
          content: generateSectionContent(section, selectedProducts, config),
          order: section.order,
        })),
      };

      setGeneratedContent(article);
    } catch (error) {
      console.error('生成失败:', error);
      setGenerationSteps(prev =>
        prev.map((step, index) => (index === currentStep ? { ...step, status: 'error' } : step)),
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // 生成文章标题
  const generateArticleTitle = (template: Template, products: Product[]): string => {
    if (products.length === 1) {
      const product = products[0];
      return `${product.basicInfo.brand} ${product.basicInfo.modelName} 详细评测`;
    } else if (products.length > 1) {
      const brands = Array.from(new Set(products.map(p => p.basicInfo.brand)));
      return `${brands.join(' vs ')} 吸尘器对比评测`;
    }
    return template.main_title;
  };

  // 生成文章副标题
  const generateArticleSubtitle = (template: Template, products: Product[]): string => {
    const features = products.flatMap(p => p.features || []).slice(0, 3);
    return `${features.join('、')} | 深度测试报告`;
  };

  // 生成章节内容
  const generateSectionContent = (
    section: any,
    products: Product[],
    config: GenerationConfig,
  ): string => {
    const product = products[0]; // 简化实现，使用第一个产品

    switch (section.title) {
      case '产品概述':
      case '产品介绍':
        return `${product.basicInfo.brand} ${product.basicInfo.modelName} 是一款专业的${product.basicInfo.category}产品。${product.basicInfo.description}

这款产品具备多项先进特性，在同类产品中表现出色。

主要特性包括：
${(product.features || []).map(feature => `• ${feature}`).join('\n')}

该产品适合追求品质和性能的用户群体。`;

      case '性能测试':
      case '性能表现':
        return `经过我们的专业测试，${product.basicInfo.modelName} 在各项性能指标上表现如下：

**性能参数**
${Object.entries(product.parameters || {})
  .map(([key, value]) => `${key}：${value}`)
  .join('\n')}

**功能特性**
${(product.features || []).map(feature => `• ${feature}`).join('\n')}

在同类产品中属于中上水平。`;

      case '使用体验':
        return `在日常使用中，${product.basicInfo.modelName} 的表现令人满意。

**操作体验**
机身重量适中，长时间使用不会感到疲劳。${product.parameters?.speedLevels}档调速设计让用户可以根据不同清洁需求调整吸力。

**清洁效果**
对于硬质地面和地毯都有不错的清洁效果。${(product.features || []).includes('LED照明灯') ? 'LED照明设计让暗处清洁更加便利。' : ''}

**维护保养**
${(product.features || []).includes('可拆卸电池') ? '可拆卸电池设计方便更换和维护。' : ''}集尘盒清理简单，${product.parameters?.dustCapacity || '0.5L'}的容量满足日常需求。`;

      case '优缺点总结':
      case '总结评价':
        return `经过全面测试，${product.basicInfo.modelName} 的表现可以总结如下：

**优点：**
${(product.features || []).map(feature => `• ${feature}`).join('\n')}
• 品质可靠：${product.basicInfo.brand}品牌保障
• 性能表现出色

**需要改进：**
• 价格相对较高
• 部分功能需要学习成本

**总体评价：**
${product.basicInfo.brand} ${product.basicInfo.modelName} 是一款值得考虑的${product.basicInfo.category}产品，特别适合注重品质的用户群体。`;

      case '购买建议':
        return `根据我们的测试和分析，为您提供以下购买建议：

**适合人群：**
• 注重品质的用户
• 追求性能的消费者
• ${product.basicInfo.brand}品牌忠实用户

**购买建议：**
${config.includePricing && product.basicInfo.price ? `当前售价${product.basicInfo.price}元，` : ''}性价比表现良好。建议关注促销活动时购买。

**购买渠道：**
建议通过官方渠道或授权经销商购买，确保产品质量和售后服务。`;

      default:
        return `本章节内容正在生成中...

基于${product.basicInfo.brand} ${product.basicInfo.modelName}的产品特性，我们将从多个维度为您详细分析。

${(product.features || [])
  .slice(0, 2)
  .map(feature => `• ${feature}`)
  .join('\n')}

详细内容将在后续版本中完善。`;
    }
  };

  // 保存生成的文章
  const saveGeneratedArticle = () => {
    if (generatedContent) {
      const now = new Date().toISOString();
      const article: ArticleContent = {
        id: `article-${Date.now()}`,
        title: generatedContent.title || '未命名文章',
        content: generatedContent.sections?.map(s => s.content).join('\n\n') || '',
        subtitle: generatedContent.subtitle || '',
        template_id: generatedContent.template_id || '',
        sections: generatedContent.sections || [],
        status: 'draft',
        created_at: now,
        updated_at: now,
      };

      actions.addArticle(article);
      alert('文章已保存到草稿箱');
    }
  };

  // 生成产品标题
  const generateTitle = (product: Product): string => {
    if (config.tone === 'professional') {
      return `${product.basicInfo.brand} ${product.basicInfo.modelName} 专业评测报告`;
    } else if (config.tone === 'casual') {
      return `${product.basicInfo.brand} ${product.basicInfo.modelName} 深度体验：值得入手吗？`;
    } else {
      return `${product.basicInfo.brand} ${product.basicInfo.modelName} 详细评测`;
    }
  };

  // 生成产品介绍
  const generateIntroduction = (product: Product): string => {
    const params = product.parameters || {};
    const features = product.features || [];

    let intro = `${product.basicInfo.brand}作为知名品牌，其${product.basicInfo.modelName}在${product.basicInfo.category}领域表现出色。`;

    // 添加主要参数信息
    const keyParams = Object.entries(params).slice(0, 3);
    if (keyParams.length > 0) {
      intro += `该产品具备${keyParams.map(([key, value]) => `${key}${value}`).join('、')}等特性。`;
    }

    // 添加特色功能
    if (features.length > 0) {
      intro += `同时支持${features.slice(0, 3).join('、')}等功能。`;
    }

    return intro;
  };

  // 生成性能测试内容
  const generatePerformanceTest = (product: Product): string => {
    const params = product.parameters || {};

    let content = `经过我们的专业测试，${product.basicInfo.modelName} 在各项性能指标上表现如下：\n\n`;

    // 添加主要性能参数
    Object.entries(params).forEach(([key, value]) => {
      content += `${key}：${value}\n`;
    });

    content += `\n在同类产品中属于中上水平。`;

    return content;
  };

  // 生成使用体验内容
  const generateUserExperience = (product: Product): string => {
    const features = product.features || [];

    let content = `在日常使用中，${product.basicInfo.modelName} 的表现令人满意。\n\n`;

    content += `产品设计人性化，操作简单直观。`;

    if (features.length > 0) {
      content += `${features.join('、')}等功能让使用更加便捷。`;
    }

    content += `整体使用体验良好，满足日常需求。`;

    return content;
  };

  // 生成总结评价
  const generateSummary = (product: Product): string => {
    const params = product.parameters || {};
    const features = product.features || [];

    let summary = `经过全面测试，${product.basicInfo.modelName} 的表现可以总结如下：\n\n`;

    summary += `优点：\n`;
    if (Object.keys(params).length > 0) {
      summary += `• 性能表现：${Object.entries(params)
        .slice(0, 2)
        .map(([key, value]) => `${key}${value}`)
        .join('、')}\n`;
    }
    if (features.length > 0) {
      summary += `• 功能丰富：支持${features.slice(0, 2).join('、')}等功能\n`;
    }
    summary += `• 品质可靠：${product.basicInfo.brand}品牌保障\n`;

    summary += `\n不足：\n`;
    summary += `• 价格相对较高\n`;
    summary += `• 部分功能需要学习成本\n`;

    summary += `\n总结：\n`;
    summary += `${product.basicInfo.brand} ${product.basicInfo.modelName} 是一款值得考虑的${product.basicInfo.category}产品，特别适合注重品质的用户群体。`;

    if (config.includePricing && product.basicInfo.price) {
      summary += `当前售价${product.basicInfo.price}元，性价比${product.basicInfo.price < 1000 ? '突出' : '适中'}。建议关注促销活动时购买。`;
    }

    return summary;
  };

  // 生成深度分析内容
  const generateDeepAnalysis = (product: Product): string => {
    let analysis = `基于${product.basicInfo.brand} ${product.basicInfo.modelName}的产品特性，我们将从多个维度为您详细分析。\n\n`;

    analysis += `产品定位：${product.basicInfo.category}领域的中高端产品\n`;
    analysis += `目标用户：追求品质和性能的消费者\n`;
    analysis += `核心优势：品牌实力强、产品质量可靠\n`;

    return analysis;
  };

  return (
    <div className="w-full max-w-none space-y-6">
      {/* 顶部标题 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="w-5 h-5" />
            <span>智能内容生成器</span>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧配置面板 */}
        <div className="lg:col-span-1 space-y-4">
          {/* 模板选择 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>选择模板</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={config.templateId}
                onChange={e => setConfig(prev => ({ ...prev, templateId: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="">请选择模板</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} - {template.main_title}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* 产品选择 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <Database className="w-4 h-4" />
                <span>选择产品</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {products.slice(0, 6).map(product => (
                <label key={product.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.selectedProducts.includes(product.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setConfig(prev => ({
                          ...prev,
                          selectedProducts: [...prev.selectedProducts, product.id],
                        }));
                      } else {
                        setConfig(prev => ({
                          ...prev,
                          selectedProducts: prev.selectedProducts.filter(id => id !== product.id),
                        }));
                      }
                    }}
                  />
                  <span className="text-sm">
                    {product.basicInfo.brand} {product.basicInfo.modelName}
                  </span>
                </label>
              ))}
            </CardContent>
          </Card>

          {/* 生成配置 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>生成配置</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">目标读者</label>
                <select
                  value={config.targetAudience}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      targetAudience: e.target.value as any,
                    }))
                  }
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="general">普通用户</option>
                  <option value="expert">专业用户</option>
                  <option value="beginner">新手用户</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">文章长度</label>
                <select
                  value={config.articleLength}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      articleLength: e.target.value as any,
                    }))
                  }
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="short">简短 (1000-1500字)</option>
                  <option value="medium">中等 (1500-2500字)</option>
                  <option value="long">详细 (2500字以上)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">文章风格</label>
                <select
                  value={config.tone}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      tone: e.target.value as any,
                    }))
                  }
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="professional">专业客观</option>
                  <option value="casual">轻松易懂</option>
                  <option value="technical">技术详细</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.includePricing}
                    onChange={e =>
                      setConfig(prev => ({
                        ...prev,
                        includePricing: e.target.checked,
                      }))
                    }
                  />
                  <span className="text-sm">包含价格信息</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.includeSpecs}
                    onChange={e =>
                      setConfig(prev => ({
                        ...prev,
                        includeSpecs: e.target.checked,
                      }))
                    }
                  />
                  <span className="text-sm">包含技术参数</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.includeComparison}
                    onChange={e =>
                      setConfig(prev => ({
                        ...prev,
                        includeComparison: e.target.checked,
                      }))
                    }
                  />
                  <span className="text-sm">包含产品对比</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* 开始生成按钮 */}
          <Button
            onClick={startGeneration}
            disabled={!config.templateId || config.selectedProducts.length === 0 || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                开始生成
              </>
            )}
          </Button>
        </div>

        {/* 右侧生成进度和结果 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 生成进度 */}
          {generationSteps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">生成进度</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generationSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        'flex items-center space-x-3 p-3 rounded-lg border',
                        step.status === 'completed' && 'bg-green-50 border-green-200',
                        step.status === 'processing' && 'bg-blue-50 border-blue-200',
                        step.status === 'error' && 'bg-red-50 border-red-200',
                        step.status === 'pending' && 'bg-gray-50 border-gray-200',
                      )}
                    >
                      <div className="flex-shrink-0">
                        {step.status === 'completed' && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {step.status === 'processing' && (
                          <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                        )}
                        {step.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                        {step.status === 'pending' && (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{step.title}</div>
                        <div className="text-xs text-muted-foreground">{step.description}</div>
                        {step.status === 'processing' && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${step.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 生成结果 */}
          {generatedContent && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>生成结果</span>
                  <Button onClick={saveGeneratedArticle}>
                    <Save className="w-4 h-4 mr-2" />
                    保存文章
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{generatedContent.title}</h3>
                    {generatedContent.subtitle && (
                      <p className="text-muted-foreground">{generatedContent.subtitle}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    {generatedContent.sections?.map(section => (
                      <div key={section.id} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">{section.title}</h4>
                        <div className="text-sm text-muted-foreground whitespace-pre-line max-h-32 overflow-y-auto">
                          {section.content.slice(0, 200)}
                          {section.content.length > 200 && '...'}
                        </div>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {section.content.length} 字
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;
