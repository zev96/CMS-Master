#!/bin/bash

# 设置环境变量
export NODE_ENV=production

# 安装依赖
echo "Installing dependencies..."
npm install --production

# 构建前端
echo "Building frontend..."
npm run build

# 数据库迁移
echo "Running database migrations..."
node scripts/migrate.js

# 启动应用
echo "Starting application..."
pm2 start server/index.js --name "cms-server"

# 输出状态
echo "Deployment completed!"
pm2 status 