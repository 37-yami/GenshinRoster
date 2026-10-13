import { useMemo } from "react";
import { CHARACTERS } from "../data/characters";
import { useTrackerStore } from "../store/useTrackerStore";
import { ELEMENTS, REGION_ORDER } from "../types";
import type { Character, CharacterElement, SortBy } from "../types";
import { CharacterCard } from "../components/CharacterCard";
import { StatsBar } from "../components/StatsBar";
import { FilterBar } from "../components/FilterBar";
import { ActionBar } from "../components/ActionBar";

const ELEMENT_ORDER: Record<CharacterElement, number> = ELEMENTS.reduce(
  (acc, e, i) => {
    acc[e.key] = i;
    return acc;
  },
  { none: ELEMENTS.length } as Record<CharacterElement, number>,
);

function sortCharacters(list: Character[], sortBy: SortBy): Character[] {
  const arr = [...list];
  switch (sortBy) {
    case "rarity":
      return arr.sort((a, b) => b.rarity - a.rarity || a.name.localeCompare(b.name, "zh"));
    case "element":
      return arr.sort(
        (a, b) =>
          ELEMENT_ORDER[a.element] - ELEMENT_ORDER[b.element] ||
          b.rarity - a.rarity ||
          a.name.localeCompare(b.name, "zh"),
      );
    case "name":
      return arr.sort((a, b) => a.name.localeCompare(b.name, "zh"));
    case "region":
    default:
      return arr.sort(
        (a, b) =>
          REGION_ORDER.indexOf(a.region) - REGION_ORDER.indexOf(b.region) ||
          b.rarity - a.rarity ||
          ELEMENT_ORDER[a.element] - ELEMENT_ORDER[b.element],
      );
  }
}

export default function Home() {
  const {
    ownedIds,
    hasInteracted,
    filterElement,
    filterRarity,
    searchKey,
    sortBy,
    groupByRegion,
    toggleOwned,
    setFilterElement,
    setFilterRarity,
    setSearchKey,
    setSortBy,
    setGroupByRegion,
    selectAll,
    clearAll,
    reset,
  } = useTrackerStore();

  const ownedSet = useMemo(() => new Set(ownedIds), [ownedIds]);

  // 筛选 + 排序后的可见角色（及其中已拥有数量）
  const { visible, visibleOwnedCount } = useMemo(() => {
    const filtered = CHARACTERS.filter((c) => {
      if (filterElement !== "all" && c.element !== filterElement) return false;
      if (filterRarity !== "all" && c.rarity !== filterRarity) return false;
      if (searchKey.trim() && !c.name.includes(searchKey.trim())) return false;
      return true;
    });
    const list = sortCharacters(filtered, sortBy);
    return {
      visible: list,
      visibleOwnedCount: list.reduce((n, c) => n + (ownedSet.has(c.id) ? 1 : 0), 0),
    };
  }, [filterElement, filterRarity, searchKey, sortBy, ownedSet]);

  // 仅在用户显式开启分组时按地区分节
  const grouped = useMemo(() => {
    if (!groupByRegion) return null;
    const map = new Map<string, Character[]>();
    for (const c of visible) {
      if (!map.has(c.region)) map.set(c.region, []);
      map.get(c.region)!.push(c);
    }
    return REGION_ORDER.filter((r) => map.has(r)).map((r) => ({
      region: r,
      list: map.get(r)!,
    }));
  }, [visible, groupByRegion]);

  const handleSelectAllVisible = () => selectAll(visible.map((c) => c.id));

  return (
    <div className="app-bg min-h-screen w-full">
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
        {/* 标题区 */}
        <header className="mb-6 text-center sm:mb-8">
          <div className="mb-2 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60 sm:w-20" />
            <span className="font-latin text-xs tracking-[0.35em] text-gold/70">
              GENSHIN IMPACT
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60 sm:w-20" />
          </div>
          <h1 className="font-display text-4xl text-white sm:text-5xl">
            角色拥有情况
          </h1>
          <div className="title-underline mx-auto mt-3 h-px w-48 sm:w-64" />
          <p className="mt-3 text-sm text-white/45">
            点击头像标记已拥有 · 已拥有保持明亮，未拥有自动变暗
          </p>
        </header>

        {/* 统计栏 */}
        <StatsBar
          characters={CHARACTERS}
          ownedIds={ownedIds}
          visibleCount={visible.length}
          visibleOwnedCount={visibleOwnedCount}
        />

        {/* 筛选栏 */}
        <div className="mt-4">
          <FilterBar
            filterElement={filterElement}
            filterRarity={filterRarity}
            searchKey={searchKey}
            sortBy={sortBy}
            groupByRegion={groupByRegion}
            onElement={setFilterElement}
            onRarity={setFilterRarity}
            onSearch={setSearchKey}
            onSort={setSortBy}
            onToggleGroup={() => setGroupByRegion(!groupByRegion)}
          />
        </div>

        {/* 操作栏 */}
        <div className="mt-4">
          <ActionBar
            ownedCount={ownedIds.length}
            hasInteracted={hasInteracted}
            onSelectAllVisible={handleSelectAllVisible}
            onClearAll={clearAll}
            onReset={reset}
          />
        </div>

        {/* 角色网格 */}
        <main className="mt-6">
          {visible.length === 0 ? (
            <EmptyState />
          ) : grouped ? (
            <div className="space-y-7">
              {grouped.map((g) => (
                <section key={g.region}>
                  <RegionHeader region={g.region} count={g.list.length} />
                  <Grid>
                    {g.list.map((c, i) => (
                      <CharacterCard
                        key={c.id}
                        character={c}
                        owned={ownedSet.has(c.id)}
                        hasInteracted={hasInteracted}
                        index={i}
                        onToggle={toggleOwned}
                      />
                    ))}
                  </Grid>
                </section>
              ))}
            </div>
          ) : (
            <Grid>
              {visible.map((c, i) => (
                <CharacterCard
                  key={c.id}
                  character={c}
                  owned={ownedSet.has(c.id)}
                  hasInteracted={hasInteracted}
                  index={i}
                  onToggle={toggleOwned}
                />
              ))}
            </Grid>
          )}
        </main>

        {/* 页脚 */}
        <footer className="mt-10 border-t border-white/8 pt-5 text-center text-xs text-white/30">
          <p>
            数据基于公开角色信息整理 · 不含官方美术资源 · 进度自动保存于本地浏览器
          </p>
          <p className="mt-1 font-latin tracking-wider">
            TRAVELER&apos;S COLLECTION TRACKER
          </p>
        </footer>
      </div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
      {children}
    </div>
  );
}

function RegionHeader({ region, count }: { region: string; count: number }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <h2 className="font-display text-lg text-white/85">{region}</h2>
      <span className="rounded-full bg-white/6 px-2 py-0.5 text-[11px] text-white/45">
        {count}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
      <div className="text-4xl opacity-40">🔮</div>
      <p className="mt-3 text-sm text-white/50">没有匹配的角色</p>
      <p className="mt-1 text-xs text-white/30">试试调整筛选条件或搜索关键字</p>
    </div>
  );
}
