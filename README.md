# 米哈游角色收集追踪器 · HoYoRoster

一个纯前端的多游戏角色收集追踪器，目前覆盖 **原神 / 崩坏：星穹铁道 / 绝区零**，
页内顶部 tab 一键切换，记录你已拥有的角色，支持筛选、排序与进度统计。
**完全离线可用**：所有角色头像与字体在构建时内联为 base64/woff2 打包进单个 HTML 文件，
双击即可在断网环境下运行，无需任何后端服务。

> 在线使用：`https://<你的用户名>.github.io/HoYoRoster/`（GitHub Pages 自动部署），
> 把链接发给好友即可各自在浏览器里记录自己的收集进度（数据保存在各自浏览器本地）。

## 特性

- **271 个角色**：原神 122（至 7.1）· 星穹铁道 89（至 4.6）· 绝区零 60（至 3.2）
- **游戏切换**：HashRouter 路由（`#/genshin`、`#/hsr`、`#/zzz`），支持刷新/直链/前进后退
- **四维筛选**：元素/属性 + 稀有度 + 分组（地区/命途/阵营）+ 次级标签（原神武器类型、绝区零特性）+ 搜索
- **离线优先**：头像与字体全部内联，无任何外部资源请求
- **单文件部署**：使用 `vite-plugin-singlefile` 将 JS/CSS/图片/字体全部内联进 `dist/index.html`
- **本地持久化**：各游戏独立保存勾选状态（Zustand + `localStorage`，带数据迁移，角色表变更自动清理陈旧记录）
- **三态卡片**：默认明亮 → 已拥有（光晕 + 勾选）→ 未拥有（灰度变暗）

## 各游戏数据口径

| | 原神 | 崩坏：星穹铁道 | 绝区零 |
|---|---|---|---|
| element | 七元素 + 特殊(奇偶) | 物理/火/冰/雷/风/量子/虚数 | 物理/火/冰/电/以太/风/烈霜/玄墨/凛刃/流明 |
| 分组 | 地区 | 命途（9 种） | 阵营 |
| 次级标签 | 武器类型 | —（命途即分组） | 特性（强攻/击破/异常/支援/防护/命破/锋御） |
| 稀有度 | 5★/4★ | 5★/4★ | S级/A级 |
| 特殊处理 | 旅行者单条；奇偶无固定元素 | 同名多形态合并单条（开拓者/三月七取初始形态） | 仅可玩代理人，不含主角与邦布 |

数据来源为 BWIKI（wiki.biligame.com）SMW API，与各 wiki 图鉴口径对齐（实装日期一周内的角色不计入）。

## 技术栈

React 18 · TypeScript · Vite 6 · Tailwind CSS 3 · Zustand 5 · react-router 7 · vite-plugin-singlefile

## 本地开发

```bash
npm install        # 安装依赖
npm run dev        # 启动开发服务器
npm run build      # 构建单文件产物到 dist/index.html
npm run preview    # 本地预览构建产物
npm run check      # TypeScript 类型检查
npm run lint       # ESLint
```

## 离线使用

构建完成后，直接双击 `dist/index.html` 即可在浏览器中打开，无需联网、无需服务器。
所有 271 张角色头像与全部字体子集均已内联进该 HTML 文件（约 22 MB）。

## 部署到 GitHub Pages

本项目已配置 GitHub Actions 自动部署工作流（见 `.github/workflows/deploy.yml`）。

1. 将本仓库推送到 GitHub
2. 进入仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**
3. 此后每次推送到 `main` 分支都会自动构建并发布到 GitHub Pages

## 项目结构

```
├── index.html              # 入口 HTML（favicon 内联为 SVG data URI）
├── vite.config.ts          # Vite 配置（singlefile + 去除 module 属性以支持 file://）
├── scripts/
│   ├── fetch-roster.py     # 星铁/绝区零数据+头像拉取（BWIKI SMW API，可重复执行增量更新）
│   └── subset-fonts.py     # 字体离线子集生成（改文案/加角色后重跑）
├── src/
│   ├── main.tsx            # 入口（DOMContentLoaded 包裹，兼容 file:// 协议）
│   ├── App.tsx             # HashRouter 路由 + 游戏 tab
│   ├── config/games.ts     # 三游戏 GameConfig 注册表（元素/分组/标签/稀有度元数据）
│   ├── pages/Home.tsx      # 主页面（配置驱动）
│   ├── components/         # 卡片、筛选栏、操作栏、统计栏、游戏tab、图标
│   ├── data/
│   │   ├── genshin/        # 原神数据（手工维护）
│   │   ├── hsr/            # 星铁数据（fetch-roster.py 生成）
│   │   └── zzz/            # 绝区零数据（fetch-roster.py 生成）
│   ├── portraits/{genshin,hsr,zzz}/  # 角色头像 PNG（构建时内联）
│   ├── fonts/              # 字体 woff2 子集（由 scripts/subset-fonts.py 生成）
│   ├── store/              # Zustand 状态管理（多游戏分区 + localStorage 迁移）
│   ├── types.ts            # 游戏无关核心模型
│   └── types.genshin.ts    # 原神专属类型与元数据
└── .github/workflows/      # GitHub Actions 自动部署
```

## 数据维护

- **原神**：手工维护 `src/data/genshin/characters.ts`，头像放入 `src/portraits/genshin/{id}.png`
- **星铁/绝区零**：运行 `python scripts/fetch-roster.py` 自动更新数据与头像（含增量下载）
- **任意游戏更新后**：运行 `python scripts/subset-fonts.py` 重新生成字体子集，
  否则新增文字在离线环境下会回退到系统字体

新增一个游戏只需：建 `src/data/{game}/`、在 `src/config/games.ts` 注册配置、
在 `src/components/Icons.tsx` 补元素图标，页面/筛选/统计/持久化全部自动生效。
