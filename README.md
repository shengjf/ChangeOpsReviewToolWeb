# ChangeOps Review Tool - 变更文档审核工具

基于React的前端应用，实现变更文档内容的自动化审核与校验。

## 🚀 功能特性

### 核心功能

- **文档上传**: 支持批量上传.doc/.docx/.xlsx/.xls格式文档
- **自动化校验**: 模拟后端校验逻辑，返回详细错误信息
- **结果展示**: 清晰展示校验结果，按文件分组显示状态
- **筛选功能**: 支持按通过/失败状态筛选文档
- **交互体验**: 拖拽上传、文件状态跟踪、错误详情展开

### 技术特性

- **现代化UI**: 使用shadcn/ui组件库，基于Radix UI和Tailwind CSS
- **响应式设计**: 适配桌面端和移动端
- **状态管理**: 使用React Context管理应用状态
- **类型安全**: 完整的TypeScript类型定义
- **工程化**: ESLint + Prettier代码规范，Vite构建工具

## 🛠️ 技术栈

- **框架**: React 19
- **构建工具**: Vite
- **UI组件库**: shadcn/ui (基于Radix UI + Tailwind CSS)
- **样式**: Tailwind CSS v4
- **图标**: Lucide React
- **字体**: Fira Sans (正文) + Fira Code (代码)
- **代码规范**: ESLint + Prettier
- **开发语言**: TypeScript

## 📁 项目结构

```
src/
├── components/           # React组件
│   ├── layout/          # 布局组件 (Header, Sidebar)
│   ├── upload/          # 上传相关组件
│   ├── results/         # 结果展示组件
│   └── ui/              # shadcn UI组件
├── context/             # React Context状态管理
├── services/            # API服务层 (模拟接口)
├── types/               # TypeScript类型定义
├── utils/               # 工具函数
└── hooks/               # 自定义Hooks
```

## 🚦 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint        # ESLint检查
npm run typecheck   # TypeScript类型检查
npm run format      # Prettier格式化
```

## 🎨 设计系统

基于UI/UX Pro Max方法定义的设计规范：

### 色彩方案

- **主色**: #0F172A (深海军蓝)
- **强调色**: #0369A1 (专业蓝)
- **背景色**: #F8FAFC (浅灰背景)
- **文字色**: #020617 (深黑文字)

### 字体

- **正文字体**: Fira Sans - 技术感强，适合数据展示
- **代码字体**: Fira Code - 等宽字体，适合技术内容

### 设计原则

- **专业权威**: 采用证书/徽章展示风格，建立信任感
- **数据导向**: 清晰的统计信息和可视化展示
- **交互友好**: 明确的反馈和流畅的过渡动画

## 🔌 API接口 (模拟)

### 文件上传

```typescript
POST / api / upload
// 返回: FileInfo[] - 文件信息列表
```

### 文档校验

```typescript
POST / api / validate
// 返回: ValidationResult[] - 校验结果列表
```

### 报告生成

```typescript
POST / api / report
// 返回: { downloadUrl: string } - 报告下载链接
```

## 📋 使用说明

1. **上传文档**: 拖放或点击选择Word/Excel文档
2. **开始校验**: 点击"开始校验"按钮触发自动化校验
3. **查看结果**: 在右侧面板查看校验结果
4. **筛选查看**: 使用侧边栏筛选通过/失败的文档
5. **导出报告**: 点击"导出报告"生成汇总报告

## 🔮 未来扩展

### 计划功能

- **文档生成**: 根据模板自动生成变更文档
- **模板管理**: 自定义校验规则和文档模板
- **团队协作**: 多用户权限管理和协作功能
- **历史记录**: 文档校验历史查询和对比
- **实时协作**: WebSocket实时更新校验状态

### 技术改进

- **性能优化**: 虚拟滚动支持大量文档
- **离线支持**: PWA离线功能
- **国际化**: 多语言支持
- **主题系统**: 可切换的深色/浅色主题

## 📄 许可证

本项目仅供内部使用，所有文档内容均受保密协议保护。

## 👥 贡献

欢迎提交Issue和Pull Request。

## 📞 支持

如有问题，请联系变更运维团队。
