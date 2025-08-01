const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

// 导入路由和数据库
const { initDatabase } = require('./database');
const productRoutes = require('./routes/products');
const templateRoutes = require('./routes/templates');
const assetRoutes = require('./routes/assets');
const chartRoutes = require('./routes/charts');
const uploadRoutes = require('./routes/upload');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

const PORT = process.env.PORT || 3000;

// 安全和性能中间件
app.use(helmet({
  contentSecurityPolicy: false, // 为了支持内联样式和脚本
}));
app.use(compression());
app.use(cors());

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 1000, // 限制每个IP 15分钟内最多1000个请求
  message: '请求过于频繁，请稍后再试'
});
app.use('/api/', limiter);

// 解析JSON和URL编码数据
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 检查是否存在构建后的前端文件
const distPath = path.join(__dirname, '../dist');
const fs = require('fs');

if (fs.existsSync(distPath)) {
  // 如果存在构建文件，提供静态文件服务
  app.use(express.static(distPath));
  console.log('✅ 找到构建后的前端文件，提供完整Web应用');
} else {
  console.log('⚠️  未找到构建后的前端文件，提供基础管理界面');
}

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CMS服务器运行正常',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API路由
app.use('/api/products', productRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/charts', chartRoutes);
app.use('/api/upload', uploadRoutes);

// WebSocket连接处理
io.on('connection', (socket) => {
  console.log('用户连接:', socket.id);
  
  // 加入房间（可用于不同的数据类型）
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`用户 ${socket.id} 加入房间: ${room}`);
  });
  
  // 处理实时数据同步
  socket.on('data-updated', (data) => {
    socket.broadcast.emit('data-changed', data);
  });
  
  socket.on('disconnect', () => {
    console.log('用户断开连接:', socket.id);
  });
});

