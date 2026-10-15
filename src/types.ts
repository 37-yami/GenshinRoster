/** 稀有度：内部统一用 5/4，各游戏显示标签不同（5★/4★、S级/A级） */
export type Rarity = 4 | 5;

/** 排序维度（group 对应各游戏的地区/命途/阵营） */
export type SortBy = "rarity" | "element" | "group" | "name";

export type GameKey = "genshin" | "hsr" | "zzz";

/** 统一角色模型：字段含义由各游戏 GameConfig 解释 */
export interface GameCharacter {
  id: string;
  name: string;
  /** 属性/元素 key（定义于 GameConfig.elements / specialElementMeta） */
  element: string;
  rarity: Rarity;
  /** 分组 key：原神=地区、星铁=命途、绝区零=阵营（定义于 GameConfig.groups） */
  group: string;
  /** 次级标签 key：原神=武器类型、绝区零=特性、星铁=null（命途即分组） */
  tag: string | null;
}

/** 筛选/展示用的元数据（元素、分组、标签通用） */
export interface FilterMeta {
  key: string;
  cn: string;
  color: string;
}

/** 次级标签筛选（武器/特性）；星铁无次级标签则为 null */
export interface TagFilterConfig {
  label: string;
  options: FilterMeta[];
}

export interface GameConfig {
  key: GameKey;
  /** 中文全名（崩坏：星穹铁道） */
  cn: string;
  /** 顶栏 tab 短名（星穹铁道） */
  tabCn: string;
  /** 拉丁标题装饰（HONKAI: STAR RAIL） */
  latin: string;
  /** 主题强调色（tab 高亮等） */
  accent: string;
  /** 可筛选元素/属性（有序，驱动筛选栏与统计栏） */
  elements: FilterMeta[];
  /** 不可筛选的特殊元素（原神奇偶 "none"）的展示元数据 */
  specialElementMeta?: Record<string, FilterMeta>;
  /** 分组（有序）：原神=地区、星铁=命途、绝区零=阵营 */
  groups: FilterMeta[];
  /** 分组维度名称（地区/命途/阵营，用于筛选与排序文案） */
  groupLabel: string;
  /** 次级标签筛选（原神=武器类型、绝区零=特性、星铁=null） */
  tagFilter: TagFilterConfig | null;
  /** 稀有度显示标签 */
  rarityLabel: Record<Rarity, string>;
  characters: GameCharacter[];
  characterMap: Record<string, GameCharacter>;
  /** 本地内联头像（id → data URI；空串表示无图回退元素符号） */
  portrait: (id: string) => string;
}
