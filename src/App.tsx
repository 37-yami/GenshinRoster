import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { GAME_REGISTRY, isGameKey } from "./config/games";
import { GameTabBar } from "./components/GameTabBar";
import Home from "./pages/Home";

function GameRoute() {
  const { game } = useParams<{ game: string }>();
  const valid = game !== undefined && isGameKey(game) ? game : "genshin";
  const config = GAME_REGISTRY[valid];
  useEffect(() => {
    document.title = `${config.cn} · 角色拥有情况追踪器`;
    return () => {
      document.title = "角色拥有情况追踪器";
    };
  }, [config]);
  if (game === undefined || !isGameKey(game)) {
    return <Navigate to="/genshin" replace />;
  }
  return <Home key={game} config={config} />;
}

export default function App() {
  return (
    <HashRouter>
      <div className="app-bg min-h-screen w-full">
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6">
          <GameTabBar />
          <Routes>
            <Route path="/" element={<Navigate to="/genshin" replace />} />
            <Route path="/:game" element={<GameRoute />} />
            <Route path="*" element={<Navigate to="/genshin" replace />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}
