"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { useUserStore } from "@/stores/user-store";
import { getLevelProgress } from "@/lib/xp";
import { ProgressBar } from "@/components/ui/progress";
import { Flame, Star } from "lucide-react";

const greetings = [
  "Every expert was once a beginner",
  "Small steps lead to big breakthroughs",
  "Your creativity is your superpower",
  "Today is a great day to learn something new",
  "Progress, not perfection",
  "You're building something amazing",
  "Keep going — momentum is everything",
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function WelcomeCard() {
  const { name, totalXP, currentStreak } = useUserStore();
  const progress = getLevelProgress(totalXP);
  const quote = greetings[Math.floor(Math.random() * greetings.length)];

  return (
    <motion.div
      variants={fadeInUp}
      className="rounded-xl border border-border-subtle bg-bg-secondary p-5 md:p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">
            {getGreeting()}, {name || "Nagham"}
          </h1>
          <p className="mt-1 text-text-secondary italic">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Flame className={`h-5 w-5 ${currentStreak > 0 ? "text-streak-fire" : "text-text-tertiary"}`} />
            <span className="font-heading text-lg font-bold">{currentStreak}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-5 w-5 text-xp-gold" />
            <span className="font-heading text-lg font-bold">Lv.{progress.current.level}</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-text-secondary">
            Level {progress.current.level} — {progress.current.name}
          </span>
          <span className="font-semibold text-xp-gold">
            {totalXP.toLocaleString()}
            {progress.next
              ? ` / ${progress.next.xpRequired.toLocaleString()} XP`
              : " XP (MAX)"}
          </span>
        </div>
        <ProgressBar
          value={progress.progress * 100}
          size="default"
        />
      </div>
    </motion.div>
  );
}
