import { NavLink } from "react-router-dom";
import { GAME_KEYS, GAME_REGISTRY } from "../config/games";

/** 顶部游戏切换 tab（三游戏各自主题色高亮） */
export function GameTabBar() {
  return (
    <nav
      className="glass mx-auto flex w-fit items-center gap-1 rounded-full p-1"
      aria-label="切换游戏"
    >
      {GAME_KEYS.map((key) => {
        const g = GAME_REGISTRY[key];
        return (
          <NavLink
            key={key}
            to={`/${key}`}
            className={({ isActive }) =>
              [
                "rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200",
                isActive
                  ? "shadow"
                  : "text-white/50 hover:bg-white/8 hover:text-white/85",
              ].join(" ")
            }
            style={({ isActive }) =>
              isActive
                ? { background: `${g.accent}26`, color: g.accent }
                : undefined
            }
          >
            {g.tabCn}
          </NavLink>
        );
      })}
    </nav>
  );
}
