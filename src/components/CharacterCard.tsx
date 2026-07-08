import { memo, useState } from "react";
import type { Character } from "../types";
import { ELEMENT_MAP, WEAPON_CN } from "../types";
import { portraitUrl } from "../data/characters";
import { ElementIcon, WeaponIcon } from "./Icons";

interface CharacterCardProps {
  character: Character;
  owned: boolean;
  /** 是否已进入交互态（决定未拥有时是否变暗） */
  hasInteracted: boolean;
  index: number;
  onToggle: (id: string) => void;
}

/**
 * 角色卡片
 * 三态：
 *  - 初始（hasInteracted=false）：明亮默认态，无勾选
 *  - 已拥有（owned=true）：明亮 + 稀有度光晕边框 + 勾选
 *  - 未拥有且已交互：灰度 + 半透明（暗）
 *
 * 失败时回退到元素几何符号。
 */
function CharacterCardBase({
  character,
  owned,
  hasInteracted,
  index,
  onToggle,
}: CharacterCardProps) {
  const meta = ELEMENT_MAP[character.element];
  const isDim = hasInteracted && !owned;
  const isOwnedActive = hasInteracted && owned;
  const rarityColor = character.rarity === 5 ? "#f5d76e" : "#c08bf0";

  // 图片加载失败时回退到元素符号
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = character.apiId !== null && !imgFailed;

  // 卡片背景：元素径向渐变
  const background = `radial-gradient(circle at 50% 18%, ${meta.color}33 0%, ${meta.color}14 40%, transparent 70%), linear-gradient(160deg, #1a1430 0%, #0e0b1a 100%)`;

  return (
    <button
      type="button"
      onClick={() => onToggle(character.id)}
      aria-pressed={owned}
      aria-label={`${character.name} ${owned ? "已拥有，点击取消" : "未拥有，点击标记"}`}
      title={`${character.name} · ${meta.cn} · ${character.rarity}★ · ${WEAPON_CN[character.weapon]}`}
      style={
        {
          "--glow-color":
            character.rarity === 5
              ? "rgba(245,215,110,0.55)"
              : "rgba(192,139,240,0.5)",
          background,
          animationDelay: `${Math.min(index * 18, 600)}ms`,
        } as React.CSSProperties
      }
      className={[
        "group relative flex aspect-[3/4] flex-col overflow-hidden rounded-xl text-center",
        "border transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "animate-fade-up",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70",
        isDim
          ? "border-white/5 opacity-40 saturate-0"
          : isOwnedActive
            ? "border-transparent shadow-glow-strong -translate-y-0.5"
            : "border-white/10 hover:border-white/25 hover:-translate-y-0.5",
      ].join(" ")}
    >
      {/* 稀有度顶部光带 */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${rarityColor}, transparent)`,
          opacity: isDim ? 0.2 : 0.9,
        }}
      />

      {/* 头像区 */}
      <div className="relative flex-1 overflow-hidden">
        {/* 元素辉光底层 */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: `radial-gradient(circle at 50% 60%, ${meta.color}${
              isDim ? "11" : "33"
            } 0%, transparent 70%)`,
          }}
        />

        {showImage ? (
          <img
            src={portraitUrl(character.id)}
            alt={character.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className={[
              "absolute inset-0 z-10 h-full w-full object-cover transition-all duration-300",
              isDim ? "opacity-60" : "opacity-100",
            ].join(" ")}
          />
        ) : (
          /* 无图回退：角色名首字 + 元素水印 + 元素配色 */
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
            {/* 元素符号大水印 */}
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              style={{
                color: meta.color,
                opacity: isDim ? 0.08 : 0.22,
              }}
            >
              <ElementIcon element={character.element} size={92} />
            </div>
            {/* 角色名首字 */}
            <div
              className="relative font-display text-4xl font-bold leading-none"
              style={{
                color: isDim ? "rgba(255,255,255,0.5)" : "#ffffff",
                textShadow: isDim
                  ? "none"
                  : `0 2px 14px ${meta.color}aa, 0 1px 3px rgba(0,0,0,0.5)`,
              }}
            >
              {character.name.charAt(0)}
            </div>
            {/* 元素中文小字 */}
            <div
              className="relative mt-1.5 text-[10px] font-medium tracking-[0.2em]"
              style={{
                color: isDim
                  ? "rgba(255,255,255,0.3)"
                  : `${meta.color}dd`,
              }}
            >
              {meta.cn}
            </div>
          </div>
        )}

        {/* 底部渐变遮罩，让名字更易读 */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1/2"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(10,8,20,0.85) 80%)",
          }}
        />

        {/* 元素角标（左上） */}
        <div
          className="absolute left-1 top-1.5 z-30 flex h-5 w-5 items-center justify-center rounded-full backdrop-blur-sm transition-opacity duration-300"
          style={{
            color: meta.color,
            background: "rgba(10,8,20,0.55)",
            opacity: isDim ? 0.5 : 0.95,
          }}
          title={`${meta.cn}元素`}
        >
          <ElementIcon element={character.element} size={13} />
        </div>

        {/* 已拥有勾选标记（右上） */}
        {isOwnedActive && (
          <span
            className="absolute right-1 top-1 z-30 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-ink-900 shadow-md"
            style={{ background: rarityColor }}
          >
            ✓
          </span>
        )}
      </div>

      {/* 角色名 + 稀有度 + 武器 */}
      <div className="relative z-20 px-1 pb-1.5 pt-1">
        <div
          className={[
            "truncate text-[13px] font-medium leading-tight transition-colors duration-300",
            isDim ? "text-white/40" : "text-white/95",
          ].join(" ")}
        >
          {character.name}
        </div>
        <div className="mt-0.5 flex items-center justify-center gap-1.5">
          <span
            className="text-[10px] tracking-tight"
            style={{
              color: isDim ? "rgba(255,255,255,0.25)" : rarityColor,
            }}
          >
            {"★".repeat(character.rarity)}
          </span>
          <span
            className="flex items-center gap-0.5 text-[9px] transition-colors duration-300"
            style={{
              color: isDim
                ? "rgba(255,255,255,0.25)"
                : "rgba(255,255,255,0.55)",
            }}
            title={WEAPON_CN[character.weapon]}
          >
            <WeaponIcon weapon={character.weapon} size={12} />
          </span>
        </div>
      </div>

      {/* 悬停高亮描边 */}
      <span
        className="pointer-events-none absolute inset-0 z-40 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1px ${meta.color}55` }}
      />
    </button>
  );
}

export const CharacterCard = memo(CharacterCardBase);
