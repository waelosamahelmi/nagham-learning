"use client";

import { Flame, Star, Zap } from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { getLevelProgress } from "@/lib/xp";
import { Avatar } from "./avatar";

export function TopBar() {
  const { name, totalXP, currentStreak, currentLevel } = useUserStore();
  const progress = getLevelProgress(totalXP);

  return (
    <header className="hidden md:flex h-14 items-center justify-between border-b border-border-subtle bg-bg-secondary px-6">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Zap className="h-4 w-4 text-xp-gold" />
        <span className="font-semibold text-xp-gold">{totalXP.toLocaleString()} XP</span>
        {progress.next && (
          <span className="text-text-tertiary">
            / {progress.next.xpRequired.toLocaleString()}
          </span>
        )}
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5 text-sm">
          <Flame className={`h-4 w-4 ${currentStreak > 0 ? "text-streak-fire" : "text-text-tertiary"}`} />
          <span className={`font-semibold ${currentStreak > 0 ? "text-streak-fire" : "text-text-tertiary"}`}>
            {currentStreak}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Star className="h-4 w-4 text-xp-gold" />
          <span className="font-semibold">Lv.{currentLevel.level}</span>
        </div>
        <Avatar fallback={name} size="sm" />
      </div>
    </header>
  );
}
