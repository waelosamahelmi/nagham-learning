"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AchievementData {
  id: string;
  name: string;
  icon: string;
  xpReward: number;
}

let achievementListeners: Array<(a: AchievementData) => void> = [];

export function showAchievement(achievement: AchievementData) {
  achievementListeners.forEach((l) => l(achievement));
}

export function AchievementPopup() {
  const [achievement, setAchievement] = useState<AchievementData | null>(null);

  useEffect(() => {
    const listener = (a: AchievementData) => {
      setAchievement(a);
      setTimeout(() => setAchievement(null), 3500);
    };
    achievementListeners.push(listener);
    return () => {
      achievementListeners = achievementListeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-4 rounded-2xl border border-achievement-glow/30 bg-bg-secondary px-6 py-4 shadow-[0_0_40px_rgba(255,238,182,0.15)]"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="text-4xl"
          >
            {achievement.icon}
          </motion.div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-achievement-glow">
              Achievement Unlocked!
            </p>
            <p className="font-heading text-lg font-bold mt-0.5">
              {achievement.name}
            </p>
            <p className="text-xs text-xp-gold">+{achievement.xpReward} XP</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
