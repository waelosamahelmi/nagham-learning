"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { SKILL_TRACKS } from "@/lib/constants";

export interface RecommendedLesson {
  id: string;
  name: string;
  trackId: string;
  moduleId: string;
  estimatedMinutes: number;
  lessonType: string;
}

interface TodayRecommendedProps {
  lessons?: RecommendedLesson[];
}

export function TodayRecommended({ lessons = [] }: TodayRecommendedProps) {
  if (lessons.length === 0) {
    return (
      <motion.section variants={fadeInUp}>
        <h2 className="font-heading text-xl font-semibold">
          Today&apos;s Recommended
        </h2>
        <div className="mt-4 rounded-xl border border-border-subtle bg-bg-secondary p-6 text-center">
          <p className="text-text-secondary">
            Start a skill track to get personalized recommendations!
          </p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section variants={fadeInUp}>
      <h2 className="font-heading text-xl font-semibold">
        Today&apos;s Recommended
      </h2>
      <div className="mt-4 space-y-2">
        {lessons.map((lesson) => {
          const track =
            SKILL_TRACKS[lesson.trackId as keyof typeof SKILL_TRACKS];
          return (
            <Link
              key={lesson.id}
              href={`/skill/${lesson.trackId}/${lesson.moduleId}/${lesson.id}`}
            >
              <div className="group flex items-center gap-4 rounded-xl border border-border-subtle bg-bg-secondary p-4 transition-all hover:border-border-active">
                <div
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: track?.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{lesson.name}</p>
                  <p className="text-xs text-text-tertiary">
                    {track?.nameEn || lesson.trackId}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-text-tertiary shrink-0">
                  <Clock className="h-3 w-3" />
                  {lesson.estimatedMinutes} min
                </div>
                <ArrowRight className="h-4 w-4 text-text-tertiary group-hover:text-text-primary transition-colors shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>
    </motion.section>
  );
}
