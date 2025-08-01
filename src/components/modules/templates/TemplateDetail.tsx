import React, { useState } from 'react';
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
  ChevronRight,
  Plus,
  Save,
  X,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { cn } from '../../../lib/utils';
import type { Template } from '../../../types';
import { Input } from '../../ui/input';
import QuillEditor from '../editor/QuillEditor';

interface TemplateDetailProps {
  template: Template;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUse: () => void;
  onSave: (template: Template) => void;
  className?: string;
}

// 模板类型颜色映射（与TemplateList保持一致）
const getTemplateColor = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('单品')) return 'border-blue-200 text-blue-800';
  if (lowerName.includes('对比')) return 'border-green-200 text-green-800';
  if (lowerName.includes('导购')) return 'border-purple-200 text-purple-800';
  if (lowerName.includes('知乎')) return 'border-orange-200 text-orange-800';
  return 'border-gray-200 text-gray-800';
};

const TemplateDetail: React.FC<TemplateDetailProps> = ({
  template,
  onBack,
  onEdit,
  onDelete,
  onUse,
  onSave,
  className,
}) => {
  const colorClass = getTemplateColor(template.name);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTemplate, setEditedTemplate] = useState(template);

  const handleSave = () => {
    onSave(editedTemplate);
    setIsEditing(false);
  };

  const handleContentChange = (sectionId: string, content: string) => {
    setEditedTemplate(prev => ({
      ...prev,
      structure: prev.structure.map(section =>
        section.id === sectionId ? { ...section, content } : section,
      ),
    }));
  };

  const handleTitleChange = (sectionId: string, title: string) => {
    setEditedTemplate(prev => ({
      ...prev,
      structure: prev.structure.map(section =>
        section.id === sectionId ? { ...section, title } : section,
      ),
    }));
  };

  return (
    <div className={cn('w-full max-w-none space-y-6', className)}>
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>返回列表</span>
        </Button>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            复制模板
          </Button>
          {isEditing ? (
            <>
              <Button variant="default" size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                取消
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              编辑
            </Button>
          )}
          <Button onClick={onUse}>
            <Play className="w-4 h-4 mr-2" />
            使用模板
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            删除
          </Button>
        </div>
      </div>

      {/* 模板头部信息 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <Input
                    value={editedTemplate.name}
                    onChange={e => setEditedTemplate(prev => ({ ...prev, name: e.target.value }))}
                    className="text-3xl font-bold h-auto py-1"
                  />
                ) : (
                  <h1 className="text-3xl font-bold">{editedTemplate.name}</h1>
                )}
                <Badge className={cn('border', colorClass)}>
                  {editedTemplate.structure.length} 个章节
                </Badge>
              </div>
              {isEditing ? (
                <Input
                  value={editedTemplate.main_title}
                  onChange={e =>
                    setEditedTemplate(prev => ({ ...prev, main_title: e.target.value }))
                  }
                  className="text-xl text-muted-foreground font-medium h-auto py-1"
                />
              ) : (
                <p className="text-xl text-muted-foreground font-medium">
                  {editedTemplate.main_title}
                </p>
              )}
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    创建于 {new Date(editedTemplate.created_at).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>
                    最后更新于 {new Date(editedTemplate.updated_at).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 模板结构 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Hash className="w-5 h-5" />
            <span>文章结构</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {editedTemplate.structure.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="transition-all duration-200 hover:shadow-sm border-l-4 border-l-primary/20 hover:border-l-primary">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {isEditing ? (
                        <>
                          <Input
                            value={section.title}
                            onChange={e => handleTitleChange(section.id, e.target.value)}
                            className="font-medium text-lg mb-2"
                          />
                          <QuillEditor
                            content={section.content || ''}
                            onChange={content => handleContentChange(section.id, content)}
                            placeholder="在这里编辑章节内容..."
                            height={200}
                          />
                        </>
                      ) : (
                        <>
                          <h3 className="font-medium text-lg">{section.title}</h3>
                          {section.content && (
                            <div className="text-muted-foreground">{section.content}</div>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* 添加新章节按钮 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: editedTemplate.structure.length * 0.1 + 0.2 }}
          >
            <Card className="border-dashed border-2 border-muted-foreground/20 hover:border-primary/40 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">添加新章节</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </CardContent>
      </Card>

      {/* 模板使用指南 */}
      <Card>
        <CardHeader>
          <CardTitle>使用指南</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">适用场景</h4>
                <p className="text-sm text-muted-foreground">
                  {template.name.includes('单品') && '单个产品的详细评测和介绍'}
                  {template.name.includes('对比') && '多个产品的横向对比分析'}
                  {template.name.includes('导购') && '为用户提供购买建议和指导'}
                  {template.name.includes('知乎') && '深度分析和专业解答'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">推荐长度</h4>
                <p className="text-sm text-muted-foreground">
                  {template.name.includes('单品') && '1500-2500字，包含详细测试数据'}
                  {template.name.includes('对比') && '2000-3000字，重点突出差异化'}
                  {template.name.includes('导购') && '1000-2000字，简洁明了易懂'}
                  {template.name.includes('知乎') && '3000字以上，深度分析'}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-sm mb-2">写作建议</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 保持逻辑清晰，章节之间过渡自然</li>
                <li>• 重点突出产品特色和用户关心的功能</li>
                <li>• 适当添加实际使用数据和测试结果</li>
                <li>• 结合目标用户群体的真实需求</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 版本历史 */}
      <Card>
        <CardHeader>
          <CardTitle>版本历史</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium text-sm">当前版本</div>
                <div className="text-xs text-muted-foreground">
                  最后更新: {new Date(template.updated_at).toLocaleString('zh-CN')}
                </div>
              </div>
              <Badge variant="outline">v1.0</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg opacity-60">
              <div>
                <div className="font-medium text-sm">初始版本</div>
                <div className="text-xs text-muted-foreground">
                  创建时间: {new Date(template.created_at).toLocaleString('zh-CN')}
                </div>
              </div>
              <Badge variant="outline">v0.1</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateDetail;
