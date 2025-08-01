#!/bin/bash

# CMS Content Creator 快速部署脚本
# 使用方法: ./quick-deploy.sh [web|desktop|all]

set -e

DEPLOY_TYPE=${1:-"web"}
PROJECT_NAME="cms-content-creator"

echo "🚀 开始部署 $PROJECT_NAME..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 工具函数
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查依赖
check_dependencies() {
    log_info "检查依赖..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装，请先安装 Node.js 16+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装"
        exit 1
    fi
    
    log_success "依赖检查通过"
}

# 安装项目依赖
install_deps() {
    log_info "安装项目依赖..."
    npm ci
    log_success "依赖安装完成"
}

# Web版本部署
deploy_web() {
    log_info "开始 Web 版本部署..."
    
    # 清理构建文件
    npm run clean
    
    # 构建Web版本
    log_info "构建 Web 版本..."
    npm run build
    
    # 检查构建结果
    if [ -d "dist" ]; then
        log_success "Web 版本构建完成"
        
        # 显示构建信息
        echo "📦 构建文件位置: ./dist/"
        echo "📊 文件大小:"
        du -sh dist/*
        
        # 提供部署选项
        echo ""
        echo "🌐 Web 部署选项:"
        echo "1. Vercel:  npx vercel --prod"
        echo "2. Netlify: npx netlify deploy --prod --dir dist"
        echo "3. GitHub Pages: 将 dist/ 内容推送到 gh-pages 分支"
        echo "4. 本地预览: npm run preview"
        
        read -p "是否现在本地预览? (y/n): " preview
        if [ "$preview" = "y" ]; then
            npm run preview
        fi
    else
        log_error "Web 版本构建失败"
        exit 1
    fi
}

# 桌面应用构建
build_desktop() {
    log_info "开始桌面应用构建..."
    
    # 检查Rust环境
    if ! command -v rustc &> /dev/null; then
        log_warning "Rust 未安装，正在尝试安装..."
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
        source $HOME/.cargo/env
    fi
    
    # 检查Tauri CLI
    if ! command -v tauri &> /dev/null; then
        log_info "安装 Tauri CLI..."
        npm install --save-dev @tauri-apps/cli
    fi
    
    # 构建前端
    npm run build
    
    # 构建桌面应用
    log_info "构建桌面应用 (这可能需要几分钟)..."
    npm run tauri build
    
    if [ -d "src-tauri/target/release/bundle" ]; then
        log_success "桌面应用构建完成"
        echo "📦 安装包位置: ./src-tauri/target/release/bundle/"
        ls -la src-tauri/target/release/bundle/
    else
        log_error "桌面应用构建失败"
        exit 1
    fi
}

# 生成部署报告
generate_report() {
    log_info "生成部署报告..."
    
    REPORT_FILE="deployment-report.md"
    
    cat > $REPORT_FILE << EOF
# 📊 部署报告

**生成时间:** $(date)
**项目名称:** $PROJECT_NAME
**部署类型:** $DEPLOY_TYPE

## 🏗️ 构建信息

### Web 版本
- **状态:** $([ -d "dist" ] && echo "✅ 已构建" || echo "❌ 未构建")
- **大小:** $([ -d "dist" ] && du -sh dist | cut -f1 || echo "N/A")
- **文件数量:** $([ -d "dist" ] && find dist -type f | wc -l || echo "0")

### 桌面版本
- **状态:** $([ -d "src-tauri/target/release/bundle" ] && echo "✅ 已构建" || echo "❌ 未构建")
- **安装包:** $([ -d "src-tauri/target/release/bundle" ] && ls src-tauri/target/release/bundle/ | head -3 || echo "无")

## 🚀 部署建议

### 立即可用的方案:
1. **GitHub Pages** - 免费静态托管
2. **Vercel** - 高性能CDN，适合React应用
3. **Netlify** - 简单易用，集成CI/CD

### 桌面应用分发:
1. **GitHub Releases** - 免费，适合开源项目
2. **官网下载** - 专业性强，需要自建网站
3. **应用商店** - 触达更多用户，需要开发者账号

## 📝 下一步行动

- [ ] 选择Web托管平台
- [ ] 配置自定义域名
- [ ] 设置自动部署
- [ ] 准备用户文档
- [ ] 制作产品演示

---
*本报告由快速部署脚本自动生成*
EOF

    log_success "部署报告已生成: $REPORT_FILE"
}

# 主流程
main() {
    echo "🎯 CMS Content Creator 部署向导"
    echo "================================"
    
    check_dependencies
    install_deps
    
    case $DEPLOY_TYPE in
        "web")
            deploy_web
            ;;
        "desktop")
            build_desktop
            ;;
        "all")
            deploy_web
            echo ""
            build_desktop
            ;;
        *)
            log_error "未知的部署类型: $DEPLOY_TYPE"
            echo "使用方法: $0 [web|desktop|all]"
            exit 1
            ;;
    esac
    
    generate_report
    
    echo ""
    log_success "🎉 部署完成!"
    echo "📋 查看详细报告: cat deployment-report.md"
}

# 执行主流程
main "$@" 