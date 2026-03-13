"use client";

import { Flame, Star } from "lucide-react";

export function TopBar() {
  // TODO: read from Zustand store / Supabase
  const streak = 0;
  const level = 1;

  return (
    <header className="flex h-14 items-center justify-end border-b border-border-subtle bg-bg-secondary px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-sm">
          <Flame className="h-4 w-4 text-streak-fire" />
          <span className="font-semibold">{streak}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Star className="h-4 w-4 text-xp-gold" />
          <span className="font-semibold">Lv.{level}</span>
        </div>
      </div>
    </header>
  );
}
