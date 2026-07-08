# 原神角色收集追踪器 · Genshin Character Tracker

一个纯前端的原神角色收集追踪器，记录你已拥有的角色，支持筛选、排序与进度统计。
**完全离线可用**：所有角色头像在构建时内联为 base64 打包进单个 HTML 文件，双击即可在断网环境下运行，无需任何后端服务。

## 特性

- **118 个角色**：覆盖至 6.7 版本全部实装可玩角色
- **离线优先**：头像通过 `import.meta.glob` 在构建时内联为 base64 data URI，无任何外部图片请求
- **单文件部署**：使用 `vite-plugin-singlefile` 将 JS/CSS/图片全部内联进 `dist/index.html`，双击即可打开
- **本地持久化**：勾选状态通过 Zustand + `localStorage` 保存在浏览器本地
- **筛选 / 排序**：按元素、稀有度、地区筛选；按稀有度、元素、地区、名字排序
- **三态卡片**：默认明亮 → 已拥有（光晕 + 勾选）→ 未拥有（灰度变暗）

## 技术栈

React 18 · TypeScript · Vite 6 · Tailwind CSS 3 · Zustand 5 · vite-plugin-singlefile

## 本地开发

```bash
npm install        # 安装依赖
npm run dev        # 启动开发服务器
npm run build      # 构建单文件产物到 dist/index.html
npm run preview    # 本地预览构建产物
```

## 离线使用

构建完成后，直接双击 `dist/index.html` 即可在浏览器中打开，无需联网、无需服务器。
所有 118 张角色头像均已内联进该 HTML 文件（约 6 MB）。

## 部署到 GitHub Pages

本项目已配置 GitHub Actions 自动部署工作流（见 `.github/workflows/deploy.yml`）。

1. 将本仓库推送到 GitHub
2. 进入仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**
3. 此后每次推送到 `main` 分支都会自动构建并发布到 GitHub Pages

部署后任何人访问 Pages 链接即可直接使用，无需自行启动本地服务器。

## 项目结构

```
├── index.html              # 入口 HTML（favicon 内联为 SVG data URI）
├── vite.config.ts          # Vite 配置（singlefile + 去除 module 属性以支持 file://）
├── src/
│   ├── main.tsx            # 入口（DOMContentLoaded 包裹，兼容 file:// 协议）
│   ├── App.tsx             # 根组件
│   ├── pages/Home.tsx      # 主页面
│   ├── components/         # 卡片、筛选栏、操作栏、统计栏、图标
│   ├── data/characters.ts  # 角色数据 + 本地头像加载（import.meta.glob）
│   ├── store/              # Zustand 状态管理（localStorage 持久化）
│   ├── portraits/          # 118 张角色头像 PNG（构建时内联）
│   ├── types.ts            # 类型定义与元素/武器/地区元数据
│   └── index.css           # Tailwind 入口与全局样式
└── .github/workflows/      # GitHub Actions 自动部署
```

## 角色数据说明

角色数据维护在 `src/data/characters.ts`，按地区分组（蒙德 / 璃月 / 稻妻 / 须弥 / 枫丹 / 纳塔 / 至冬 / 诺德卡莱）。
头像文件命名规则为 `src/portraits/{character.id}.png`，新增角色时只需在该目录放入同名 PNG 并更新 `characters.ts` 即可。
