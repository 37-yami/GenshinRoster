import type { GameCharacter } from "../../types";
import { ZZZ_CHARACTERS } from "./characters";

/** 离线头像：构建时将 src/portraits/zzz/*.png 内联为 base64 data URI */
const PORTRAIT_MODULES = import.meta.glob("../../portraits/zzz/*.png", {
  eager: true,
  query: "?inline",
  import: "default",
}) as Record<string, string>;

const ZZZ_PORTRAITS: Record<string, string> = {};
for (const [path, url] of Object.entries(PORTRAIT_MODULES)) {
  // path 形如 '../../portraits/zzz/雅.png' → 提取 '雅'
  const id = path.split("/").pop()!.replace(/\.png$/, "");
  ZZZ_PORTRAITS[id] = url;
}

export function zzzPortrait(id: string): string {
  return ZZZ_PORTRAITS[id] ?? "";
}

/** 映射到统一角色模型（阵营为分组、特性为次级标签） */
export const ZZZ_UNIFIED: GameCharacter[] = ZZZ_CHARACTERS.map((c) => ({
  id: c.id,
  name: c.name,
  element: c.element,
  rarity: c.rarity,
  group: c.group,
  tag: c.tag,
}));
