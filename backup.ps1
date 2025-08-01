# CMS Content Creator 项目备份脚本
# 使用方法: .\backup.ps1 [-BackupType full|code|data] [-Destination 备份路径]

param(
    [ValidateSet("full", "code", "data", "git")]
    [string]$BackupType = "full",
    [string]$Destination = "",
    [switch]$Compress = $true
)

$ProjectName = "cms-content-creator"
$CurrentDate = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

# 如果没有指定目标路径，使用默认路径
if ([string]::IsNullOrEmpty($Destination)) {
    $Destination = "..\backup\$ProjectName-$CurrentDate"
}

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

# 创建备份目录
function Create-BackupDirectory {
    Log-Info "创建备份目录: $Destination"
    
    if (!(Test-Path $Destination)) {
        try {
            New-Item -ItemType Directory -Path $Destination -Force | Out-Null
            Log-Success "备份目录创建成功"
        }
        catch {
            Log-Error "无法创建备份目录: $($_.Exception.Message)"
            exit 1
        }
    }
    else {
        Log-Warning "备份目录已存在，将覆盖现有文件"
    }
}

# 备份项目代码
function Backup-Code {
    Log-Info "备份项目代码..."
    
    $excludePatterns = @(
        "node_modules",
        "dist",
        "target", 
        ".git",
        "*.log",
        ".cache",
        ".temp",
        ".vscode\settings.json"
    )
    
    $codeBackupPath = Join-Path $Destination "code"
    New-Item -ItemType Directory -Path $codeBackupPath -Force | Out-Null
    
    try {
        # 复制源代码文件
        $sourceFiles = @(
            "src",
            "public", 
            "src-tauri",
            "package.json",
            "package-lock.json",
            "tsconfig.json",
            "tsconfig.node.json",
            "vite.config.ts",
            "tailwind.config.js",
            "postcss.config.js",
            "README.md",
            "DEPLOYMENT.md",
            "*.html",
            "*.md"
        )
        
        foreach ($pattern in $sourceFiles) {
            $items = Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue
            foreach ($item in $items) {
                if ($item.PSIsContainer) {
                    $shouldExclude = $false
                    foreach ($exclude in $excludePatterns) {
                        if ($item.Name -like $exclude) {
                            $shouldExclude = $true
                            break
                        }
                    }
                    if (!$shouldExclude) {
                        Copy-Item -Path $item.FullName -Destination $codeBackupPath -Recurse -Force
                        Log-Info "已备份目录: $($item.Name)"
                    }
                }
                else {
                    Copy-Item -Path $item.FullName -Destination $codeBackupPath -Force
                    Log-Info "已备份文件: $($item.Name)"
                }
            }
        }
        
        Log-Success "代码备份完成"
    }
    catch {
        Log-Error "代码备份失败: $($_.Exception.Message)"
    }
}

# 备份数据文件
function Backup-Data {
    Log-Info "备份数据文件..."
    
    $dataBackupPath = Join-Path $Destination "data"
    New-Item -ItemType Directory -Path $dataBackupPath -Force | Out-Null
    
    try {
        # 备份数据库文件
        if (Test-Path "src-tauri\database.json") {
            Copy-Item -Path "src-tauri\database.json" -Destination $dataBackupPath -Force
            Log-Info "已备份: database.json"
        }
        
        # 备份Excel数据文件
        $excelFiles = Get-ChildItem -Path "." -Filter "*.xlsx" -Recurse
        foreach ($file in $excelFiles) {
            Copy-Item -Path $file.FullName -Destination $dataBackupPath -Force
            Log-Info "已备份: $($file.Name)"
        }
        
        # 备份配置文件
        $configFiles = @(
            "src-tauri\tauri.conf.json",
            "src-tauri\Cargo.toml",
            "src-tauri\capabilities\default.json"
        )
        
        foreach ($config in $configFiles) {
            if (Test-Path $config) {
                $configDir = Join-Path $dataBackupPath "config"
                if (!(Test-Path $configDir)) {
                    New-Item -ItemType Directory -Path $configDir -Force | Out-Null
                }
                Copy-Item -Path $config -Destination $configDir -Force
                Log-Info "已备份配置: $(Split-Path $config -Leaf)"
            }
        }
        
        Log-Success "数据备份完成"
    }
    catch {
        Log-Error "数据备份失败: $($_.Exception.Message)"
    }
}

# 备份Git仓库
function Backup-Git {
    Log-Info "备份Git仓库..."
    
    $gitBackupPath = Join-Path $Destination "git"
    New-Item -ItemType Directory -Path $gitBackupPath -Force | Out-Null
    
    try {
        if (Test-Path ".git") {
            # 创建Git bundle备份
            $bundlePath = Join-Path $gitBackupPath "repository.bundle"
            git bundle create $bundlePath --all
            Log-Success "Git仓库备份完成"
            
            # 导出当前分支信息
            $currentBranch = git rev-parse --abbrev-ref HEAD
            $currentCommit = git rev-parse HEAD
            $gitStatus = git status --porcelain
            
            $gitInfo = @"
# Git 仓库信息备份

**备份时间:** $(Get-Date)
**当前分支:** $currentBranch
**当前提交:** $currentCommit

## 工作目录状态
```
$gitStatus
```

## 最近提交记录
```
$(git log --oneline -10)
```

## 远程仓库
```
$(git remote -v)
```
"@
            
            $gitInfo | Out-File -FilePath (Join-Path $gitBackupPath "git-info.md") -Encoding UTF8
        }
        else {
            Log-Warning "未发现Git仓库"
        }
    }
    catch {
        Log-Error "Git备份失败: $($_.Exception.Message)"
    }
}

