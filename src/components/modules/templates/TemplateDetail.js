import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  Play,
  FileText,
  Calendar,
  Hash,
  Plus,
  Save,
  X,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { cn } from '../../../lib/utils';
import { Input } from '../../ui/input';
import QuillEditor from '../editor/QuillEditor';
// 模板类型颜色映射（与TemplateList保持一致）
const getTemplateColor = name => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('单品')) return 'border-blue-200 text-blue-800';
  if (lowerName.includes('对比')) return 'border-green-200 text-green-800';
  if (lowerName.includes('导购')) return 'border-purple-200 text-purple-800';
  if (lowerName.includes('知乎')) return 'border-orange-200 text-orange-800';
  return 'border-gray-200 text-gray-800';
};
const TemplateDetail = ({ template, onBack, onEdit, onDelete, onUse, onSave, className }) => {
  const colorClass = getTemplateColor(template.name);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTemplate, setEditedTemplate] = useState(template);
  const handleSave = () => {
    onSave(editedTemplate);
    setIsEditing(false);
  };
  const handleContentChange = (sectionId, content) => {
    setEditedTemplate(prev => ({
      ...prev,
      structure: prev.structure.map(section =>
        section.id === sectionId ? { ...section, content } : section,
      ),
    }));
  };
  const handleTitleChange = (sectionId, title) => {
    setEditedTemplate(prev => ({
      ...prev,
      structure: prev.structure.map(section =>
        section.id === sectionId ? { ...section, title } : section,
      ),
    }));
  };
  return _jsxs('div', {
    className: cn('w-full max-w-none space-y-6', className),
    children: [
      _jsxs('div', {
        className: 'flex items-center justify-between',
        children: [
          _jsxs(Button, {
            variant: 'ghost',
            onClick: onBack,
            className: 'flex items-center space-x-2',
            children: [
              _jsx(ArrowLeft, { className: 'w-4 h-4' }),
              _jsx('span', { children: '\u8FD4\u56DE\u5217\u8868' }),
            ],
          }),
          _jsxs('div', {
            className: 'flex items-center space-x-2',
            children: [
              _jsxs(Button, {
                variant: 'outline',
                size: 'sm',
                children: [_jsx(Copy, { className: 'w-4 h-4 mr-2' }), '\u590D\u5236\u6A21\u677F'],
              }),
              isEditing
                ? _jsxs(_Fragment, {
                    children: [
                      _jsxs(Button, {
                        variant: 'default',
                        size: 'sm',
                        onClick: handleSave,
                        children: [_jsx(Save, { className: 'w-4 h-4 mr-2' }), '\u4FDD\u5B58'],
                      }),
                      _jsxs(Button, {
                        variant: 'outline',
                        size: 'sm',
                        onClick: () => setIsEditing(false),
                        children: [_jsx(X, { className: 'w-4 h-4 mr-2' }), '\u53D6\u6D88'],
                      }),
                    ],
                  })
                : _jsxs(Button, {
                    variant: 'outline',
                    size: 'sm',
                    onClick: () => setIsEditing(true),
                    children: [_jsx(Edit, { className: 'w-4 h-4 mr-2' }), '\u7F16\u8F91'],
                  }),
              _jsxs(Button, {
                onClick: onUse,
                children: [_jsx(Play, { className: 'w-4 h-4 mr-2' }), '\u4F7F\u7528\u6A21\u677F'],
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
      _jsx(Card, {
        children: _jsx(CardHeader, {
          children: _jsx('div', {
            className: 'flex items-start justify-between',
            children: _jsxs('div', {
              className: 'space-y-3',
              children: [
                _jsxs('div', {
                  className: 'flex items-center space-x-3',
                  children: [
                    isEditing
                      ? _jsx(Input, {
                          value: editedTemplate.name,
                          onChange: e =>
                            setEditedTemplate(prev => ({ ...prev, name: e.target.value })),
                          className: 'text-3xl font-bold h-auto py-1',
                        })
                      : _jsx('h1', {
                          className: 'text-3xl font-bold',
                          children: editedTemplate.name,
                        }),
                    _jsxs(Badge, {
                      className: cn('border', colorClass),
                      children: [editedTemplate.structure.length, ' \u4E2A\u7AE0\u8282'],
                    }),
                  ],
                }),
                isEditing
                  ? _jsx(Input, {
                      value: editedTemplate.main_title,
                      onChange: e =>
                        setEditedTemplate(prev => ({ ...prev, main_title: e.target.value })),
                      className: 'text-xl text-muted-foreground font-medium h-auto py-1',
                    })
                  : _jsx('p', {
                      className: 'text-xl text-muted-foreground font-medium',
                      children: editedTemplate.main_title,
                    }),
                _jsxs('div', {
                  className: 'flex items-center space-x-4 text-sm text-muted-foreground',
                  children: [
                    _jsxs('div', {
                      className: 'flex items-center space-x-1',
                      children: [
                        _jsx(Calendar, { className: 'w-4 h-4' }),
                        _jsxs('span', {
                          children: [
                            '\u521B\u5EFA\u4E8E ',
                            new Date(editedTemplate.created_at).toLocaleDateString('zh-CN'),
                          ],
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      className: 'flex items-center space-x-1',
                      children: [
                        _jsx(FileText, { className: 'w-4 h-4' }),
                        _jsxs('span', {
                          children: [
                            '\u6700\u540E\u66F4\u65B0\u4E8E ',
                            new Date(editedTemplate.updated_at).toLocaleDateString('zh-CN'),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
        }),
      }),
      _jsxs(Card, {
        children: [
          _jsx(CardHeader, {
            children: _jsxs(CardTitle, {
              className: 'flex items-center space-x-2',
              children: [
                _jsx(Hash, { className: 'w-5 h-5' }),
                _jsx('span', { children: '\u6587\u7AE0\u7ED3\u6784' }),
              ],
            }),
          }),
          _jsxs(CardContent, {
            className: 'space-y-4',
            children: [
              _jsx('div', {
                className: 'space-y-3',
                children: editedTemplate.structure.map((section, index) =>
                  _jsx(
                    motion.div,
                    {
                      initial: { opacity: 0, x: -20 },
                      animate: { opacity: 1, x: 0 },
                      transition: { delay: index * 0.1 },
                      className: 'group',
                      children: _jsx(Card, {
                        className:
                          'transition-all duration-200 hover:shadow-sm border-l-4 border-l-primary/20 hover:border-l-primary',
                        children: _jsx(CardContent, {
                          className: 'p-4',
                          children: _jsx('div', {
                            className: 'space-y-2',
                            children: isEditing
                              ? _jsxs(_Fragment, {
                                  children: [
                                    _jsx(Input, {
                                      value: section.title,
                                      onChange: e => handleTitleChange(section.id, e.target.value),
                                      className: 'font-medium text-lg mb-2',
                                    }),
                                    _jsx(QuillEditor, {
                                      content: section.content || '',
                                      onChange: content => handleContentChange(section.id, content),
                                      placeholder:
                                        '\u5728\u8FD9\u91CC\u7F16\u8F91\u7AE0\u8282\u5185\u5BB9...',
                                      height: 200,
                                    }),
                                  ],
                                })
                              : _jsxs(_Fragment, {
                                  children: [
                                    _jsx('h3', {
                                      className: 'font-medium text-lg',
                                      children: section.title,
                                    }),
                                    section.content &&
                                      _jsx('div', {
                                        className: 'text-muted-foreground',
                                        children: section.content,
                                      }),
                                  ],
                                }),
                          }),
                        }),
                      }),
                    },
                    section.id,
                  ),
                ),
              }),
              _jsx(motion.div, {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: editedTemplate.structure.length * 0.1 + 0.2 },
                children: _jsx(Card, {
                  className:
                    'border-dashed border-2 border-muted-foreground/20 hover:border-primary/40 transition-colors cursor-pointer',
                  children: _jsx(CardContent, {
                    className: 'p-4',
                    children: _jsxs('div', {
                      className:
                        'flex items-center justify-center space-x-2 text-muted-foreground hover:text-primary transition-colors',
                      children: [
                        _jsx(Plus, { className: 'w-4 h-4' }),
                        _jsx('span', {
                          className: 'text-sm',
                          children: '\u6DFB\u52A0\u65B0\u7AE0\u8282',
                        }),
                      ],
                    }),
                  }),
                }),
              }),
            ],
          }),
        ],
      }),
      _jsxs(Card, {
        children: [
          _jsx(CardHeader, { children: _jsx(CardTitle, { children: '\u4F7F\u7528\u6307\u5357' }) }),
          _jsx(CardContent, {
            children: _jsxs('div', {
              className: 'space-y-4',
              children: [
                _jsxs('div', {
                  className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
                  children: [
                    _jsxs('div', {
                      className: 'space-y-2',
                      children: [
                        _jsx('h4', {
                          className: 'font-medium text-sm',
                          children: '\u9002\u7528\u573A\u666F',
                        }),
                        _jsxs('p', {
                          className: 'text-sm text-muted-foreground',
                          children: [
                            template.name.includes('单品') && '单个产品的详细评测和介绍',
                            template.name.includes('对比') && '多个产品的横向对比分析',
                            template.name.includes('导购') && '为用户提供购买建议和指导',
                            template.name.includes('知乎') && '深度分析和专业解答',
                          ],
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      className: 'space-y-2',
                      children: [
                        _jsx('h4', {
                          className: 'font-medium text-sm',
                          children: '\u63A8\u8350\u957F\u5EA6',
                        }),
                        _jsxs('p', {
                          className: 'text-sm text-muted-foreground',
                          children: [
                            template.name.includes('单品') && '1500-2500字，包含详细测试数据',
                            template.name.includes('对比') && '2000-3000字，重点突出差异化',
                            template.name.includes('导购') && '1000-2000字，简洁明了易懂',
                            template.name.includes('知乎') && '3000字以上，深度分析',
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                _jsxs('div', {
                  className: 'border-t pt-4',
                  children: [
                    _jsx('h4', {
                      className: 'font-medium text-sm mb-2',
                      children: '\u5199\u4F5C\u5EFA\u8BAE',
                    }),
                    _jsxs('ul', {
                      className: 'space-y-1 text-sm text-muted-foreground',
                      children: [
                        _jsx('li', {
                          children:
                            '\u2022 \u4FDD\u6301\u903B\u8F91\u6E05\u6670\uFF0C\u7AE0\u8282\u4E4B\u95F4\u8FC7\u6E21\u81EA\u7136',
                        }),
                        _jsx('li', {
                          children:
                            '\u2022 \u91CD\u70B9\u7A81\u51FA\u4EA7\u54C1\u7279\u8272\u548C\u7528\u6237\u5173\u5FC3\u7684\u529F\u80FD',
                        }),
                        _jsx('li', {
                          children:
                            '\u2022 \u9002\u5F53\u6DFB\u52A0\u5B9E\u9645\u4F7F\u7528\u6570\u636E\u548C\u6D4B\u8BD5\u7ED3\u679C',
                        }),
                        _jsx('li', {
                          children:
                            '\u2022 \u7ED3\u5408\u76EE\u6807\u7528\u6237\u7FA4\u4F53\u7684\u771F\u5B9E\u9700\u6C42',
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
      _jsxs(Card, {
        children: [
          _jsx(CardHeader, { children: _jsx(CardTitle, { children: '\u7248\u672C\u5386\u53F2' }) }),
          _jsx(CardContent, {
            children: _jsxs('div', {
              className: 'space-y-3',
              children: [
                _jsxs('div', {
                  className: 'flex items-center justify-between p-3 border rounded-lg',
                  children: [
                    _jsxs('div', {
                      children: [
                        _jsx('div', {
                          className: 'font-medium text-sm',
                          children: '\u5F53\u524D\u7248\u672C',
                        }),
                        _jsxs('div', {
                          className: 'text-xs text-muted-foreground',
                          children: [
                            '\u6700\u540E\u66F4\u65B0: ',
                            new Date(template.updated_at).toLocaleString('zh-CN'),
                          ],
                        }),
                      ],
                    }),
                    _jsx(Badge, { variant: 'outline', children: 'v1.0' }),
                  ],
                }),
                _jsxs('div', {
                  className: 'flex items-center justify-between p-3 border rounded-lg opacity-60',
                  children: [
                    _jsxs('div', {
                      children: [
                        _jsx('div', {
                          className: 'font-medium text-sm',
                          children: '\u521D\u59CB\u7248\u672C',
                        }),
                        _jsxs('div', {
                          className: 'text-xs text-muted-foreground',
                          children: [
                            '\u521B\u5EFA\u65F6\u95F4: ',
                            new Date(template.created_at).toLocaleString('zh-CN'),
                          ],
                        }),
                      ],
                    }),
                    _jsx(Badge, { variant: 'outline', children: 'v0.1' }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
};
export default TemplateDetail;
