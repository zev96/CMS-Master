import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useMemo } from 'react';
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
  Play,
  TrendingUp,
  Archive,
} from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { cn } from '../../../lib/utils';
import useAppStore from '../../../stores/useAppStore';
import { useToast } from '../../ui/use-toast';
// 获取模板图标
const getTemplateIcon = name => {
  if (name.includes('评测') || name.includes('测试')) return _jsx(Target, { className: 'w-5 h-5' });
  if (name.includes('对比') || name.includes('比较'))
    return _jsx(TrendingUp, { className: 'w-5 h-5' });
  if (name.includes('指南') || name.includes('教程'))
    return _jsx(BookOpen, { className: 'w-5 h-5' });
  if (name.includes('导购') || name.includes('推荐'))
    return _jsx(ShoppingCart, { className: 'w-5 h-5' });
  if (name.includes('知乎') || name.includes('问答'))
    return _jsx(MessageSquare, { className: 'w-5 h-5' });
  return _jsx(FileText, { className: 'w-5 h-5' });
};
// 获取模板颜色样式
const getTemplateStyle = name => {
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
const TemplateCard = ({
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
    return _jsx(motion.div, {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      whileHover: { x: 4 },
      transition: { duration: 0.2 },
      children: _jsx(Card, {
        className: cn(
          'cursor-pointer transition-all duration-200 hover:shadow-lg group',
          'bg-gradient-to-r from-white to-gray-50/50 border-0 shadow-md',
          isSelected && 'ring-2 ring-blue-500 shadow-xl',
        ),
        onClick: onClick,
        children: _jsx(CardContent, {
          className: 'p-6',
          children: _jsxs('div', {
            className: 'flex items-center justify-between',
            children: [
              _jsxs('div', {
                className: 'flex items-center space-x-4 flex-1',
                children: [
                  _jsx('div', {
                    className: cn(
                      'p-3 rounded-xl shadow-sm',
                      templateStyle.bg,
                      templateStyle.border,
                    ),
                    children: _jsx('div', {
                      className: templateStyle.color,
                      children: getTemplateIcon(template.name),
                    }),
                  }),
                  _jsxs('div', {
                    className: 'flex-1 min-w-0',
                    children: [
                      _jsxs('div', {
                        className: 'flex items-center space-x-3',
                        children: [
                          _jsx('h3', {
                            className: 'font-bold text-lg text-gray-900 truncate',
                            children: template.name,
                          }),
                          _jsxs(Badge, {
                            variant: 'outline',
                            className: 'shrink-0',
                            children: [template.structure.length, ' \u7AE0\u8282'],
                          }),
                        ],
                      }),
                      _jsx('p', {
                        className: 'text-gray-600 mt-1 line-clamp-2',
                        children: template.main_title,
                      }),
                      _jsx('div', {
                        className: 'flex items-center space-x-4 mt-3 text-sm text-gray-500',
                        children: _jsxs('div', {
                          className: 'flex items-center space-x-1',
                          children: [
                            _jsx(Clock, { className: 'w-4 h-4' }),
                            _jsxs('span', {
                              children: [
                                '\u66F4\u65B0\u4E8E ',
                                new Date(template.updated_at).toLocaleDateString('zh-CN'),
                              ],
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                ],
              }),
              _jsxs('div', {
                className:
                  'flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity',
                children: [
                  _jsxs(Button, {
                    variant: 'outline',
                    size: 'sm',
                    onClick: e => {
                      e.stopPropagation();
                      onUse();
                    },
                    className: 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200',
                    children: [_jsx(Play, { className: 'w-4 h-4 mr-2' }), '\u4F7F\u7528'],
                  }),
                  _jsx(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: e => {
                      e.stopPropagation();
                      onCopy();
                    },
                    children: _jsx(Copy, { className: 'w-4 h-4' }),
                  }),
                  _jsx(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: e => {
                      e.stopPropagation();
                      onEdit();
                    },
                    children: _jsx(Edit, { className: 'w-4 h-4' }),
                  }),
                  _jsx(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: e => {
                      e.stopPropagation();
                      onDelete();
                    },
                    className: 'text-red-600 hover:text-red-700 hover:bg-red-50',
                    children: _jsx(Trash2, { className: 'w-4 h-4' }),
                  }),
                ],
              }),
            ],
          }),
        }),
      }),
    });
  }
  return _jsx(motion.div, {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    whileHover: { y: -4, scale: 1.02 },
    transition: { duration: 0.2 },
    children: _jsxs(Card, {
      className: cn(
        'cursor-pointer transition-all duration-300 hover:shadow-xl group h-full',
        'bg-gradient-to-br from-white via-gray-50/30 to-white border-0 shadow-lg',
        isSelected && 'ring-2 ring-blue-500 shadow-2xl',
      ),
      onClick: onClick,
      children: [
        _jsx(CardHeader, {
          className: 'pb-4',
          children: _jsxs('div', {
            className: 'flex items-start justify-between',
            children: [
              _jsxs('div', {
                className: 'flex items-center space-x-3 flex-1',
                children: [
                  _jsx('div', {
                    className: cn(
                      'p-3 rounded-xl shadow-sm',
                      templateStyle.bg,
                      templateStyle.border,
                    ),
                    children: _jsx('div', {
                      className: templateStyle.color,
                      children: getTemplateIcon(template.name),
                    }),
                  }),
                  _jsxs('div', {
                    className: 'min-w-0 flex-1',
                    children: [
                      _jsx('h3', {
                        className: 'font-bold text-lg text-gray-900 truncate',
                        children: template.name,
                      }),
                      _jsx('p', {
                        className: 'text-sm text-gray-600 truncate mt-1',
                        children: template.main_title,
                      }),
                    ],
                  }),
                ],
              }),
              _jsxs(Badge, {
                variant: 'outline',
                className: 'shrink-0 bg-white/80',
                children: [template.structure.length, ' \u7AE0\u8282'],
              }),
            ],
          }),
        }),
        _jsxs(CardContent, {
          className: 'pt-0 flex flex-col justify-between flex-1',
          children: [
            _jsx('div', {
              className: 'space-y-4',
              children: _jsxs('div', {
                className: 'bg-white/60 rounded-lg p-3 border border-gray-100',
                children: [
                  _jsxs('div', {
                    className: 'text-xs font-medium text-gray-600 mb-2 flex items-center',
                    children: [
                      _jsx(Archive, { className: 'w-3 h-3 mr-1' }),
                      '\u6A21\u677F\u7ED3\u6784',
                    ],
                  }),
                  _jsxs('div', {
                    className: 'space-y-1 max-h-24 overflow-y-auto',
                    children: [
                      template.structure
                        .slice(0, 4)
                        .map((section, index) =>
                          _jsxs(
                            'div',
                            {
                              className: 'text-xs text-gray-600 flex items-center',
                              children: [
                                _jsxs('span', {
                                  className: 'w-5 text-center font-medium text-gray-400',
                                  children: [index + 1, '.'],
                                }),
                                _jsx('span', { className: 'truncate', children: section.title }),
                              ],
                            },
                            section.id,
                          ),
                        ),
                      template.structure.length > 4 &&
                        _jsxs('div', {
                          className: 'text-xs text-gray-500 text-center py-1',
                          children: [
                            '... \u8FD8\u6709 ',
                            template.structure.length - 4,
                            ' \u4E2A\u7AE0\u8282',
                          ],
                        }),
                    ],
                  }),
                ],
              }),
            }),
            _jsxs('div', {
              className: 'flex items-center justify-between pt-4 border-t border-gray-100 mt-4',
              children: [
                _jsxs('div', {
                  className: 'flex items-center space-x-1 text-xs text-gray-500',
                  children: [
                    _jsx(Clock, { className: 'w-3 h-3' }),
                    _jsx('span', {
                      children: new Date(template.updated_at).toLocaleDateString('zh-CN'),
                    }),
                  ],
                }),
                _jsxs('div', {
                  className:
                    'flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity',
                  children: [
                    _jsxs(Button, {
                      variant: 'ghost',
                      size: 'sm',
                      onClick: e => {
                        e.stopPropagation();
                        onUse();
                      },
                      className: 'h-8 px-3 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600',
                      children: [_jsx(Play, { className: 'w-3 h-3 mr-1' }), '\u4F7F\u7528'],
                    }),
                    _jsx(Button, {
                      variant: 'ghost',
                      size: 'sm',
                      onClick: e => {
                        e.stopPropagation();
                        onCopy();
                      },
                      className: 'h-8 px-2',
                      children: _jsx(Copy, { className: 'w-3 h-3' }),
                    }),
                    _jsx(Button, {
                      variant: 'ghost',
                      size: 'sm',
                      onClick: e => {
                        e.stopPropagation();
                        onEdit();
                      },
                      className: 'h-8 px-2',
                      children: _jsx(Edit, { className: 'w-3 h-3' }),
                    }),
                    _jsx(Button, {
                      variant: 'ghost',
                      size: 'sm',
                      onClick: e => {
                        e.stopPropagation();
                        onDelete();
                      },
                      className: 'h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50',
                      children: _jsx(Trash2, { className: 'w-3 h-3' }),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
};
const TemplateList = () => {
  const { templates, actions } = useAppStore();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterCategory, setFilterCategory] = useState('all');
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
  const handleTemplateClick = template => {
    setSelectedTemplate(template.id === selectedTemplate ? null : template.id);
    actions.showTemplateDetail(template.id);
  };
  const handleEditTemplate = template => {
    actions.showTemplateForm(template.id);
  };
  const handleDeleteTemplate = template => {
    if (confirm(`确定要删除模板"${template.name}" 吗？`)) {
      actions.deleteTemplate(template.id);
      if (selectedTemplate === template.id) {
        setSelectedTemplate(null);
      }
    }
  };
  const handleCopyTemplate = template => {
    const newTemplate = {
      ...template,
      id: `template-copy-${Date.now()}`,
      name: `${template.name} (副本)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    actions.addTemplate(newTemplate);
  };
  const handleUseTemplate = async template => {
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
  return _jsxs('div', {
    className: 'space-y-6',
    children: [
      _jsxs('div', {
        className: 'flex items-center justify-between gap-4',
        children: [
          _jsxs('div', {
            className: 'relative flex-1',
            children: [
              _jsx(Search, {
                className: 'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400',
              }),
              _jsx(Input, {
                placeholder:
                  '\u641C\u7D22\u6A21\u677F\u540D\u79F0\u3001\u6807\u9898\u6216\u7AE0\u8282...',
                value: searchTerm,
                onChange: e => setSearchTerm(e.target.value),
                className: 'pl-10 bg-white/80 border-gray-200 focus:border-blue-300',
              }),
            ],
          }),
          _jsxs('div', {
            className: 'flex gap-2',
            children: [
              _jsx(Button, {
                variant: 'outline',
                size: 'icon',
                onClick: () => setViewMode(viewMode === 'grid' ? 'list' : 'grid'),
                className: 'bg-white/80',
                children:
                  viewMode === 'grid'
                    ? _jsx(List, { className: 'w-4 h-4' })
                    : _jsx(LayoutGrid, { className: 'w-4 h-4' }),
              }),
              _jsxs('div', {
                className: 'flex gap-2',
                children: [
                  _jsxs(Select, {
                    value: filterCategory,
                    onValueChange: setFilterCategory,
                    children: [
                      _jsxs(SelectTrigger, {
                        className: 'w-32 bg-white/80',
                        children: [
                          _jsx(Filter, { className: 'w-4 h-4 mr-2' }),
                          _jsx(SelectValue, { placeholder: '\u5168\u90E8\u5206\u7C7B' }),
                        ],
                      }),
                      _jsxs(SelectContent, {
                        children: [
                          _jsx(SelectItem, { value: 'all', children: '\u5168\u90E8\u5206\u7C7B' }),
                          _jsx(SelectItem, {
                            value: 'evaluation',
                            children: '\u8BC4\u6D4B\u6A21\u677F',
                          }),
                          _jsx(SelectItem, {
                            value: 'comparison',
                            children: '\u5BF9\u6BD4\u6A21\u677F',
                          }),
                          _jsx(SelectItem, {
                            value: 'guide',
                            children: '\u6307\u5357\u6A21\u677F',
                          }),
                        ],
                      }),
                    ],
                  }),
                  _jsxs(Select, {
                    value: sortBy,
                    onValueChange: value => setSortBy(value),
                    children: [
                      _jsxs(SelectTrigger, {
                        className: 'w-32 bg-white/80',
                        children: [
                          _jsx(SortAsc, { className: 'w-4 h-4 mr-2' }),
                          _jsx(SelectValue, { placeholder: '\u6392\u5E8F\u65B9\u5F0F' }),
                        ],
                      }),
                      _jsxs(SelectContent, {
                        children: [
                          _jsx(SelectItem, { value: 'date', children: '\u6700\u8FD1\u66F4\u65B0' }),
                          _jsx(SelectItem, { value: 'name', children: '\u540D\u79F0\u6392\u5E8F' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              _jsxs(Button, {
                onClick: handleNewTemplate,
                className: 'bg-gradient-to-r from-blue-600 to-purple-600',
                children: [_jsx(Plus, { className: 'w-4 h-4 mr-2' }), '\u65B0\u5EFA\u6A21\u677F'],
              }),
            ],
          }),
        ],
      }),
      filteredAndSortedTemplates.length > 0
        ? _jsx('div', {
            className: cn(
              'grid gap-6',
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1',
            ),
            children: _jsx(AnimatePresence, {
              children: filteredAndSortedTemplates.map(template =>
                _jsx(
                  motion.div,
                  {
                    layout: true,
                    initial: { opacity: 0, scale: 0.9 },
                    animate: { opacity: 1, scale: 1 },
                    exit: { opacity: 0, scale: 0.9 },
                    transition: { duration: 0.2 },
                    children: _jsx(Card, {
                      className: cn(
                        'group cursor-pointer transition-all duration-300 hover:shadow-lg',
                        selectedTemplate === template.id && 'ring-2 ring-blue-500',
                      ),
                      onClick: () => handleTemplateClick(template),
                      children: _jsx(CardContent, {
                        className: 'p-6',
                        children: _jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            _jsxs('div', {
                              className: 'flex items-center space-x-4 flex-1',
                              children: [
                                _jsx('div', {
                                  className: cn(
                                    'p-3 rounded-xl shadow-sm',
                                    getTemplateStyle(template.name).bg,
                                    getTemplateStyle(template.name).border,
                                  ),
                                  children: _jsx('div', {
                                    className: getTemplateStyle(template.name).color,
                                    children: getTemplateIcon(template.name),
                                  }),
                                }),
                                _jsxs('div', {
                                  className: 'flex-1 min-w-0',
                                  children: [
                                    _jsxs('div', {
                                      className: 'flex items-center space-x-3',
                                      children: [
                                        _jsx('h3', {
                                          className: 'font-bold text-lg text-gray-900 truncate',
                                          children: template.name,
                                        }),
                                        _jsxs(Badge, {
                                          variant: 'outline',
                                          className: 'shrink-0',
                                          children: [template.structure.length, ' \u7AE0\u8282'],
                                        }),
                                      ],
                                    }),
                                    _jsx('p', {
                                      className: 'text-gray-600 mt-1 line-clamp-2',
                                      children: template.main_title,
                                    }),
                                    _jsx('div', {
                                      className:
                                        'flex items-center space-x-4 mt-3 text-sm text-gray-500',
                                      children: _jsxs('div', {
                                        className: 'flex items-center space-x-1',
                                        children: [
                                          _jsx(Clock, { className: 'w-4 h-4' }),
                                          _jsxs('span', {
                                            children: [
                                              '\u66F4\u65B0\u4E8E ',
                                              new Date(template.updated_at).toLocaleDateString(
                                                'zh-CN',
                                              ),
                                            ],
                                          }),
                                        ],
                                      }),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            _jsxs('div', {
                              className:
                                'flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity',
                              children: [
                                _jsxs(Button, {
                                  variant: 'outline',
                                  size: 'sm',
                                  onClick: e => {
                                    e.stopPropagation();
                                    handleUseTemplate(template);
                                  },
                                  className:
                                    'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200',
                                  children: [
                                    _jsx(Play, { className: 'w-4 h-4 mr-2' }),
                                    '\u4F7F\u7528',
                                  ],
                                }),
                                _jsx(Button, {
                                  variant: 'ghost',
                                  size: 'sm',
                                  onClick: e => {
                                    e.stopPropagation();
                                    handleCopyTemplate(template);
                                  },
                                  children: _jsx(Copy, { className: 'w-4 h-4' }),
                                }),
                                _jsx(Button, {
                                  variant: 'ghost',
                                  size: 'sm',
                                  onClick: e => {
                                    e.stopPropagation();
                                    handleEditTemplate(template);
                                  },
                                  children: _jsx(Edit, { className: 'w-4 h-4' }),
                                }),
                                _jsx(Button, {
                                  variant: 'ghost',
                                  size: 'sm',
                                  onClick: e => {
                                    e.stopPropagation();
                                    handleDeleteTemplate(template);
                                  },
                                  className: 'text-red-600 hover:text-red-700 hover:bg-red-50',
                                  children: _jsx(Trash2, { className: 'w-4 h-4' }),
                                }),
                              ],
                            }),
                          ],
                        }),
                      }),
                    }),
                  },
                  template.id,
                ),
              ),
            }),
          })
        : _jsxs('div', {
            className: 'text-center py-12',
            children: [
              _jsx(FileText, { className: 'w-16 h-16 text-gray-300 mx-auto mb-4' }),
              _jsx('h3', {
                className: 'text-lg font-medium text-gray-600 mb-2',
                children: searchTerm || filterCategory !== 'all' ? '未找到匹配的模板' : '暂无模板',
              }),
              _jsx('p', {
                className: 'text-gray-500 mb-6',
                children:
                  searchTerm || filterCategory !== 'all'
                    ? '尝试调整搜索条件或筛选器'
                    : '创建您的第一个内容模板，提高内容创作效率',
              }),
              !searchTerm &&
                filterCategory === 'all' &&
                _jsxs(Button, {
                  onClick: handleNewTemplate,
                  className: 'bg-gradient-to-r from-blue-600 to-purple-600',
                  children: [_jsx(Plus, { className: 'w-4 h-4 mr-2' }), '\u65B0\u5EFA\u6A21\u677F'],
                }),
            ],
          }),
    ],
  });
};
export default TemplateList;
