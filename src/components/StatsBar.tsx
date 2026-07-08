import { ELEMENTS } from "../types";
import type { Character } from "../types";

interface StatsBarProps {
  characters: Character[];
  ownedIds: string[];
  /** 当前筛选后展示的角色（用于显示"显示中"统计） */
  visibleCount: number;
  visibleOwnedCount: number;
}

export function StatsBar({
  characters,
  ownedIds,
  visibleCount,
  visibleOwnedCount,
}: StatsBarProps) {
  const total = characters.length;
  const owned = ownedIds.length;
  const percent = total > 0 ? Math.round((owned / total) * 100) : 0;

  const ownedSet = new Set(ownedIds);

  // 按元素统计
  const elementStats = ELEMENTS.map((e) => {
    const totalOfElement = characters.filter((c) => c.element === e.key).length;
    const ownedOfElement = characters.filter(
      (c) => c.element === e.key && ownedSet.has(c.id),
    ).length;
    return { ...e, totalOfElement, ownedOfElement };
  });

  // 按稀有度统计
  const fiveTotal = characters.filter((c) => c.rarity === 5).length;
  const fiveOwned = characters.filter(
    (c) => c.rarity === 5 && ownedSet.has(c.id),
  ).length;
  const fourTotal = characters.filter((c) => c.rarity === 4).length;
  const fourOwned = characters.filter(
    (c) => c.rarity === 4 && ownedSet.has(c.id),
  ).length;

  return (
    <div className="glass rounded-2xl p-4 sm:p-5">
      {/* 主统计数字 */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-latin text-5xl font-bold text-gold drop-shadow-[0_0_18px_rgba(245,215,110,0.4)] sm:text-6xl">
              {owned}
            </span>
            <span className="text-2xl font-light text-white/40">/ {total}</span>
            <span className="ml-1 text-sm text-white/50">已拥有角色</span>
          </div>
          <div className="mt-1 text-xs text-white/45">
            当前显示 {visibleOwnedCount} / {visibleCount} · 拥有率 {percent}%
          </div>
        </div>

        {/* 稀有度小计 */}
        <div className="flex gap-4">
          <RarityBadge
            label="5★"
            owned={fiveOwned}
            total={fiveTotal}
            color="#f5d76e"
          />
          <RarityBadge
            label="4★"
            owned={fourOwned}
            total={fourTotal}
            color="#c08bf0"
          />
        </div>
      </div>

      {/* 进度条 */}
      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percent}%`,
            background:
              "linear-gradient(90deg, #f5d76e, #ef7938 40%, #b78aff 75%, #4cc2f1)",
            boxShadow: "0 0 12px rgba(245,215,110,0.5)",
          }}
        />
      </div>

      {/* 元素分布 */}
      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {elementStats.map((e) => {
          const ep =
            e.totalOfElement > 0
              ? Math.round((e.ownedOfElement / e.totalOfElement) * 100)
              : 0;
          return (
            <div
              key={e.key}
              className="rounded-lg border border-white/8 bg-white/4 px-2 py-1.5"
              title={`${e.cn}元素：${e.ownedOfElement}/${e.totalOfElement}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className="flex items-center gap-1 text-[11px] font-medium"
                  style={{ color: e.color }}
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: e.color }}
                  />
                  {e.cn}
                </span>
              </div>
              <div className="mt-0.5 text-[11px] text-white/55">
                {e.ownedOfElement}
                <span className="text-white/30">/{e.totalOfElement}</span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${ep}%`, background: e.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RarityBadge({
  label,
  owned,
  total,
  color,
}: {
  label: string;
  owned: number;
  total: number;
  color: string;
}) {
  return (
    <div className="flex flex-col items-end">
      <div className="flex items-baseline gap-1">
        <span className="font-latin text-xl font-bold" style={{ color }}>
          {owned}
        </span>
        <span className="text-xs text-white/35">/ {total}</span>
      </div>
      <span className="text-[11px]" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
