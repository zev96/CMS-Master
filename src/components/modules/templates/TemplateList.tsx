import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  FileText,
  LayoutGrid,
  List,
  Clock,
  BookOpen,
  Target,
  ShoppingCart,
  MessageSquare,
  Filter,
  SortAsc,
  Eye,
  Play,
  Star,
  TrendingUp,
  Archive,
  Download,
} from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { cn } from '../../../lib/utils';
import useAppStore from '../../../stores/useAppStore';
import type { Template } from '../../../types';
import { useToast } from '../../ui/use-toast';

// 获取模板图标
const getTemplateIcon = (name: string) => {
  if (name.includes('评测') || name.includes('测试')) return <Target className="w-5 h-5" />;
  if (name.includes('对比') || name.includes('比较')) return <TrendingUp className="w-5 h-5" />;
  if (name.includes('指南') || name.includes('教程')) return <BookOpen className="w-5 h-5" />;
  if (name.includes('导购') || name.includes('推荐')) return <ShoppingCart className="w-5 h-5" />;
  if (name.includes('知乎') || name.includes('问答')) return <MessageSquare className="w-5 h-5" />;
  return <FileText className="w-5 h-5" />;
};

// 获取模板颜色样式
const getTemplateStyle = (name: string) => {
  if (name.includes('评测') || name.includes('测试'))
    return {
      color: 'text-blue-600',
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      border: 'border-blue-200',
    };
  if (name.includes('对比') || name.includes('比较'))
    return {
      color: 'text-green-600',
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      border: 'border-green-200',
    };
  if (name.includes('指南') || name.includes('教程'))
    return {
      color: 'text-purple-600',
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      border: 'border-purple-200',
    };
  if (name.includes('导购') || name.includes('推荐'))
    return {
      color: 'text-orange-600',
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
      border: 'border-orange-200',
    };
  return {
    color: 'text-gray-600',
    bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
    border: 'border-gray-200',
  };
};

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onUse: () => void;
  viewMode: 'grid' | 'list';
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onClick,
  onEdit,
  onDelete,
  onCopy,
  onUse,
  viewMode,
}) => {
  const templateStyle = getTemplateStyle(template.name);

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className={cn(
            'cursor-pointer transition-all duration-200 hover:shadow-lg group',
            'bg-gradient-to-r from-white to-gray-50/50 border-0 shadow-md',
            isSelected && 'ring-2 ring-blue-500 shadow-xl',
          )}
          onClick={onClick}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div
                  className={cn('p-3 rounded-xl shadow-sm', templateStyle.bg, templateStyle.border)}
                >
                  <div className={templateStyle.color}>{getTemplateIcon(template.name)}</div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-bold text-lg text-gray-900 truncate">{template.name}</h3>
                    <Badge variant="outline" className="shrink-0">
                      {template.structure.length} 章节
                    </Badge>
                  </div>
                  <p className="text-gray-600 mt-1 line-clamp-2">{template.main_title}</p>

                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        更新于 {new Date(template.updated_at).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    onUse();
                  }}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                >
                  <Play className="w-4 h-4 mr-2" />
                  使用
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    onCopy();
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'cursor-pointer transition-all duration-300 hover:shadow-xl group h-full',
          'bg-gradient-to-br from-white via-gray-50/30 to-white border-0 shadow-lg',
          isSelected && 'ring-2 ring-blue-500 shadow-2xl',
        )}
        onClick={onClick}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div
                className={cn('p-3 rounded-xl shadow-sm', templateStyle.bg, templateStyle.border)}
              >
                <div className={templateStyle.color}>{getTemplateIcon(template.name)}</div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-lg text-gray-900 truncate">{template.name}</h3>
                <p className="text-sm text-gray-600 truncate mt-1">{template.main_title}</p>
              </div>
            </div>

            <Badge variant="outline" className="shrink-0 bg-white/80">
              {template.structure.length} 章节
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0 flex flex-col justify-between flex-1">
          <div className="space-y-4">
            {/* 模板结构预览 */}
            <div className="bg-white/60 rounded-lg p-3 border border-gray-100">
              <div className="text-xs font-medium text-gray-600 mb-2 flex items-center">
                <Archive className="w-3 h-3 mr-1" />
                模板结构
              </div>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {template.structure.slice(0, 4).map((section, index) => (
                  <div key={section.id} className="text-xs text-gray-600 flex items-center">
                    <span className="w-5 text-center font-medium text-gray-400">{index + 1}.</span>
                    <span className="truncate">{section.title}</span>
                  </div>
                ))}
                {template.structure.length > 4 && (
                  <div className="text-xs text-gray-500 text-center py-1">
                    ... 还有 {template.structure.length - 4} 个章节
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 底部操作栏 */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{new Date(template.updated_at).toLocaleDateString('zh-CN')}</span>
            </div>

            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={e => {
                  e.stopPropagation();
                  onUse();
                }}
                className="h-8 px-3 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600"
              >
                <Play className="w-3 h-3 mr-1" />
                使用
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={e => {
                  e.stopPropagation();
                  onCopy();
                }}
                className="h-8 px-2"
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={e => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="h-8 px-2"
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={e => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TemplateList: React.FC = () => {
  const { templates, actions } = useAppStore();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // 过滤和排序模板
  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = templates.filter(template => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.main_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.structure.some(section =>
          section.title.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      if (!matchesSearch) return false;

      if (filterCategory === 'all') return true;
      if (filterCategory === 'evaluation')
        return template.name.includes('评测') || template.name.includes('测试');
      if (filterCategory === 'comparison')
        return template.name.includes('对比') || template.name.includes('比较');
      if (filterCategory === 'guide')
        return template.name.includes('指南') || template.name.includes('教程');

      return true;
    });

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

    return filtered;
  }, [templates, searchTerm, sortBy, filterCategory]);

  // 统计数据
  const stats = useMemo(() => {
    return {
      total: templates.length,
      evaluation: templates.filter(t => t.name.includes('评测') || t.name.includes('测试')).length,
      comparison: templates.filter(t => t.name.includes('对比') || t.name.includes('比较')).length,
      guide: templates.filter(t => t.name.includes('指南') || t.name.includes('教程')).length,
      filtered: filteredAndSortedTemplates.length,
    };
  }, [templates, filteredAndSortedTemplates]);

  // 处理模板操作
  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template.id === selectedTemplate ? null : template.id);
    actions.showTemplateDetail(template.id);
  };

  const handleEditTemplate = (template: Template) => {
    actions.showTemplateForm(template.id);
  };

  const handleDeleteTemplate = (template: Template) => {
    if (confirm(`确定要删除模板"${template.name}" 吗？`)) {
      actions.deleteTemplate(template.id);
      if (selectedTemplate === template.id) {
        setSelectedTemplate(null);
      }
    }
  };

  const handleCopyTemplate = (template: Template) => {
    const newTemplate = {
      ...template,
      id: `template-copy-${Date.now()}`,
      name: `${template.name} (副本)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    actions.addTemplate(newTemplate);
  };

  const handleUseTemplate = async (template: Template) => {
    // 检查是否有未保存的内容
    const currentContent = actions.getEditorContent();
    if (currentContent && currentContent.trim()) {
      const confirmUse = window.confirm(
        '当前编辑器中有未保存的内容，使用新模板将会清空当前内容。是否继续？',
      );
      if (!confirmUse) {
        return;
      }
    }

    try {
      // 重置模板修改状态，准备使用新模板
      actions.resetTemplateModifiedStatus();

      // 尝试使用模板
      const success = actions.useTemplate(template.id);
      if (!success) {
        throw new Error('模板加载失败');
      }

      // 切换到编辑器模块
      actions.setCurrentModule('editor');

      // 提示用户
      toast({
        title: '模板加载成功',
        description: `已成功加载模板"${template.name}"`,
        variant: 'default',
      });
    } catch (error) {
      console.error('使用模板失败:', error);
      toast({
        title: '模板加载失败',
        description: error instanceof Error ? error.message : '使用模板时发生错误',
        variant: 'destructive',
      });
    }
  };

  const handleNewTemplate = () => {
    actions.showTemplateForm();
  };

  return (
    <div className="space-y-6">
      {/* 搜索和工具栏 */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索模板名称、标题或章节..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 border-gray-200 focus:border-blue-300"
          />
        </div>

        <div className="flex gap-2">
          {/* 视图切换 */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="bg-white/80"
          >
            {viewMode === 'grid' ? (
              <List className="w-4 h-4" />
            ) : (
              <LayoutGrid className="w-4 h-4" />
            )}
          </Button>

          {/* 筛选和排序 */}
          <div className="flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-32 bg-white/80">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="全部分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="evaluation">评测模板</SelectItem>
                <SelectItem value="comparison">对比模板</SelectItem>
                <SelectItem value="guide">指南模板</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={value => setSortBy(value as 'name' | 'date')}>
              <SelectTrigger className="w-32 bg-white/80">
                <SortAsc className="w-4 h-4 mr-2" />
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">最近更新</SelectItem>
                <SelectItem value="name">名称排序</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleNewTemplate}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            新建模板
          </Button>
        </div>
      </div>

      {/* 模板列表 */}
      {filteredAndSortedTemplates.length > 0 ? (
        <div
          className={cn(
            'grid gap-6',
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1',
          )}
        >
          <AnimatePresence>
            {filteredAndSortedTemplates.map(template => (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={cn(
                    'group cursor-pointer transition-all duration-300 hover:shadow-lg',
                    selectedTemplate === template.id && 'ring-2 ring-blue-500',
                  )}
                  onClick={() => handleTemplateClick(template)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div
                          className={cn(
                            'p-3 rounded-xl shadow-sm',
                            getTemplateStyle(template.name).bg,
                            getTemplateStyle(template.name).border,
                          )}
                        >
                          <div className={getTemplateStyle(template.name).color}>
                            {getTemplateIcon(template.name)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-bold text-lg text-gray-900 truncate">
                              {template.name}
                            </h3>
                            <Badge variant="outline" className="shrink-0">
                              {template.structure.length} 章节
                            </Badge>
                          </div>
                          <p className="text-gray-600 mt-1 line-clamp-2">{template.main_title}</p>

                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                更新于 {new Date(template.updated_at).toLocaleDateString('zh-CN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            handleUseTemplate(template);
                          }}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          使用
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            handleCopyTemplate(template);
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            handleEditTemplate(template);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteTemplate(template);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {searchTerm || filterCategory !== 'all' ? '未找到匹配的模板' : '暂无模板'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterCategory !== 'all'
              ? '尝试调整搜索条件或筛选器'
              : '创建您的第一个内容模板，提高内容创作效率'}
          </p>
          {!searchTerm && filterCategory === 'all' && (
            <Button
              onClick={handleNewTemplate}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              新建模板
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateList;
