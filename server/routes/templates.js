const express = require('express');
const router = express.Router();
const { runQuery, getQuery, allQuery, parseJsonField, stringifyJsonField } = require('../database');

// 生成唯一ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 获取所有模板
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 50 } = req.query;
    
    let sql = 'SELECT * FROM templates WHERE 1=1';
    const params = [];
    
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    sql += ' ORDER BY usage_count DESC, updated_at DESC';
    
    if (limit !== 'all') {
      const offset = (parseInt(page) - 1) * parseInt(limit);
      sql += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), offset);
    }
    
    const templates = await allQuery(sql, params);
    
    // 转换为前端期望的格式
    const formattedTemplates = templates.map(template => ({
      id: template.id,
      name: template.name,
      main_title: template.description || template.name, // 兼容处理
      structure: parseJsonField(template.content, []), // content字段存储结构化数据
      createdAt: template.created_at,
      updatedAt: template.updated_at
    }));
    
    res.json({
      success: true,
      data: formattedTemplates
    });
  } catch (error) {
    console.error('获取模板列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取模板列表失败',
      error: error.message
    });
  }
});

// 获取单个模板
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const template = await getQuery('SELECT * FROM templates WHERE id = ?', [id]);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: '模板不存在'
      });
    }
    
    // 转换为前端期望的格式
    const formattedTemplate = {
      id: template.id,
      name: template.name,
      main_title: template.description || template.name,
      structure: parseJsonField(template.content, []),
      createdAt: template.created_at,
      updatedAt: template.updated_at
    };
    
    res.json({
      success: true,
      data: formattedTemplate
    });
  } catch (error) {
    console.error('获取模板详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取模板详情失败',
      error: error.message
    });
  }
});

// 创建新模板
router.post('/', async (req, res) => {
  try {
    console.log('📝 收到模板创建请求:', JSON.stringify(req.body, null, 2));
    
    const templateData = req.body;
    const id = generateId();
    
    // 🔥 修复：处理前端发送的数据结构
    const name = templateData.name;
    const main_title = templateData.main_title;
    const structure = templateData.structure || [];
    
    if (!name || !main_title) {
      return res.status(400).json({
        success: false,
        message: '模板名称和主标题不能为空'
      });
    }
    
    const sql = `
      INSERT INTO templates (
        id, name, description, content, category, tags, 
        thumbnail, is_public, usage_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      name,
      main_title, // 将main_title存储为description
      stringifyJsonField(structure), // 将structure存储为content
      templateData.category || null,
      stringifyJsonField(templateData.tags || []),
      templateData.thumbnail || null,
      templateData.is_public !== undefined ? templateData.is_public : true,
      0
    ];
    
    console.log('💾 准备插入数据库，参数:', params);
    
    await runQuery(sql, params);
    
    // 获取创建的模板
    const newTemplate = await getQuery('SELECT * FROM templates WHERE id = ?', [id]);
    
    // 转换为前端期望的格式
    const formattedTemplate = {
      id: newTemplate.id,
      name: newTemplate.name,
      main_title: newTemplate.description,
      structure: parseJsonField(newTemplate.content, []),
      createdAt: newTemplate.created_at,
      updatedAt: newTemplate.updated_at
    };
    
    console.log('✅ 模板创建成功:', formattedTemplate);
    
    // 通知其他客户端
    const io = req.app.get('io');
    if (io) {
      io.emit('templateChange', {
        action: 'create',
        data: formattedTemplate
      });
    }
    
    res.status(201).json({
      success: true,
      message: '模板创建成功',
      data: formattedTemplate
    });
  } catch (error) {
    console.error('❌ 创建模板失败:', error);
    res.status(500).json({
      success: false,
      message: '创建模板失败',
      error: error.message
    });
  }
});

// 更新模板
router.put('/:id', async (req, res) => {
  try {
    console.log('📝 收到模板更新请求:', req.params.id, JSON.stringify(req.body, null, 2));
    
    const { id } = req.params;
    const templateData = req.body;
    
    // 检查模板是否存在
    const existingTemplate = await getQuery('SELECT * FROM templates WHERE id = ?', [id]);
    if (!existingTemplate) {
      return res.status(404).json({
        success: false,
        message: '模板不存在'
      });
    }
    
    // 🔥 修复：处理前端发送的数据结构
    const name = templateData.name || existingTemplate.name;
    const main_title = templateData.main_title || existingTemplate.description;
    const structure = templateData.structure || parseJsonField(existingTemplate.content, []);
    
    const sql = `
      UPDATE templates SET 
        name = ?, description = ?, content = ?, category = ?, tags = ?,
        thumbnail = ?, is_public = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const params = [
      name,
      main_title,
      stringifyJsonField(structure),
      templateData.category || existingTemplate.category,
      stringifyJsonField(templateData.tags || parseJsonField(existingTemplate.tags, [])),
      templateData.thumbnail || existingTemplate.thumbnail,
      templateData.is_public !== undefined ? templateData.is_public : existingTemplate.is_public,
      id
    ];
    
    console.log('💾 准备更新数据库，参数:', params);
    
    await runQuery(sql, params);
    
    // 获取更新后的模板
    const updatedTemplate = await getQuery('SELECT * FROM templates WHERE id = ?', [id]);
    
    // 转换为前端期望的格式
    const formattedTemplate = {
      id: updatedTemplate.id,
      name: updatedTemplate.name,
      main_title: updatedTemplate.description,
      structure: parseJsonField(updatedTemplate.content, []),
      createdAt: updatedTemplate.created_at,
      updatedAt: updatedTemplate.updated_at
    };
    
    console.log('✅ 模板更新成功:', formattedTemplate);
    
    // 通知其他客户端
    const io = req.app.get('io');
    if (io) {
      io.emit('templateChange', {
        action: 'update',
        data: formattedTemplate
      });
    }
    
    res.json({
      success: true,
      message: '模板更新成功',
      data: formattedTemplate
    });
  } catch (error) {
    console.error('❌ 更新模板失败:', error);
    res.status(500).json({
      success: false,
      message: '更新模板失败',
      error: error.message
    });
  }
});

