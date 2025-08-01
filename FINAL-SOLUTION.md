# CMS内容创作平台 - 最终可用方案

## 🎯 完整的Web版部署方案

您好！我为您提供一个完全可用的CMS内容创作平台Web版本。以下是所有必要的步骤：

### 📋 系统信息
- **您的IP地址**: 192.168.1.91
- **服务器端口**: 3000
- **访问地址**: http://192.168.1.91:3000

## 🚀 快速启动（一键部署）

### 方案1：使用简化服务器（推荐）

1. **打开PowerShell，运行以下命令：**
```powershell
cd "C:\Users\16779\Desktop\comfyFile\cursor\Case-3\cms-content-creator"
node server/simple-server.js
```

2. **等待看到以下成功信息：**
```
🎉 CMS内容创作平台启动成功！
=================================
📱 本地访问地址: http://localhost:3000
🌐 局域网访问地址: http://192.168.1.91:3000
=================================
```

3. **访问测试：**
   - 本机访问：http://localhost:3000
   - 局域网访问：http://192.168.1.91:3000
   - 健康检查：http://192.168.1.91:3000/api/health

### 方案2：使用一键启动脚本

1. **双击运行：** `start-cms.bat`
2. **或者在PowerShell中运行：**
```powershell
cd "C:\Users\16779\Desktop\comfyFile\cursor\Case-3\cms-content-creator"
.\start-cms.bat
```

## 🏗️ 系统架构

### 后端服务
- **框架**: Node.js + Express
- **数据库**: SQLite（文件：data/cms_content.db）
- **端口**: 3000
- **API接口**: RESTful API

### 前端应用
- **框架**: React + TypeScript
- **构建工具**: Vite
- **UI组件**: Tailwind CSS + Shadcn/ui

### 核心功能
- ✅ 产品管理（CRUD操作）
- ✅ 模板管理
- ✅ 素材库管理
- ✅ 图表生成
- ✅ 文件上传
- ✅ 数据持久化

## 📱 多设备访问

### 局域网访问设置
1. **确保防火墙设置**：
   - Windows防火墙允许3000端口
   - 或者临时关闭防火墙进行测试

2. **其他设备访问**：
   - 手机：连接同一WiFi，访问 http://192.168.1.91:3000
   - 平板：http://192.168.1.91:3000
   - 其他电脑：http://192.168.1.91:3000

### 防火墙配置（如需要）
```powershell
# 以管理员身份运行PowerShell
netsh advfirewall firewall add rule name="CMS Server" dir=in action=allow protocol=TCP localport=3000
```

## 📊 API接口说明

### 基础接口
- `GET /api/health` - 健康检查
- `GET /api/products` - 获取产品列表
- `POST /api/products` - 创建产品
- `PUT /api/products/:id` - 更新产品
- `DELETE /api/products/:id` - 删除产品

### 文件上传
- `POST /api/upload/image` - 上传图片
- `POST /api/upload/document` - 上传文档

## 🛠️ 故障排除

### 常见问题

1. **端口被占用**
```powershell
# 检查端口占用
netstat -ano | findstr :3000
# 如果被占用，修改 server/simple-server.js 中的 PORT = 3001
```

2. **依赖缺失**
```powershell
npm install
```

3. **数据库初始化失败**
   - 检查 data/ 目录是否存在
   - 确保有写入权限

### 重置系统
```powershell
# 删除数据库文件（谨慎操作）
rm data/cms_content.db
# 重新启动服务器将自动重建数据库
```

## 📈 系统监控

### 性能监控
- 内存使用：通过任务管理器查看 node.exe 进程
- 数据库大小：检查 data/cms_content.db 文件大小
- 网络流量：通过Windows性能监视器

### 日志查看
- 服务器日志：PowerShell窗口实时显示
- 错误日志：检查控制台输出

## 🔧 维护操作

### 备份数据
```powershell
# 备份数据库文件
copy data\cms_content.db data\cms_content_backup_$(Get-Date -Format "yyyy-MM-dd").db

# 备份上传文件
xcopy uploads uploads_backup /E /I
```

### 更新系统
```powershell
# 停止服务器（Ctrl+C）
# 更新代码
git pull
# 重新启动
node server/simple-server.js
```

## 🎮 使用流程

### 1. 产品管理
1. 访问 http://192.168.1.91:3000
2. 点击"产品管理"
3. 添加/编辑产品信息
4. 上传产品图片

### 2. 模板使用
1. 进入"模板库"
2. 选择或创建模板
3. 在内容编辑器中使用

### 3. 素材管理
1. 访问"素材库"
2. 分类管理文本和视觉素材
3. 在编辑器中插入使用

### 4. 图表生成
1. 进入"图表工具"
2. 输入数据或选择数据源
3. 生成各种类型图表
4. 导出或插入到内容中

## 📞 技术支持

### 系统状态检查
```powershell
# 检查服务器状态
curl http://localhost:3000/api/health

# 检查数据库
node -e "const db = require('./server/database'); console.log('数据库连接正常');"
```

### 重启服务
```powershell
# 在服务器运行窗口按 Ctrl+C 停止
# 然后重新运行
node server/simple-server.js
```

---

## ✅ 验证清单

请确认以下项目都已完成：
- [ ] 服务器成功启动（看到成功信息）
- [ ] 本地访问正常（http://localhost:3000）
- [ ] 局域网访问正常（http://192.168.1.91:3000）
- [ ] API接口响应正常（/api/health）
- [ ] 数据库初始化成功
- [ ] 可以创建和查看产品

**🎉 恭喜！您的CMS内容创作平台已经可以正常使用了！** 