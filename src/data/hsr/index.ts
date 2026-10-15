import type { GameCharacter } from "../../types";
import { HSR_CHARACTERS } from "./characters";

/** 离线头像：构建时将 src/portraits/hsr/*.png 内联为 base64 data URI */
const PORTRAIT_MODULES = import.meta.glob("../../portraits/hsr/*.png", {
  eager: true,
  query: "?inline",
  import: "default",
}) as Record<string, string>;

const HSR_PORTRAITS: Record<string, string> = {};
for (const [path, url] of Object.entries(PORTRAIT_MODULES)) {
  // path 形如 '../../portraits/hsr/姬子.png' → 提取 '姬子'
  const id = path.split("/").pop()!.replace(/\.png$/, "");
  HSR_PORTRAITS[id] = url;
}

export function hsrPortrait(id: string): string {
  return HSR_PORTRAITS[id] ?? "";
}

/** 映射到统一角色模型（命途即分组，无次级标签） */
export const HSR_UNIFIED: GameCharacter[] = HSR_CHARACTERS.map((c) => ({
  id: c.id,
  name: c.name,
  element: c.element,
  rarity: c.rarity,
  group: c.group,
  tag: null,
}));
