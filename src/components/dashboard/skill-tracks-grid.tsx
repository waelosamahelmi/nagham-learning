"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import Link from "next/link";
import { SKILL_TRACKS, type SkillTrackId } from "@/lib/constants";
import {
  Figma,
  Image,
  PenTool,
  Palette,
  Box,
  Cpu,
  Code2,
} from "lucide-react";
import { ProgressBar } from "@/components/ui/progress";

const trackIcons: Record<SkillTrackId, React.ElementType> = {
  figma: Figma,
  photoshop: Image,
  illustrator: PenTool,
  "graphic-design": Palette,
  blender: Box,
  "ai-tools": Cpu,
  "coding-ai": Code2,
};

interface TrackProgress {
  trackId: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
}

interface SkillTracksGridProps {
  trackProgress?: TrackProgress[];
}

export function SkillTracksGrid({ trackProgress = [] }: SkillTracksGridProps) {
  const tracks = Object.entries(SKILL_TRACKS);

  function getProgress(trackId: string) {
    return trackProgress.find((t) => t.trackId === trackId);
  }

  return (
    <motion.section variants={fadeInUp}>
      <h2 className="font-heading text-xl font-semibold">Skill Tracks</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tracks.map(([id, track]) => {
          const Icon = trackIcons[id as SkillTrackId];
          const prog = getProgress(id);
          const percent = prog?.progress || 0;

          return (
            <Link key={id} href={`/skill/${id}`}>
              <div className="group rounded-xl border border-border-subtle bg-bg-secondary p-4 transition-all hover:border-border-active hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `color-mix(in srgb, ${track.color} 15%, transparent)` }}
                  >
                    <Icon
                      className="h-4.5 w-4.5"
                      style={{ color: track.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-sm font-semibold truncate">
                      {track.nameEn}
                    </h3>
                    <p className="text-xs text-text-tertiary">
                      {prog
                        ? `${prog.lessonsCompleted}/${prog.totalLessons} lessons`
                        : "Not started"}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <ProgressBar
                    value={percent}
                    color={track.color}
                    size="sm"
                  />
                  <p className="mt-1 text-right text-xs text-text-tertiary">
                    {Math.round(percent)}%
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.section>
  );
}
