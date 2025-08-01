# CMS Content Creator Windows 快速部署脚本
# 使用方法: .\quick-deploy.ps1 -DeployType [web|desktop|all]

param(
    [ValidateSet("web", "desktop", "all")]
    [string]$DeployType = "web"
)

$ProjectName = "cms-content-creator"

# 颜色输出函数
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Log-Info($Message) {
    Write-ColorOutput Blue "ℹ️  $Message"
}

function Log-Success($Message) {
    Write-ColorOutput Green "✅ $Message"
}

function Log-Warning($Message) {
    Write-ColorOutput Yellow "⚠️  $Message"
}

function Log-Error($Message) {
    Write-ColorOutput Red "❌ $Message"
}

# 检查依赖
function Check-Dependencies {
    Log-Info "检查依赖..."
    
    # 检查 Node.js
    try {
        $nodeVersion = node --version
        Log-Success "Node.js 版本: $nodeVersion"
    }
    catch {
        Log-Error "Node.js 未安装，请先从 https://nodejs.org 下载安装"
        exit 1
    }
    
    # 检查 npm
    try {
        $npmVersion = npm --version
        Log-Success "npm 版本: $npmVersion"
    }
    catch {
        Log-Error "npm 未安装"
        exit 1
    }
    
    Log-Success "依赖检查通过"
}

# 安装项目依赖
function Install-Dependencies {
    Log-Info "安装项目依赖..."
    try {
        npm ci
        Log-Success "依赖安装完成"
    }
    catch {
        Log-Error "依赖安装失败"
        exit 1
    }
}

# Web版本部署
function Deploy-Web {
    Log-Info "开始 Web 版本部署..."
    
    # 清理构建文件
    Log-Info "清理旧的构建文件..."
    npm run clean
    
    # 构建Web版本
    Log-Info "构建 Web 版本..."
    try {
        npm run build
        
        if (Test-Path "dist") {
            Log-Success "Web 版本构建完成"
            
            # 显示构建信息
            Write-Host "📦 构建文件位置: .\dist\"
            
            $distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
            Write-Host "📊 总文件大小: $([math]::Round($distSize, 2)) MB"
            
            # 提供部署选项
            Write-Host ""
            Write-Host "🌐 Web 部署选项:"
            Write-Host "1. Vercel:   npx vercel --prod"
            Write-Host "2. Netlify:  npx netlify deploy --prod --dir dist"
            Write-Host "3. GitHub Pages: 将 dist\ 内容推送到 gh-pages 分支"
            Write-Host "4. 本地预览: npm run preview"
            Write-Host ""
            
            $preview = Read-Host "是否现在本地预览? (y/n)"
            if ($preview -eq "y") {
                Start-Process -NoNewWindow npm "run preview"
            }
        }
        else {
            Log-Error "构建目录不存在"
            exit 1
        }
    }
    catch {
        Log-Error "Web 版本构建失败"
        Write-Host $_.Exception.Message
        exit 1
    }
}

# 桌面应用构建
function Build-Desktop {
    Log-Info "开始桌面应用构建..."
    
    # 检查 Rust 环境
    try {
        $rustVersion = rustc --version
        Log-Success "Rust 版本: $rustVersion"
    }
    catch {
        Log-Warning "Rust 未安装，正在引导安装..."
        Write-Host "请访问 https://rustup.rs/ 安装 Rust"
        Write-Host "或者运行: winget install Rustlang.Rustup"
        $installRust = Read-Host "是否现在安装 Rust? (y/n)"
        if ($installRust -eq "y") {
            try {
                winget install Rustlang.Rustup
                Log-Success "Rust 安装完成，请重新启动 PowerShell"
                exit 0
            }
            catch {
                Log-Error "自动安装失败，请手动安装 Rust"
                exit 1
            }
        }
        else {
            exit 1
        }
    }
    
    # 构建前端
    Log-Info "构建前端项目..."
    npm run build
    
    # 构建桌面应用
    Log-Info "构建桌面应用 (这可能需要几分钟)..."
    try {
        npm run tauri build
        
        $bundlePath = "src-tauri\target\release\bundle"
        if (Test-Path $bundlePath) {
            Log-Success "桌面应用构建完成"
            Write-Host "📦 安装包位置: .\$bundlePath\"
            
            # 列出构建的文件
            Get-ChildItem -Path $bundlePath -Recurse -File | ForEach-Object {
                $sizeKB = [math]::Round($_.Length / 1KB, 2)
                Write-Host "  - $($_.Name) ($sizeKB KB)"
            }
        }
        else {
            Log-Error "构建目录不存在"
            exit 1
        }
    }
    catch {
        Log-Error "桌面应用构建失败"
        Write-Host $_.Exception.Message
        exit 1
    }
}

