/**
 * 绝区零代理人数据（由 scripts/fetch-roster.py 生成，请勿手工编辑）
 *
 * 字段：id/name、element（属性）、rarity（内部 5=S级 / 4=A级，显示层映射）、
 * group（阵营）、tag（特性）、rel（实装日期，排序用）
 */
export interface ZzzCharacter {
  id: string;
  name: string;
  element: string;
  rarity: 4 | 5;
  group: string;
  tag: string;
  rel: string;
}

export const ZZZ_CHARACTERS: ZzzCharacter[] = [
  { id: "「11号」", name: "「11号」", element: "火", rarity: 5, group: "防卫军·奥波勒斯小队", tag: "强攻", rel: "2024-07-04" },
  { id: "丽娜", name: "丽娜", element: "电", rarity: 5, group: "维多利亚家政", tag: "支援", rel: "2024-07-04" },
  { id: "可琳", name: "可琳", element: "物理", rarity: 4, group: "维多利亚家政", tag: "强攻", rel: "2024-07-04" },
  { id: "妮可", name: "妮可", element: "以太", rarity: 4, group: "狡兔屋", tag: "支援", rel: "2024-07-04" },
  { id: "安东", name: "安东", element: "电", rarity: 4, group: "白祇重工", tag: "强攻", rel: "2024-07-04" },
  { id: "安比", name: "安比", element: "电", rarity: 4, group: "狡兔屋", tag: "击破", rel: "2024-07-04" },
  { id: "本", name: "本", element: "火", rarity: 4, group: "白祇重工", tag: "防护", rel: "2024-07-04" },
  { id: "格莉丝", name: "格莉丝", element: "电", rarity: 5, group: "白祇重工", tag: "异常", rel: "2024-07-04" },
  { id: "比利", name: "比利", element: "物理", rarity: 4, group: "狡兔屋", tag: "强攻", rel: "2024-07-04" },
  { id: "派派", name: "派派", element: "物理", rarity: 4, group: "卡吕冬之子", tag: "异常", rel: "2024-07-04" },
  { id: "猫又", name: "猫又", element: "物理", rarity: 5, group: "狡兔屋", tag: "强攻", rel: "2024-07-04" },
  { id: "珂蕾妲", name: "珂蕾妲", element: "火", rarity: 5, group: "白祇重工", tag: "击破", rel: "2024-07-04" },
  { id: "艾莲", name: "艾莲", element: "冰", rarity: 5, group: "维多利亚家政", tag: "强攻", rel: "2024-07-04" },
  { id: "苍角", name: "苍角", element: "冰", rarity: 4, group: "对空六课", tag: "支援", rel: "2024-07-04" },
  { id: "莱卡恩", name: "莱卡恩", element: "冰", rarity: 5, group: "维多利亚家政", tag: "击破", rel: "2024-07-04" },
  { id: "露西", name: "露西", element: "火", rarity: 4, group: "卡吕冬之子", tag: "支援", rel: "2024-07-04" },
  { id: "朱鸢", name: "朱鸢", element: "以太", rarity: 5, group: "治安局·刑侦特勤组", tag: "强攻", rel: "2024-07-24" },
  { id: "青衣", name: "青衣", element: "电", rarity: 5, group: "治安局·刑侦特勤组", tag: "击破", rel: "2024-08-14" },
  { id: "简", name: "简", element: "物理", rarity: 5, group: "治安局·刑侦特勤组", tag: "异常", rel: "2024-09-04" },
  { id: "赛斯", name: "赛斯", element: "电", rarity: 4, group: "治安局·刑侦特勤组", tag: "防护", rel: "2024-09-04" },
  { id: "凯撒", name: "凯撒", element: "物理", rarity: 5, group: "卡吕冬之子", tag: "防护", rel: "2024-09-25" },
  { id: "柏妮思", name: "柏妮思", element: "火", rarity: 5, group: "卡吕冬之子", tag: "异常", rel: "2024-10-16" },
  { id: "柳", name: "柳", element: "电", rarity: 5, group: "对空六课", tag: "异常", rel: "2024-11-06" },
  { id: "莱特", name: "莱特", element: "火", rarity: 5, group: "卡吕冬之子", tag: "击破", rel: "2024-11-27" },
  { id: "悠真", name: "悠真", element: "电", rarity: 5, group: "对空六课", tag: "强攻", rel: "2024-12-18" },
  { id: "雅", name: "雅", element: "烈霜", rarity: 5, group: "对空六课", tag: "异常", rel: "2024-12-18" },
  { id: "耀嘉音", name: "耀嘉音", element: "以太", rarity: 5, group: "天琴座", tag: "支援", rel: "2025-01-22" },
  { id: "伊芙琳", name: "伊芙琳", element: "火", rarity: 5, group: "天琴座", tag: "强攻", rel: "2025-02-12" },
  { id: "波可娜", name: "波可娜", element: "物理", rarity: 4, group: "卡吕冬之子", tag: "击破", rel: "2025-03-12" },
  { id: "零号·安比", name: "零号·安比", element: "电", rarity: 5, group: "防卫军·白银小队", tag: "强攻", rel: "2025-03-12" },
  { id: "「扳机」", name: "「扳机」", element: "电", rarity: 5, group: "防卫军·奥波勒斯小队", tag: "击破", rel: "2025-04-02" },
  { id: "薇薇安", name: "薇薇安", element: "以太", rarity: 5, group: "反舌鸟", tag: "异常", rel: "2025-04-23" },
  { id: "雨果", name: "雨果", element: "冰", rarity: 5, group: "反舌鸟", tag: "强攻", rel: "2025-05-14" },
  { id: "仪玄", name: "仪玄", element: "玄墨", rarity: 5, group: "云岿山", tag: "命破", rel: "2025-06-06" },
  { id: "潘引壶", name: "潘引壶", element: "物理", rarity: 4, group: "云岿山", tag: "防护", rel: "2025-06-06" },
  { id: "橘福福", name: "橘福福", element: "火", rarity: 5, group: "云岿山", tag: "击破", rel: "2025-06-25" },
  { id: "柚叶", name: "柚叶", element: "物理", rarity: 5, group: "怪啖屋", tag: "支援", rel: "2025-07-16" },
  { id: "爱丽丝", name: "爱丽丝", element: "物理", rarity: 5, group: "怪啖屋", tag: "异常", rel: "2025-08-06" },
  { id: "「席德」", name: "「席德」", element: "电", rarity: 5, group: "防卫军·奥波勒斯小队", tag: "强攻", rel: "2025-09-04" },
  { id: "奥菲丝&「鬼火」", name: "奥菲丝&「鬼火」", element: "火", rarity: 5, group: "防卫军·奥波勒斯小队", tag: "强攻", rel: "2025-09-24" },
  { id: "卢西娅", name: "卢西娅", element: "以太", rarity: 5, group: "怪啖屋", tag: "支援", rel: "2025-10-15" },
  { id: "真斗", name: "真斗", element: "火", rarity: 4, group: "怪啖屋", tag: "命破", rel: "2025-10-15" },
  { id: "伊德海莉", name: "伊德海莉", element: "冰", rarity: 5, group: "怪啖屋", tag: "命破", rel: "2025-11-05" },
  { id: "琉音", name: "琉音", element: "物理", rarity: 5, group: "坎卜斯黑枝", tag: "击破", rel: "2025-11-26" },
  { id: "般岳", name: "般岳", element: "火", rarity: 5, group: "坎卜斯黑枝", tag: "命破", rel: "2025-12-17" },
  { id: "叶瞬光", name: "叶瞬光", element: "凛刃", rarity: 5, group: "云岿山", tag: "强攻", rel: "2025-12-30" },
  { id: "照", name: "照", element: "冰", rarity: 5, group: "坎卜斯黑枝", tag: "防护", rel: "2025-12-30" },
  { id: "千夏", name: "千夏", element: "物理", rarity: 5, group: "妄想天使", tag: "支援", rel: "2026-02-06" },
  { id: "爱芮", name: "爱芮", element: "以太", rarity: 5, group: "妄想天使", tag: "异常", rel: "2026-03-04" },
  { id: "南宫羽", name: "南宫羽", element: "以太", rarity: 5, group: "妄想天使", tag: "击破", rel: "2026-03-24" },
  { id: "希希芙", name: "希希芙", element: "电", rarity: 5, group: "治安局·都市秩序部", tag: "强攻", rel: "2026-04-15" },
  { id: "普罗米娅", name: "普罗米娅", element: "冰", rarity: 5, group: "坎卜斯黑枝", tag: "异常", rel: "2026-05-06" },
  { id: "星徽·比利", name: "星徽·比利", element: "物理", rarity: 5, group: "狡兔屋", tag: "命破", rel: "2026-05-27" },
  { id: "佩洛伊斯", name: "佩洛伊斯", element: "以太", rarity: 5, group: "法厄同", tag: "强攻", rel: "2026-06-17" },
  { id: "维琳娜", name: "维琳娜", element: "风", rarity: 5, group: "罗斯凯利法·外务筹策局", tag: "异常", rel: "2026-06-17" },
  { id: "诺姆", name: "诺姆", element: "火", rarity: 5, group: "罗斯凯利法·外务筹策局", tag: "击破", rel: "2026-07-08" },
  { id: "蕾米埃尔", name: "蕾米埃尔", element: "流明", rarity: 5, group: "达识结社", tag: "异常", rel: "2026-07-29" },
  { id: "希格莉德", name: "希格莉德", element: "冰", rarity: 5, group: "罗斯凯利法·空域巡戍局", tag: "强攻", rel: "2026-08-19" },
  { id: "克拉蕾", name: "克拉蕾", element: "电", rarity: 5, group: "罗斯凯利法·弗林特工坊", tag: "锋御", rel: "2026-09-09" },
  { id: "洛克茜", name: "洛克茜", element: "风", rarity: 5, group: "罗斯凯利法·弗林特工坊", tag: "击破", rel: "2026-09-30" },
];
