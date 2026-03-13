# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NaghamOS is a gamified, AI-powered learning platform built for a single learner (Nagham) with a mentor dashboard (Wael). Dark-mode, animation-rich, designed to make skill-building addictive through micro-wins and visual delight. Built by Helmies Oy.

## Tech Stack

- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Styling:** Tailwind CSS + CSS variables for theming (dark mode default)
- **Animations:** Framer Motion + GSAP (ScrollTrigger, SplitText)
- **UI Base:** shadcn/ui (heavily customized)
- **Database:** Supabase (PostgreSQL + Auth + Realtime + Storage)
- **AI Engine:** Z.ai GLM-4.7 via OpenAI-compatible SDK, OpenRouter as fallback
- **State:** Zustand
- **Deployment:** Vercel
- **Fonts:** Syne (headings) + Inter (body) + IBM Plex Arabic (Arabic support)
- **Audio:** Tone.js for achievement sounds
- **Charts:** Recharts

## Commands

```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking (tsc --noEmit)

# Database
npx supabase start   # Start local Supabase
npx supabase db push # Push schema changes
npx supabase gen types typescript --local > lib/database.types.ts  # Generate types
```

## Architecture

### Route Structure (App Router)
```
app/
  (auth)/login/          → Login page
  (app)/                 → Authenticated layout (sidebar + top bar)
    dashboard/           → Main hub with progress, streaks, recommendations
    skill/[track]/       → Skill track overview (7 tracks)
    skill/[track]/[module]/[lesson]/ → AI-powered interactive lesson
    projects/            → Project gallery
    achievements/        → Trophy room
    profile/             → Settings, language toggle
    inspiration/         → Curated design feed
    mentor/              → Mentor-only dashboard (role-gated)
```

### Key Directories
```
lib/
  ai.ts               → AI provider config (Z.ai primary, OpenRouter fallback)
  supabase/
    client.ts          → Browser Supabase client
    server.ts          → Server Supabase client
    middleware.ts       → Auth middleware
  animations.ts        → Shared Framer Motion animation configs
  xp.ts               → XP economy constants and level calculations
  achievements.ts      → Achievement condition checking
components/
  ui/                  → shadcn/ui base components (customized)
  dashboard/           → Dashboard widgets
  lesson/              → AI chat interface components
  gamification/        → XP counter, streak fire, level-up celebration
stores/                → Zustand stores
```

### AI Provider System

Located in `lib/ai.ts`. Uses OpenAI SDK with two providers:
- **Z.ai** (primary): `glm-4.7` for lessons, `glm-4.7-flash` for quizzes, `glm-4.6v` for vision
- **OpenRouter** (fallback): `z-ai/glm-4.5-air:free`

Switch via `AI_PROVIDER` env var. Auto-fallback on failure. All AI calls go through server-side API routes only (never expose keys to client).

### Two User Roles
- **Learner** (Nagham): Sees dashboard, lessons, achievements, projects
- **Mentor** (Wael): Additional `/mentor` routes for analytics, assigning challenges, sending messages, awarding XP

### Gamification
- XP ledger pattern (append-only `xp_ledger` table, `user_levels` for aggregates)
- Level system: 15 levels from "Seedling" (0 XP) to "Nagham-Level" (15,000 XP)
- Streak: consecutive days with 1+ lesson or 15min activity; multiplier = 10 × streak_count
- Achievements: milestone, streak, skill, social, hidden categories

### Design System
- Theme: "neon oasis" — deep dark backgrounds (`#0A0A0F`) with glowing skill-track accent colors
- Each skill track has a signature color (CSS variable like `--color-figma: #A259FF`)
- Glassmorphism cards: `backdrop-blur-xl bg-white/5 border border-white/10`
- All CSS color tokens defined as CSS variables in globals.css
- i18n: English + Arabic with RTL support via `next-intl` and Tailwind `rtl:` variants

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
AI_PROVIDER (zai|openrouter), ZAI_API_KEY, OPENROUTER_API_KEY
NEXT_PUBLIC_APP_URL
```

## Quality Standards
- Dark mode must have no white flashes; proper WCAG contrast ratios
- Animations at 60fps; use `will-change` and GPU-accelerated properties
- AI responses must stream (SSE) for smooth UX
- All async operations need loading skeletons (shimmer effect, not spinners)
- Streak calculations must handle Europe/Helsinki timezone correctly
- RTL layout must work when Arabic is selected
- Mobile-responsive: primary 1440px, tablet 768px, mobile 375px
