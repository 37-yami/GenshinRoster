import { CheckCheck, Eraser, RotateCcw } from "lucide-react";

interface ActionBarProps {
  ownedCount: number;
  hasInteracted: boolean;
  onSelectAllVisible: () => void;
  onClearAll: () => void;
  onReset: () => void;
}

export function ActionBar({
  ownedCount,
  hasInteracted,
  onSelectAllVisible,
  onClearAll,
  onReset,
}: ActionBarProps) {
  return (
    <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-3 sm:p-4">
      <div className="text-xs text-white/50">
        {hasInteracted ? (
          <>
            点击头像可切换拥有状态 ·
            <span className="ml-1 text-gold/80">已选 {ownedCount}</span>
          </>
        ) : (
          <>点击下方头像，标记你已拥有的角色（其余将自动变暗）</>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ActionButton onClick={onSelectAllVisible} icon={<CheckCheck size={14} />}>
          全选当前
        </ActionButton>
        <ActionButton onClick={onClearAll} icon={<Eraser size={14} />}>
          清空拥有
        </ActionButton>
        <ActionButton
          onClick={onReset}
          icon={<RotateCcw size={14} />}
          variant="ghost"
        >
          重置
        </ActionButton>
      </div>
    </div>
  );
}

function ActionButton({
  onClick,
  icon,
  children,
  variant = "solid",
}: {
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
        variant === "solid"
          ? "border border-gold/30 bg-gold/10 text-gold hover:bg-gold/20 hover:shadow-glow"
          : "border border-white/10 bg-white/4 text-white/60 hover:bg-white/8 hover:text-white/85",
      ].join(" ")}
    >
      {icon}
      {children}
    </button>
  );
}
