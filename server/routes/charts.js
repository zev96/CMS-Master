const express = require('express');
const router = express.Router();
const { runQuery, getQuery, allQuery, parseJsonField, stringifyJsonField } = require('../database');

// 生成唯一ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 获取所有图表
router.get('/', async (req, res) => {
  try {
    const { category, search, chart_type, page = 1, limit = 50 } = req.query;
    
    let sql = 'SELECT * FROM charts WHERE 1=1';
    const params = [];
    
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    if (chart_type) {
      sql += ' AND chart_type = ?';
      params.push(chart_type);
    }
    
    if (search) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    sql += ' ORDER BY updated_at DESC';
    
    if (limit !== 'all') {
      const offset = (parseInt(page) - 1) * parseInt(limit);
      sql += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), offset);
    }
    
    const charts = await allQuery(sql, params);
    
    // 解析JSON字段
    const formattedCharts = charts.map(chart => ({
      ...chart,
      chartConfig: parseJsonField(chart.chart_config, {}),
      chartData: parseJsonField(chart.chart_data, {}),
      tags: parseJsonField(chart.tags, []),
      // 为了兼容性保留原字段名
      chart_config: parseJsonField(chart.chart_config, {}),
      chart_data: parseJsonField(chart.chart_data, {}),
    }));
    
    res.json({
      success: true,
      data: formattedCharts
    });
  } catch (error) {
    console.error('获取图表列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取图表列表失败',
      error: error.message
    });
  }
});

// 获取单个图表
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const chart = await getQuery('SELECT * FROM charts WHERE id = ?', [id]);
    
    if (!chart) {
      return res.status(404).json({
        success: false,
        message: '图表不存在'
      });
    }
    
    // 解析JSON字段
    const formattedChart = {
      ...chart,
      chartConfig: parseJsonField(chart.chart_config, {}),
      chartData: parseJsonField(chart.chart_data, {}),
      tags: parseJsonField(chart.tags, []),
      // 为了兼容性保留原字段名
      chart_config: parseJsonField(chart.chart_config, {}),
      chart_data: parseJsonField(chart.chart_data, {}),
    };
    
    res.json({
      success: true,
      data: formattedChart
    });
  } catch (error) {
    console.error('获取图表详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取图表详情失败',
      error: error.message
    });
  }
});

// 创建新图表
router.post('/', async (req, res) => {
  try {
    const chartData = req.body;
    const id = generateId();
    
    const sql = `
      INSERT INTO charts (
        id, title, description, chart_type, chart_config, 
        chart_data, category, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      chartData.title,
      chartData.description || null,
      chartData.chartType || chartData.chart_type,
      stringifyJsonField(chartData.chartConfig || chartData.chart_config),
      stringifyJsonField(chartData.chartData || chartData.chart_data),
      chartData.category || null,
      stringifyJsonField(chartData.tags)
    ];
    
    await runQuery(sql, params);
    
    // 获取创建的图表
    const newChart = await getQuery('SELECT * FROM charts WHERE id = ?', [id]);
    const formattedChart = {
      ...newChart,
      chartConfig: parseJsonField(newChart.chart_config, {}),
      chartData: parseJsonField(newChart.chart_data, {}),
      tags: parseJsonField(newChart.tags, []),
      // 添加createdAt字段用于兼容性
      createdAt: newChart.created_at,
      // 为了兼容性保留原字段名
      chart_config: parseJsonField(newChart.chart_config, {}),
      chart_data: parseJsonField(newChart.chart_data, {}),
    };
    
    // 通知其他客户端
    const io = req.app.get('io');
    io.emit('data-changed', {
      type: 'charts',
      action: 'create',
      data: formattedChart
    });
    
    res.status(201).json({
      success: true,
      message: '图表创建成功',
      data: formattedChart
    });
  } catch (error) {
    console.error('创建图表失败:', error);
    res.status(500).json({
      success: false,
      message: '创建图表失败',
      error: error.message
    });
  }
});

// 更新图表
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const chartData = req.body;
    
    // 检查图表是否存在
    const existingChart = await getQuery('SELECT * FROM charts WHERE id = ?', [id]);
    if (!existingChart) {
      return res.status(404).json({
        success: false,
        message: '图表不存在'
      });
    }
    
    const sql = `
      UPDATE charts SET 
        title = ?, description = ?, chart_type = ?, chart_config = ?,
        chart_data = ?, category = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const params = [
      chartData.title,
      chartData.description || null,
      chartData.chartType || chartData.chart_type,
      stringifyJsonField(chartData.chartConfig || chartData.chart_config),
      stringifyJsonField(chartData.chartData || chartData.chart_data),
      chartData.category || null,
      stringifyJsonField(chartData.tags),
      id
    ];
    
    await runQuery(sql, params);
    
    // 获取更新后的图表
    const updatedChart = await getQuery('SELECT * FROM charts WHERE id = ?', [id]);
    const formattedChart = {
      ...updatedChart,
      chartConfig: parseJsonField(updatedChart.chart_config, {}),
      chartData: parseJsonField(updatedChart.chart_data, {}),
      tags: parseJsonField(updatedChart.tags, []),
      // 添加createdAt字段用于兼容性
      createdAt: updatedChart.created_at,
      // 为了兼容性保留原字段名
      chart_config: parseJsonField(updatedChart.chart_config, {}),
      chart_data: parseJsonField(updatedChart.chart_data, {}),
    };
    
    // 通知其他客户端
    const io = req.app.get('io');
    io.emit('data-changed', {
      type: 'charts',
      action: 'update',
      data: formattedChart
    });
    
    res.json({
      success: true,
      message: '图表更新成功',
      data: formattedChart
    });
  } catch (error) {
    console.error('更新图表失败:', error);
    res.status(500).json({
      success: false,
      message: '更新图表失败',
      error: error.message
    });
  }
});

// 删除图表
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查图表是否存在
    const existingChart = await getQuery('SELECT * FROM charts WHERE id = ?', [id]);
    if (!existingChart) {
      return res.status(404).json({
        success: false,
        message: '图表不存在'
      });
    }
    
    await runQuery('DELETE FROM charts WHERE id = ?', [id]);
    
    // 通知其他客户端
    const io = req.app.get('io');
    io.emit('data-changed', {
      type: 'charts',
      action: 'delete',
      data: { id }
    });
    
    res.json({
      success: true,
      message: '图表删除成功'
    });
  } catch (error) {
    console.error('删除图表失败:', error);
    res.status(500).json({
      success: false,
      message: '删除图表失败',
      error: error.message
    });
  }
});

// 获取图表类型统计
router.get('/stats/types', async (req, res) => {
  try {
    const sql = `
      SELECT chart_type, COUNT(*) as count 
      FROM charts 
      WHERE chart_type IS NOT NULL 
      GROUP BY chart_type 
      ORDER BY count DESC
    `;
    
    const chartTypes = await allQuery(sql);
    
    res.json({
      success: true,
      data: chartTypes
    });
  } catch (error) {
    console.error('获取图表类型统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取图表类型统计失败',
      error: error.message
    });
  }
});

module.exports = router; 