"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { ACHIEVEMENTS, type AchievementDef } from "@/lib/achievements";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function AchievementsPage() {
  const userId = useUserStore((s) => s.userId);
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", userId!);

      setUnlocked(new Set((data || []).map((a) => a.achievement_id)));
      setLoading(false);
    }
    load();
  }, [userId]);

  const categories = [
    { key: "milestone", label: "Milestones" },
    { key: "streak", label: "Streaks" },
    { key: "skill", label: "Skills" },
    { key: "hidden", label: "Hidden" },
  ] as const;

  if (loading) {
    return (
      <div className="max-w-4xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const unlockedCount = unlocked.size;
  const totalCount = ACHIEVEMENTS.filter((a) => a.category !== "hidden").length;

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="max-w-4xl space-y-8"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="font-heading text-3xl font-bold">Trophy Room</h1>
        <p className="mt-1 text-text-secondary">
          {unlockedCount} of {totalCount} achievements unlocked
        </p>
      </motion.div>

      {categories.map((cat) => {
        const achievements = ACHIEVEMENTS.filter(
          (a) => a.category === cat.key
        );
        if (achievements.length === 0) return null;

        return (
          <motion.section key={cat.key} variants={fadeInUp}>
            <h2 className="font-heading text-xl font-semibold mb-4">
              {cat.label}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {achievements.map((achievement) => {
                const isUnlocked = unlocked.has(achievement.id);
                const isHidden =
                  cat.key === "hidden" && !isUnlocked;

                return (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    isUnlocked={isUnlocked}
                    isHidden={isHidden}
                  />
                );
              })}
            </div>
          </motion.section>
        );
      })}
    </motion.div>
  );
}

function AchievementCard({
  achievement,
  isUnlocked,
  isHidden,
}: {
  achievement: AchievementDef;
  isUnlocked: boolean;
  isHidden: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 text-center transition-all",
        isUnlocked
          ? "border-achievement-glow/30 bg-achievement-glow/5 shadow-[0_0_20px_rgba(255,238,182,0.05)]"
          : "border-border-subtle bg-bg-secondary opacity-50"
      )}
    >
      <div className={cn("text-3xl mb-2", !isUnlocked && "grayscale")}>
        {isHidden ? "❓" : achievement.icon}
      </div>
      <p className="font-heading text-sm font-semibold">
        {isHidden ? "???" : achievement.nameEn}
      </p>
      <p className="mt-0.5 text-xs text-text-tertiary">
        {isHidden ? "Keep exploring to discover!" : achievement.descriptionEn}
      </p>
      {isUnlocked && (
        <p className="mt-1 text-xs text-xp-gold font-medium">
          +{achievement.xpReward} XP
        </p>
      )}
    </div>
  );
}
