# 简化版项目备份脚本
param(
    [string]$BackupType = "full"
)

$ProjectName = "cms-content-creator"
$CurrentDate = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$Destination = "..\backup\$ProjectName-$CurrentDate"

Write-Host "开始备份项目..." -ForegroundColor Green

# 创建备份目录
if (!(Test-Path $Destination)) {
    New-Item -ItemType Directory -Path $Destination -Force | Out-Null
    Write-Host "创建备份目录: $Destination" -ForegroundColor Blue
}

# 备份代码文件
Write-Host "备份代码文件..." -ForegroundColor Yellow
$codeBackupPath = Join-Path $Destination "code"
New-Item -ItemType Directory -Path $codeBackupPath -Force | Out-Null

# 复制重要文件和目录
$itemsToBackup = @(
    "src",
    "public", 
    "src-tauri",
    "package.json",
    "package-lock.json", 
    "tsconfig.json",
    "vite.config.ts",
    "tailwind.config.js",
    "README.md"
)

foreach ($item in $itemsToBackup) {
    if (Test-Path $item) {
        if ((Get-Item $item).PSIsContainer) {
            Copy-Item -Path $item -Destination $codeBackupPath -Recurse -Force
            Write-Host "已备份目录: $item" -ForegroundColor Green
        } else {
            Copy-Item -Path $item -Destination $codeBackupPath -Force  
            Write-Host "已备份文件: $item" -ForegroundColor Green
        }
    }
}

# 备份数据文件
Write-Host "备份数据文件..." -ForegroundColor Yellow
$dataBackupPath = Join-Path $Destination "data"
New-Item -ItemType Directory -Path $dataBackupPath -Force | Out-Null

# 备份数据库和Excel文件
if (Test-Path "src-tauri\database.json") {
    Copy-Item -Path "src-tauri\database.json" -Destination $dataBackupPath -Force
    Write-Host "已备份: database.json" -ForegroundColor Green
}

$excelFiles = Get-ChildItem -Path "." -Filter "*.xlsx" -Recurse
foreach ($file in $excelFiles) {
    Copy-Item -Path $file.FullName -Destination $dataBackupPath -Force
    Write-Host "已备份: $($file.Name)" -ForegroundColor Green
}

# 备份Git仓库
if (Test-Path ".git") {
    Write-Host "备份Git仓库..." -ForegroundColor Yellow
    $gitBackupPath = Join-Path $Destination "git"
    New-Item -ItemType Directory -Path $gitBackupPath -Force | Out-Null
    
    try {
        $bundlePath = Join-Path $gitBackupPath "repository.bundle"
        git bundle create $bundlePath --all
        Write-Host "Git仓库备份完成" -ForegroundColor Green
    }
    catch {
        Write-Host "Git备份失败: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 压缩备份
Write-Host "压缩备份文件..." -ForegroundColor Yellow
try {
    $zipPath = "$Destination.zip"
    Compress-Archive -Path $Destination -DestinationPath $zipPath -Force
    
    $originalSize = (Get-ChildItem -Path $Destination -Recurse | Measure-Object -Property Length -Sum).Sum
    $compressedSize = (Get-Item $zipPath).Length
    
    Write-Host "备份完成!" -ForegroundColor Green
    Write-Host "压缩文件: $zipPath" -ForegroundColor Cyan
    Write-Host "原始大小: $([math]::Round($originalSize / 1MB, 2)) MB" -ForegroundColor Cyan
    Write-Host "压缩后: $([math]::Round($compressedSize / 1MB, 2)) MB" -ForegroundColor Cyan
    
    # 询问是否删除原始目录
    $delete = Read-Host "是否删除原始备份目录? (y/n)"
    if ($delete -eq "y") {
        Remove-Item -Path $Destination -Recurse -Force
        Write-Host "已删除原始备份目录" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "压缩失败: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Backup completed successfully!" -ForegroundColor Green 