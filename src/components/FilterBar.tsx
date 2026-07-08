import { LayoutGrid, ListTree, Search, X } from "lucide-react";
import { ELEMENTS } from "../types";
import type { ElementFilter, RarityFilter, SortBy } from "../types";

interface FilterBarProps {
  filterElement: ElementFilter;
  filterRarity: RarityFilter;
  searchKey: string;
  sortBy: SortBy;
  groupByRegion: boolean;
  onElement: (f: ElementFilter) => void;
  onRarity: (r: RarityFilter) => void;
  onSearch: (s: string) => void;
  onSort: (s: SortBy) => void;
  onToggleGroup: () => void;
}

const RARITY_OPTIONS: { value: RarityFilter; label: string; color: string }[] = [
  { value: "all", label: "全部", color: "rgba(255,255,255,0.7)" },
  { value: 5, label: "5★", color: "#f5d76e" },
  { value: 4, label: "4★", color: "#c08bf0" },
];

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "region", label: "按地区" },
  { value: "rarity", label: "按稀有度" },
  { value: "element", label: "按元素" },
  { value: "name", label: "按名称" },
];

export function FilterBar({
  filterElement,
  filterRarity,
  searchKey,
  sortBy,
  groupByRegion,
  onElement,
  onRarity,
  onSearch,
  onSort,
  onToggleGroup,
}: FilterBarProps) {
  return (
    <div className="glass rounded-2xl p-3 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* 元素筛选 */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-white/40">元素</span>
          <FilterPill
            active={filterElement === "all"}
            onClick={() => onElement("all")}
          >
            全部
          </FilterPill>
          {ELEMENTS.map((e) => (
            <FilterPill
              key={e.key}
              active={filterElement === e.key}
              onClick={() => onElement(e.key)}
              color={e.color}
            >
              <span className="flex items-center gap-1">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: e.color }}
                />
                {e.cn}
              </span>
            </FilterPill>
          ))}
        </div>

        {/* 右侧：稀有度 + 排序 + 搜索 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 稀有度 */}
          <div className="flex items-center gap-1 rounded-full bg-white/4 p-0.5">
            {RARITY_OPTIONS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => onRarity(r.value)}
                className={[
                  "rounded-full px-3 py-1 text-xs font-medium transition-all duration-200",
                  filterRarity === r.value
                    ? "bg-white/12 text-white shadow"
                    : "text-white/50 hover:text-white/80",
                ].join(" ")}
                style={
                  filterRarity === r.value ? { color: r.color } : undefined
                }
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* 排序 */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSort(e.target.value as SortBy)}
              className="cursor-pointer appearance-none rounded-full border border-white/10 bg-white/4 py-1.5 pl-3 pr-8 text-xs text-white/80 outline-none transition-colors hover:bg-white/8 focus:border-gold/50"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-ink-700">
                  {o.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-white/40">
              ▼
            </span>
          </div>

          {/* 分组开关：默认单张大图，开启后按地区分节 */}
          <button
            type="button"
            onClick={onToggleGroup}
            title={groupByRegion ? "当前：按地区分组，点击切换为大图" : "当前：单张大图，点击按地区分组"}
            aria-pressed={groupByRegion}
            className={[
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
              groupByRegion
                ? "border-gold/40 bg-gold/15 text-gold hover:bg-gold/20 hover:shadow-glow"
                : "border-white/10 bg-white/4 text-white/55 hover:bg-white/8 hover:text-white/85",
            ].join(" ")}
          >
            {groupByRegion ? <ListTree size={14} /> : <LayoutGrid size={14} />}
            {groupByRegion ? "分组" : "大图"}
          </button>

          {/* 搜索 */}
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              value={searchKey}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="搜索角色"
              className="w-32 rounded-full border border-white/10 bg-white/4 py-1.5 pl-8 pr-7 text-xs text-white/90 outline-none transition-all placeholder:text-white/30 focus:w-44 focus:border-gold/50"
            />
            {searchKey && (
              <button
                type="button"
                onClick={() => onSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                aria-label="清除搜索"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-3 py-1 text-xs font-medium transition-all duration-200",
        active
          ? "text-ink-900 shadow"
          : "bg-white/4 text-white/55 hover:bg-white/8 hover:text-white/85",
      ].join(" ")}
      style={active ? { background: color ?? "#fff", color: "#0a0814" } : undefined}
    >
      {children}
    </button>
  );
}
