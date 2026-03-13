"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { SKILL_TRACKS, type SkillTrackId } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { ProgressBar, CircularProgress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Lock, CheckCircle, Play, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Module {
  id: string;
  nameEn: string;
  descriptionEn: string;
  sortOrder: number;
  xpReward: number;
  unlockAfter: string | null;
  lessons: Lesson[];
  completedLessons: number;
}

interface Lesson {
  id: string;
  nameEn: string;
  lessonType: string;
  difficulty: string;
  estimatedMinutes: number;
  xpReward: number;
  status: "not_started" | "in_progress" | "completed" | "skipped";
}

export default function SkillTrackPage() {
  const params = useParams();
  const trackId = params.track as string;
  const track = SKILL_TRACKS[trackId as SkillTrackId];
  const userId = useUserStore((s) => s.userId);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    async function load() {
      const supabase = createClient();

      const { data: modulesData } = await supabase
        .from("modules")
        .select(
          "id, name_en, description_en, sort_order, xp_reward, unlock_after"
        )
        .eq("track_id", trackId)
        .order("sort_order");

      if (!modulesData) {
        setLoading(false);
        return;
      }

      const moduleIds = modulesData.map((m) => m.id);

      const [{ data: lessonsData }, { data: progressData }] =
        await Promise.all([
          supabase
            .from("lessons")
            .select("*")
            .in("module_id", moduleIds)
            .order("sort_order"),
          supabase
            .from("lesson_progress")
            .select("lesson_id, status")
            .eq("user_id", userId!),
        ]);

      const progressMap = new Map(
        (progressData || []).map((p) => [p.lesson_id, p.status])
      );

      const mapped: Module[] = modulesData.map((mod) => {
        const modLessons = (lessonsData || [])
          .filter((l) => l.module_id === mod.id)
          .map((l) => ({
            id: l.id,
            nameEn: l.name_en,
            lessonType: l.lesson_type,
            difficulty: l.difficulty,
            estimatedMinutes: l.estimated_minutes,
            xpReward: l.xp_reward,
            status:
              (progressMap.get(l.id) as Lesson["status"]) || "not_started",
          }));

        return {
          id: mod.id,
          nameEn: mod.name_en,
          descriptionEn: mod.description_en || "",
          sortOrder: mod.sort_order,
          xpReward: mod.xp_reward,
          unlockAfter: mod.unlock_after,
          lessons: modLessons,
          completedLessons: modLessons.filter((l) => l.status === "completed")
            .length,
        };
      });

      setModules(mapped);
      setLoading(false);
    }
    load();
  }, [userId, trackId]);

  if (!track) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">Track not found</p>
      </div>
    );
  }

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = modules.reduce(
    (sum, m) => sum + m.completedLessons,
    0
  );
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="max-w-4xl space-y-8"
    >
      {/* Track Header */}
      <motion.div variants={fadeInUp} className="flex items-start gap-6">
        <CircularProgress
          value={overallProgress}
          size={80}
          strokeWidth={6}
          color={track.color}
        >
          <span className="text-sm font-bold">{Math.round(overallProgress)}%</span>
        </CircularProgress>
        <div>
          <h1
            className="font-heading text-3xl font-bold"
            style={{ color: track.color }}
          >
            {track.nameEn}
          </h1>
          <p className="mt-1 text-text-secondary">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>
      </motion.div>

      {/* Modules */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : modules.length === 0 ? (
        <motion.div variants={fadeInUp} className="rounded-xl border border-border-subtle bg-bg-secondary p-8 text-center">
          <p className="text-text-secondary">
            Modules for this track are coming soon!
          </p>
        </motion.div>
      ) : (
        modules.map((mod, idx) => {
          const isLocked =
            mod.unlockAfter &&
            !modules.find(
              (m) =>
                m.id === mod.unlockAfter &&
                m.completedLessons === m.lessons.length
            );
          const moduleProgress =
            mod.lessons.length > 0
              ? (mod.completedLessons / mod.lessons.length) * 100
              : 0;

          return (
            <motion.div
              key={mod.id}
              variants={fadeInUp}
              className={`rounded-xl border bg-bg-secondary overflow-hidden ${
                isLocked
                  ? "border-border-subtle opacity-60"
                  : "border-border-subtle"
              }`}
            >
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-text-tertiary">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-semibold">
                        {mod.nameEn}
                      </h3>
                      {mod.descriptionEn && (
                        <p className="text-sm text-text-secondary mt-0.5">
                          {mod.descriptionEn}
                        </p>
                      )}
                    </div>
                  </div>
                  {isLocked ? (
                    <Lock className="h-5 w-5 text-text-tertiary" />
                  ) : moduleProgress === 100 ? (
                    <CheckCircle
                      className="h-5 w-5"
                      style={{ color: track.color }}
                    />
                  ) : (
                    <Badge variant="secondary">
                      {mod.completedLessons}/{mod.lessons.length}
                    </Badge>
                  )}
                </div>

                <ProgressBar
                  value={moduleProgress}
                  color={track.color}
                  size="sm"
                  className="mt-4"
                />
              </div>

              {/* Lesson list */}
              {!isLocked && (
                <div className="border-t border-border-subtle">
                  {mod.lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/skill/${trackId}/${mod.id}/${lesson.id}`}
                    >
                      <div className="flex items-center gap-3 px-5 py-3 hover:bg-bg-hover transition-colors border-b border-border-subtle last:border-0">
                        {lesson.status === "completed" ? (
                          <CheckCircle
                            className="h-4 w-4 shrink-0"
                            style={{ color: track.color }}
                          />
                        ) : lesson.status === "in_progress" ? (
                          <Play
                            className="h-4 w-4 shrink-0"
                            style={{ color: track.color }}
                          />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-border-active shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{lesson.nameEn}</p>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">
                          {lesson.lessonType.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-text-tertiary">
                          {lesson.estimatedMinutes}m
                        </span>
                        <ChevronRight className="h-4 w-4 text-text-tertiary" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })
      )}
    </motion.div>
  );
}
