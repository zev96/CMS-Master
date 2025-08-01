import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Settings,
  RefreshCw,
  FileText,
  CheckCircle,
  AlertCircle,
  Wand2,
  Database,
  Save,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { cn } from '../../../lib/utils';
import useAppStore from '../../../stores/useAppStore';
const ContentGenerator = () => {
  const { templates, products, actions } = useAppStore();
  const [config, setConfig] = useState({
    templateId: '',
    selectedProducts: [],
    targetAudience: 'general',
    articleLength: 'medium',
    tone: 'professional',
    includeComparison: false,
    includePricing: true,
    includeSpecs: true,
  });
  const [generationSteps, setGenerationSteps] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  // 初始化生成步骤
  useEffect(() => {
    const selectedTemplate = templates.find(t => t.id === config.templateId);
    if (selectedTemplate) {
      const steps = [
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
          status: 'pending',
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
      const template = templates.find(t => t.id === config.templateId);
      const selectedProducts = products.filter(p => config.selectedProducts.includes(p.id));
      const article = {
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
  const generateArticleTitle = (template, products) => {
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
  const generateArticleSubtitle = (template, products) => {
    const features = products.flatMap(p => p.features || []).slice(0, 3);
    return `${features.join('、')} | 深度测试报告`;
  };
  // 生成章节内容
  const generateSectionContent = (section, products, config) => {
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
      const article = {
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
  const generateTitle = product => {
    if (config.tone === 'professional') {
      return `${product.basicInfo.brand} ${product.basicInfo.modelName} 专业评测报告`;
    } else if (config.tone === 'casual') {
      return `${product.basicInfo.brand} ${product.basicInfo.modelName} 深度体验：值得入手吗？`;
    } else {
      return `${product.basicInfo.brand} ${product.basicInfo.modelName} 详细评测`;
    }
  };
  // 生成产品介绍
  const generateIntroduction = product => {
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
  const generatePerformanceTest = product => {
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
  const generateUserExperience = product => {
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
  const generateSummary = product => {
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
  const generateDeepAnalysis = product => {
    let analysis = `基于${product.basicInfo.brand} ${product.basicInfo.modelName}的产品特性，我们将从多个维度为您详细分析。\n\n`;
    analysis += `产品定位：${product.basicInfo.category}领域的中高端产品\n`;
    analysis += `目标用户：追求品质和性能的消费者\n`;
    analysis += `核心优势：品牌实力强、产品质量可靠\n`;
    return analysis;
  };
  return _jsxs('div', {
    className: 'w-full max-w-none space-y-6',
    children: [
      _jsx(Card, {
        children: _jsx(CardHeader, {
          children: _jsxs(CardTitle, {
            className: 'flex items-center space-x-2',
            children: [
              _jsx(Wand2, { className: 'w-5 h-5' }),
              _jsx('span', { children: '\u667A\u80FD\u5185\u5BB9\u751F\u6210\u5668' }),
            ],
          }),
        }),
      }),
      _jsxs('div', {
        className: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
        children: [
          _jsxs('div', {
            className: 'lg:col-span-1 space-y-4',
            children: [
              _jsxs(Card, {
                children: [
                  _jsx(CardHeader, {
                    children: _jsxs(CardTitle, {
                      className: 'text-base flex items-center space-x-2',
                      children: [
                        _jsx(FileText, { className: 'w-4 h-4' }),
                        _jsx('span', { children: '\u9009\u62E9\u6A21\u677F' }),
                      ],
                    }),
                  }),
                  _jsx(CardContent, {
                    children: _jsxs('select', {
                      value: config.templateId,
                      onChange: e => setConfig(prev => ({ ...prev, templateId: e.target.value })),
                      className: 'w-full p-2 border rounded',
                      children: [
                        _jsx('option', { value: '', children: '\u8BF7\u9009\u62E9\u6A21\u677F' }),
                        templates.map(template =>
                          _jsxs(
                            'option',
                            {
                              value: template.id,
                              children: [template.name, ' - ', template.main_title],
                            },
                            template.id,
                          ),
                        ),
                      ],
                    }),
                  }),
                ],
              }),
              _jsxs(Card, {
                children: [
                  _jsx(CardHeader, {
                    children: _jsxs(CardTitle, {
                      className: 'text-base flex items-center space-x-2',
                      children: [
                        _jsx(Database, { className: 'w-4 h-4' }),
                        _jsx('span', { children: '\u9009\u62E9\u4EA7\u54C1' }),
                      ],
                    }),
                  }),
                  _jsx(CardContent, {
                    className: 'space-y-2',
                    children: products.slice(0, 6).map(product =>
                      _jsxs(
                        'label',
                        {
                          className: 'flex items-center space-x-2 cursor-pointer',
                          children: [
                            _jsx('input', {
                              type: 'checkbox',
                              checked: config.selectedProducts.includes(product.id),
                              onChange: e => {
                                if (e.target.checked) {
                                  setConfig(prev => ({
                                    ...prev,
                                    selectedProducts: [...prev.selectedProducts, product.id],
                                  }));
                                } else {
                                  setConfig(prev => ({
                                    ...prev,
                                    selectedProducts: prev.selectedProducts.filter(
                                      id => id !== product.id,
                                    ),
                                  }));
                                }
                              },
                            }),
                            _jsxs('span', {
                              className: 'text-sm',
                              children: [product.basicInfo.brand, ' ', product.basicInfo.modelName],
                            }),
                          ],
                        },
                        product.id,
                      ),
                    ),
                  }),
                ],
              }),
              _jsxs(Card, {
                children: [
                  _jsx(CardHeader, {
                    children: _jsxs(CardTitle, {
                      className: 'text-base flex items-center space-x-2',
                      children: [
                        _jsx(Settings, { className: 'w-4 h-4' }),
                        _jsx('span', { children: '\u751F\u6210\u914D\u7F6E' }),
                      ],
                    }),
                  }),
                  _jsxs(CardContent, {
                    className: 'space-y-4',
                    children: [
                      _jsxs('div', {
                        children: [
                          _jsx('label', {
                            className: 'text-sm font-medium',
                            children: '\u76EE\u6807\u8BFB\u8005',
                          }),
                          _jsxs('select', {
                            value: config.targetAudience,
                            onChange: e =>
                              setConfig(prev => ({
                                ...prev,
                                targetAudience: e.target.value,
                              })),
                            className: 'w-full p-2 border rounded text-sm',
                            children: [
                              _jsx('option', {
                                value: 'general',
                                children: '\u666E\u901A\u7528\u6237',
                              }),
                              _jsx('option', {
                                value: 'expert',
                                children: '\u4E13\u4E1A\u7528\u6237',
                              }),
                              _jsx('option', {
                                value: 'beginner',
                                children: '\u65B0\u624B\u7528\u6237',
                              }),
                            ],
                          }),
                        ],
                      }),
                      _jsxs('div', {
                        children: [
                          _jsx('label', {
                            className: 'text-sm font-medium',
                            children: '\u6587\u7AE0\u957F\u5EA6',
                          }),
                          _jsxs('select', {
                            value: config.articleLength,
                            onChange: e =>
                              setConfig(prev => ({
                                ...prev,
                                articleLength: e.target.value,
                              })),
                            className: 'w-full p-2 border rounded text-sm',
                            children: [
                              _jsx('option', {
                                value: 'short',
                                children: '\u7B80\u77ED (1000-1500\u5B57)',
                              }),
                              _jsx('option', {
                                value: 'medium',
                                children: '\u4E2D\u7B49 (1500-2500\u5B57)',
                              }),
                              _jsx('option', {
                                value: 'long',
                                children: '\u8BE6\u7EC6 (2500\u5B57\u4EE5\u4E0A)',
                              }),
                            ],
                          }),
                        ],
                      }),
                      _jsxs('div', {
                        children: [
                          _jsx('label', {
                            className: 'text-sm font-medium',
                            children: '\u6587\u7AE0\u98CE\u683C',
                          }),
                          _jsxs('select', {
                            value: config.tone,
                            onChange: e =>
                              setConfig(prev => ({
                                ...prev,
                                tone: e.target.value,
                              })),
                            className: 'w-full p-2 border rounded text-sm',
                            children: [
                              _jsx('option', {
                                value: 'professional',
                                children: '\u4E13\u4E1A\u5BA2\u89C2',
                              }),
                              _jsx('option', {
                                value: 'casual',
                                children: '\u8F7B\u677E\u6613\u61C2',
                              }),
                              _jsx('option', {
                                value: 'technical',
                                children: '\u6280\u672F\u8BE6\u7EC6',
                              }),
                            ],
                          }),
                        ],
                      }),
                      _jsxs('div', {
                        className: 'space-y-2',
                        children: [
                          _jsxs('label', {
                            className: 'flex items-center space-x-2',
                            children: [
                              _jsx('input', {
                                type: 'checkbox',
                                checked: config.includePricing,
                                onChange: e =>
                                  setConfig(prev => ({
                                    ...prev,
                                    includePricing: e.target.checked,
                                  })),
                              }),
                              _jsx('span', {
                                className: 'text-sm',
                                children: '\u5305\u542B\u4EF7\u683C\u4FE1\u606F',
                              }),
                            ],
                          }),
                          _jsxs('label', {
                            className: 'flex items-center space-x-2',
                            children: [
                              _jsx('input', {
                                type: 'checkbox',
                                checked: config.includeSpecs,
                                onChange: e =>
                                  setConfig(prev => ({
                                    ...prev,
                                    includeSpecs: e.target.checked,
                                  })),
                              }),
                              _jsx('span', {
                                className: 'text-sm',
                                children: '\u5305\u542B\u6280\u672F\u53C2\u6570',
                              }),
                            ],
                          }),
                          _jsxs('label', {
                            className: 'flex items-center space-x-2',
                            children: [
                              _jsx('input', {
                                type: 'checkbox',
                                checked: config.includeComparison,
                                onChange: e =>
                                  setConfig(prev => ({
                                    ...prev,
                                    includeComparison: e.target.checked,
                                  })),
                              }),
                              _jsx('span', {
                                className: 'text-sm',
                                children: '\u5305\u542B\u4EA7\u54C1\u5BF9\u6BD4',
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              _jsx(Button, {
                onClick: startGeneration,
                disabled:
                  !config.templateId || config.selectedProducts.length === 0 || isGenerating,
                className: 'w-full',
                size: 'lg',
                children: isGenerating
                  ? _jsxs(_Fragment, {
                      children: [
                        _jsx(RefreshCw, { className: 'w-4 h-4 mr-2 animate-spin' }),
                        '\u751F\u6210\u4E2D...',
                      ],
                    })
                  : _jsxs(_Fragment, {
                      children: [
                        _jsx(Play, { className: 'w-4 h-4 mr-2' }),
                        '\u5F00\u59CB\u751F\u6210',
                      ],
                    }),
              }),
            ],
          }),
          _jsxs('div', {
            className: 'lg:col-span-2 space-y-4',
            children: [
              generationSteps.length > 0 &&
                _jsxs(Card, {
                  children: [
                    _jsx(CardHeader, {
                      children: _jsx(CardTitle, {
                        className: 'text-base',
                        children: '\u751F\u6210\u8FDB\u5EA6',
                      }),
                    }),
                    _jsx(CardContent, {
                      children: _jsx('div', {
                        className: 'space-y-3',
                        children: generationSteps.map((step, index) =>
                          _jsxs(
                            motion.div,
                            {
                              initial: { opacity: 0, x: -20 },
                              animate: { opacity: 1, x: 0 },
                              transition: { delay: index * 0.1 },
                              className: cn(
                                'flex items-center space-x-3 p-3 rounded-lg border',
                                step.status === 'completed' && 'bg-green-50 border-green-200',
                                step.status === 'processing' && 'bg-blue-50 border-blue-200',
                                step.status === 'error' && 'bg-red-50 border-red-200',
                                step.status === 'pending' && 'bg-gray-50 border-gray-200',
                              ),
                              children: [
                                _jsxs('div', {
                                  className: 'flex-shrink-0',
                                  children: [
                                    step.status === 'completed' &&
                                      _jsx(CheckCircle, { className: 'w-5 h-5 text-green-500' }),
                                    step.status === 'processing' &&
                                      _jsx(RefreshCw, {
                                        className: 'w-5 h-5 text-blue-500 animate-spin',
                                      }),
                                    step.status === 'error' &&
                                      _jsx(AlertCircle, { className: 'w-5 h-5 text-red-500' }),
                                    step.status === 'pending' &&
                                      _jsx('div', {
                                        className: 'w-5 h-5 rounded-full border-2 border-gray-300',
                                      }),
                                  ],
                                }),
                                _jsxs('div', {
                                  className: 'flex-1 min-w-0',
                                  children: [
                                    _jsx('div', {
                                      className: 'font-medium text-sm',
                                      children: step.title,
                                    }),
                                    _jsx('div', {
                                      className: 'text-xs text-muted-foreground',
                                      children: step.description,
                                    }),
                                    step.status === 'processing' &&
                                      _jsx('div', {
                                        className: 'w-full bg-gray-200 rounded-full h-1.5 mt-2',
                                        children: _jsx('div', {
                                          className:
                                            'bg-blue-500 h-1.5 rounded-full transition-all duration-300',
                                          style: { width: `${step.progress}%` },
                                        }),
                                      }),
                                  ],
                                }),
                              ],
                            },
                            step.id,
                          ),
                        ),
                      }),
                    }),
                  ],
                }),
              generatedContent &&
                _jsxs(Card, {
                  children: [
                    _jsx(CardHeader, {
                      children: _jsxs(CardTitle, {
                        className: 'flex items-center justify-between',
                        children: [
                          _jsx('span', { children: '\u751F\u6210\u7ED3\u679C' }),
                          _jsxs(Button, {
                            onClick: saveGeneratedArticle,
                            children: [
                              _jsx(Save, { className: 'w-4 h-4 mr-2' }),
                              '\u4FDD\u5B58\u6587\u7AE0',
                            ],
                          }),
                        ],
                      }),
                    }),
                    _jsx(CardContent, {
                      children: _jsxs('div', {
                        className: 'space-y-4',
                        children: [
                          _jsxs('div', {
                            children: [
                              _jsx('h3', {
                                className: 'font-semibold text-lg',
                                children: generatedContent.title,
                              }),
                              generatedContent.subtitle &&
                                _jsx('p', {
                                  className: 'text-muted-foreground',
                                  children: generatedContent.subtitle,
                                }),
                            ],
                          }),
                          _jsx('div', {
                            className: 'space-y-3',
                            children: generatedContent.sections?.map(section =>
                              _jsxs(
                                'div',
                                {
                                  className: 'border rounded-lg p-4',
                                  children: [
                                    _jsx('h4', {
                                      className: 'font-medium mb-2',
                                      children: section.title,
                                    }),
                                    _jsxs('div', {
                                      className:
                                        'text-sm text-muted-foreground whitespace-pre-line max-h-32 overflow-y-auto',
                                      children: [
                                        section.content.slice(0, 200),
                                        section.content.length > 200 && '...',
                                      ],
                                    }),
                                    _jsxs(Badge, {
                                      variant: 'outline',
                                      className: 'mt-2 text-xs',
                                      children: [section.content.length, ' \u5B57'],
                                    }),
                                  ],
                                },
                                section.id,
                              ),
                            ),
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
            ],
          }),
        ],
      }),
    ],
  });
};
export default ContentGenerator;
