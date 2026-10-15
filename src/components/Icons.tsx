import type { GameKey } from "../types";
import type { WeaponType } from "../types.genshin";

interface IconProps {
  game: GameKey;
  element: string;
  size?: number;
  className?: string;
}

/**
 * 各游戏元素/属性几何符号（内联 SVG，避免依赖外部资源）
 * 统一 viewBox 0 0 100 100 简笔几何风格。
 */
const ELEMENT_PATHS: Record<GameKey, Record<string, React.ReactNode>> = {
  genshin: {
    anemo: (
      <>
        <path d="M50 30 C 35 45, 35 55, 50 70 C 65 55, 65 45, 50 30 Z" />
        <path d="M30 50 C 45 35, 55 35, 70 50 C 55 65, 45 65, 30 50 Z" />
      </>
    ),
    geo: (
      <>
        <path d="M50 22 L72 50 L50 78 L28 50 Z" />
        <path d="M50 36 L62 50 L50 64 L38 50 Z" />
      </>
    ),
    electro: (
      <>
        <path d="M54 20 L30 54 L46 54 L40 80 L70 44 L52 44 Z" />
      </>
    ),
    dendro: (
      <>
        <circle cx="40" cy="40" r="14" />
        <circle cx="60" cy="56" r="14" />
        <path d="M30 70 Q 50 50 72 30" />
      </>
    ),
    hydro: (
      <>
        <path d="M50 24 C 38 42, 30 52, 30 60 A 20 20 0 0 0 70 60 C 70 52, 62 42, 50 24 Z" />
      </>
    ),
    pyro: (
      <>
        <path d="M50 22 C 42 38, 30 44, 34 58 C 36 70, 46 78, 50 78 C 56 78, 66 66, 64 52 C 62 40, 56 38, 50 22 Z" />
        <path d="M50 40 C 46 50, 44 56, 46 62 C 48 68, 52 68, 54 62 C 56 56, 53 48, 50 40 Z" />
      </>
    ),
    cryo: (
      <>
        <path d="M50 18 L50 82 M22 35 L78 65 M22 65 L78 35" />
        <path d="M50 30 L44 36 L56 36 Z M50 70 L44 64 L56 64 Z" />
        <path d="M30 28 L34 34 M70 72 L66 66 M70 28 L66 34 M30 72 L34 66" />
      </>
    ),
    // 奇偶：无固定元素的万用符号（同心圆 + 四向射线）
    none: (
      <>
        <circle cx="50" cy="50" r="30" />
        <circle cx="50" cy="50" r="10" />
        <path d="M28 28 L34 34 M72 28 L66 34 M28 72 L34 66 M72 72 L66 66" />
      </>
    ),
  },
  hsr: {
    物理: <path d="M50 20 L62 42 L84 50 L62 58 L50 80 L38 58 L16 50 L38 42 Z" />,
    火: (
      <>
        <path d="M50 22 C 42 38, 30 44, 34 58 C 36 70, 46 78, 50 78 C 56 78, 66 66, 64 52 C 62 40, 56 38, 50 22 Z" />
        <path d="M50 40 C 46 50, 44 56, 46 62 C 48 68, 52 68, 54 62 C 56 56, 53 48, 50 40 Z" />
      </>
    ),
    冰: (
      <>
        <path d="M50 18 L50 82 M22 35 L78 65 M22 65 L78 35" />
        <path d="M50 30 L44 36 L56 36 Z M50 70 L44 64 L56 64 Z" />
      </>
    ),
    雷: (
      <>
        <path d="M54 20 L30 54 L46 54 L40 80 L70 44 L52 44 Z" />
        <path d="M46 62 L40 80 L64 52 L52 52 L58 38 Z" />
      </>
    ),
    风: (
      <>
        <path d="M24 42 C 40 34, 60 34, 76 42 C 60 46, 40 46, 24 42 Z" />
        <path d="M28 58 C 44 52, 60 52, 76 58" />
        <path d="M50 30 C 46 42, 46 52, 50 64" />
      </>
    ),
    量子: (
      <>
        <circle cx="50" cy="50" r="10" />
        <ellipse cx="50" cy="50" rx="34" ry="16" />
        <ellipse cx="50" cy="50" rx="34" ry="16" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="50" rx="34" ry="16" transform="rotate(120 50 50)" />
      </>
    ),
    虚数: (
      <>
        <path d="M35 30 C 25 40, 25 60, 35 70 C 45 60, 45 40, 35 30 Z" />
        <path d="M65 30 C 55 40, 55 60, 65 70 C 75 60, 75 40, 65 30 Z" />
        <path d="M42 50 L58 50" />
      </>
    ),
  },
  zzz: {
    物理: <path d="M50 22 L60 40 L78 50 L60 60 L50 78 L40 60 L22 50 L40 40 Z" />,
    火: (
      <>
        <path d="M50 22 C 42 38, 30 44, 34 58 C 36 70, 46 78, 50 78 C 56 78, 66 66, 64 52 C 62 40, 56 38, 50 22 Z" />
        <path d="M50 40 C 46 50, 44 56, 46 62 C 48 68, 52 68, 54 62 C 56 56, 53 48, 50 40 Z" />
      </>
    ),
    冰: (
      <>
        <path d="M50 18 L50 82 M22 35 L78 65 M22 65 L78 35" />
        <path d="M50 30 L44 36 L56 36 Z M50 70 L44 64 L56 64 Z" />
      </>
    ),
    电: (
      <>
        <path d="M56 18 L30 50 L48 50 L40 82 L72 46 L52 46 Z" />
        <path d="M36 24 L26 36" />
      </>
    ),
    以太: (
      <>
        <path d="M50 24 C 62 24, 72 34, 72 46 C 72 58, 62 66, 50 66 C 38 66, 28 58, 28 46 C 28 34, 38 24, 50 24 Z" />
        <path d="M40 46 C 46 40, 54 40, 60 46 M40 54 C 46 48, 54 48, 60 54" />
      </>
    ),
    风: (
      <>
        <path d="M24 42 C 40 34, 60 34, 76 42 C 60 46, 40 46, 24 42 Z" />
        <path d="M28 58 C 44 52, 60 52, 76 58" />
        <path d="M50 30 C 46 42, 46 52, 50 64" />
      </>
    ),
    烈霜: (
      <>
        <path d="M50 20 L58 42 L80 50 L58 58 L50 80 L42 58 L20 50 L42 42 Z" />
        <path d="M50 38 L54 50 L50 62 L46 50 Z" />
      </>
    ),
    玄墨: (
      <>
        <circle cx="38" cy="42" r="14" />
        <circle cx="62" cy="58" r="14" />
        <path d="M34 30 Q 50 24 66 30 M66 70 Q 50 76 34 70" />
      </>
    ),
    凛刃: (
      <>
        <path d="M50 18 L62 50 L50 82 L38 50 Z" />
        <path d="M30 38 L38 50 M70 62 L62 50" />
      </>
    ),
    流明: (
      <>
        <circle cx="50" cy="50" r="14" />
        <path d="M50 20 L50 32 M50 68 L50 80 M20 50 L32 50 M68 50 L80 50 M29 29 L37 37 M71 71 L63 63 M71 29 L63 37 M29 71 L37 63" />
      </>
    ),
  },
};