# 创建备份清单
function Create-BackupManifest {
    Log-Info "创建备份清单..."
    
    $webStatus = if (Test-Path "dist") { "✅ 已构建" } else { "❌ 未构建" }
    $webSize = if (Test-Path "dist") { 
        $size = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        "$([math]::Round($size, 2)) MB"
    } else { "N/A" }
    
    $desktopStatus = if (Test-Path "src-tauri\target\release\bundle") { "✅ 已构建" } else { "❌ 未构建" }
    $desktopFiles = if (Test-Path "src-tauri\target\release\bundle") {
        $files = Get-ChildItem -Path "src-tauri\target\release\bundle" -Recurse -File | Select-Object -First 3
        ($files | ForEach-Object { $_.Name }) -join ", "
    } else { "无" }

    $codeStatus = if (Test-Path (Join-Path $Destination "code")) { "✅ 已备份" } else { "❌ 未备份" }
    $dataStatus = if (Test-Path (Join-Path $Destination "data")) { "✅ 已备份" } else { "❌ 未备份" }
    $gitStatus = if (Test-Path (Join-Path $Destination "git")) { "✅ 已备份" } else { "❌ 未备份" }

    $manifest = @"
# 📋 备份清单

**备份时间:** $(Get-Date)
**备份类型:** $BackupType
**备份位置:** $Destination
**操作系统:** Windows $([System.Environment]::OSVersion.Version)

## 📦 备份内容

### 代码文件
**状态:** $codeStatus
**说明:** 包含源代码、配置文件、文档

### 数据文件  
**状态:** $dataStatus
**说明:** 包含数据库、Excel文件、配置

### Git仓库
**状态:** $gitStatus
**说明:** 完整的版本控制历史

## 🏗️ 构建状态

### Web 版本
- **状态:** $webStatus
- **大小:** $webSize

### 桌面版本
- **状态:** $desktopStatus
- **安装包:** $desktopFiles

## 🔄 恢复说明

### 完整恢复
1. 创建新的项目目录
2. 复制 code/ 目录下的所有文件到项目根目录
3. 复制 data/ 目录下的配置和数据文件到对应位置
4. 如果需要恢复Git历史: git clone repository.bundle new-repo

### 部分恢复
- **仅恢复代码:** 复制 code/ 目录内容
- **仅恢复数据:** 复制 data/ 目录内容  
- **仅恢复Git:** 使用 git clone 命令

## ⚠️ 注意事项

- 备份不包含 node_modules，恢复后需要运行 npm install
- 备份不包含构建产物 (dist, target)，恢复后需要重新构建
- 确保目标环境已安装 Node.js 和 Rust

---
*备份脚本自动生成于 $(Get-Date)*
"@

    $manifest | Out-File -FilePath (Join-Path $Destination "backup-manifest.md") -Encoding UTF8
    Log-Success "备份清单已创建"
}

# 压缩备份
function Compress-Backup {
    if ($Compress) {
        Log-Info "压缩备份文件..."
        
        try {
            $zipPath = "$Destination.zip"
            Compress-Archive -Path $Destination -DestinationPath $zipPath -Force
            
            # 显示压缩信息
            $originalSize = (Get-ChildItem -Path $Destination -Recurse | Measure-Object -Property Length -Sum).Sum
            $compressedSize = (Get-Item $zipPath).Length
            $compressionRatio = [math]::Round((1 - $compressedSize / $originalSize) * 100, 1)
            
            Log-Success "备份已压缩"
            Write-Host "📦 压缩文件: $zipPath"
            Write-Host "📊 原始大小: $([math]::Round($originalSize / 1MB, 2)) MB"
            Write-Host "📊 压缩后: $([math]::Round($compressedSize / 1MB, 2)) MB"
            Write-Host "📊 压缩率: $compressionRatio%"
            
            # 询问是否删除原始备份目录
            $deleteOriginal = Read-Host "是否删除原始备份目录? (y/n)"
            if ($deleteOriginal -eq "y") {
                Remove-Item -Path $Destination -Recurse -Force
                Log-Info "已删除原始备份目录"
            }
        }
        catch {
            Log-Error "压缩失败: $($_.Exception.Message)"
        }
    }
}

# 主流程
function Main {
    Write-Host "💾 CMS Content Creator 备份工具" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "📋 备份配置:"
    Write-Host "  - 备份类型: $BackupType"
    Write-Host "  - 目标路径: $Destination"
    Write-Host "  - 是否压缩: $Compress"
    Write-Host ""
    
    $confirm = Read-Host "确认开始备份? (y/n)"
    if ($confirm -ne "y") {
        Write-Host "备份已取消"
        exit 0
    }
    
    Create-BackupDirectory
    
    switch ($BackupType) {
        "full" {
            Backup-Code
            Backup-Data
            Backup-Git
        }
        "code" {
            Backup-Code
        }
        "data" {
            Backup-Data
        }
        "git" {
            Backup-Git
        }
    }
    
    Create-BackupManifest
    Compress-Backup
    
    Write-Host ""
    Log-Success "🎉 备份完成!"
    
    if ($Compress -and (Test-Path "$Destination.zip")) {
        Write-Host "📦 备份文件: $Destination.zip"
    } else {
        Write-Host "📁 备份目录: $Destination"
    }
    
    Write-Host "📋 查看备份清单: Get-Content '$Destination\backup-manifest.md'"
}

# 执行主流程
try {
    Main
}
catch {
    Log-Error "备份过程出错: $($_.Exception.Message)"
    exit 1
} 