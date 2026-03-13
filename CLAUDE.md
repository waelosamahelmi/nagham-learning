# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NaghamOS is a gamified, AI-powered learning platform built for a single learner (Nagham) with a mentor dashboard (Wael). Dark-mode, animation-rich, designed to make skill-building addictive through micro-wins and visual delight. Built by Helmies Oy.

## Tech Stack

- **Framework:** Next.js 16 (App Router) with TypeScript
- **Styling:** Tailwind CSS v4 + CSS variables for theming (dark mode default)
- **Animations:** Framer Motion (shared presets in `lib/animations.ts`)
- **UI Base:** Custom component library in `components/ui/` (Button, Card, Badge, Progress, Input, Dialog, Avatar, Skeleton, Toast)
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **AI Engine:** Z.ai GLM-4.7 via OpenAI SDK, OpenRouter as fallback — lazy-initialized in `lib/ai.ts`
- **State:** Zustand (`stores/user-store.ts`)
- **Deployment:** Vercel
- **Fonts:** Syne (headings) + Inter (body) loaded via Google Fonts `<link>` tag
- **i18n:** Custom hook-based (`lib/i18n/`) with English + Arabic translations

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking (tsc --noEmit)
```

### Database Setup
```bash
# Apply schema to Supabase project
# 1. Run supabase/schema.sql (tables + RLS policies)
# 2. Run supabase/functions.sql (increment_xp, update_streak, check_achievements RPCs)
# 3. Run supabase/seed.sql (skill tracks, modules, lessons, achievements)
```

## Architecture

### Route Structure
```
src/app/
  (auth)/login/                    → Login page
  (app)/                           → Authenticated layout (sidebar + top bar + gamification overlays)
    dashboard/                     → Main hub (welcome, continue learning, recommendations, tracks, achievements, mentor messages)
    skill/[track]/                 → Skill track overview with modules and lessons
    skill/[track]/[module]/[lesson]/ → AI-powered interactive lesson (streaming chat)
    projects/                      → Project gallery
    projects/[id]/                 → Project detail (submit/review)
    achievements/                  → Trophy room
    profile/                       → Stats, level roadmap, settings, language toggle
    inspiration/                   → Masonry grid curated feed with track filters
    mentor/                        → Mentor dashboard (role-gated via middleware)
    mentor/assign/                 → Assign challenges
    mentor/messages/               → Send motivational messages
    mentor/award-xp/               → Award bonus XP
  api/ai/                          → Non-streaming AI endpoint
  api/ai/stream/                   → SSE streaming AI endpoint
  api/auth/login/                  → Login endpoint
  api/auth/logout/                 → Logout endpoint
```

### Key Directories
```
src/lib/
  ai.ts                → Dual AI provider (Z.ai + OpenRouter) with lazy init and auto-fallback
  ai-system-prompt.ts  → NaghamOS teaching persona prompt builder
  animations.ts        → Shared Framer Motion variants (fadeInUp, staggerContainer, etc.)
  xp.ts                → 15-level system, XP rewards, level calculations
  achievements.ts      → Achievement definitions with i18n
  constants.ts         → Skill track definitions with colors and i18n names
  recommendations.ts   → Daily recommendation algorithm (track balance + momentum + variety)
  utils.ts             → cn() utility (clsx + tailwind-merge)
  supabase/
    client.ts          → Browser Supabase client
    server.ts          → Server Supabase client (cookies-based)
    actions.ts         → Server actions (getCurrentUser, getUserLevel)
    middleware.ts      → Session refresh helper

src/components/
  ui/                  → Base components: Button, Card, Badge, Progress, Input, Textarea, Dialog, Avatar, Skeleton, Toast, Sidebar, TopBar
  dashboard/           → WelcomeCard, SkillTracksGrid, TodayRecommended, ContinueLearning, RecentAchievements, MentorMessage, ActivityHeatmap, SkillRadarChart
  lesson/              → ChatInterface (streaming AI chat with quick replies, hints, auto-save)
  gamification/        → LevelUpCelebration (particle animation), AchievementPopup, XPCounter (animated), StreakFire
  user-hydrator.tsx    → Client-side user state hydration from Supabase

src/stores/
  user-store.ts        → Zustand store (user profile, XP, streak, level, language)

src/lib/i18n/
  locales.ts           → EN + AR translations for all UI strings
  use-translations.ts  → useTranslations() hook

supabase/
  schema.sql           → Full database schema with RLS policies
  functions.sql        → PostgreSQL RPCs (increment_xp, update_streak, check_achievements, log_daily_activity)
  seed.sql             → Skill tracks, modules, lessons (Figma, AI Tools, Graphic Design), achievements
```

### AI Provider System

`lib/ai.ts` uses lazy-initialized OpenAI clients (won't crash without API keys at build time):
- **Z.ai** (primary): `glm-4.7` for lessons, `glm-4.7-flash` for quizzes, `glm-4.6v` for vision
- **OpenRouter** (fallback): `z-ai/glm-4.5-air:free`

Switch via `AI_PROVIDER` env var. Auto-fallback on failure. All AI calls go through server-side API routes (`/api/ai` and `/api/ai/stream`).

### Auth & Middleware

`src/middleware.ts` handles:
- Redirecting unauthenticated users to `/login`
- Redirecting authenticated users away from `/login` to `/dashboard`
- Role-gating `/mentor` routes (checks `profiles.role`)

### Gamification System
- **XP**: Append-only `xp_ledger` table → `increment_xp()` RPC updates `user_levels`
- **Levels**: 15 levels ("Seedling" 0 XP → "Nagham-Level" 15,000 XP)
- **Streaks**: `update_streak()` RPC handles consecutive day tracking with auto XP bonus
- **Achievements**: `check_achievements()` RPC checks milestone/streak conditions; hidden achievements exist
- **Celebrations**: `LevelUpCelebration` component with particle effects, `AchievementPopup` for unlock notifications

### Design System
- Theme: "neon oasis" — `#0A0A0F` base with glowing skill-track accent colors
- 7 skill track colors defined as CSS custom properties in `globals.css` under `@theme`
- Glassmorphism cards: `backdrop-blur-xl bg-white/5 border border-white/10`
- Tailwind v4 with `@tailwindcss/postcss`

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
AI_PROVIDER (zai|openrouter), ZAI_API_KEY, OPENROUTER_API_KEY
NEXT_PUBLIC_APP_URL
```

## Quality Standards
- Dark mode: no white flashes, proper WCAG contrast ratios
- Animations at 60fps using Framer Motion (GPU-accelerated transforms)
- AI responses stream via SSE for smooth UX
- All async operations use Skeleton loading states (shimmer, not spinners)
- Streak calculations use `Europe/Helsinki` timezone
- Mobile-responsive: primary 1440px, tablet 768px, mobile 375px
- i18n: all UI strings translated, RTL support when Arabic selected
