@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
title CMS内容创作平台打包工具

:menu
cls
echo ====================================
echo      CMS内容创作平台打包工具
echo ====================================
echo.
echo   [1] 创建完整发布包
echo   [2] 创建精简发布包
echo   [3] 验证发布包
echo   [0] 退出程序
echo.
echo ====================================

set /p choice=请输入选项数字:
if "%choice%"=="1" goto create_full_package
if "%choice%"=="2" goto create_lite_package
if "%choice%"=="3" goto verify_package
if "%choice%"=="0" goto exit
goto menu

:create_full_package
echo.
echo 创建完整发布包...
echo ====================================

REM 创建打包目录
set package_name=cms-release-%date:~0,4%%date:~5,2%%date:~8,2%
if exist "dist\%package_name%" rmdir /s /q "dist\%package_name%"
mkdir "dist\%package_name%"

echo [信息] 复制核心文件...
xcopy "server" "dist\%package_name%\server\" /E /I /Y
xcopy "src" "dist\%package_name%\src\" /E /I /Y
xcopy "public" "dist\%package_name%\public\" /E /I /Y
copy "package.json" "dist\%package_name%\"
copy "CMS服务器管理.bat" "dist\%package_name%\"

echo [信息] 创建必要目录...
mkdir "dist\%package_name%\uploads\images"
mkdir "dist\%package_name%\uploads\documents"
mkdir "dist\%package_name%\uploads\other"
mkdir "dist\%package_name%\data"

echo [信息] 创建说明文档...
echo CMS内容创作平台安装说明 > "dist\%package_name%\安装说明.txt"
echo. >> "dist\%package_name%\安装说明.txt"
echo 1. 安装Node.js (建议版本 14.x 或更高) >> "dist\%package_name%\安装说明.txt"
echo 2. 打开命令行，进入本目录 >> "dist\%package_name%\安装说明.txt"
echo 3. 执行: npm install >> "dist\%package_name%\安装说明.txt"
echo 4. 运行 CMS服务器管理.bat >> "dist\%package_name%\安装说明.txt"
echo 5. 在浏览器中访问: http://localhost:3000 >> "dist\%package_name%\安装说明.txt"

echo [信息] 创建快捷启动脚本...
echo @echo off > "dist\%package_name%\快速启动.bat"
echo start CMS服务器管理.bat >> "dist\%package_name%\快速启动.bat"

echo [成功] 完整发布包已创建: dist\%package_name%
echo.
pause
goto menu

:create_lite_package
echo.
echo 创建精简发布包...
echo ====================================

REM 创建精简打包目录
set package_name=cms-release-lite-%date:~0,4%%date:~5,2%%date:~8,2%
if exist "dist\%package_name%" rmdir /s /q "dist\%package_name%"
mkdir "dist\%package_name%"

echo [信息] 复制核心文件...
xcopy "server" "dist\%package_name%\server\" /E /I /Y
xcopy "public" "dist\%package_name%\public\" /E /I /Y
copy "package.json" "dist\%package_name%\"
copy "CMS服务器管理.bat" "dist\%package_name%\"

echo [信息] 创建必要目录...
mkdir "dist\%package_name%\uploads\images"
mkdir "dist\%package_name%\uploads\documents"
mkdir "dist\%package_name%\uploads\other"
mkdir "dist\%package_name%\data"

echo [信息] 创建说明文档...
echo CMS内容创作平台安装说明 (精简版) > "dist\%package_name%\安装说明.txt"
echo. >> "dist\%package_name%\安装说明.txt"
echo 1. 安装Node.js (建议版本 14.x 或更高) >> "dist\%package_name%\安装说明.txt"
echo 2. 打开命令行，进入本目录 >> "dist\%package_name%\安装说明.txt"
echo 3. 执行: npm install --production >> "dist\%package_name%\安装说明.txt"
echo 4. 运行 CMS服务器管理.bat >> "dist\%package_name%\安装说明.txt"
echo 5. 在浏览器中访问: http://localhost:3000 >> "dist\%package_name%\安装说明.txt"

echo [成功] 精简发布包已创建: dist\%package_name%
echo.
pause
goto menu

:verify_package
echo.
echo 验证发布包...
echo ====================================

REM 检查最新的发布包
set latest_package=
for /f "delims=" %%i in ('dir /b /ad /o-n "dist\cms-release*"') do (
    set latest_package=%%i
    goto :check_package
)

:check_package
if "%latest_package%"=="" (
    echo [错误] 未找到发布包
    pause
    goto menu
)

echo [信息] 正在验证发布包: %latest_package%
echo.

REM 验证核心文件
echo 检查核心文件:
if exist "dist\%latest_package%\server\index.js" (
    echo [√] server/index.js
) else (
    echo [×] server/index.js 缺失
)

if exist "dist\%latest_package%\package.json" (
    echo [√] package.json
) else (
    echo [×] package.json 缺失
)

if exist "dist\%latest_package%\CMS服务器管理.bat" (
    echo [√] CMS服务器管理.bat
) else (
    echo [×] CMS服务器管理.bat 缺失
)

REM 验证目录结构
echo.
echo 检查目录结构:
if exist "dist\%latest_package%\uploads" (
    echo [√] uploads 目录
) else (
    echo [×] uploads 目录缺失
)

if exist "dist\%latest_package%\data" (
    echo [√] data 目录
) else (
    echo [×] data 目录缺失
)

echo.
echo [完成] 发布包验证完成
pause
goto menu

:exit
echo.
echo 感谢使用CMS内容创作平台打包工具
echo ====================================
timeout /t 2 >nul
exit 