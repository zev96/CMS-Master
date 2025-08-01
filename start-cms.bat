@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo     CMS内容创作平台 - 启动程序
echo ==========================================
echo.

echo 🔧 正在检查依赖...
if not exist node_modules (
    echo ❌ 缺少依赖包，正在安装...
    npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败，请检查网络连接
        pause
        exit /b 1
    )
)

echo ✅ 依赖检查完成
echo.

echo 🏗️  正在构建前端应用...
npm run build:web
if errorlevel 1 (
    echo ❌ 前端构建失败
    pause
    exit /b 1
)

echo ✅ 前端构建完成
echo.

echo 🚀 启动CMS服务器...
echo.
echo 💡 提示: 服务器启动后，按 Ctrl+C 停止服务
echo.

node server/simple-server.js

pause 