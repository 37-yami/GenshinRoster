# 多游戏支持设计（原神 / 崩坏：星穹铁道 / 绝区零）

日期：2026-10-15
状态：已确认（用户批准，含两处修正：击晕→击破；原神加武器筛选、绝区零加特性筛选）

## 目标

在现有原神角色追踪器基础上，新增崩坏：星穹铁道（下称 HSR）与绝区零（下称 ZZZ）两个游戏页，
单页应用内通过顶部 tab（HashRouter 路由）切换，三游戏共享全部既有功能：
拥有勾选、筛选、排序、分组、统计、本地持久化、完全离线单文件。

## 产物形态

单一大 HTML（dist/index.html，预计 25~30MB），tab 切换不跳页；仓库源码侧 +15MB 左右（远低于 GitHub 限制）。

## 统一数据模型

```ts
interface GameCharacter {
  id: string;
  name: string;
  element: string;        // key，定义于各游戏 config.elements
  rarity: 4 | 5;          // ZZZ 的 S/A 在显示层映射
  group: string;          // 分组 key：原神=地区、HSR=命途、ZZZ=阵营
  tag: string | null;     // 次级标签：原神=武器类型、ZZZ=特性、HSR=null（命途即 group）
}
```

| 维度 | 原神 | HSR | ZZZ |
|---|---|---|---|
| element | 风/岩/雷/草/水/火/冰 + 特殊(奇偶 none) | 物理/火/冰/雷/风/量子/虚数 | 物理/火/冰/电/以太 |
| group | 地区（蒙德…其他 9 组） | 命途（毁灭/巡猎/智识/和谐/虚无/存护/丰饶/记忆） | 阵营（跟随 BWIKI 口径） |
| rarity 显示 | 5★/4★ | 5★/4★ | S级/A级 |
| tag | 武器（单手剑…5 种） | 无 | 特性（攻击/击破/异常/支援/防护） |

筛选器四维（三游戏一致）：element + rarity + group + tag + 搜索 + 排序 + 分组开关。
HSR 无 tag，不渲染该筛选器；原神奇偶 none 不参与元素筛选与统计（沿现行逻辑）。

## GameConfig 驱动

```ts
interface GameConfig {
  key: "genshin" | "hsr" | "zzz";
  cn: string; latin: string;
  elements: FilterMeta[];            // 可筛选元素/属性（有序）
  specialElementMeta?: Record<string, FilterMeta>; // 不可筛选元素（genshin none）
  groups: FilterMeta[];              // 分组（有序）+ 可筛选
  tagFilter?: { label: string; options: FilterMeta[] };
  rarityLabels: Record<Rarity, string>;
  characters: GameCharacter[];
  characterMap: Record<string, GameCharacter>;
  portrait: (id: string) => string;
  accent: string;                    // 主题强调色（tab 高亮等）
}
```

所有页面组件（Home/CharacterCard/FilterBar/StatsBar/ActionBar）改为接收 GameConfig 渲染，
组件内部不再含任何游戏硬编码。元素图标：原神沿用现有几何符号；HSR/ZZZ 各绘制简笔几何符号
（统一 viewBox 0 0 100 100 风格）。

## 路由

react-router-dom HashRouter（依赖已装未用）：
- `/` → 重定向 `/genshin`
- `/:game` → Home（无效 game 重定向 `/genshin`）
顶部 GameTabBar 三项，各自 accent 高亮；支持刷新/直链/前进后退（file:// 兼容）。

## Store

```ts
interface GameSlot {
  ownedIds: string[];
  hasInteracted: boolean;
  filterElement: string;        // "all" | element key
  filterRarity: Rarity | "all";
  filterGroup: string;          // "all" | group key
  filterTag: string;            // "all" | tag key
  searchKey: string;
  sortBy: "rarity" | "element" | "group" | "name";
  groupBy: boolean;             // 原 groupByRegion 泛化
}
interface TrackerState {
  activeGame: GameKey;
  games: Record<GameKey, GameSlot>;
}
```

- localStorage key 沿用 `genshin-tracker-v1`（老用户数据无损），persist version 升 3；
- migrate：v2 {ownedIds, hasInteracted, groupByRegion} → v3 games.genshin（含陈旧 id 按各游戏 characterMap 清理）；HSR/ZZZ 初始空槽；
- partialize：activeGame + 每游戏 {ownedIds, hasInteracted, groupBy}（筛选/排序仍为会话态）；
- selectAll 并集语义保持。

## 数据管线（复用已验证的 BWIKI SMW API）

- HSR：wiki.biligame.com/sr（api.php?action=ask），拉 名称/属性/命途/稀有度 + 实装列表
- ZZZ：wiki.biligame.com/zzz，拉 名称/属性/特性/阵营/稀有度
- 头像：api.php imageinfo 批量取 `文件:{名}头像.png` 256×256，存 `src/portraits/{game}/`
- 口径：跟随 BWIKI 图鉴；开拓者多命途变体合并单条（物理/毁灭，对齐原神旅行者处理）；
  ZZZ 仅收录可玩代理人（哲/铃按 BWIKI 列法），邦布不收录
- 校验：数量与 BWIKI 统计文对照，属性逐项程序化 diff，入库前零差异

## 文件布局

```
src/
├── config/games.ts          # 三游戏 GameConfig 组装
├── data/{genshin,hsr,zzz}/characters.ts   # 各游戏原始数据（保留游戏原生字段便于维护）
├── portraits/{genshin,hsr,zzz}/*.png      # 现有 122 张 git mv 到 genshin/ 子目录
├── components/…             # 全部配置驱动化 + GameTabBar 新增
├── pages/Home.tsx           # :game 参数驱动
├── store/useTrackerStore.ts # 多游戏分区
└── fonts/                   # subset-fonts.py 重新生成（自动覆盖新文案）
```

## 验证

npm run check / lint / build 全过；dist 单 HTML：三游戏数据齐、无外部请求、
头像与字体全内联、tab 路由可用；数据与 BWIKI 零差异；README 更新。
