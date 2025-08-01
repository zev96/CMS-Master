const express = require('express');
const router = express.Router();
const { runQuery, getQuery, allQuery, parseJsonField, stringifyJsonField } = require('../database');

// 生成唯一ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 获取所有产品
router.get('/', async (req, res) => {
  try {
    const { category, subcategory, status, search, page = 1, limit = 50 } = req.query;
    
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    
    // 添加筛选条件
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    if (subcategory) {
      sql += ' AND subcategory = ?';
      params.push(subcategory);
    }
    
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    
    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ? OR brand LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    // 排序和分页
    sql += ' ORDER BY updated_at DESC';
    
    if (limit !== 'all') {
      const offset = (parseInt(page) - 1) * parseInt(limit);
      sql += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), offset);
    }
    
    const products = await allQuery(sql, params);
    
    // 转换为前端期望的格式
    const formattedProducts = products.map(product => ({
      id: product.id,
      basicInfo: {
        brand: product.brand || '',
        modelName: product.model || '',
        price: product.price || 0,
        category: product.category || '',
        description: product.description || ''
      },
      parameters: parseJsonField(product.specifications, {}),
      features: parseJsonField(product.features, []),
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));
    
    // 获取总数（用于分页）
    let countSql = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = [];
    
    if (category) {
      countSql += ' AND category = ?';
      countParams.push(category);
    }
    
    if (subcategory) {
      countSql += ' AND subcategory = ?';
      countParams.push(subcategory);
    }
    
    if (status) {
      countSql += ' AND status = ?';
      countParams.push(status);
    }
    
    if (search) {
      countSql += ' AND (name LIKE ? OR description LIKE ? OR brand LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    const countResult = await getQuery(countSql, countParams);
    
    res.json({
      success: true,
      data: formattedProducts,
      pagination: {
        total: countResult.total,
        page: parseInt(page),
        limit: limit === 'all' ? countResult.total : parseInt(limit),
        totalPages: limit === 'all' ? 1 : Math.ceil(countResult.total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('获取产品列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取产品列表失败',
      error: error.message
    });
  }
});

// 获取单个产品
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getQuery('SELECT * FROM products WHERE id = ?', [id]);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '产品不存在'
      });
    }
    
    // 转换为前端期望的格式
    const formattedProduct = {
      id: product.id,
      basicInfo: {
        brand: product.brand || '',
        modelName: product.model || '',
        price: product.price || 0,
        category: product.category || '',
        description: product.description || ''
      },
      parameters: parseJsonField(product.specifications, {}),
      features: parseJsonField(product.features, []),
      createdAt: product.created_at,
      updatedAt: product.updated_at
    };
    
    res.json({
      success: true,
      data: formattedProduct
    });
  } catch (error) {
    console.error('获取产品详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取产品详情失败',
      error: error.message
    });
  }
});

