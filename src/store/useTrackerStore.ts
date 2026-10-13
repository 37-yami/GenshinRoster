import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CHARACTER_MAP } from "../data/characters";
import type {
  ElementFilter,
  RarityFilter,
  SortBy,
} from "../types";

const STORAGE_KEY = "genshin-tracker-v1";

/** 实际持久化到 localStorage 的状态形状（见 partialize） */
interface PersistedState {
  ownedIds: string[];
  hasInteracted: boolean;
  groupByRegion: boolean;
}

interface TrackerState {
  /** 已拥有角色 id 集合 */
  ownedIds: string[];
  /** 是否已开始交互（决定初始全亮 vs 已选亮未选暗） */
  hasInteracted: boolean;
  /** 筛选：元素 */
  filterElement: ElementFilter;
  /** 筛选：稀有度 */
  filterRarity: RarityFilter;
  /** 筛选：搜索关键字 */
  searchKey: string;
  /** 排序方式 */
  sortBy: SortBy;
  /** 是否按地区分组展示（默认 false：单张大图） */
  groupByRegion: boolean;

  toggleOwned: (id: string) => void;
  setFilterElement: (f: ElementFilter) => void;
  setFilterRarity: (r: RarityFilter) => void;
  setSearchKey: (s: string) => void;
  setSortBy: (s: SortBy) => void;
  setGroupByRegion: (g: boolean) => void;
  /** 将 ids 并入已拥有集合（保留现有选择，不替换） */
  selectAll: (ids: string[]) => void;
  clearAll: () => void;
  reset: () => void;
}

export const useTrackerStore = create<TrackerState>()(
  persist(
    (set) => ({
      ownedIds: [],
      hasInteracted: false,
      filterElement: "all",
      filterRarity: "all",
      searchKey: "",
      sortBy: "region",
      groupByRegion: false,

      toggleOwned: (id) =>
        set((state) => {
          const exists = state.ownedIds.includes(id);
          const ownedIds = exists
            ? state.ownedIds.filter((x) => x !== id)
            : [...state.ownedIds, id];
          return { ownedIds, hasInteracted: true };
        }),

      setFilterElement: (filterElement) => set({ filterElement }),
      setFilterRarity: (filterRarity) => set({ filterRarity }),
      setSearchKey: (searchKey) => set({ searchKey }),
      setSortBy: (sortBy) => set({ sortBy }),
      setGroupByRegion: (groupByRegion) => set({ groupByRegion }),

      selectAll: (ids) =>
        set((state) => ({
          ownedIds: Array.from(new Set([...state.ownedIds, ...ids])),
          hasInteracted: true,
        })),

      clearAll: () => set({ ownedIds: [], hasInteracted: true }),

      reset: () =>
        set({
          ownedIds: [],
          hasInteracted: false,
          filterElement: "all",
          filterRarity: "all",
          searchKey: "",
          sortBy: "region",
          groupByRegion: false,
        }),
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      // 历史数据迁移：清理已从角色表中移除的陈旧 id，避免统计口径失真
      migrate: (persisted): PersistedState => {
        const s = persisted as Partial<PersistedState>;
        return {
          ownedIds: (s.ownedIds ?? []).filter((id) => id in CHARACTER_MAP),
          hasInteracted: s.hasInteracted ?? false,
          groupByRegion: s.groupByRegion ?? false,
        };
      },
      // 持久化拥有状态、交互标记、分组偏好；筛选/排序为临时状态
      partialize: (state) => ({
        ownedIds: state.ownedIds,
        hasInteracted: state.hasInteracted,
        groupByRegion: state.groupByRegion,
      }),
    },
  ),
);
