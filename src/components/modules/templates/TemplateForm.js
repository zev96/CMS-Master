import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Plus, Trash2, FileText, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { cn } from '../../../lib/utils';
const TemplateForm = ({ template, onSave, onCancel, className }) => {
  const [formData, setFormData] = useState({
    name: '',
    main_title: '',
    structure: [],
  });
  const [newSectionTitle, setNewSectionTitle] = useState('');
  // 初始化表单数据
  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        main_title: template.main_title,
        structure: [...template.structure],
      });
    }
  }, [template]);
  // 生成新的章节ID
  const generateSectionId = () =>
    `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  // 添加新章节
  const addSection = () => {
    if (newSectionTitle.trim()) {
      const newSection = {
        id: generateSectionId(),
        title: newSectionTitle.trim(),
        order: formData.structure.length + 1,
      };
      setFormData(prev => ({
        ...prev,
        structure: [...prev.structure, newSection],
      }));
      setNewSectionTitle('');
    }
  };
  // 删除章节
  const removeSection = id => {
    setFormData(prev => {
      const newStructure = prev.structure
        .filter(section => section.id !== id)
        .map((section, index) => ({ ...section, order: index + 1 }));
      return {
        ...prev,
        structure: newStructure,
      };
    });
  };
  // 更新章节标题
  const updateSectionTitle = (id, title) => {
    setFormData(prev => ({
      ...prev,
      structure: prev.structure.map(section =>
        section.id === id ? { ...section, title } : section,
      ),
    }));
  };
  // 移动章节位置
  const moveSectionUp = index => {
    if (index > 0) {
      setFormData(prev => {
        const newStructure = [...prev.structure];
        [newStructure[index], newStructure[index - 1]] = [
          newStructure[index - 1],
          newStructure[index],
        ];
        // 更新order字段
        newStructure.forEach((section, idx) => {
          section.order = idx + 1;
        });
        return { ...prev, structure: newStructure };
      });
    }
  };
  const moveSectionDown = index => {
    if (index < formData.structure.length - 1) {
      setFormData(prev => {
        const newStructure = [...prev.structure];
        [newStructure[index], newStructure[index + 1]] = [
          newStructure[index + 1],
          newStructure[index],
        ];
        // 更新order字段
        newStructure.forEach((section, idx) => {
          section.order = idx + 1;
        });
        return { ...prev, structure: newStructure };
      });
    }
  };
  // 表单验证
  const validateForm = () => {
    return !!(formData.name.trim() && formData.main_title.trim() && formData.structure.length > 0);
  };
  // 提交表单
  const handleSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };
  const isEditing = !!template;
  const handleSectionChange = (index, field, value) => {
    const newStructure = [...formData.structure];
    const sectionToUpdate = { ...newStructure[index], [field]: value };
    newStructure[index] = sectionToUpdate;
    setFormData(prev => ({ ...prev, structure: newStructure }));
  };
  return _jsxs('div', {
    className: cn('w-full max-w-none space-y-6', className),
    children: [
      _jsxs('div', {
        className: 'flex items-center justify-between',
        children: [
          _jsx('h1', {
            className: 'text-2xl font-bold',
            children: isEditing ? '编辑模板' : '新建模板',
          }),
          _jsxs('div', {
            className: 'flex items-center space-x-2',
            children: [
              _jsxs(Button, {
                variant: 'outline',
                onClick: onCancel,
                children: [_jsx(X, { className: 'w-4 h-4 mr-2' }), '\u53D6\u6D88'],
              }),
              _jsxs(Button, {
                onClick: handleSubmit,
                disabled: !validateForm(),
                children: [_jsx(Save, { className: 'w-4 h-4 mr-2' }), '\u4FDD\u5B58'],
              }),
            ],
          }),
        ],
      }),
      _jsxs('form', {
        onSubmit: handleSubmit,
        className: 'space-y-6',
        children: [
          _jsxs(Card, {
            children: [
              _jsx(CardHeader, {
                children: _jsxs(CardTitle, {
                  className: 'flex items-center space-x-2',
                  children: [
                    _jsx(FileText, { className: 'w-5 h-5' }),
                    _jsx('span', { children: '\u57FA\u672C\u4FE1\u606F' }),
                  ],
                }),
              }),
              _jsx(CardContent, {
                className: 'space-y-4',
                children: _jsxs('div', {
                  className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
                  children: [
                    _jsxs('div', {
                      children: [
                        _jsx('label', {
                          className: 'text-sm font-medium mb-2 block',
                          children: '\u6A21\u677F\u540D\u79F0 *',
                        }),
                        _jsx(Input, {
                          value: formData.name,
                          onChange: e => setFormData(prev => ({ ...prev, name: e.target.value })),
                          placeholder:
                            '\u5982\uFF1A\u5355\u54C1\u6587\u3001\u5BF9\u6BD4\u6587\u7B49',
                          required: true,
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      children: [
                        _jsx('label', {
                          className: 'text-sm font-medium mb-2 block',
                          children: '\u4E3B\u6807\u9898 *',
                        }),
                        _jsx(Input, {
                          value: formData.main_title,
                          onChange: e =>
                            setFormData(prev => ({ ...prev, main_title: e.target.value })),
                          placeholder: '\u5982\uFF1A\u4EA7\u54C1\u8BE6\u7EC6\u8BC4\u6D4B',
                          required: true,
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
              _jsx(CardHeader, {
                children: _jsx(CardTitle, { children: '\u6587\u7AE0\u7ED3\u6784' }),
              }),
              _jsxs(CardContent, {
                className: 'space-y-4',
                children: [
                  _jsx('div', {
                    className: 'space-y-3',
                    children: formData.structure.map((section, index) =>
                      _jsx(
                        motion.div,
                        {
                          layout: true,
                          initial: { opacity: 0, y: -10 },
                          animate: { opacity: 1, y: 0 },
                          exit: { opacity: 0, x: -20 },
                          transition: { duration: 0.2 },
                          className: 'bg-gray-50 p-4 rounded-lg border',
                          children: _jsxs('div', {
                            className: 'flex items-center justify-between',
                            children: [
                              _jsxs('div', {
                                className: 'flex-1',
                                children: [
                                  _jsxs('label', {
                                    className: 'text-sm font-medium text-gray-600 block mb-1',
                                    children: ['\u7AE0\u8282 ', index + 1, ' \u6807\u9898'],
                                  }),
                                  _jsx(Input, {
                                    value: section.title,
                                    onChange: e =>
                                      handleSectionChange(index, 'title', e.target.value),
                                    placeholder: '\u4F8B\u5982\uFF1A\u4EA7\u54C1\u4ECB\u7ECD',
                                  }),
                                  _jsx('label', {
                                    className: 'text-sm font-medium text-gray-600 block mt-3 mb-1',
                                    children: '\u9884\u8BBE\u5185\u5BB9 (\u53EF\u9009)',
                                  }),
                                  _jsx('textarea', {
                                    value: section.content || '',
                                    onChange: e =>
                                      handleSectionChange(index, 'content', e.target.value),
                                    placeholder:
                                      '\u4E3A\u8FD9\u4E2A\u7AE0\u8282\u7F16\u5199\u9884\u8BBE\u5185\u5BB9...',
                                    className:
                                      'w-full p-2 border rounded-md min-h-[100px] text-sm focus:ring-blue-500 focus:border-blue-500',
                                  }),
                                ],
                              }),
                              _jsxs('div', {
                                className:
                                  'flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity',
                                children: [
                                  _jsx(Button, {
                                    type: 'button',
                                    variant: 'ghost',
                                    size: 'sm',
                                    onClick: () => moveSectionUp(index),
                                    disabled: index === 0,
                                    className: 'h-8 w-8 p-0',
                                    children: _jsx(ArrowUp, { className: 'w-3 h-3' }),
                                  }),
                                  _jsx(Button, {
                                    type: 'button',
                                    variant: 'ghost',
                                    size: 'sm',
                                    onClick: () => moveSectionDown(index),
                                    disabled: index === formData.structure.length - 1,
                                    className: 'h-8 w-8 p-0',
                                    children: _jsx(ArrowDown, { className: 'w-3 h-3' }),
                                  }),
                                  _jsx(Button, {
                                    type: 'button',
                                    variant: 'ghost',
                                    size: 'sm',
                                    onClick: () => removeSection(section.id),
                                    className:
                                      'h-8 w-8 p-0 text-destructive hover:text-destructive',
                                    children: _jsx(Trash2, { className: 'w-3 h-3' }),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        },
                        section.id,
                      ),
                    ),
                  }),
                  _jsxs('div', {
                    className: 'flex space-x-2',
                    children: [
                      _jsx(Input, {
                        value: newSectionTitle,
                        onChange: e => setNewSectionTitle(e.target.value),
                        placeholder: '\u8F93\u5165\u65B0\u7AE0\u8282\u6807\u9898...',
                        onKeyPress: e => e.key === 'Enter' && (e.preventDefault(), addSection()),
                      }),
                      _jsx(Button, {
                        type: 'button',
                        onClick: addSection,
                        children: _jsx(Plus, { className: 'w-4 h-4' }),
                      }),
                    ],
                  }),
                  formData.structure.length === 0 &&
                    _jsxs('div', {
                      className: 'text-center py-8 text-muted-foreground',
                      children: [
                        _jsx(FileText, { className: 'w-12 h-12 mx-auto mb-4 opacity-50' }),
                        _jsx('p', { children: '\u8FD8\u6CA1\u6709\u6DFB\u52A0\u7AE0\u8282' }),
                        _jsx('p', {
                          className: 'text-sm',
                          children:
                            '\u5728\u4E0A\u65B9\u8F93\u5165\u6846\u4E2D\u6DFB\u52A0\u7B2C\u4E00\u4E2A\u7AE0\u8282',
                        }),
                      ],
                    }),
                ],
              }),
            ],
          }),
          !isEditing &&
            formData.structure.length === 0 &&
            _jsxs(Card, {
              children: [
                _jsx(CardHeader, {
                  children: _jsx(CardTitle, { children: '\u9884\u8BBE\u6A21\u677F' }),
                }),
                _jsx(CardContent, {
                  children: _jsx('div', {
                    className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
                    children: [
                      {
                        name: '单品评测',
                        sections: ['产品介绍', '外观设计', '性能测试', '使用体验', '总结评价'],
                      },
                      {
                        name: '产品对比',
                        sections: ['对比概述', '外观对比', '性能对比', '价格对比', '购买建议'],
                      },
                      {
                        name: '导购指南',
                        sections: ['需求分析', '产品推荐', '性价比分析', '购买建议'],
                      },
                      {
                        name: '深度解析',
                        sections: ['背景介绍', '深度分析', '实际测试', '总结思考'],
                      },
                    ].map(preset =>
                      _jsx(
                        Card,
                        {
                          className: 'cursor-pointer hover:shadow-md transition-shadow',
                          onClick: () => {
                            const sections = preset.sections.map((title, index) => ({
                              id: generateSectionId(),
                              title,
                              order: index + 1,
                            }));
                            setFormData(prev => ({
                              ...prev,
                              name: preset.name,
                              structure: sections,
                            }));
                          },
                          children: _jsxs(CardContent, {
                            className: 'p-4',
                            children: [
                              _jsx('h4', { className: 'font-medium mb-2', children: preset.name }),
                              _jsx('div', {
                                className: 'space-y-1',
                                children: preset.sections.map((section, index) =>
                                  _jsxs(
                                    'div',
                                    {
                                      className: 'text-xs text-muted-foreground flex items-center',
                                      children: [
                                        _jsxs('span', {
                                          className: 'w-4 text-center',
                                          children: [index + 1, '.'],
                                        }),
                                        _jsx('span', { children: section }),
                                      ],
                                    },
                                    index,
                                  ),
                                ),
                              }),
                            ],
                          }),
                        },
                        preset.name,
                      ),
                    ),
                  }),
                }),
              ],
            }),
        ],
      }),
    ],
  });
};
export default TemplateForm;
