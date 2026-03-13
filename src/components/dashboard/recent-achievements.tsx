"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import Link from "next/link";
import { Trophy } from "lucide-react";

export interface RecentAchievement {
  id: string;
  nameEn: string;
  icon: string;
  unlockedAt: string;
}

interface RecentAchievementsProps {
  achievements?: RecentAchievement[];
}

export function RecentAchievements({
  achievements = [],
}: RecentAchievementsProps) {
  return (
    <motion.section variants={fadeInUp}>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold">
          Recent Achievements
        </h2>
        <Link
          href="/achievements"
          className="text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          View all
        </Link>
      </div>
      <div className="mt-4">
        {achievements.length === 0 ? (
          <div className="rounded-xl border border-border-subtle bg-bg-secondary p-6 text-center">
            <Trophy className="mx-auto h-8 w-8 text-text-tertiary mb-2" />
            <p className="text-text-secondary text-sm">
              Complete lessons to unlock achievements!
            </p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="shrink-0 w-28 rounded-xl border border-achievement-glow/20 bg-bg-secondary p-3 text-center"
              >
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <p className="text-xs font-medium truncate">
                  {achievement.nameEn}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