// 根路径处理
app.get('/', (req, res) => {
  const distIndexPath = path.join(__dirname, '../dist/index.html');
  
  // 如果存在构建后的index.html，返回它
  if (fs.existsSync(distIndexPath)) {
    res.sendFile(distIndexPath);
    return;
  }
  
  // 否则返回基础管理界面
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CMS内容创作平台 - 管理界面</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                color: #333;
            }
            .header {
                background: rgba(255,255,255,0.95);
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            .status-card {
                background: white;
                border-radius: 15px;
                padding: 30px;
                margin: 20px 0;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .status {
                background: #e8f5e8;
                color: #2d5d31;
                padding: 15px;
                border-radius: 10px;
                margin: 20px 0;
                border-left: 5px solid #4caf50;
                text-align: center;
                font-size: 18px;
                font-weight: bold;
            }
            .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }
            .info-card {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                border-left: 4px solid #667eea;
            }
            .api-list {
                background: #f9f9f9;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
            }
            .api-item {
                background: white;
                padding: 12px 15px;
                margin: 8px 0;
                border-radius: 8px;
                border-left: 3px solid #667eea;
                font-family: 'Courier New', monospace;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .btn {
                background: #667eea;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
                transition: background 0.3s;
                font-size: 14px;
            }
            .btn:hover { background: #5a6fd8; }
            .btn-success { background: #4caf50; }
            .btn-success:hover { background: #45a049; }
            .btn-warning { background: #ff9800; }
            .btn-warning:hover { background: #e68900; }
            h1 { color: #667eea; font-size: 2.5em; text-align: center; margin-bottom: 10px; }
            h2 { color: #667eea; margin-bottom: 15px; }
            h3 { color: #333; margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="container">
                <h1>🚀 CMS内容创作平台</h1>
                <div class="status">
                    ✅ API服务器运行正常 | 端口: ${PORT} | 时间: ${new Date().toLocaleString('zh-CN')}
                </div>
            </div>
        </div>
        
        <div class="container">
            <div class="info-grid">
                <div class="info-card">
                    <h3>📱 访问地址</h3>
                    <p><strong>本机访问:</strong> <a href="http://localhost:${PORT}" target="_blank">http://localhost:${PORT}</a></p>
                    <p><strong>局域网访问:</strong> http://192.168.1.91:${PORT}</p>
                    <p><strong>手机/平板:</strong> 连接同一WiFi后访问局域网地址</p>
                </div>
                
                <div class="info-card">
                    <h3>⚠️ 当前状态</h3>
                    <p>您正在使用<strong>基础管理界面</strong></p>
                    <p>要使用完整的Web应用，请：</p>
                    <ol style="margin-left: 20px; margin-top: 10px;">
                        <li>关闭服务器（Ctrl+C）</li>
                        <li>运行构建命令：<code>npm run build:web</code></li>
                        <li>重新启动服务器</li>
                    </ol>
                </div>
            </div>
            
            <div class="status-card">
                <h2>🔧 API接口测试</h2>
                <div class="api-list">
                    <div class="api-item">
                        <span>GET /api/health - 健康检查</span>
                        <a href="/api/health" class="btn btn-success" target="_blank">测试</a>
                    </div>
                    <div class="api-item">
                        <span>GET /api/products - 获取产品列表</span>
                        <a href="/api/products" class="btn btn-success" target="_blank">测试</a>
                    </div>
                    <div class="api-item">
                        <span>GET /api/templates - 获取模板列表</span>
                        <a href="/api/templates" class="btn btn-success" target="_blank">测试</a>
                    </div>
                    <div class="api-item">
                        <span>GET /api/assets - 获取素材列表</span>
                        <a href="/api/assets" class="btn btn-success" target="_blank">测试</a>
                    </div>
                    <div class="api-item">
                        <span>GET /api/charts - 获取图表列表</span>
                        <a href="/api/charts" class="btn btn-success" target="_blank">测试</a>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <button class="btn btn-success" onclick="testAPI()">🧪 测试API连接</button>
                    <button class="btn btn-warning" onclick="createSampleData()">📝 创建示例数据</button>
                </div>
            </div>
            
            <div class="status-card">
                <h2>💡 使用说明</h2>
                <ul style="margin-left: 20px;">
                    <li>当前为API服务器模式，提供后端数据接口</li>
                    <li>数据存储在SQLite数据库中（data/cms_content.db）</li>
                    <li>支持多设备访问和实时数据同步（WebSocket）</li>
                    <li>要使用完整的Web界面，请构建前端应用</li>
                    <li>按 Ctrl+C 停止服务器</li>
                </ul>
            </div>
        </div>
        
        <script>
            async function testAPI() {
                try {
                    const response = await fetch('/api/health');
                    const data = await response.json();
                    alert('✅ API测试成功!\\n' + JSON.stringify(data, null, 2));
                } catch (error) {
                    alert('❌ API测试失败: ' + error.message);
                }
            }
            
            async function createSampleData() {
                if (!confirm('确定要创建示例数据吗？这将添加一些测试产品到数据库中。')) {
                    return;
                }
                
                try {
                    const sampleProduct = {
                        name: '示例产品 ' + Date.now(),
                        brand: '示例品牌',
                        category: 'electronics',
                        price: 999,
                        description: '这是一个示例产品，用于测试系统功能',
                        features: ['功能1', '功能2', '功能3'],
                        specifications: { '规格1': '值1', '规格2': '值2' },
                        tags: ['示例', '测试']
                    };
                    
                    const response = await fetch('/api/products', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(sampleProduct)
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        alert('✅ 示例数据创建成功!\\n产品ID: ' + data.data.id);
                        window.location.reload();
                    } else {
                        alert('❌ 创建失败: ' + data.message);
                    }
                } catch (error) {
                    alert('❌ 创建失败: ' + error.message);
                }
            }
        </script>
    </body>
    </html>
  `);
});

// SPA路由处理 - 返回React应用
app.get('*', (req, res) => {
  const distIndexPath = path.join(__dirname, '../dist/index.html');
  
  if (fs.existsSync(distIndexPath)) {
    res.sendFile(distIndexPath);
  } else {
    // 如果访问的是非API路径且没有构建文件，重定向到首页
    res.redirect('/');
  }
});

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 启动服务器
async function startServer() {
  try {
    console.log('🔍 开始初始化数据库...');
    // 初始化数据库
    await initDatabase();
    console.log('✅ 数据库初始化完成');
    
    console.log('🔍 准备启动HTTP服务器...');
    console.log(`📊 监听地址: 0.0.0.0:${PORT}`);
    
    // 启动HTTP服务器
    server.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('🚀 CMS服务器启动成功!');
      console.log(`📱 本地访问: http://localhost:${PORT}`);
      console.log(`🌐 局域网访问: http://192.168.1.91:${PORT}`);
      console.log('💡 服务器正在运行，可以开始使用Web界面了！');
      console.log('📴 按 Ctrl+C 停止服务器');
      console.log('');
    });
    
    server.on('error', (err) => {
      console.error('❌ 服务器启动失败:', err);
      if (err.code === 'EADDRINUSE') {
        console.error(`💡 端口 ${PORT} 已被占用，请尝试其他端口或停止占用进程`);
      }
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    console.error('错误详情:', error.message);
    console.error('错误堆栈:', error.stack);
    process.exit(1);
  }
}

// 优雅关闭处理
process.on('SIGTERM', () => {
  console.log('📴 接收到SIGTERM信号，正在关闭服务器...');
  server.close(() => {
    console.log('✅ 服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 接收到SIGINT信号，正在关闭服务器...');
  server.close(() => {
    console.log('✅ 服务器已关闭');
    process.exit(0);
  });
});

// 导出socket.io实例供路由使用
app.set('io', io);

startServer(); 