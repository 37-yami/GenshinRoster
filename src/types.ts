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

export interface Character {
  id: string;
  name: string;
  element: Element;
  rarity: Rarity;
  weapon: WeaponType;
  /** 上线版本区域，用于排序分组 */
  region:
    | "蒙德"
    | "璃月"
    | "稻妻"
    | "须弥"
    | "枫丹"
    | "纳塔"
    | "至冬"
    | "诺德卡莱";
  /** 社区图片 API (genshin.jmp.blue) 的角色 ID；为 null 表示无图，回退到元素符号 */
  apiId: string | null;
}

export type SortBy = "rarity" | "element" | "region" | "name";
export type ElementFilter = Element | "all";
export type RarityFilter = Rarity | "all";

export interface ElementMeta {
  key: Element;
  cn: string;
  color: string;
  glow: string;
}

export const ELEMENTS: ElementMeta[] = [
  { key: "anemo", cn: "风", color: "#74c2a8", glow: "rgba(116,194,168,0.55)" },
  { key: "geo", cn: "岩", color: "#f4b860", glow: "rgba(244,184,96,0.55)" },
  { key: "electro", cn: "雷", color: "#b78aff", glow: "rgba(183,138,255,0.55)" },
  { key: "dendro", cn: "草", color: "#a5c83b", glow: "rgba(165,200,59,0.55)" },
  { key: "hydro", cn: "水", color: "#4cc2f1", glow: "rgba(76,194,241,0.55)" },
  { key: "pyro", cn: "火", color: "#ef7938", glow: "rgba(239,121,56,0.55)" },
  { key: "cryo", cn: "冰", color: "#7fd8e8", glow: "rgba(127,216,232,0.55)" },
];

export const ELEMENT_MAP: Record<Element, ElementMeta> = ELEMENTS.reduce(
  (acc, e) => {
    acc[e.key] = e;
    return acc;
  },
  {} as Record<Element, ElementMeta>,
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
  "诺德卡莱",
];

export const REGION_META: Record<Character["region"], { color: string; cn: string }> = {
  蒙德: { color: "#74c2a8", cn: "蒙德" },
  璃月: { color: "#f4b860", cn: "璃月" },
  稻妻: { color: "#b78aff", cn: "稻妻" },
  须弥: { color: "#a5c83b", cn: "须弥" },
  枫丹: { color: "#4cc2f1", cn: "枫丹" },
  纳塔: { color: "#ef7938", cn: "纳塔" },
  至冬: { color: "#7fd8e8", cn: "至冬" },
  诺德卡莱: { color: "#c8b6e8", cn: "诺德卡莱" },
};
