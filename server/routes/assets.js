const express = require('express');
const router = express.Router();
const { runQuery, getQuery, allQuery, parseJsonField, stringifyJsonField } = require('../database');

// 生成唯一ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// =============== 文本素材路由 ===============

// 获取所有文本素材
router.get('/text', async (req, res) => {
  try {
    const { category, search, type, page = 1, limit = 50 } = req.query;
    
    let sql = 'SELECT * FROM text_assets WHERE 1=1';
    const params = [];
    
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }
    
    if (search) {
      sql += ' AND (title LIKE ? OR content LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    sql += ' ORDER BY usage_count DESC, updated_at DESC';
    
    if (limit !== 'all') {
      const offset = (parseInt(page) - 1) * parseInt(limit);
      sql += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), offset);
    }
    
    const textAssets = await allQuery(sql, params);
    
    // 转换为前端期望的格式
    const formattedAssets = textAssets.map(asset => ({
      id: asset.id,
      title: asset.title,
      content: asset.content,
      asset_category: asset.category,
      productCategory: asset.product_category,
      sub_category: asset.sub_category,
      brand: asset.brand,
      tags: parseJsonField(asset.tags, []),
      created_at: asset.created_at,
      updated_at: asset.updated_at
    }));
    
    res.json({
      success: true,
      data: formattedAssets
    });
  } catch (error) {
    console.error('❌ 获取文本素材失败:', error);
    res.status(500).json({
      success: false,
      message: '获取文本素材失败',
      error: error.message
    });
  }
});

// 获取单个文本素材
router.get('/text/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await getQuery('SELECT * FROM text_assets WHERE id = ?', [id]);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: '文本素材不存在'
      });
    }
    
    // 转换为前端期望的格式
    const formattedAsset = {
      id: asset.id,
      title: asset.title,
      content: asset.content,
      asset_category: asset.category,
      productCategory: asset.product_category,
      sub_category: asset.sub_category,
      brand: asset.brand,
      tags: parseJsonField(asset.tags, []),
      created_at: asset.created_at,
      updated_at: asset.updated_at
    };
    
    res.json({
      success: true,
      data: formattedAsset
    });
  } catch (error) {
    console.error('❌ 获取文本素材详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取文本素材详情失败',
      error: error.message
    });
  }
});

// 创建文本素材
router.post('/text', async (req, res) => {
  try {
    console.log('📝 收到文本素材创建请求:', JSON.stringify(req.body, null, 2));
    
    const assetData = req.body;
    const id = generateId();
    
    // 🔥 修复：处理前端发送的数据结构
    const title = assetData.title;
    const content = assetData.content;
    const category = assetData.category || assetData.asset_category;
    const productCategory = assetData.productCategory;
    const subCategory = assetData.sub_category;
    const brand = assetData.brand;
    const tags = assetData.tags || [];
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: '标题和内容不能为空'
      });
    }
    
    const sql = `
      INSERT INTO text_assets (
        id, title, content, category, product_category, sub_category, brand, tags, type, language, usage_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      title,
      content,
      category || null,
      productCategory || null,
      subCategory || null,
      brand || null,
      stringifyJsonField(tags),
      assetData.type || 'text',
      assetData.language || 'zh-CN',
      0
    ];
    
    console.log('💾 准备插入数据库，参数:', params);
    
    await runQuery(sql, params);
    
    // 获取创建的素材
    const newAsset = await getQuery('SELECT * FROM text_assets WHERE id = ?', [id]);
    
    // 转换为前端期望的格式
    const formattedAsset = {
      id: newAsset.id,
      title: newAsset.title,
      content: newAsset.content,
      asset_category: newAsset.category,
      productCategory: newAsset.product_category,
      sub_category: newAsset.sub_category,
      brand: newAsset.brand,
      tags: parseJsonField(newAsset.tags, []),
      created_at: newAsset.created_at,
      updated_at: newAsset.updated_at
    };
    
    console.log('✅ 文本素材创建成功:', formattedAsset);
    
    // 通知其他客户端
    const io = req.app.get('io');
    if (io) {
      io.emit('assetChange', {
        type: 'text',
        action: 'create',
        data: formattedAsset
      });
    }
    
    res.status(201).json({
      success: true,
      message: '文本素材创建成功',
      data: formattedAsset
    });
  } catch (error) {
    console.error('❌ 创建文本素材失败:', error);
    res.status(500).json({
      success: false,
      message: '创建文本素材失败',
      error: error.message
    });
  }
});

// 更新文本素材
router.put('/text/:id', async (req, res) => {
  try {
    console.log('📝 收到文本素材更新请求:', req.params.id, JSON.stringify(req.body, null, 2));
    
    const { id } = req.params;
    const assetData = req.body;
    
    // 检查素材是否存在
    const existingAsset = await getQuery('SELECT * FROM text_assets WHERE id = ?', [id]);
    if (!existingAsset) {
      return res.status(404).json({
        success: false,
        message: '文本素材不存在'
      });
    }
    
    // 🔥 修复：处理前端发送的数据结构
    const title = assetData.title || existingAsset.title;
    const content = assetData.content || existingAsset.content;
    const category = assetData.category || assetData.asset_category || existingAsset.category;
    const productCategory = assetData.productCategory !== undefined ? assetData.productCategory : existingAsset.product_category;
    const subCategory = assetData.sub_category !== undefined ? assetData.sub_category : existingAsset.sub_category;
    const brand = assetData.brand !== undefined ? assetData.brand : existingAsset.brand;
    const tags = assetData.tags || parseJsonField(existingAsset.tags, []);
    
    const sql = `
      UPDATE text_assets SET 
        title = ?, content = ?, category = ?, product_category = ?, sub_category = ?, brand = ?, tags = ?, type = ?, 
        language = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const params = [
      title,
      content,
      category,
      productCategory,
      subCategory,
      brand,
      stringifyJsonField(tags),
      assetData.type || existingAsset.type,
      assetData.language || existingAsset.language,
      id
    ];
    
    console.log('💾 准备更新数据库，参数:', params);
    
    await runQuery(sql, params);
    
    // 获取更新后的素材
    const updatedAsset = await getQuery('SELECT * FROM text_assets WHERE id = ?', [id]);
    
    // 转换为前端期望的格式
    const formattedAsset = {
      id: updatedAsset.id,
      title: updatedAsset.title,
      content: updatedAsset.content,
      asset_category: updatedAsset.category,
      productCategory: updatedAsset.product_category,
      sub_category: updatedAsset.sub_category,
      brand: updatedAsset.brand,
      tags: parseJsonField(updatedAsset.tags, []),
      created_at: updatedAsset.created_at,
      updated_at: updatedAsset.updated_at
    };
    
    console.log('✅ 文本素材更新成功:', formattedAsset);
    
    // 通知其他客户端
    const io = req.app.get('io');
    if (io) {
      io.emit('assetChange', {
        type: 'text',
        action: 'update',
        data: formattedAsset
      });
    }
    
    res.json({
      success: true,
      message: '文本素材更新成功',
      data: formattedAsset
    });
  } catch (error) {
    console.error('❌ 更新文本素材失败:', error);
    res.status(500).json({
      success: false,
      message: '更新文本素材失败',
      error: error.message
    });
  }
});

