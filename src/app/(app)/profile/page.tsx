"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useUserStore } from "@/stores/user-store";
import { getLevelProgress, LEVELS } from "@/lib/xp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ProgressBar } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { StreakFire } from "@/components/gamification/streak-fire";
import { Star, Zap, Calendar, Globe } from "lucide-react";

export default function ProfilePage() {
  const {
    name,
    role,
    totalXP,
    currentStreak,
    longestStreak,
    currentLevel,
    language,
    setLanguage,
  } = useUserStore();

  const progress = getLevelProgress(totalXP);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="max-w-2xl space-y-6"
    >
      {/* Profile Header */}
      <motion.div
        variants={fadeInUp}
        className="flex items-center gap-5"
      >
        <Avatar fallback={name} size="xl" />
        <div>
          <h1 className="font-heading text-2xl font-bold">{name || "User"}</h1>
          <p className="text-text-secondary capitalize">{role}</p>
        </div>
      </motion.div>

      {/* Level & XP */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-xp-gold" />
                <span className="font-heading font-semibold">
                  Level {currentLevel.level} — {currentLevel.name}
                </span>
              </div>
              <span className="text-sm text-xp-gold font-semibold">
                {totalXP.toLocaleString()} XP
              </span>
            </div>
            <ProgressBar value={progress.progress * 100} />
            {progress.next && (
              <p className="mt-2 text-xs text-text-tertiary">
                {(progress.next.xpRequired - totalXP).toLocaleString()} XP to{" "}
                Level {progress.next.level} ({progress.next.name})
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-2 gap-3"
      >
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <StreakFire streak={currentStreak} />
            <div>
              <p className="text-xs text-text-tertiary">Current Streak</p>
              <p className="font-semibold">{currentStreak} days</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Zap className="h-5 w-5 text-figma" />
            <div>
              <p className="text-xs text-text-tertiary">Longest Streak</p>
              <p className="font-semibold">{longestStreak} days</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Level Roadmap */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle>Level Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {LEVELS.map((level) => {
              const isReached = totalXP >= level.xpRequired;
              const isCurrent = currentLevel.level === level.level;
              return (
                <div
                  key={level.level}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                    isCurrent
                      ? "bg-figma/10 border border-figma/20"
                      : isReached
                      ? "text-text-primary"
                      : "text-text-tertiary"
                  }`}
                >
                  <span className="w-6 text-center font-bold">
                    {level.level}
                  </span>
                  <span className="flex-1">{level.name}</span>
                  <span className="text-xs">
                    {level.xpRequired.toLocaleString()} XP
                  </span>
                  {isReached && (
                    <span className="text-level-up text-xs">✓</span>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Settings */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-text-tertiary" />
                <span className="text-sm">Language</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage("en")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border ${
                    language === "en"
                      ? "border-figma text-figma bg-figma/10"
                      : "border-border-subtle text-text-secondary"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage("ar")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border ${
                    language === "ar"
                      ? "border-figma text-figma bg-figma/10"
                      : "border-border-subtle text-text-secondary"
                  }`}
                >
                  العربية
                </button>
              </div>
            </div>

            <div className="border-t border-border-subtle pt-4">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
