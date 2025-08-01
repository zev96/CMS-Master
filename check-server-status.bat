@echo off
echo ==========================================
echo  CMS内容创作平台 - 服务器状态检查
echo ==========================================
echo.

echo 正在检查服务器状态...
echo.

REM 检查端口3000是否在监听
netstat -ano | findstr :3000 > nul
if %errorlevel% == 0 (
    echo ✅ 服务器状态: 运行中
    echo ✅ 端口3000: 正在监听
    
    REM 获取本机IP地址
    for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /i "IPv4"') do (
        set ip=%%i
        goto :found
    )
    :found
    set ip=%ip: =%
    
    echo.
    echo 📍 访问地址:
    echo    本地访问: http://localhost:3000
    echo    局域网访问: http://%ip%:3000
    echo.
    echo 🎯 服务器正常运行中，可以开始使用！
) else (
    echo ❌ 服务器状态: 未运行
    echo ❌ 端口3000: 未监听
    echo.
    echo 🔧 解决方案:
    echo    1. 双击运行 start-web-server.bat 启动服务器
    echo    2. 或者手动运行: npm run server:start
    echo    3. 检查是否有其他程序占用端口3000
)

echo.
echo ==========================================
echo 按任意键退出...
pause > nul 