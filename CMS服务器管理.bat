@echo off
chcp 65001 > nul
cd /d "%~dp0"

:menu
cls
echo.
echo  CMS服务器管理系统
echo.
echo  [1] 启动服务器
echo  [2] 停止服务器
echo  [3] 查看状态
echo  [0] 退出程序
echo.
echo  请输入数字选择操作
echo.

choice /c 1230 /n /m "选择操作(1-3,0):"

if errorlevel 4 goto exit_program
if errorlevel 3 goto check_status
if errorlevel 2 goto stop_server
if errorlevel 1 goto start_server
goto menu

:start_server
cls
echo.
echo  正在启动服务器...
echo.

node --version > nul 2>&1
if errorlevel 1 (
    echo  错误: 未安装Node.js
    echo  请访问 https://nodejs.org 下载安装
    pause
    goto menu
)

netstat -ano | findstr ":3000" | findstr "LISTENING" > nul
if not errorlevel 1 (
    echo  提示: 服务器已在运行
    pause
    goto menu
)

echo  信息: 正在启动服务器...
start /min cmd /c "node server/index.js"
timeout /t 2 > nul

netstat -ano | findstr ":3000" | findstr "LISTENING" > nul
if not errorlevel 1 (
    echo  成功: 服务器已启动
    echo  访问地址: http://localhost:3000
) else (
    echo  错误: 启动失败，请检查配置
)
pause
goto menu

:stop_server
cls
echo.
echo  正在停止服务器...
echo.

set pid=
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do set pid=%%a

if "%pid%"=="" (
    echo  提示: 服务器未在运行
    pause
    goto menu
)

echo  正在停止进程 PID: %pid%
taskkill /F /PID %pid% > nul 2>&1
if errorlevel 1 (
    echo  错误: 无法停止服务器
) else (
    echo  成功: 服务器已停止
)

timeout /t 1 > nul
netstat -ano | findstr ":3000" | findstr "LISTENING" > nul
if not errorlevel 1 (
    echo  警告: 端口3000仍被占用
) else (
    echo  信息: 端口已释放
)
pause
goto menu

:check_status
cls
echo.
echo  检查服务器状态...
echo.

netstat -ano | findstr ":3000" | findstr "LISTENING" > nul
if not errorlevel 1 (
    echo  信息: 服务器正在运行
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do echo  进程ID: %%a
    echo  访问地址: http://localhost:3000
) else (
    echo  信息: 服务器未运行
)
pause
goto menu

:exit_program
cls
echo.
echo  正在退出...
echo.
timeout /t 1 > nul
exit 