/** 未登记元素的兜底符号 */
const FALLBACK_PATH = <circle cx="50" cy="50" r="26" />;

export function ElementIcon({ game, element, size = 24, className }: IconProps) {
  const paths = ELEMENT_PATHS[game][element] ?? FALLBACK_PATH;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}

interface WeaponIconProps {
  weapon: WeaponType;
  size?: number;
  className?: string;
}

/** 原神武器类型简化符号 */
const WEAPON_PATHS: Record<WeaponType, React.ReactNode> = {
  sword: <path d="M50 14 L50 60 M40 60 L60 60 M44 60 L44 70 M56 60 L56 70 M50 70 L50 80" />,
  claymore: (
    <>
      <path d="M50 12 L40 60 L60 60 Z" />
      <path d="M34 60 L66 60 M44 60 L44 72 M56 60 L56 72 M50 72 L50 84" />
    </>
  ),
  polearm: (
    <>
      <path d="M50 14 L42 42 L58 42 Z" />
      <path d="M50 42 L50 86 M44 50 L56 50" />
    </>
  ),
  bow: (
    <>
      <path d="M34 18 Q 70 50 34 82" />
      <path d="M34 18 L34 82" />
      <path d="M40 30 L48 50 L40 70" />
    </>
  ),
  catalyst: (
    <>
      <circle cx="50" cy="38" r="14" />
      <path d="M50 52 L50 84 M42 84 L58 84" />
    </>
  ),
};

export function WeaponIcon({ weapon, size = 16, className }: WeaponIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {WEAPON_PATHS[weapon]}
    </svg>
  );
}