// 删除文本素材
router.delete('/text/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查素材是否存在
    const asset = await getQuery('SELECT * FROM text_assets WHERE id = ?', [id]);
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: '文本素材不存在'
      });
    }
    
    await runQuery('DELETE FROM text_assets WHERE id = ?', [id]);
    
    console.log('✅ 文本素材删除成功:', id);
    
    // 通知其他客户端
    const io = req.app.get('io');
    if (io) {
      io.emit('assetChange', {
        type: 'text',
        action: 'delete',
        data: { id }
      });
    }
    
    res.json({
      success: true,
      message: '文本素材删除成功'
    });
  } catch (error) {
    console.error('❌ 删除文本素材失败:', error);
    res.status(500).json({
      success: false,
      message: '删除文本素材失败',
      error: error.message
    });
  }
});

// =============== 视觉素材路由 ===============

// 获取所有视觉素材
router.get('/visual', async (req, res) => {
  try {
    const { category, search, type, page = 1, limit = 50 } = req.query;
    
    let sql = 'SELECT * FROM visual_assets WHERE 1=1';
    const params = [];
    
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    if (type) {
      sql += ' AND file_type LIKE ?';
      params.push(`%${type}%`);
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
    
    const visualAssets = await allQuery(sql, params);
    
    // 转换为前端期望的格式
    const formattedAssets = visualAssets.map(asset => ({
      id: asset.id,
      title: asset.name,
      url: asset.file_path,
      type: 'image', // 简化处理
      asset_category: asset.category,
      tags: parseJsonField(asset.tags, []),
      created_at: asset.created_at,
      updated_at: asset.updated_at
    }));
    
    res.json({
      success: true,
      data: formattedAssets
    });
  } catch (error) {
    console.error('❌ 获取视觉素材失败:', error);
    res.status(500).json({
      success: false,
      message: '获取视觉素材失败',
      error: error.message
    });
  }
});

// 批量删除素材
router.delete('/batch', async (req, res) => {
  try {
    const { ids, type = 'text' } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供要删除的素材ID列表'
      });
    }
    
    const table = type === 'visual' ? 'visual_assets' : 'text_assets';
    const placeholders = ids.map(() => '?').join(',');
    await runQuery(`DELETE FROM ${table} WHERE id IN (${placeholders})`, ids);
    
    console.log(`✅ 批量删除${type}素材成功:`, ids);
    
    // 通知其他客户端
    const io = req.app.get('io');
    if (io) {
      io.emit('assetChange', {
        type,
        action: 'batchDelete',
        data: { ids }
      });
    }
    
    res.json({
      success: true,
      message: `成功删除 ${ids.length} 个${type}素材`
    });
  } catch (error) {
    console.error(`❌ 批量删除${type || ''}素材失败:`, error);
    res.status(500).json({
      success: false,
      message: '批量删除素材失败',
      error: error.message
    });
  }
});

module.exports = router; 