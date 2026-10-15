import type { GameCharacter } from "../../types";
import { HSR_CHARACTERS } from "./characters";

/** 离线头像：import.meta.glob 加载 src/portraits/hsr/*.webp（网页模式为 URL，单文件模式内联 data URI） */
const PORTRAIT_MODULES = import.meta.glob("../../portraits/hsr/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const HSR_PORTRAITS: Record<string, string> = {};
for (const [path, url] of Object.entries(PORTRAIT_MODULES)) {
  // path 形如 '../../portraits/hsr/姬子.webp' → 提取 '姬子'
  const id = path.split("/").pop()!.replace(/\.webp$/, "");
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
