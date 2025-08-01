import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Plus, Trash2, FileText, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { cn } from '../../../lib/utils';
import type { Template, TemplateSection } from '../../../types';

interface TemplateFormData {
  name: string;
  main_title: string;
  structure: Array<{
    id: string;
    title: string;
    order: number;
    content?: string;
  }>;
}

interface TemplateFormProps {
  template?: Template;
  onSave: (data: TemplateFormData) => void;
  onCancel: () => void;
  className?: string;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ template, onSave, onCancel, className }) => {
  const [formData, setFormData] = useState<TemplateFormData>({
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
      const newSection: TemplateSection = {
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
  const removeSection = (id: string) => {
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
  const updateSectionTitle = (id: string, title: string) => {
    setFormData(prev => ({
      ...prev,
      structure: prev.structure.map(section =>
        section.id === id ? { ...section, title } : section,
      ),
    }));
  };

  // 移动章节位置
  const moveSectionUp = (index: number) => {
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

  const moveSectionDown = (index: number) => {
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
  const validateForm = (): boolean => {
    return !!(formData.name.trim() && formData.main_title.trim() && formData.structure.length > 0);
  };

  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const isEditing = !!template;

  const handleSectionChange = (index: number, field: 'title' | 'content', value: string) => {
    const newStructure = [...formData.structure];
    const sectionToUpdate = { ...newStructure[index], [field]: value };
    newStructure[index] = sectionToUpdate;
    setFormData(prev => ({ ...prev, structure: newStructure }));
  };

  return (
    <div className={cn('w-full max-w-none space-y-6', className)}>
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isEditing ? '编辑模板' : '新建模板'}</h1>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={!validateForm()}>
            <Save className="w-4 h-4 mr-2" />
            保存
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>基本信息</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">模板名称 *</label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="如：单品文、对比文等"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">主标题 *</label>
                <Input
                  value={formData.main_title}
                  onChange={e => setFormData(prev => ({ ...prev, main_title: e.target.value }))}
                  placeholder="如：产品详细评测"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 文章结构 */}
        <Card>
          <CardHeader>
            <CardTitle>文章结构</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 章节列表 */}
            <div className="space-y-3">
              {formData.structure.map((section, index) => (
                <motion.div
                  key={section.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-50 p-4 rounded-lg border"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-600 block mb-1">
                        章节 {index + 1} 标题
                      </label>
                      <Input
                        value={section.title}
                        onChange={e => handleSectionChange(index, 'title', e.target.value)}
                        placeholder="例如：产品介绍"
                      />
                      <label className="text-sm font-medium text-gray-600 block mt-3 mb-1">
                        预设内容 (可选)
                      </label>
                      <textarea
                        value={section.content || ''}
                        onChange={e => handleSectionChange(index, 'content', e.target.value)}
                        placeholder="为这个章节编写预设内容..."
                        className="w-full p-2 border rounded-md min-h-[100px] text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSectionUp(index)}
                        disabled={index === 0}
                        className="h-8 w-8 p-0"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSectionDown(index)}
                        disabled={index === formData.structure.length - 1}
                        className="h-8 w-8 p-0"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSection(section.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 添加新章节 */}
            <div className="flex space-x-2">
              <Input
                value={newSectionTitle}
                onChange={e => setNewSectionTitle(e.target.value)}
                placeholder="输入新章节标题..."
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSection())}
              />
              <Button type="button" onClick={addSection}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {formData.structure.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>还没有添加章节</p>
                <p className="text-sm">在上方输入框中添加第一个章节</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 预设模板建议 */}
        {!isEditing && formData.structure.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>预设模板</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
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
                ].map(preset => (
                  <Card
                    key={preset.name}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
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
                    }}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">{preset.name}</h4>
                      <div className="space-y-1">
                        {preset.sections.map((section, index) => (
                          <div
                            key={index}
                            className="text-xs text-muted-foreground flex items-center"
                          >
                            <span className="w-4 text-center">{index + 1}.</span>
                            <span>{section}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
};

export default TemplateForm;
