"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function DashboardPage() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.section variants={fadeInUp}>
        <h1 className="font-heading text-3xl font-bold">
          Good morning, Nagham
        </h1>
        <p className="mt-1 text-text-secondary">
          &ldquo;Every expert was once a beginner&rdquo;
        </p>

        {/* Level Progress Bar */}
        <div className="mt-4 rounded-xl border border-border-subtle bg-bg-secondary p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Level 1 — Seedling</span>
            <span className="text-xp-gold font-semibold">0 / 100 XP</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-bg-tertiary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-figma to-ai"
              style={{ width: "0%" }}
            />
          </div>
        </div>
      </motion.section>

      {/* Skill Tracks */}
      <motion.section variants={fadeInUp}>
        <h2 className="font-heading text-xl font-semibold">Skill Tracks</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder cards — will be populated from DB */}
          {[
            { name: "Figma & Framer", color: "figma", progress: 0 },
            { name: "Photoshop", color: "photoshop", progress: 0 },
            { name: "Illustrator", color: "illustrator", progress: 0 },
            { name: "Graphic Design", color: "graphic", progress: 0 },
            { name: "Blender 3D", color: "blender", progress: 0 },
            { name: "AI Tools", color: "ai", progress: 0 },
            { name: "Coding with AI", color: "coding", progress: 0 },
          ].map((track) => (
            <div
              key={track.name}
              className="rounded-xl border border-border-subtle bg-bg-secondary p-4 transition-colors hover:border-border-active"
            >
              <div
                className="h-1 w-8 rounded-full"
                style={{
                  backgroundColor: `var(--color-${track.color})`,
                }}
              />
              <h3 className="mt-3 font-heading font-semibold">{track.name}</h3>
              <div className="mt-2 h-1.5 rounded-full bg-bg-tertiary">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${track.progress}%`,
                    backgroundColor: `var(--color-${track.color})`,
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-text-tertiary">
                {track.progress}% complete
              </p>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
