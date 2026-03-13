"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StreakFireProps {
  streak: number;
  className?: string;
}

export function StreakFire({ streak, className }: StreakFireProps) {
  if (streak === 0) {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        <span className="text-lg">🔥</span>
        <span className="text-text-tertiary text-sm font-semibold">0</span>
      </div>
    );
  }

  // Scale fire based on streak length
  const fireSize = streak >= 30 ? "text-3xl" : streak >= 14 ? "text-2xl" : streak >= 7 ? "text-xl" : "text-lg";
  const fireCount = streak >= 30 ? 3 : streak >= 14 ? 2 : 1;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -3, 3, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn("flex", fireSize)}
      >
        {Array.from({ length: fireCount }).map((_, i) => (
          <span key={i}>🔥</span>
        ))}
      </motion.div>
      <span className="text-streak-fire font-heading text-lg font-bold">
        {streak}
      </span>
    </div>
  );
}
