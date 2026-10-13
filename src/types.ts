export type Element =
  | "anemo"
  | "geo"
  | "electro"
  | "dendro"
  | "hydro"
  | "pyro"
  | "cryo";

export type WeaponType =
  | "sword"
  | "claymore"
  | "polearm"
  | "bow"
  | "catalyst";

export type Rarity = 4 | 5;

/** 角色元素：七元素，或 "none"（无固定元素的特殊角色，如奇偶，元素随旅行者变化） */
export type CharacterElement = Element | "none";

export interface Character {
  id: string;
  name: string;
  element: CharacterElement;
  rarity: Rarity;
  weapon: WeaponType;
  /** 角色所属地区，用于排序分组 */
  region:
    | "蒙德"
    | "璃月"
    | "稻妻"
    | "须弥"
    | "枫丹"
    | "纳塔"
    | "至冬"
    | "挪德卡莱"
    | "其他";
  /** 头像来源的历史参考（jmp.blue / enka / bwiki），运行时仅使用本地内联头像 */
  apiId: string | null;
}

export type SortBy = "rarity" | "element" | "region" | "name";
export type ElementFilter = Element | "all";
export type RarityFilter = Rarity | "all";

export interface ElementMeta {
  key: CharacterElement;
  cn: string;
  color: string;
  glow: string;
}

/** 七元素筛选/统计用的元数据列表（不含特殊元素 "none"） */
export const ELEMENTS: (ElementMeta & { key: Element })[] = [
  { key: "anemo", cn: "风", color: "#74c2a8", glow: "rgba(116,194,168,0.55)" },
  { key: "geo", cn: "岩", color: "#f4b860", glow: "rgba(244,184,96,0.55)" },
  { key: "electro", cn: "雷", color: "#b78aff", glow: "rgba(183,138,255,0.55)" },
  { key: "dendro", cn: "草", color: "#a5c83b", glow: "rgba(165,200,59,0.55)" },
  { key: "hydro", cn: "水", color: "#4cc2f1", glow: "rgba(76,194,241,0.55)" },
  { key: "pyro", cn: "火", color: "#ef7938", glow: "rgba(239,121,56,0.55)" },
  { key: "cryo", cn: "冰", color: "#7fd8e8", glow: "rgba(127,216,232,0.55)" },
];

/** 无固定元素的特殊角色（奇偶）：中性配色，不参与元素筛选与元素统计 */
export const SPECIAL_ELEMENT_META: ElementMeta = {
  key: "none",
  cn: "特殊",
  color: "#d8d4e8",
  glow: "rgba(216,212,232,0.5)",
};

export const ELEMENT_MAP: Record<CharacterElement, ElementMeta> = ELEMENTS.reduce(
  (acc, e) => {
    acc[e.key] = e;
    return acc;
  },
  { none: SPECIAL_ELEMENT_META } as Record<CharacterElement, ElementMeta>,
);

export const WEAPON_CN: Record<WeaponType, string> = {
  sword: "单手剑",
  claymore: "双手剑",
  polearm: "长柄武器",
  bow: "弓",
  catalyst: "法器",
};

export const REGION_ORDER: Character["region"][] = [
  "蒙德",
  "璃月",
  "稻妻",
  "须弥",
  "枫丹",
  "纳塔",
  "至冬",
  "挪德卡莱",
  "其他",
];

export const REGION_META: Record<Character["region"], { color: string; cn: string }> = {
  蒙德: { color: "#74c2a8", cn: "蒙德" },
  璃月: { color: "#f4b860", cn: "璃月" },
  稻妻: { color: "#b78aff", cn: "稻妻" },
  须弥: { color: "#a5c83b", cn: "须弥" },
  枫丹: { color: "#4cc2f1", cn: "枫丹" },
  纳塔: { color: "#ef7938", cn: "纳塔" },
  至冬: { color: "#7fd8e8", cn: "至冬" },
  挪德卡莱: { color: "#c8b6e8", cn: "挪德卡莱" },
  其他: { color: "#b8c0d0", cn: "其他" },
};
