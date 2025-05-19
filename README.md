# 她说 (She-Says)

[中文](README.md) | [English](README_EN.md)

「她说」是一个专注于分享个人故事和感悟的平台，让每个人的声音都能被听见。这是一个基于 [Next.js](https://nextjs.org) 构建的现代化 Web 应用，旨在为用户提供一个简洁、优雅的内容分享空间。

## 项目特点

- 🌟 用户可以分享个人故事和感悟
- 👤 完整的用户认证系统（注册、登录、个人资料）
- 🏷️ 文章标签分类系统
- 📱 响应式设计，适配各种设备
- 🎨 精美的 UI 设计，提供舒适的阅读体验

## 技术栈

- **前端框架**: Next.js 15.x (React 19)
- **样式**: Tailwind CSS, DaisyUI
- **认证**: NextAuth.js
- **数据库**: Prisma ORM (SQLite)
- **部署**: 可部署在 Vercel 或其他平台

## 开始使用

### 环境要求

- Node.js 18.18.0 或更高版本
- npm, yarn 或 pnpm 包管理器

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/zym9863/she-says.git
cd she-says
```

2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. 配置环境变量

创建 `.env` 文件并添加必要的环境变量：

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. 初始化数据库

```bash
npx prisma migrate dev
```

5. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
she-says/
├── app/                  # Next.js 应用目录
│   ├── api/              # API 路由
│   ├── posts/            # 文章相关页面
│   ├── profile/          # 用户资料页面
│   ├── globals.css       # 全局样式
│   ├── layout.tsx        # 根布局组件
│   └── page.tsx          # 首页
├── components/           # 可复用组件
├── lib/                  # 工具函数和库
├── prisma/               # Prisma 数据库配置
└── public/               # 静态资源
```

## 了解更多

要了解更多关于 Next.js 的信息，请查看以下资源：

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 的特性和 API
- [学习 Next.js](https://nextjs.org/learn) - 交互式 Next.js 教程

## 部署

推荐使用 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) 部署 Next.js 应用，这是 Next.js 创建者提供的平台。

查看 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多详情。
