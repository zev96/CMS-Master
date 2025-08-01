# 🌐 Web+本地服务器部署指南

## 📋 部署概述

本指南将帮助你将Tauri桌面应用改造为Web+本地服务器架构，实现局域网多人协作使用。

## 🏗️ 架构说明

### 改造前（Tauri架构）
```
桌面应用 (Tauri)
├── 前端 (React + TypeScript)
├── 后端 (Rust)
└── 本地存储 (文件系统)
```

### 改造后（Web+服务器架构）
```
Web应用 + 本地服务器
├── 前端 (React Web应用)
├── 后端 (Node.js + Express)
├── 数据库 (SQLite)
├── 实时同步 (WebSocket)
└── 文件管理 (Multer)
```

## 🚀 部署步骤

### 步骤1: 安装依赖
```bash
# 安装新增的服务器端依赖
npm install express cors helmet sqlite3 multer socket.io socket.io-client bcryptjs jsonwebtoken compression express-rate-limit

# 安装开发依赖
npm install --save-dev nodemon concurrently
```

### 步骤2: 环境配置
```bash
# 复制环境配置文件
cp env.example .env

# 编辑配置文件，修改你的设置
nano .env
```

### 步骤3: 构建前端应用
```bash
# 构建Web版本
npm run build:web
```

### 步骤4: 启动服务器
```bash
# 开发模式（前端+后端同时启动）
npm run dev:fullstack

# 或者分别启动
npm run server:dev  # 启动后端服务器
npm run dev         # 启动前端开发服务器

# 生产模式
npm run build:web   # 构建前端
npm run server:start # 启动生产服务器
```

## 🔧 服务器配置

### 数据库初始化
服务器首次启动时会自动创建SQLite数据库和表结构。数据库文件位置：`./data/cms_content.db`

### 文件上传目录
上传的文件存储在 `./uploads` 目录，按类型分类：
- `./uploads/images/` - 图片文件
- `./uploads/documents/` - 文档文件
- `./uploads/other/` - 其他文件

## 🌐 访问方式

### 本地访问
```
http://localhost:3000
```

### 局域网访问
1. 获取服务器IP地址
```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
```

2. 其他设备通过IP访问
```
http://192.168.1.XXX:3000
```

## 👥 多用户协作功能

### 实时数据同步
- 使用WebSocket实现实时数据同步
- 用户A修改数据，用户B界面自动更新
- 支持产品、模板、素材等数据的实时同步

### 操作日志
- 记录所有用户的操作行为
- 追踪数据修改历史
- 便于问题排查和数据恢复

## 🔐 安全设置

### 基础安全
- CORS跨域保护
- 请求频率限制
- 文件上传类型限制
- XSS和CSRF防护

### 生产环境建议
1. 修改默认端口
2. 设置防火墙规则
3. 启用HTTPS（使用nginx反向代理）
4. 定期备份数据库

## 📊 性能优化

### 数据库优化
- 使用索引提升查询性能
- 定期清理无用数据
- 数据库备份策略

### 文件管理
- 图片压缩和优化
- 静态资源CDN加速
- 文件清理定时任务

## 🛠️ 故障排除

### 常见问题

1. **端口被占用**
```bash
# 查看端口占用
netstat -ano | findstr :3000

# 修改端口
# 编辑 .env 文件中的 PORT 配置
```

2. **数据库连接失败**
```bash
# 检查数据目录权限
ls -la data/

# 手动创建数据目录
mkdir -p data
```

3. **文件上传失败**
```bash
# 检查上传目录权限
ls -la uploads/

# 创建上传目录
mkdir -p uploads/{images,documents,other}
```

## 📈 监控和维护

### 日志查看
```bash
# 查看服务器日志
npm run server:start 2>&1 | tee server.log

# 查看数据库大小
du -sh data/cms_content.db
```

### 定期维护
1. 数据库备份
```bash
# 备份数据库
cp data/cms_content.db data/backup_$(date +%Y%m%d_%H%M%S).db
```

2. 清理临时文件
```bash
# 清理上传文件中的临时文件
find uploads/ -name "*.tmp" -delete
```

## 🔄 升级和迁移

### 数据迁移
如需将现有Tauri应用数据迁移到Web版本：

1. 导出Tauri应用数据
2. 转换数据格式
3. 导入到新的SQLite数据库

### 系统升级
```bash
# 备份数据
cp -r data/ backup_data/
cp -r uploads/ backup_uploads/

# 拉取最新代码
git pull origin main

# 重新安装依赖
npm install

# 重新构建
npm run build:web

# 重启服务器
npm run server:start
```

## 📞 技术支持

如果在部署过程中遇到问题：

1. 检查控制台错误信息
2. 查看服务器日志
3. 确认网络连接
4. 验证环境配置

需要进一步协助请联系技术支持团队。 