import { useMemo } from "react";
import { useTrackerStore } from "../store/useTrackerStore";
import type { GameConfig, GameCharacter, SortBy } from "../types";
import { CharacterCard } from "../components/CharacterCard";
import { StatsBar } from "../components/StatsBar";
import { FilterBar } from "../components/FilterBar";
import { ActionBar } from "../components/ActionBar";

function sortCharacters(
  config: GameConfig,
  list: GameCharacter[],
  sortBy: SortBy,
): GameCharacter[] {
  const elementOrder = new Map(config.elements.map((e, i) => [e.key, i]));
  const groupOrder = new Map(config.groups.map((g, i) => [g.key, i]));
  const eleIdx = (c: GameCharacter) =>
    elementOrder.has(c.element)
      ? elementOrder.get(c.element)!
      : config.elements.length; // 特殊元素排最后
  const arr = [...list];
  switch (sortBy) {
    case "rarity":
      return arr.sort((a, b) => b.rarity - a.rarity || a.name.localeCompare(b.name, "zh"));
    case "element":
      return arr.sort(
        (a, b) =>
          eleIdx(a) - eleIdx(b) ||
          b.rarity - a.rarity ||
          a.name.localeCompare(b.name, "zh"),
      );
    case "name":
      return arr.sort((a, b) => a.name.localeCompare(b.name, "zh"));
    case "group":
    default:
      return arr.sort(
        (a, b) =>
          (groupOrder.get(a.group) ?? 999) - (groupOrder.get(b.group) ?? 999) ||
          b.rarity - a.rarity ||
          eleIdx(a) - eleIdx(b),
      );
  }
}

export default function Home({ config }: { config: GameConfig }) {
  const slot = useTrackerStore((s) => s.games[config.key]);
  const toggleOwned = useTrackerStore((s) => s.toggleOwned);
  const setFilter = useTrackerStore((s) => s.setFilter);
  const selectAll = useTrackerStore((s) => s.selectAll);
  const clearAll = useTrackerStore((s) => s.clearAll);
  const reset = useTrackerStore((s) => s.reset);

  const {
    ownedIds,
    hasInteracted,
    filterElement,
    filterRarity,
    filterGroup,
    filterTag,
    searchKey,
    sortBy,
    groupBy,
  } = slot;

  const ownedSet = useMemo(() => new Set(ownedIds), [ownedIds]);

  // 筛选 + 排序后的可见角色（及其中已拥有数量）
  const { visible, visibleOwnedCount } = useMemo(() => {
    const filtered = config.characters.filter((c) => {
      if (filterElement !== "all" && c.element !== filterElement) return false;
      if (filterRarity !== "all" && c.rarity !== filterRarity) return false;
      if (filterGroup !== "all" && c.group !== filterGroup) return false;
      if (
        config.tagFilter &&
        filterTag !== "all" &&
        c.tag !== filterTag
      )
        return false;
      if (searchKey.trim() && !c.name.includes(searchKey.trim())) return false;
      return true;
    });
    const list = sortCharacters(config, filtered, sortBy);
    return {
      visible: list,
      visibleOwnedCount: list.reduce(
        (n, c) => n + (ownedSet.has(c.id) ? 1 : 0),
        0,
      ),
    };
  }, [config, filterElement, filterRarity, filterGroup, filterTag, searchKey, sortBy, ownedSet]);

  // 仅在用户显式开启分组时按分组分节
  const grouped = useMemo(() => {
    if (!groupBy) return null;
    const map = new Map<string, GameCharacter[]>();
    for (const c of visible) {
      if (!map.has(c.group)) map.set(c.group, []);
      map.get(c.group)!.push(c);
    }
    return config.groups
      .filter((g) => map.has(g.key))
      .map((g) => ({ group: g, list: map.get(g.key)! }));
  }, [visible, groupBy, config]);

  const handleSelectAllVisible = () =>
    selectAll(config.key, visible.map((c) => c.id));

  return (
    <>
      {/* 标题区 */}
      <header className="mb-6 mt-4 text-center sm:mb-8">
        <div className="mb-2 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60 sm:w-20" />
          <span className="font-latin text-xs tracking-[0.35em] text-gold/70">
            {config.latin}
          </span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60 sm:w-20" />
        </div>
        <h1 className="font-display text-4xl text-white sm:text-5xl">
          {config.cn} · 角色拥有情况
        </h1>
        <div className="title-underline mx-auto mt-3 h-px w-48 sm:w-64" />
        <p className="mt-3 text-sm text-white/45">
          点击头像标记已拥有 · 已拥有保持明亮，未拥有自动变暗
        </p>
      </header>

      {/* 统计栏 */}
      <StatsBar
        config={config}
        ownedIds={ownedIds}
        visibleCount={visible.length}
        visibleOwnedCount={visibleOwnedCount}
      />

      {/* 筛选栏 */}
      <div className="mt-4">
        <FilterBar
          config={config}
          filterElement={filterElement}
          filterRarity={filterRarity}
          filterGroup={filterGroup}
          filterTag={filterTag}
          searchKey={searchKey}
          sortBy={sortBy}
          groupBy={groupBy}
          onElement={(v) => setFilter(config.key, { filterElement: v })}
          onRarity={(v) => setFilter(config.key, { filterRarity: v })}
          onGroup={(v) => setFilter(config.key, { filterGroup: v })}
          onTag={(v) => setFilter(config.key, { filterTag: v })}
          onSearch={(v) => setFilter(config.key, { searchKey: v })}
          onSort={(v) => setFilter(config.key, { sortBy: v })}
          onToggleGroup={() => setFilter(config.key, { groupBy: !groupBy })}
        />
      </div>

      {/* 操作栏 */}
      <div className="mt-4">
        <ActionBar
          ownedCount={ownedIds.length}
          hasInteracted={hasInteracted}
          onSelectAllVisible={handleSelectAllVisible}
          onClearAll={() => clearAll(config.key)}
          onReset={() => reset(config.key)}
        />
      </div>

      {/* 角色网格 */}
      <main className="mt-6">
        {visible.length === 0 ? (
          <EmptyState />
        ) : grouped ? (
          <div className="space-y-7">
            {grouped.map((g) => (
              <section key={g.group.key}>
                <RegionHeader
                  name={g.group.cn}
                  color={g.group.color}
                  count={g.list.length}
                />
                <Grid>
                  {g.list.map((c, i) => (
                    <CharacterCard
                      key={c.id}
                      config={config}
                      character={c}
                      owned={ownedSet.has(c.id)}
                      hasInteracted={hasInteracted}
                      index={i}
                      onToggle={(id) => toggleOwned(config.key, id)}
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
                config={config}
                character={c}
                owned={ownedSet.has(c.id)}
                hasInteracted={hasInteracted}
                index={i}
                onToggle={(id) => toggleOwned(config.key, id)}
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
    </>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
      {children}
    </div>
  );
}

function RegionHeader({
  name,
  color,
  count,
}: {
  name: string;
  color: string;
  count: number;
}) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: color }}
      />
      <h2 className="font-display text-lg text-white/85">{name}</h2>
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
