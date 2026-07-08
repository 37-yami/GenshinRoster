import type { Element, WeaponType } from "../types";

interface IconProps {
  element: Element;
  size?: number;
  className?: string;
}

/**
 * 七元素几何符号（内联 SVG，避免依赖外部资源）
 * 设计为统一的菱形底 + 元素特征图形。
 */
const ELEMENT_PATHS: Record<Element, React.ReactNode> = {
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
};

export function ElementIcon({ element, size = 24, className }: IconProps) {
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
      {ELEMENT_PATHS[element]}
    </svg>
  );
}

interface WeaponIconProps {
  weapon: WeaponType;
  size?: number;
  className?: string;
}

/** 武器类型简化符号 */
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
