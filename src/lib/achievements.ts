export interface AchievementDef {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  icon: string;
  xpReward: number;
  category: "milestone" | "streak" | "skill" | "social" | "hidden";
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // Milestone
  {
    id: "first_lesson",
    nameEn: "First Step",
    nameAr: "الخطوة الأولى",
    descriptionEn: "Complete your first lesson",
    icon: "🌱",
    xpReward: 50,
    category: "milestone",
  },
  {
    id: "first_challenge",
    nameEn: "First Blood",
    nameAr: "أول إنجاز",
    descriptionEn: "Complete your first challenge",
    icon: "🎯",
    xpReward: 50,
    category: "milestone",
  },
  {
    id: "first_project",
    nameEn: "First Delivery",
    nameAr: "أول تسليم",
    descriptionEn: "Submit your first project",
    icon: "📦",
    xpReward: 100,
    category: "milestone",
  },
  {
    id: "first_module",
    nameEn: "Summit",
    nameAr: "القمة",
    descriptionEn: "Complete your first full module",
    icon: "🏔️",
    xpReward: 100,
    category: "milestone",
  },
  {
    id: "deep_dive",
    nameEn: "Deep Dive",
    nameAr: "غوص عميق",
    descriptionEn: "Spend 2+ hours in a single session",
    icon: "🌊",
    xpReward: 75,
    category: "milestone",
  },

  // Streak
  {
    id: "streak_3",
    nameEn: "Spark",
    nameAr: "شرارة",
    descriptionEn: "3-day streak",
    icon: "🔥",
    xpReward: 50,
    category: "streak",
  },
  {
    id: "streak_7",
    nameEn: "Flame",
    nameAr: "لهب",
    descriptionEn: "7-day streak",
    icon: "🔥",
    xpReward: 100,
    category: "streak",
  },
  {
    id: "streak_14",
    nameEn: "Blaze",
    nameAr: "حريق",
    descriptionEn: "14-day streak",
    icon: "🔥",
    xpReward: 150,
    category: "streak",
  },
  {
    id: "streak_30",
    nameEn: "Unstoppable",
    nameAr: "لا يمكن إيقافه",
    descriptionEn: "30-day streak",
    icon: "☀️",
    xpReward: 300,
    category: "streak",
  },
  {
    id: "streak_60",
    nameEn: "Supernova",
    nameAr: "نجم عملاق",
    descriptionEn: "60-day streak",
    icon: "⭐",
    xpReward: 400,
    category: "streak",
  },
  {
    id: "streak_90",
    nameEn: "Diamond",
    nameAr: "ألماس",
    descriptionEn: "90-day streak",
    icon: "💎",
    xpReward: 500,
    category: "streak",
  },

  // Hidden
  {
    id: "night_owl",
    nameEn: "Night Owl",
    nameAr: "بومة الليل",
    descriptionEn: "Complete a lesson after midnight",
    icon: "🦉",
    xpReward: 50,
    category: "hidden",
  },
  {
    id: "early_bird",
    nameEn: "Early Bird",
    nameAr: "الطائر المبكر",
    descriptionEn: "Complete a lesson before 7 AM",
    icon: "🌅",
    xpReward: 50,
    category: "hidden",
  },
  {
    id: "polymath",
    nameEn: "Polymath",
    nameAr: "متعدد المعارف",
    descriptionEn: "Active in 4+ tracks in one week",
    icon: "🎨",
    xpReward: 100,
    category: "hidden",
  },
  {
    id: "curious_mind",
    nameEn: "Curious Mind",
    nameAr: "عقل فضولي",
    descriptionEn: "Ask AI 50+ questions across lessons",
    icon: "💬",
    xpReward: 100,
    category: "hidden",
  },
  {
    id: "speed_runner",
    nameEn: "Speed Runner",
    nameAr: "عداء السرعة",
    descriptionEn: "Complete a lesson in under 5 minutes",
    icon: "🏃",
    xpReward: 50,
    category: "hidden",
  },
  {
    id: "surprise",
    nameEn: "Surprise!",
    nameAr: "مفاجأة!",
    descriptionEn: "A special gift from your mentor",
    icon: "🎁",
    xpReward: 200,
    category: "hidden",
  },
];
