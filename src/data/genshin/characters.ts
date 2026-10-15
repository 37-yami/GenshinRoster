import type { Character } from "../../types.genshin";

/**
 * 离线头像：import.meta.glob 加载 src/portraits/genshin/*.webp。
 * 单文件模式（vite build --mode single）下 assetsInlineLimit 极大，全部内联为 base64 data URI；
 * 网页模式下为独立资源 URL，配合 <img loading="lazy"> 按需加载。
 *
 * 文件名约定：src/portraits/genshin/{character.id}.webp
 */
const PORTRAIT_MODULES = import.meta.glob("../../portraits/genshin/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const LOCAL_PORTRAITS: Record<string, string> = {};
for (const [path, url] of Object.entries(PORTRAIT_MODULES)) {
  // path 形如 '../../portraits/genshin/venti.webp' → 提取 'venti'
  const id = path.split("/").pop()!.replace(/\.webp$/, "");
  LOCAL_PORTRAITS[id] = url;
}

/**
 * 原神角色数据（截至 7.1 版本全部实装可玩角色，不含旅行者多元素变体与派蒙）
 *
 * 头像来源（apiId 字段，仅作为下载脚本的历史参考，运行时不再使用远程 URL）：
 *  - "xxx"        → genshin.jmp.blue（4.x 及之前实装角色 + 旅行者）
 *  - "enka:Name"  → enka.network（5.x~7.x 较新角色）
 *  - "bwiki:Name" → patchwiki.biligame.com（enka/jmp.blue 均未收录的角色）
 *
 * 离线模式：所有头像已下载到 src/portraits/ 并在构建时内联为 base64 打包进单文件 HTML
 */
export const CHARACTERS: Character[] = [
  // ============ 蒙德 ============
  { id: "venti", name: "温迪", element: "anemo", rarity: 5, weapon: "bow", region: "蒙德", apiId: "venti" },
  { id: "jean", name: "琴", element: "anemo", rarity: 5, weapon: "sword", region: "蒙德", apiId: "jean" },
  { id: "mona", name: "莫娜", element: "hydro", rarity: 5, weapon: "catalyst", region: "蒙德", apiId: "mona" },
  { id: "klee", name: "可莉", element: "pyro", rarity: 5, weapon: "catalyst", region: "蒙德", apiId: "klee" },
  { id: "albedo", name: "阿贝多", element: "geo", rarity: 5, weapon: "sword", region: "蒙德", apiId: "albedo" },
  { id: "eula", name: "优菈", element: "cryo", rarity: 5, weapon: "claymore", region: "蒙德", apiId: "eula" },
  { id: "diluc", name: "迪卢克", element: "pyro", rarity: 5, weapon: "claymore", region: "蒙德", apiId: "diluc" },
  { id: "durin", name: "杜林", element: "pyro", rarity: 5, weapon: "sword", region: "蒙德", apiId: "enka:Durin" },
  { id: "varka", name: "法尔伽", element: "anemo", rarity: 5, weapon: "claymore", region: "蒙德", apiId: "enka:Varka" },
  { id: "lohen", name: "洛恩", element: "cryo", rarity: 5, weapon: "polearm", region: "蒙德", apiId: "enka:Lohen" },
  { id: "traveler", name: "旅行者", element: "anemo", rarity: 5, weapon: "sword", region: "蒙德", apiId: "traveler-anemo" },
  { id: "amber", name: "安柏", element: "pyro", rarity: 4, weapon: "bow", region: "蒙德", apiId: "amber" },
  { id: "kaeya", name: "凯亚", element: "cryo", rarity: 4, weapon: "sword", region: "蒙德", apiId: "kaeya" },
  { id: "lisa", name: "丽莎", element: "electro", rarity: 4, weapon: "catalyst", region: "蒙德", apiId: "lisa" },
  { id: "barbara", name: "芭芭拉", element: "hydro", rarity: 4, weapon: "catalyst", region: "蒙德", apiId: "barbara" },
  { id: "razor", name: "雷泽", element: "electro", rarity: 4, weapon: "claymore", region: "蒙德", apiId: "razor" },
  { id: "bennett", name: "班尼特", element: "pyro", rarity: 4, weapon: "sword", region: "蒙德", apiId: "bennett" },
  { id: "noelle", name: "诺艾尔", element: "geo", rarity: 4, weapon: "claymore", region: "蒙德", apiId: "noelle" },
  { id: "sucrose", name: "砂糖", element: "anemo", rarity: 4, weapon: "catalyst", region: "蒙德", apiId: "sucrose" },
  { id: "fischl", name: "菲谢尔", element: "electro", rarity: 4, weapon: "bow", region: "蒙德", apiId: "fischl" },
  { id: "diona", name: "迪奥娜", element: "cryo", rarity: 4, weapon: "bow", region: "蒙德", apiId: "diona" },
  { id: "rosaria", name: "罗莎莉亚", element: "cryo", rarity: 4, weapon: "polearm", region: "蒙德", apiId: "rosaria" },
  { id: "mika", name: "米卡", element: "cryo", rarity: 4, weapon: "polearm", region: "蒙德", apiId: "mika" },
  { id: "dahlia", name: "塔利雅", element: "hydro", rarity: 4, weapon: "sword", region: "蒙德", apiId: "enka:Dahlia" },
  { id: "prune", name: "布伦妮", element: "anemo", rarity: 4, weapon: "catalyst", region: "蒙德", apiId: "enka:Prune" },

  // ============ 璃月 ============
  { id: "zhongli", name: "钟离", element: "geo", rarity: 5, weapon: "polearm", region: "璃月", apiId: "zhongli" },
  { id: "xiao", name: "魈", element: "anemo", rarity: 5, weapon: "polearm", region: "璃月", apiId: "xiao" },
  { id: "ganyu", name: "甘雨", element: "cryo", rarity: 5, weapon: "bow", region: "璃月", apiId: "ganyu" },
  { id: "hutao", name: "胡桃", element: "pyro", rarity: 5, weapon: "polearm", region: "璃月", apiId: "hu-tao" },
  { id: "keqing", name: "刻晴", element: "electro", rarity: 5, weapon: "sword", region: "璃月", apiId: "keqing" },
  { id: "qiqi", name: "七七", element: "cryo", rarity: 5, weapon: "sword", region: "璃月", apiId: "qiqi" },
  { id: "baizhu", name: "白术", element: "dendro", rarity: 5, weapon: "catalyst", region: "璃月", apiId: "baizhu" },
  { id: "shenhe", name: "申鹤", element: "cryo", rarity: 5, weapon: "polearm", region: "璃月", apiId: "shenhe" },
  { id: "yelan", name: "夜兰", element: "hydro", rarity: 5, weapon: "bow", region: "璃月", apiId: "yelan" },
  { id: "xianyun", name: "闲云", element: "anemo", rarity: 5, weapon: "catalyst", region: "璃月", apiId: "xianyun" },
  { id: "ningguang", name: "凝光", element: "geo", rarity: 4, weapon: "catalyst", region: "璃月", apiId: "ningguang" },
  { id: "xiangling", name: "香菱", element: "pyro", rarity: 4, weapon: "polearm", region: "璃月", apiId: "xiangling" },
  { id: "xingqiu", name: "行秋", element: "hydro", rarity: 4, weapon: "sword", region: "璃月", apiId: "xingqiu" },
  { id: "beidou", name: "北斗", element: "electro", rarity: 4, weapon: "claymore", region: "璃月", apiId: "beidou" },
  { id: "chongyun", name: "重云", element: "cryo", rarity: 4, weapon: "claymore", region: "璃月", apiId: "chongyun" },
  { id: "xinyan", name: "辛焱", element: "pyro", rarity: 4, weapon: "claymore", region: "璃月", apiId: "xinyan" },
  { id: "yanfei", name: "烟绯", element: "pyro", rarity: 4, weapon: "catalyst", region: "璃月", apiId: "yanfei" },
  { id: "yunjin", name: "云堇", element: "geo", rarity: 4, weapon: "polearm", region: "璃月", apiId: "yun-jin" },
  { id: "yaoyao", name: "瑶瑶", element: "dendro", rarity: 4, weapon: "polearm", region: "璃月", apiId: "yaoyao" },
  { id: "gaming", name: "嘉明", element: "pyro", rarity: 4, weapon: "claymore", region: "璃月", apiId: "gaming" },
  { id: "lanyan", name: "蓝砚", element: "anemo", rarity: 4, weapon: "catalyst", region: "璃月", apiId: "enka:Lanyan" },
  { id: "zibai", name: "兹白", element: "geo", rarity: 5, weapon: "sword", region: "璃月", apiId: "enka:Zibai" },

  // ============ 稻妻 ============
  { id: "raiden", name: "雷电将军", element: "electro", rarity: 5, weapon: "polearm", region: "稻妻", apiId: "raiden" },
  { id: "ayaka", name: "神里绫华", element: "cryo", rarity: 5, weapon: "sword", region: "稻妻", apiId: "ayaka" },
  { id: "kazuha", name: "枫原万叶", element: "anemo", rarity: 5, weapon: "sword", region: "稻妻", apiId: "kazuha" },
  { id: "yoimiya", name: "宵宫", element: "pyro", rarity: 5, weapon: "bow", region: "稻妻", apiId: "yoimiya" },
  { id: "kokomi", name: "珊瑚宫心海", element: "hydro", rarity: 5, weapon: "catalyst", region: "稻妻", apiId: "kokomi" },
  { id: "itto", name: "荒泷一斗", element: "geo", rarity: 5, weapon: "claymore", region: "稻妻", apiId: "arataki-itto" },
  { id: "yaemiko", name: "八重神子", element: "electro", rarity: 5, weapon: "catalyst", region: "稻妻", apiId: "yae-miko" },
  { id: "ayato", name: "神里绫人", element: "hydro", rarity: 5, weapon: "sword", region: "稻妻", apiId: "ayato" },
  { id: "sayu", name: "早柚", element: "anemo", rarity: 4, weapon: "claymore", region: "稻妻", apiId: "sayu" },
  { id: "sara", name: "九条裟罗", element: "electro", rarity: 4, weapon: "bow", region: "稻妻", apiId: "sara" },
  { id: "gorou", name: "五郎", element: "geo", rarity: 4, weapon: "bow", region: "稻妻", apiId: "gorou" },
  { id: "thoma", name: "托马", element: "pyro", rarity: 4, weapon: "polearm", region: "稻妻", apiId: "thoma" },
  { id: "heizou", name: "鹿野院平藏", element: "anemo", rarity: 4, weapon: "catalyst", region: "稻妻", apiId: "shikanoin-heizou" },
  { id: "shinobu", name: "久岐忍", element: "electro", rarity: 4, weapon: "sword", region: "稻妻", apiId: "kuki-shinobu" },
  { id: "kirara", name: "绮良良", element: "dendro", rarity: 4, weapon: "sword", region: "稻妻", apiId: "kirara" },
  { id: "mizuki", name: "梦见月瑞希", element: "anemo", rarity: 5, weapon: "catalyst", region: "稻妻", apiId: "enka:Mizuki" },
  { id: "chiori", name: "千织", element: "geo", rarity: 5, weapon: "sword", region: "稻妻", apiId: "chiori" },

  // ============ 须弥 ============
  { id: "nahida", name: "纳西妲", element: "dendro", rarity: 5, weapon: "catalyst", region: "须弥", apiId: "nahida" },
  { id: "tighnari", name: "提纳里", element: "dendro", rarity: 5, weapon: "bow", region: "须弥", apiId: "tighnari" },
  { id: "cyno", name: "赛诺", element: "electro", rarity: 5, weapon: "polearm", region: "须弥", apiId: "cyno" },
  { id: "nilou", name: "妮露", element: "hydro", rarity: 5, weapon: "sword", region: "须弥", apiId: "nilou" },
  { id: "wanderer", name: "流浪者", element: "anemo", rarity: 5, weapon: "catalyst", region: "须弥", apiId: "wanderer" },
  { id: "alhaitham", name: "艾尔海森", element: "dendro", rarity: 5, weapon: "sword", region: "须弥", apiId: "alhaitham" },
  { id: "dehya", name: "迪希雅", element: "pyro", rarity: 5, weapon: "claymore", region: "须弥", apiId: "dehya" },
  { id: "collei", name: "柯莱", element: "dendro", rarity: 4, weapon: "bow", region: "须弥", apiId: "collei" },
  { id: "dori", name: "多莉", element: "electro", rarity: 4, weapon: "claymore", region: "须弥", apiId: "dori" },
  { id: "candace", name: "坎蒂丝", element: "hydro", rarity: 4, weapon: "polearm", region: "须弥", apiId: "candace" },
  { id: "faruzan", name: "珐露珊", element: "anemo", rarity: 4, weapon: "bow", region: "须弥", apiId: "faruzan" },
  { id: "layla", name: "莱依拉", element: "cryo", rarity: 4, weapon: "sword", region: "须弥", apiId: "layla" },
  { id: "kaveh", name: "卡维", element: "dendro", rarity: 4, weapon: "claymore", region: "须弥", apiId: "kaveh" },
  { id: "sethos", name: "赛索斯", element: "electro", rarity: 4, weapon: "bow", region: "须弥", apiId: "sethos" },

  // ============ 枫丹 ============
  { id: "neuvillette", name: "那维莱特", element: "hydro", rarity: 5, weapon: "catalyst", region: "枫丹", apiId: "neuvillette" },
  { id: "furina", name: "芙宁娜", element: "hydro", rarity: 5, weapon: "sword", region: "枫丹", apiId: "furina" },
  { id: "lyney", name: "林尼", element: "pyro", rarity: 5, weapon: "bow", region: "枫丹", apiId: "lyney" },
  { id: "wriothesley", name: "莱欧斯利", element: "cryo", rarity: 5, weapon: "catalyst", region: "枫丹", apiId: "wriothesley" },
  { id: "navia", name: "娜维娅", element: "geo", rarity: 5, weapon: "claymore", region: "枫丹", apiId: "navia" },
  { id: "clorinde", name: "克洛琳德", element: "electro", rarity: 5, weapon: "sword", region: "枫丹", apiId: "clorinde" },
  { id: "sigewinne", name: "希格雯", element: "hydro", rarity: 5, weapon: "bow", region: "枫丹", apiId: "sigewinne" },
  { id: "emilie", name: "艾梅莉埃", element: "dendro", rarity: 5, weapon: "polearm", region: "枫丹", apiId: "emilie" },
  { id: "escoffier", name: "爱可菲", element: "cryo", rarity: 5, weapon: "polearm", region: "枫丹", apiId: "enka:Escoffier" },
  { id: "lynette", name: "琳妮特", element: "anemo", rarity: 4, weapon: "sword", region: "枫丹", apiId: "lynette" },
  { id: "freminet", name: "菲米尼", element: "cryo", rarity: 4, weapon: "claymore", region: "枫丹", apiId: "freminet" },
  { id: "charlotte", name: "夏洛蒂", element: "cryo", rarity: 4, weapon: "catalyst", region: "枫丹", apiId: "charlotte" },
  { id: "chevreuse", name: "夏沃蕾", element: "pyro", rarity: 4, weapon: "polearm", region: "枫丹", apiId: "chevreuse" },

  // ============ 纳塔 ============
  { id: "mualani", name: "玛拉妮", element: "hydro", rarity: 5, weapon: "catalyst", region: "纳塔", apiId: "mualani" },
  { id: "kinich", name: "基尼奇", element: "dendro", rarity: 5, weapon: "claymore", region: "纳塔", apiId: "kinich" },
  { id: "mavuika", name: "玛薇卡", element: "pyro", rarity: 5, weapon: "claymore", region: "纳塔", apiId: "enka:Mavuika" },
  { id: "xilonen", name: "希诺宁", element: "geo", rarity: 5, weapon: "sword", region: "纳塔", apiId: "enka:Xilonen" },
  { id: "chasca", name: "恰斯卡", element: "anemo", rarity: 5, weapon: "bow", region: "纳塔", apiId: "enka:Chasca" },
  { id: "citlali", name: "茜特菈莉", element: "cryo", rarity: 5, weapon: "catalyst", region: "纳塔", apiId: "enka:Citlali" },
  { id: "varesa", name: "瓦雷莎", element: "electro", rarity: 5, weapon: "catalyst", region: "纳塔", apiId: "enka:Varesa" },
  { id: "iansan", name: "伊安珊", element: "electro", rarity: 4, weapon: "polearm", region: "纳塔", apiId: "enka:Iansan" },
  { id: "kachina", name: "卡齐娜", element: "geo", rarity: 4, weapon: "polearm", region: "纳塔", apiId: "kachina" },
  { id: "ororon", name: "欧洛伦", element: "electro", rarity: 4, weapon: "bow", region: "纳塔", apiId: "bwiki:ororon" },
  { id: "ifa", name: "伊法", element: "anemo", rarity: 4, weapon: "catalyst", region: "纳塔", apiId: "enka:Ifa" },

  // ============ 至冬 (愚人众) ============
  { id: "tartaglia", name: "达达利亚", element: "hydro", rarity: 5, weapon: "bow", region: "至冬", apiId: "tartaglia" },
  { id: "arlecchino", name: "阿蕾奇诺", element: "pyro", rarity: 5, weapon: "polearm", region: "至冬", apiId: "arlecchino" },
  { id: "sandrone", name: "桑多涅", element: "cryo", rarity: 5, weapon: "claymore", region: "至冬", apiId: "bwiki:sandrone" },
  { id: "odette", name: "奥黛塔", element: "cryo", rarity: 5, weapon: "sword", region: "至冬", apiId: "bwiki:odette" },
  { id: "alyosha", name: "阿罗夏", element: "electro", rarity: 4, weapon: "polearm", region: "至冬", apiId: "bwiki:alyosha" },
  { id: "vesna", name: "薇斯纳", element: "anemo", rarity: 5, weapon: "sword", region: "至冬", apiId: "bwiki:vesna" },
  { id: "vodyanitsa", name: "沃雅妮莎", element: "hydro", rarity: 5, weapon: "catalyst", region: "至冬", apiId: "bwiki:vodyanitsa" },

  // ============ 挪德卡莱 (6.x) ============
  { id: "columbina", name: "哥伦比娅", element: "hydro", rarity: 5, weapon: "catalyst", region: "挪德卡莱", apiId: "enka:Columbina" },
  { id: "illuga", name: "叶洛亚", element: "geo", rarity: 4, weapon: "polearm", region: "挪德卡莱", apiId: "enka:Illuga" },
  { id: "flins", name: "菲林斯", element: "electro", rarity: 5, weapon: "polearm", region: "挪德卡莱", apiId: "enka:Flins" },
  { id: "aino", name: "爱诺", element: "hydro", rarity: 4, weapon: "claymore", region: "挪德卡莱", apiId: "enka:Aino" },
  { id: "ineffa", name: "伊涅芙", element: "electro", rarity: 5, weapon: "polearm", region: "挪德卡莱", apiId: "enka:Ineffa" },
  { id: "lauma", name: "菈乌玛", element: "dendro", rarity: 5, weapon: "catalyst", region: "挪德卡莱", apiId: "enka:Lauma" },
  { id: "nefer", name: "奈芙尔", element: "dendro", rarity: 5, weapon: "catalyst", region: "挪德卡莱", apiId: "enka:Nefer" },
  { id: "jahoda", name: "雅珂达", element: "anemo", rarity: 4, weapon: "bow", region: "挪德卡莱", apiId: "enka:Jahoda" },
  { id: "linnea", name: "莉奈娅", element: "geo", rarity: 5, weapon: "bow", region: "挪德卡莱", apiId: "enka:Linnea" },

  // ============ 其他（无固定地区归属的特殊角色） ============
  { id: "aloy", name: "埃洛伊", element: "cryo", rarity: 5, weapon: "bow", region: "其他", apiId: "aloy" },
  { id: "skirk", name: "丝柯克", element: "cryo", rarity: 5, weapon: "sword", region: "其他", apiId: "bwiki:skirk" },
  { id: "nicole", name: "尼可", element: "pyro", rarity: 5, weapon: "catalyst", region: "其他", apiId: "enka:Nicole" },
  // 奇偶：千星奇域人偶，官方标记为特殊5★，元素随旅行者当前元素变化（此处记为 "none"）
  { id: "manekin", name: "奇偶", element: "none", rarity: 5, weapon: "sword", region: "其他", apiId: "bwiki:manekin" },
];

export const CHARACTER_MAP: Record<string, Character> = CHARACTERS.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<string, Character>,
);

/**
 * 获取角色离线头像（base64 data URI，已内联进单文件 HTML）
 * @param id 角色 id（对应 src/portraits/{id}.png 文件名）
 * @returns 内联图片 URL；若本地未找到则返回空字符串（由调用方回退到元素符号）
 */
export function portraitUrl(id: string): string {
  return LOCAL_PORTRAITS[id] ?? "";
}
