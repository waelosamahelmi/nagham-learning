// ─── Level Definitions ──────────────────────────────────────
export const LEVELS = [
  { level: 1, name: "Seedling", xpRequired: 0 },
  { level: 2, name: "Sprout", xpRequired: 100 },
  { level: 3, name: "Budding", xpRequired: 300 },
  { level: 4, name: "Blooming", xpRequired: 600 },
  { level: 5, name: "Growing", xpRequired: 1000 },
  { level: 6, name: "Flourishing", xpRequired: 1500 },
  { level: 7, name: "Thriving", xpRequired: 2200 },
  { level: 8, name: "Radiant", xpRequired: 3000 },
  { level: 9, name: "Luminous", xpRequired: 4000 },
  { level: 10, name: "Brilliant", xpRequired: 5200 },
  { level: 11, name: "Stellar", xpRequired: 6500 },
  { level: 12, name: "Cosmic", xpRequired: 8000 },
  { level: 13, name: "Transcendent", xpRequired: 10000 },
  { level: 14, name: "Legendary", xpRequired: 12500 },
  { level: 15, name: "Nagham-Level", xpRequired: 15000 },
] as const;

// ─── XP Rewards ─────────────────────────────────────────────
export const XP_REWARDS = {
  lesson_complete: 25,
  module_complete: 100,
  challenge_easy: 50,
  challenge_medium: 100,
  challenge_hard: 150,
  project_submit: 200,
  project_reviewed: 100,
  streak_daily: 10, // multiplied by streak count
  achievement_common: 50,
  achievement_rare: 200,
  achievement_legendary: 500,
  mentor_bonus_min: 50,
  mentor_bonus_max: 200,
  first_activity: 15,
  exploration: 15,
} as const;

// ─── Helpers ────────────────────────────────────────────────
export type Level = (typeof LEVELS)[number];

export function getLevelForXP(totalXP: number): Level {
  let currentLevel: Level = LEVELS[0];
  for (const level of LEVELS) {
    if (totalXP >= level.xpRequired) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
}

export function getNextLevel(currentLevel: number) {
  return LEVELS.find((l) => l.level === currentLevel + 1) ?? null;
}

export function getLevelProgress(totalXP: number) {
  const current = getLevelForXP(totalXP);
  const next = getNextLevel(current.level);
  if (!next) return { current, next: null, progress: 1 };

  const xpIntoLevel = totalXP - current.xpRequired;
  const xpNeeded = next.xpRequired - current.xpRequired;
  return {
    current,
    next,
    progress: xpIntoLevel / xpNeeded,
  };
}

export function getStreakBonus(streakCount: number) {
  return XP_REWARDS.streak_daily * streakCount;
}
