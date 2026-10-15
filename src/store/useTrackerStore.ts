import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GAME_REGISTRY, GAME_KEYS } from "../config/games";
import type { GameKey, Rarity, SortBy } from "../types";

const STORAGE_KEY = "genshin-tracker-v1";

/** 单个游戏的会话/持久化状态 */
interface GameSlot {
  /** 已拥有角色 id 集合 */
  ownedIds: string[];
  /** 是否已开始交互（决定初始全亮 vs 已选亮未选暗） */
  hasInteracted: boolean;
  /** 筛选：元素/属性 */
  filterElement: string;
  /** 筛选：稀有度 */
  filterRarity: Rarity | "all";
  /** 筛选：分组（地区/命途/阵营） */
  filterGroup: string;
  /** 筛选：次级标签（武器/特性），星铁无 */
  filterTag: string;
  /** 筛选：搜索关键字 */
  searchKey: string;
  /** 排序方式 */
  sortBy: SortBy;
  /** 是否按分组展示 */
  groupBy: boolean;
}

function initialSlot(): GameSlot {
  return {
    ownedIds: [],
    hasInteracted: false,
    filterElement: "all",
    filterRarity: "all",
    filterGroup: "all",
    filterTag: "all",
    searchKey: "",
    sortBy: "group",
    groupBy: false,
  };
}

function initialGames(): Record<GameKey, GameSlot> {
  const games = {} as Record<GameKey, GameSlot>;
  for (const key of GAME_KEYS) games[key] = initialSlot();
  return games;
}

interface TrackerState {
  games: Record<GameKey, GameSlot>;

  getSlot: (game: GameKey) => GameSlot;
  toggleOwned: (game: GameKey, id: string) => void;
  setFilter: (game: GameKey, patch: Partial<Pick<GameSlot, "filterElement" | "filterRarity" | "filterGroup" | "filterTag" | "searchKey" | "sortBy" | "groupBy">>) => void;
  /** 将 ids 并入已拥有集合（保留现有选择，不替换） */
  selectAll: (game: GameKey, ids: string[]) => void;
  clearAll: (game: GameKey) => void;
  reset: (game: GameKey) => void;
}

/** 实际持久化到 localStorage 的状态形状（见 partialize） */
interface PersistedSlot {
  ownedIds: string[];
  hasInteracted: boolean;
  groupBy: boolean;
}
type PersistedState = { [K in GameKey]?: Partial<PersistedSlot> };

/** 按各游戏角色表清理陈旧 id（角色下线/改名时保持统计口径正确） */
function prune(game: GameKey, ids: string[]): string[] {
  const map = GAME_REGISTRY[game].characterMap;
  return ids.filter((id) => id in map);
}

export const useTrackerStore = create<TrackerState>()(
  persist(
    (set, get) => ({
      games: initialGames(),

      getSlot: (game) => get().games[game],

      toggleOwned: (game, id) =>
        set((state) => {
          const slot = state.games[game];
          const exists = slot.ownedIds.includes(id);
          const ownedIds = exists
            ? slot.ownedIds.filter((x) => x !== id)
            : [...slot.ownedIds, id];
          return {
            games: {
              ...state.games,
              [game]: { ...slot, ownedIds, hasInteracted: true },
            },
          };
        }),

      setFilter: (game, patch) =>
        set((state) => ({
          games: { ...state.games, [game]: { ...state.games[game], ...patch } },
        })),

      selectAll: (game, ids) =>
        set((state) => {
          const slot = state.games[game];
          return {
            games: {
              ...state.games,
              [game]: {
                ...slot,
                ownedIds: Array.from(new Set([...slot.ownedIds, ...ids])),
                hasInteracted: true,
              },
            },
          };
        }),

      clearAll: (game) =>
        set((state) => ({
          games: {
            ...state.games,
            [game]: { ...state.games[game], ownedIds: [], hasInteracted: true },
          },
        })),

      reset: (game) =>
        set((state) => ({
          games: { ...state.games, [game]: initialSlot() },
        })),
    }),
    {
      name: STORAGE_KEY,
      version: 3,
      // v2（单游戏原神）→ v3（多游戏分区）：迁入 games.genshin 并清理陈旧 id
      migrate: (persisted): { games: PersistedState } => {
        const old = persisted as {
          ownedIds?: string[];
          hasInteracted?: boolean;
          groupByRegion?: boolean;
          games?: PersistedState;
        };
        if (old?.games) {
          // v3 内部结构微调时按槽位清理
          const games: PersistedState = {};
          for (const key of GAME_KEYS) {
            const slot = old.games[key];
            if (slot) {
              games[key] = {
                ownedIds: prune(key, slot.ownedIds ?? []),
                hasInteracted: slot.hasInteracted ?? false,
                groupBy: slot.groupBy ?? false,
              };
            }
          }
          return { games };
        }
        return {
          games: {
            genshin: {
              ownedIds: prune("genshin", old?.ownedIds ?? []),
              hasInteracted: old?.hasInteracted ?? false,
              groupBy: old?.groupByRegion ?? false,
            },
          },
        };
      },
      partialize: (state) => {
        const out: { games: PersistedState } = { games: {} };
        for (const key of GAME_KEYS) {
          const s = state.games[key];
          out.games[key] = {
            ownedIds: s.ownedIds,
            hasInteracted: s.hasInteracted,
            groupBy: s.groupBy,
          };
        }
        return out;
      },
      // migrate 返回的是 partial 状态，与各游戏默认槽位浅合并
      merge: (persisted, current) => {
        const data = persisted as { games?: PersistedState };
        const games = initialGames();
        for (const key of GAME_KEYS) {
          const saved = data?.games?.[key];
          if (saved) {
            games[key] = { ...games[key], ...saved } as GameSlot;
          }
        }
        return { ...current, games };
      },
    },
  ),
);
