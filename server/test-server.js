const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./database');

const app = express();
const PORT = 3000;

// 基本中间件
app.use(cors());
app.use(express.json());

// 测试路由
app.get('/api/test', (req, res) => {
  res.json({ message: '服务器运行正常!', timestamp: new Date().toISOString() });
});

// 404处理
app.get('*', (req, res) => {
  res.json({ message: 'CMS Content Creator - 服务器运行中' });
});

// 启动服务器
async function startTestServer() {
  try {
    console.log('🔧 启动测试服务器...');
    
    // 初始化数据库
    console.log('📊 初始化数据库...');
    await initDatabase();
    console.log('✅ 数据库初始化完成');
    
    // 启动HTTP服务器
    console.log('🚀 启动HTTP服务器...');
    app.listen(PORT, '0.0.0.0', () => {
      console.log('🎉 测试服务器启动成功!');
      console.log(`📱 本地访问: http://localhost:${PORT}`);
      console.log(`🌐 局域网访问: http://192.168.1.91:${PORT}`);
      console.log(`🔍 测试API: http://localhost:${PORT}/api/test`);
    });
    
  } catch (error) {
    console.error('❌ 测试服务器启动失败:', error);
    console.error('错误详情:', error.stack);
    process.exit(1);
  }
}

startTestServer(); 