import type { FilterMeta, GameCharacter, GameConfig, GameKey, Rarity } from "../types";
import {
  CHARACTERS as GENSHIN_RAW,
  portraitUrl as genshinPortrait,
} from "../data/genshin/characters";
import {
  ELEMENTS,
  REGION_META,
  REGION_ORDER,
  SPECIAL_ELEMENT_META,
  WEAPON_CN,
} from "../types.genshin";
import type { WeaponType } from "../types.genshin";
import { HSR_UNIFIED, hsrPortrait } from "../data/hsr";
import { ZZZ_UNIFIED, zzzPortrait } from "../data/zzz";

/* ==================== 原神 ==================== */

const GENSHIN_ELEMENTS: FilterMeta[] = ELEMENTS.map((e) => ({
  key: e.key,
  cn: e.cn,
  color: e.color,
}));

const GENSHIN_GROUPS: FilterMeta[] = REGION_ORDER.map((r) => ({
  key: r,
  cn: REGION_META[r].cn,
  color: REGION_META[r].color,
}));

const GENSHIN_TAG_OPTIONS: FilterMeta[] = (
  Object.keys(WEAPON_CN) as WeaponType[]
).map((w) => ({ key: w, cn: WEAPON_CN[w], color: "#d8d4e8" }));

const GENSHIN_CHARACTERS: GameCharacter[] = GENSHIN_RAW.map((c) => ({
  id: c.id,
  name: c.name,
  element: c.element,
  rarity: c.rarity,
  group: c.region,
  tag: c.weapon,
}));

/* ==================== 崩坏：星穹铁道 ==================== */

const HSR_ELEMENTS: FilterMeta[] = [
  { key: "物理", cn: "物理", color: "#d8d4c8" },
  { key: "火", cn: "火", color: "#ef7938" },
  { key: "冰", cn: "冰", color: "#7fd8e8" },
  { key: "雷", cn: "雷", color: "#b78aff" },
  { key: "风", cn: "风", color: "#74c2a8" },
  { key: "量子", cn: "量子", color: "#d6669e" },
  { key: "虚数", cn: "虚数", color: "#f0c95e" },
];

/** 命途（分组），顺序按开服既有 → 3.x 新增 */
const HSR_GROUPS: FilterMeta[] = [
  { key: "毁灭", cn: "毁灭", color: "#ef7938" },
  { key: "巡猎", cn: "巡猎", color: "#f5d76e" },
  { key: "智识", cn: "智识", color: "#4cc2f1" },
  { key: "和谐", cn: "和谐", color: "#74c2a8" },
  { key: "虚无", cn: "虚无", color: "#b78aff" },
  { key: "存护", cn: "存护", color: "#f4b860" },
  { key: "丰饶", cn: "丰饶", color: "#a5c83b" },
  { key: "记忆", cn: "记忆", color: "#7fd8e8" },
  { key: "欢愉", cn: "欢愉", color: "#ff9db8" },
];

/* ==================== 绝区零 ==================== */

const ZZZ_ELEMENTS: FilterMeta[] = [
  { key: "物理", cn: "物理", color: "#d8d4c8" },
  { key: "火", cn: "火", color: "#ef7938" },
  { key: "冰", cn: "冰", color: "#7fd8e8" },
  { key: "电", cn: "电", color: "#b78aff" },
  { key: "以太", cn: "以太", color: "#a5c83b" },
  { key: "风", cn: "风", color: "#74c2a8" },
  { key: "烈霜", cn: "烈霜", color: "#9fc8e8" },
  { key: "玄墨", cn: "玄墨", color: "#9aa0b8" },
  { key: "凛刃", cn: "凛刃", color: "#c8d8e8" },
  { key: "流明", cn: "流明", color: "#f5d76e" },
];