# 生成部署报告
function Generate-Report {
    Log-Info "生成部署报告..."
    
    $reportFile = "deployment-report.md"
    $currentTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    $webStatus = if (Test-Path "dist") { "✅ 已构建" } else { "❌ 未构建" }
    $webSize = if (Test-Path "dist") { 
        $size = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        "$([math]::Round($size, 2)) MB"
    } else { "N/A" }
    
    $desktopStatus = if (Test-Path "src-tauri\target\release\bundle") { "✅ 已构建" } else { "❌ 未构建" }
    $desktopFiles = if (Test-Path "src-tauri\target\release\bundle") {
        (Get-ChildItem -Path "src-tauri\target\release\bundle" -Recurse -File | Select-Object -First 3 | ForEach-Object { $_.Name }) -join ", "
    } else { "无" }

    $reportContent = @"
# 📊 部署报告

**生成时间:** $currentTime
**项目名称:** $ProjectName
**部署类型:** $DeployType
**操作系统:** Windows $([System.Environment]::OSVersion.Version)

## 🏗️ 构建信息

### Web 版本
- **状态:** $webStatus
- **大小:** $webSize
- **文件数量:** $(if (Test-Path "dist") { (Get-ChildItem -Path "dist" -Recurse -File).Count } else { "0" })

### 桌面版本
- **状态:** $desktopStatus
- **安装包:** $desktopFiles

## 🚀 部署建议

### 立即可用的 Web 方案:
1. **Vercel** - 高性能 CDN，最适合 React 应用
   - 命令: ``npx vercel --prod``
   - 优势: 零配置部署，自动优化

2. **Netlify** - 简单易用，集成 CI/CD
   - 命令: ``npx netlify deploy --prod --dir dist``
   - 优势: 拖拽部署，表单处理

3. **GitHub Pages** - 完全免费
   - 步骤: 推送 dist/ 到 gh-pages 分支
   - 优势: 与 GitHub 完美集成

### 桌面应用分发:
1. **GitHub Releases** - 开源项目首选
2. **Microsoft Store** - 触达更多 Windows 用户
3. **官方网站** - 建立品牌形象

## 📝 Windows 特定注意事项

- 使用 Windows Defender 或其他杀毒软件可能会误报
- 建议申请代码签名证书以提高信任度
- 考虑使用 MSIX 格式支持自动更新

## 🎯 下一步行动

- [ ] 选择 Web 托管平台并部署
- [ ] 配置自定义域名和 HTTPS
- [ ] 设置 GitHub Actions 自动化部署
- [ ] 准备用户使用文档
- [ ] 制作产品演示视频

---
*本报告由 Windows PowerShell 部署脚本自动生成*
"@

    $reportContent | Out-File -FilePath $reportFile -Encoding UTF8
    Log-Success "部署报告已生成: $reportFile"
}

# 主流程
function Main {
    Write-Host "🎯 CMS Content Creator Windows 部署向导" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Check-Dependencies
    Install-Dependencies
    
    switch ($DeployType) {
        "web" {
            Deploy-Web
        }
        "desktop" {
            Build-Desktop
        }
        "all" {
            Deploy-Web
            Write-Host ""
            Build-Desktop
        }
    }
    
    Generate-Report
    
    Write-Host ""
    Log-Success "🎉 部署完成!"
    Write-Host "📋 查看详细报告: Get-Content deployment-report.md"
    Write-Host ""
    Write-Host "💡 提示: 可以运行以下命令快速部署到云端:"
    Write-Host "  - Vercel:  npx vercel --prod"
    Write-Host "  - Netlify: npx netlify deploy --prod --dir dist"
}

# 执行主流程
try {
    Main
}
catch {
    Log-Error "脚本执行出错: $($_.Exception.Message)"
    exit 1
} 