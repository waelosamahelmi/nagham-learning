// ─── Skill Tracks ───────────────────────────────────────────
export const SKILL_TRACKS = {
  figma: {
    id: "figma",
    nameEn: "Figma & Framer",
    nameAr: "فيجما وفريمر",
    color: "var(--color-figma)",
    colorClass: "text-figma",
    bgClass: "bg-figma",
  },
  photoshop: {
    id: "photoshop",
    nameEn: "Photoshop",
    nameAr: "فوتوشوب",
    color: "var(--color-photoshop)",
    colorClass: "text-photoshop",
    bgClass: "bg-photoshop",
  },
  illustrator: {
    id: "illustrator",
    nameEn: "Illustrator",
    nameAr: "إليستريتور",
    color: "var(--color-illustrator)",
    colorClass: "text-illustrator",
    bgClass: "bg-illustrator",
  },
  "graphic-design": {
    id: "graphic-design",
    nameEn: "Graphic Design",
    nameAr: "التصميم الجرافيكي",
    color: "var(--color-graphic)",
    colorClass: "text-graphic",
    bgClass: "bg-graphic",
  },
  blender: {
    id: "blender",
    nameEn: "Blender 3D",
    nameAr: "بلندر ثلاثي الأبعاد",
    color: "var(--color-blender)",
    colorClass: "text-blender",
    bgClass: "bg-blender",
  },
  "ai-tools": {
    id: "ai-tools",
    nameEn: "AI Tools",
    nameAr: "أدوات الذكاء الاصطناعي",
    color: "var(--color-ai)",
    colorClass: "text-ai",
    bgClass: "bg-ai",
  },
  "coding-ai": {
    id: "coding-ai",
    nameEn: "Coding with AI",
    nameAr: "البرمجة مع الذكاء الاصطناعي",
    color: "var(--color-coding)",
    colorClass: "text-coding",
    bgClass: "bg-coding",
  },
} as const;

export type SkillTrackId = keyof typeof SKILL_TRACKS;
