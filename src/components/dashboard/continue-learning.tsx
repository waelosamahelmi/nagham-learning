"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import Link from "next/link";
import { Play } from "lucide-react";
import { SKILL_TRACKS } from "@/lib/constants";
import { ProgressBar } from "@/components/ui/progress";

export interface InProgressLesson {
  lessonId: string;
  lessonName: string;
  trackId: string;
  moduleId: string;
  moduleName: string;
  progress: number; // 0-100
}

interface ContinueLearningProps {
  lessons?: InProgressLesson[];
}

export function ContinueLearning({ lessons = [] }: ContinueLearningProps) {
  if (lessons.length === 0) return null;

  return (
    <motion.section variants={fadeInUp}>
      <h2 className="font-heading text-xl font-semibold">
        Continue Where You Left Off
      </h2>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {lessons.map((lesson) => {
          const track =
            SKILL_TRACKS[lesson.trackId as keyof typeof SKILL_TRACKS];
          return (
            <Link
              key={lesson.lessonId}
              href={`/skill/${lesson.trackId}/${lesson.moduleId}/${lesson.lessonId}`}
            >
              <div className="group shrink-0 w-48 rounded-xl border border-border-subtle bg-bg-secondary p-4 transition-all hover:border-border-active">
                <div
                  className="h-1 w-8 rounded-full"
                  style={{ backgroundColor: track?.color }}
                />
                <p className="mt-3 font-heading text-sm font-semibold truncate">
                  {lesson.moduleName}
                </p>
                <p className="text-xs text-text-tertiary truncate mt-0.5">
                  {lesson.lessonName}
                </p>
                <div className="mt-3">
                  <ProgressBar
                    value={lesson.progress}
                    color={track?.color}
                    size="sm"
                  />
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-figma group-hover:text-figma/80">
                  <Play className="h-3 w-3" />
                  Continue
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.section>
  );
}
