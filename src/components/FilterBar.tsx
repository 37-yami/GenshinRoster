import { LayoutGrid, ListTree, Search, X } from "lucide-react";
import type { GameConfig, Rarity, SortBy } from "../types";
import { RARITY_COLORS } from "../config/games";

interface FilterBarProps {
  config: GameConfig;
  filterElement: string;
  filterRarity: Rarity | "all";
  filterGroup: string;
  filterTag: string;
  searchKey: string;
  sortBy: SortBy;
  groupBy: boolean;
  onElement: (v: string) => void;
  onRarity: (v: Rarity | "all") => void;
  onGroup: (v: string) => void;
  onTag: (v: string) => void;
  onSearch: (s: string) => void;
  onSort: (s: SortBy) => void;
  onToggleGroup: () => void;
}

const RARITY_OPTIONS: (Rarity | "all")[] = ["all", 5, 4];

const SORT_LABELS: Record<Exclude<SortBy, "group">, string> = {
  rarity: "按稀有度",
  element: "按元素",
  name: "按名称",
};

export function FilterBar({
  config,
  filterElement,
  filterRarity,
  filterGroup,
  filterTag,
  searchKey,
  sortBy,
  groupBy,
  onElement,
  onRarity,
  onGroup,
  onTag,
  onSearch,
  onSort,
  onToggleGroup,
}: FilterBarProps) {
  return (
    <div className="glass rounded-2xl p-3 sm:p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        {/* 元素筛选 */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-white/40">元素</span>
          <FilterPill
            active={filterElement === "all"}
            onClick={() => onElement("all")}
          >
            全部
          </FilterPill>
          {config.elements.map((e) => (
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

        {/* 右侧：稀有度 + 分组 + 标签 + 排序 + 开关 + 搜索 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 稀有度 */}
          <div className="flex items-center gap-1 rounded-full bg-white/4 p-0.5">
            {RARITY_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onRarity(r)}
                className={[
                  "rounded-full px-3 py-1 text-xs font-medium transition-all duration-200",
                  filterRarity === r
                    ? "bg-white/12 text-white shadow"
                    : "text-white/50 hover:text-white/80",
                ].join(" ")}
                style={
                  filterRarity === r && r !== "all"
                    ? { color: RARITY_COLORS[r] }
                    : undefined
                }
              >
                {r === "all" ? "全部" : config.rarityLabel[r]}
              </button>
            ))}
          </div>

          {/* 分组筛选 */}
          <SelectPill value={filterGroup} onChange={onGroup} label={config.groupLabel}>
            <option value="all">全部{config.groupLabel}</option>
            {config.groups.map((g) => (
              <option key={g.key} value={g.key} className="bg-ink-700">
                {g.cn}
              </option>
            ))}
          </SelectPill>

          {/* 次级标签筛选（武器/特性；星铁无） */}
          {config.tagFilter && (
            <SelectPill
              value={filterTag}
              onChange={onTag}
              label={config.tagFilter.label}
            >
              <option value="all">全部{config.tagFilter.label}</option>
              {config.tagFilter.options.map((t) => (
                <option key={t.key} value={t.key} className="bg-ink-700">
                  {t.cn}
                </option>
              ))}
            </SelectPill>
          )}

          {/* 排序 */}
          <SelectPill value={sortBy} onChange={(v) => onSort(v as SortBy)} label="排序">
            <option value="group" className="bg-ink-700">
              按{config.groupLabel}
            </option>
            {(Object.keys(SORT_LABELS) as Exclude<SortBy, "group">[]).map((k) => (
              <option key={k} value={k} className="bg-ink-700">
                {SORT_LABELS[k]}
              </option>
            ))}
          </SelectPill>

          {/* 分组开关：默认单张大图，开启后按分组分节 */}
          <button
            type="button"
            onClick={onToggleGroup}
            title={
              groupBy
                ? `当前：按${config.groupLabel}分组，点击切换为大图`
                : `当前：单张大图，点击按${config.groupLabel}分组`
            }
            aria-pressed={groupBy}
            className={[
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
              groupBy
                ? "border-gold/40 bg-gold/15 text-gold hover:bg-gold/20 hover:shadow-glow"
                : "border-white/10 bg-white/4 text-white/55 hover:bg-white/8 hover:text-white/85",
            ].join(" ")}
          >
            {groupBy ? <ListTree size={14} /> : <LayoutGrid size={14} />}
            {groupBy ? "分组" : "大图"}
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

function SelectPill({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="cursor-pointer appearance-none rounded-full border border-white/10 bg-white/4 py-1.5 pl-3 pr-7 text-xs text-white/80 outline-none transition-colors hover:bg-white/8 focus:border-gold/50"
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-white/40">
        ▼
      </span>
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