const ZZZ_TAG_OPTIONS: FilterMeta[] = [
  { key: "强攻", cn: "强攻", color: "#ef7938" },
  { key: "击破", cn: "击破", color: "#f5d76e" },
  { key: "异常", cn: "异常", color: "#b78aff" },
  { key: "支援", cn: "支援", color: "#74c2a8" },
  { key: "防护", cn: "防护", color: "#f4b860" },
  { key: "命破", cn: "命破", color: "#4cc2f1" },
  { key: "锋御", cn: "锋御", color: "#a5c83b" },
];

/** 阵营配色循环表（阵营较多，按数据出现顺序取色） */
const ZZZ_FACTION_PALETTE = [
  "#f5d76e", "#74c2a8", "#b78aff", "#4cc2f1", "#ef7938",
  "#a5c83b", "#7fd8e8", "#f4b860", "#ff9db8", "#9aa0b8",
  "#d6669e", "#8fd0a8", "#c8b6e8", "#f0a8a0", "#a0c8f0",
  "#d8c88f", "#8fe8d0", "#e8c4ff", "#b8d0a0", "#f0d0a0",
];

function buildZzzGroups(chars: GameCharacter[]): FilterMeta[] {
  const seen: string[] = [];
  for (const c of chars) {
    if (!seen.includes(c.group)) seen.push(c.group);
  }
  return seen.map((key, i) => ({
    key,
    cn: key,
    color: ZZZ_FACTION_PALETTE[i % ZZZ_FACTION_PALETTE.length],
  }));
}

/* ==================== 注册表 ==================== */

function buildConfig(
  base: Omit<GameConfig, "characterMap">,
): GameConfig {
  const characterMap: Record<string, GameCharacter> = {};
  for (const c of base.characters) characterMap[c.id] = c;
  return { ...base, characterMap };
}

export const GAME_REGISTRY: Record<GameKey, GameConfig> = {
  genshin: buildConfig({
    key: "genshin",
    cn: "原神",
    tabCn: "原神",
    latin: "GENSHIN IMPACT",
    accent: "#f5d76e",
    elements: GENSHIN_ELEMENTS,
    specialElementMeta: { none: { key: "none", cn: SPECIAL_ELEMENT_META.cn, color: SPECIAL_ELEMENT_META.color } },
    groups: GENSHIN_GROUPS,
    groupLabel: "地区",
    tagFilter: { label: "武器", options: GENSHIN_TAG_OPTIONS },
    rarityLabel: { 5: "5★", 4: "4★" },
    characters: GENSHIN_CHARACTERS,
    portrait: genshinPortrait,
  }),
  hsr: buildConfig({
    key: "hsr",
    cn: "崩坏：星穹铁道",
    tabCn: "星穹铁道",
    latin: "HONKAI: STAR RAIL",
    accent: "#f0c987",
    elements: HSR_ELEMENTS,
    groups: HSR_GROUPS,
    groupLabel: "命途",
    tagFilter: null,
    rarityLabel: { 5: "5★", 4: "4★" },
    characters: HSR_UNIFIED,
    portrait: hsrPortrait,
  }),
  zzz: buildConfig({
    key: "zzz",
    cn: "绝区零",
    tabCn: "绝区零",
    latin: "ZENLESS ZONE ZERO",
    accent: "#d8f400",
    elements: ZZZ_ELEMENTS,
    groups: buildZzzGroups(ZZZ_UNIFIED),
    groupLabel: "阵营",
    tagFilter: { label: "特性", options: ZZZ_TAG_OPTIONS },
    rarityLabel: { 5: "S级", 4: "A级" },
    characters: ZZZ_UNIFIED,
    portrait: zzzPortrait,
  }),
};

export const GAME_KEYS: GameKey[] = ["genshin", "hsr", "zzz"];

export function isGameKey(v: string): v is GameKey {
  return v in GAME_REGISTRY;
}

/** 稀有度颜色（三游戏统一：5/S 金色，4/A 紫色） */
export const RARITY_COLORS: Record<Rarity, string> = {
  5: "#f5d76e",
  4: "#c08bf0",
};