// 删除模板
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查模板是否存在
    const template = await getQuery('SELECT * FROM templates WHERE id = ?', [id]);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: '模板不存在'
      });
    }
    
    await runQuery('DELETE FROM templates WHERE id = ?', [id]);
    
    console.log('✅ 模板删除成功:', id);
    
    // 通知其他客户端
    const io = req.app.get('io');
    if (io) {
      io.emit('templateChange', {
        action: 'delete',
        data: { id }
      });
    }
    
    res.json({
      success: true,
      message: '模板删除成功'
    });
  } catch (error) {
    console.error('❌ 删除模板失败:', error);
    res.status(500).json({
      success: false,
      message: '删除模板失败',
      error: error.message
    });
  }
});

// 批量删除模板
router.delete('/', async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供要删除的模板ID列表'
      });
    }
    
    const placeholders = ids.map(() => '?').join(',');
    await runQuery(`DELETE FROM templates WHERE id IN (${placeholders})`, ids);
    
    console.log('✅ 批量删除模板成功:', ids);
    
    // 通知其他客户端
    const io = req.app.get('io');
    if (io) {
      io.emit('templateChange', {
        action: 'batchDelete',
        data: { ids }
      });
    }
    
    res.json({
      success: true,
      message: `成功删除 ${ids.length} 个模板`
    });
  } catch (error) {
    console.error('❌ 批量删除模板失败:', error);
    res.status(500).json({
      success: false,
      message: '批量删除模板失败',
      error: error.message
    });
  }
});

// 增加模板使用次数
router.patch('/:id/usage', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查模板是否存在
    const template = await getQuery('SELECT * FROM templates WHERE id = ?', [id]);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: '模板不存在'
      });
    }
    
    await runQuery('UPDATE templates SET usage_count = usage_count + 1 WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: '使用次数已更新'
    });
  } catch (error) {
    console.error('更新模板使用次数失败:', error);
    res.status(500).json({
      success: false,
      message: '更新使用次数失败',
      error: error.message
    });
  }
});

module.exports = router; 