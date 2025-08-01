# 🚀 CMS内容创作平台

一个基于React + TypeScript + Tauri构建的智能内容创作平台，专为产品内容管理而设计。

## ✨ 特性

- 🎨 **现代化UI** - 基于Radix UI和Tailwind CSS的美观界面
- 📝 **富文本编辑** - 集成TinyMCE和Quill编辑器
- 📊 **数据可视化** - 使用ECharts和Recharts创建图表
- 🔄 **实时协作** - Socket.io实现多用户实时同步
- 💾 **数据管理** - SQLite数据库存储，支持导入导出
- 🖥️ **跨平台** - 支持桌面应用和Web应用双模式
- 🌐 **多语言支持** - 国际化和本地化支持
- 🔒 **安全可靠** - JWT认证，数据加密，安全传输

## 🛠️ 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS + CSS Modules
- **状态管理**: Zustand
- **UI组件**: Radix UI
- **动画**: Framer Motion
- **图标**: Lucide React

### 后端
- **运行时**: Node.js + Express
- **数据库**: SQLite
- **实时通信**: Socket.io
- **文件上传**: Multer
- **安全**: Helmet + CORS + Rate Limiting

### 桌面应用
- **框架**: Tauri
- **语言**: Rust + TypeScript

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- Rust (用于Tauri桌面应用)

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/yourusername/cms-content-creator.git
cd cms-content-creator

# 安装依赖
npm install
```

### 开发模式

```bash
# 启动Web开发服务器
npm run dev

# 启动全栈开发模式（前端+后端）
npm run dev:fullstack

# 启动Tauri桌面应用开发
npm run tauri:dev
```

### 生产构建

```bash
# 构建Web应用
npm run build:web

# 构建Tauri桌面应用
npm run tauri:build

# 构建发布版本
npm run release
```

## 📁 项目结构

```
cms-content-creator/
├── src/                    # 前端源码
│   ├── components/         # React组件
│   │   ├── layout/        # 布局组件
│   │   ├── modules/       # 功能模块
│   │   └── ui/            # 基础UI组件
│   ├── hooks/             # 自定义Hooks
│   ├── services/          # API服务
│   ├── stores/            # 状态管理
│   ├── types/             # TypeScript类型
│   └── utils/             # 工具函数
├── server/                # 后端服务器
│   ├── routes/            # API路由
│   ├── database.js        # 数据库配置
│   └── index.js           # 服务器入口
├── src-tauri/             # Tauri配置
├── public/                # 静态资源
├── data/                  # 数据库文件
├── uploads/               # 上传文件
└── dist/                  # 构建输出
```

## 🔧 开发指南

### 代码规范

项目使用ESLint + Prettier进行代码格式化和质量检查：

```bash
# 代码检查
npm run lint

# 自动修复
npm run lint:fix

# 格式化代码
npm run format

# 类型检查
npm run type-check
```

### Git提交规范

项目配置了Husky和lint-staged，每次提交前会自动：
- 运行ESLint检查和修复
- 运行Prettier格式化
- 运行TypeScript类型检查

### 组件开发

```typescript
// 使用TypeScript和函数组件
import React from 'react';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  onAction 
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold">{title}</h2>
      {onAction && (
        <button 
          onClick={onAction}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          执行操作
        </button>
      )}
    </div>
  );
};
```

### 状态管理

使用Zustand进行状态管理：

```typescript
import { create } from 'zustand';

interface AppState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

## 📚 API文档

### 产品管理API

```bash
# 获取产品列表
GET /api/products

# 创建产品
POST /api/products

# 更新产品
PUT /api/products/:id

# 删除产品
DELETE /api/products/:id
```

### 模板管理API

```bash
# 获取模板列表
GET /api/templates

# 创建模板
POST /api/templates

# 更新模板
PUT /api/templates/:id

# 删除模板
DELETE /api/templates/:id
```

## 🧪 测试

```bash
# 运行单元测试
npm test

# 运行端到端测试
npm run test:e2e

# 生成测试覆盖率报告
npm run test:coverage
```

## 📦 部署

### Web应用部署

```bash
# 构建Web应用
npm run build:web

# 启动生产服务器
npm run server:start
```

### Docker部署

```bash
# 构建Docker镜像
docker build -t cms-content-creator .

# 运行容器
docker run -p 3000:3000 cms-content-creator
```

### 桌面应用分发

```bash
# 构建桌面应用
npm run tauri:build:release

# 生成的安装包位于 src-tauri/target/release/bundle/
```

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 开发规范

- 遵循现有的代码风格
- 添加适当的测试
- 更新相关文档
- 确保所有检查通过

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React](https://reactjs.org/) - 用户界面库
- [Tauri](https://tauri.app/) - 桌面应用框架
- [Vite](https://vitejs.dev/) - 前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Radix UI](https://www.radix-ui.com/) - 无样式UI组件

## 📞 支持

如果您有任何问题或建议，请：

- 创建 [Issue](https://github.com/yourusername/cms-content-creator/issues)
- 发送邮件至 your.email@example.com
- 查看 [文档](https://github.com/yourusername/cms-content-creator/wiki)

---

**祝您使用愉快！** 🎉