// 创建新产品
router.post('/', async (req, res) => {
  try {
    console.log('📝 收到产品创建请求:', JSON.stringify(req.body, null, 2));
    
    const productData = req.body;
    const id = generateId();
    
    // 🔥 修复：处理前端发送的嵌套数据结构
    const basicInfo = productData.basicInfo || {};
    const parameters = productData.parameters || {};
    const features = productData.features || [];
    
    const sql = `
      INSERT INTO products (
        id, name, brand, model, category, subcategory, 
        price, original_price, description, features, 
        specifications, images, tags, stock_quantity, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      basicInfo.modelName || basicInfo.name || '未命名产品',
      basicInfo.brand || null,
      basicInfo.modelName || null,
      basicInfo.category || null,
      productData.subcategory || null,
      basicInfo.price || null,
      productData.original_price || null,
      basicInfo.description || null,
      stringifyJsonField(features),
      stringifyJsonField(parameters),
      stringifyJsonField(productData.images || []),
      stringifyJsonField(productData.tags || []),
      productData.stock_quantity || 0,
      productData.status || 'active'
    ];
    
    console.log('💾 准备插入数据库，参数:', params);
    
    await runQuery(sql, params);
    
    // 获取创建的产品
    const newProduct = await getQuery('SELECT * FROM products WHERE id = ?', [id]);
    
    // 转换为前端期望的格式
    const formattedProduct = {
      id: newProduct.id,
      basicInfo: {
        brand: newProduct.brand || '',
        modelName: newProduct.model || '',
        price: newProduct.price || 0,
        category: newProduct.category || '',
        description: newProduct.description || ''
      },
      parameters: parseJsonField(newProduct.specifications, {}),
      features: parseJsonField(newProduct.features, []),
      createdAt: newProduct.created_at,
      updatedAt: newProduct.updated_at
    };
    
    console.log('✅ 产品创建成功:', formattedProduct);
    
    // 通知其他客户端
    const io = req.app.get('io');
    if (io) {
      io.emit('productChange', {
        action: 'create',
        data: formattedProduct
      });
    }
    
    res.status(201).json({
      success: true,
      message: '产品创建成功',
      data: formattedProduct
    });
  } catch (error) {
    console.error('❌ 创建产品失败:', error);
    res.status(500).json({
      success: false,
      message: '创建产品失败',
      error: error.message
    });
  }
});

// 更新产品
router.put('/:id', async (req, res) => {
  try {
    console.log('📝 收到产品更新请求:', req.params.id, JSON.stringify(req.body, null, 2));
    
    const { id } = req.params;
    const productData = req.body;
    
    // 检查产品是否存在
    const existingProduct = await getQuery('SELECT * FROM products WHERE id = ?', [id]);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: '产品不存在'
      });
    }
    
    // 🔥 修复：处理前端发送的嵌套数据结构
    const basicInfo = productData.basicInfo || {};
    const parameters = productData.parameters || {};
    const features = productData.features || [];
    
    const sql = `
      UPDATE products SET 
        name = ?, brand = ?, model = ?, category = ?, subcategory = ?,
        price = ?, original_price = ?, description = ?, features = ?,
        specifications = ?, images = ?, tags = ?, stock_quantity = ?,
        status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const params = [
      basicInfo.modelName || basicInfo.name || existingProduct.name,
      basicInfo.brand || existingProduct.brand,
      basicInfo.modelName || existingProduct.model,
      basicInfo.category || existingProduct.category,
      productData.subcategory || existingProduct.subcategory,
      basicInfo.price !== undefined ? basicInfo.price : existingProduct.price,
      productData.original_price || existingProduct.original_price,
      basicInfo.description || existingProduct.description,
      stringifyJsonField(features),
      stringifyJsonField(parameters),
      stringifyJsonField(productData.images || parseJsonField(existingProduct.images, [])),
      stringifyJsonField(productData.tags || parseJsonField(existingProduct.tags, [])),
      productData.stock_quantity !== undefined ? productData.stock_quantity : existingProduct.stock_quantity,
      productData.status || existingProduct.status,
      id
    ];
    
    console.log('💾 准备更新数据库，参数:', params);
    
    await runQuery(sql, params);
    
    // 获取更新后的产品
    const updatedProduct = await getQuery('SELECT * FROM products WHERE id = ?', [id]);
    
    // 转换为前端期望的格式
    const formattedProduct = {
      id: updatedProduct.id,
      basicInfo: {
        brand: updatedProduct.brand || '',
        modelName: updatedProduct.model || '',
        price: updatedProduct.price || 0,
        category: updatedProduct.category || '',
        description: updatedProduct.description || ''
      },
      parameters: parseJsonField(updatedProduct.specifications, {}),
      features: parseJsonField(updatedProduct.features, []),
      createdAt: updatedProduct.created_at,
      updatedAt: updatedProduct.updated_at
    };
    
    console.log('✅ 产品更新成功:', formattedProduct);
    
    // 通知其他客户端
    const io = req.app.get('io');
    if (io) {
      io.emit('productChange', {
        action: 'update',
        data: formattedProduct
      });
    }
    
    res.json({
      success: true,
      message: '产品更新成功',
      data: formattedProduct
    });
  } catch (error) {
    console.error('❌ 更新产品失败:', error);
    res.status(500).json({
      success: false,
      message: '更新产品失败',
      error: error.message
    });
  }
});

// 删除产品
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查产品是否存在
    const product = await getQuery('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '产品不存在'
      });
    }
    
    await runQuery('DELETE FROM products WHERE id = ?', [id]);
    
    console.log('✅ 产品删除成功:', id);
    
    // 通知其他客户端
    const io = req.app.get('io');
    if (io) {
      io.emit('productChange', {
        action: 'delete',
        data: { id }
      });
    }
    
    res.json({
      success: true,
      message: '产品删除成功'
    });
  } catch (error) {
    console.error('❌ 删除产品失败:', error);
    res.status(500).json({
      success: false,
      message: '删除产品失败',
      error: error.message
    });
  }
});

// 批量删除产品
router.delete('/', async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供要删除的产品ID列表'
      });
    }
    
    const placeholders = ids.map(() => '?').join(',');
    await runQuery(`DELETE FROM products WHERE id IN (${placeholders})`, ids);
    
    console.log('✅ 批量删除产品成功:', ids);
    
    // 通知其他客户端
    const io = req.app.get('io');
    if (io) {
      io.emit('productChange', {
        action: 'batchDelete',
        data: { ids }
      });
    }
    
    res.json({
      success: true,
      message: `成功删除 ${ids.length} 个产品`
    });
  } catch (error) {
    console.error('❌ 批量删除产品失败:', error);
    res.status(500).json({
      success: false,
      message: '批量删除产品失败',
      error: error.message
    });
  }
});

// 获取分类统计
router.get('/stats/categories', async (req, res) => {
  try {
    const categoriesResult = await allQuery(`
      SELECT category, COUNT(*) as count 
      FROM products 
      WHERE category IS NOT NULL 
      GROUP BY category
    `);
    
    const subcategoriesResult = await allQuery(`
      SELECT category, subcategory, COUNT(*) as count 
      FROM products 
      WHERE subcategory IS NOT NULL 
      GROUP BY category, subcategory
    `);
    
    res.json({
      success: true,
      data: {
        categories: categoriesResult,
        subcategories: subcategoriesResult
      }
    });
  } catch (error) {
    console.error('获取分类统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分类统计失败',
      error: error.message
    });
  }
});

module.exports = router; 