"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SKILL_TRACKS } from "@/lib/constants";
import { getLevelForXP } from "@/lib/xp";
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";
import { SkillRadarChart } from "@/components/dashboard/skill-radar-chart";
import {
  Flame,
  Star,
  Clock,
  BookOpen,
  Zap,
  MessageCircle,
  Award,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";

interface MentorData {
  learnerProfile: any;
  learnerLevel: any;
  recentActivity: any[];
  dailyActivity: any[];
  pendingProjects: any[];
  trackProgress: Record<string, { completed: number; total: number }>;
}

export default function MentorPage() {
  const role = useUserStore((s) => s.role);
  const [data, setData] = useState<MentorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      // Get learner profile (there's only one learner — Nagham)
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "learner")
        .limit(1);

      const learner = profiles?.[0];
      if (!learner) {
        setLoading(false);
        return;
      }

      const [
        { data: level },
        { data: daily },
        { data: lessonProgress },
        { data: lessons },
        { data: pendingProjects },
      ] = await Promise.all([
        supabase
          .from("user_levels")
          .select("*")
          .eq("user_id", learner.id)
          .single(),
        supabase
          .from("daily_activity")
          .select("*")
          .eq("user_id", learner.id)
          .order("activity_date", { ascending: false })
          .limit(90),
        supabase
          .from("lesson_progress")
          .select("lesson_id, status")
          .eq("user_id", learner.id),
        supabase.from("lessons").select("id, module_id, modules(track_id)"),
        supabase
          .from("projects")
          .select("*")
          .eq("user_id", learner.id)
          .eq("status", "submitted")
          .order("submitted_at", { ascending: false }),
      ]);

      // Calculate track progress
      const trackProgress: Record<
        string,
        { completed: number; total: number }
      > = {};
      for (const track of Object.keys(SKILL_TRACKS)) {
        trackProgress[track] = { completed: 0, total: 0 };
      }

      const completedSet = new Set(
        (lessonProgress || [])
          .filter((lp) => lp.status === "completed")
          .map((lp) => lp.lesson_id)
      );

      for (const lesson of lessons || []) {
        const trackId = (lesson.modules as any)?.track_id;
        if (trackId && trackProgress[trackId]) {
          trackProgress[trackId].total++;
          if (completedSet.has(lesson.id)) {
            trackProgress[trackId].completed++;
          }
        }
      }

      // This week's activity
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 86400000);
      const thisWeek = (daily || []).filter(
        (d) => new Date(d.activity_date) >= weekAgo
      );
      const weekMinutes = thisWeek.reduce(
        (sum, d) => sum + d.minutes_spent,
        0
      );

      setData({
        learnerProfile: learner,
        learnerLevel: level,
        recentActivity: daily || [],
        dailyActivity: daily || [],
        pendingProjects: pendingProjects || [],
        trackProgress,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!data?.learnerProfile) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">No learner found</p>
      </div>
    );
  }

  const level = data.learnerLevel;
  const levelInfo = getLevelForXP(level?.total_xp || 0);

  // Mood indicator based on recent activity
  const recentDays = data.dailyActivity.slice(0, 7);
  const activeDays = recentDays.filter((d) => d.minutes_spent > 0).length;
  const mood =
    activeDays >= 5 ? "green" : activeDays >= 3 ? "yellow" : "red";
  const moodEmoji =
    mood === "green" ? "🟢" : mood === "yellow" ? "🟡" : "🔴";

  // Week stats
  const weekMinutes = recentDays.reduce((s, d) => s + d.minutes_spent, 0);
  const weekLessons = recentDays.reduce((s, d) => s + d.lessons_completed, 0);

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="max-w-6xl space-y-8"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="font-heading text-3xl font-bold">Mentor Dashboard</h1>
        <p className="mt-1 text-text-secondary">
          Tracking {data.learnerProfile.name}&apos;s progress
        </p>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-2 gap-3 md:grid-cols-4"
      >
        <StatCard
          icon={<Star className="h-5 w-5 text-xp-gold" />}
          label="Level"
          value={`${levelInfo.level} — ${levelInfo.name}`}
        />
        <StatCard
          icon={<Flame className="h-5 w-5 text-streak-fire" />}
          label="Streak"
          value={`${level?.current_streak || 0} days`}
        />
        <StatCard
          icon={<Zap className="h-5 w-5 text-xp-gold" />}
          label="Total XP"
          value={(level?.total_xp || 0).toLocaleString()}
        />
        <StatCard
          icon={<span className="text-lg">{moodEmoji}</span>}
          label="Engagement"
          value={
            mood === "green"
              ? "Strong"
              : mood === "yellow"
              ? "Declining"
              : "Low"
          }
        />
      </motion.div>

      {/* Week Summary */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-8">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-text-tertiary" />
              <span className="text-sm">
                <strong>{(weekMinutes / 60).toFixed(1)}h</strong> active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-text-tertiary" />
              <span className="text-sm">
                <strong>{weekLessons}</strong> lessons
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-text-tertiary" />
              <span className="text-sm">
                <strong>
                  {recentDays
                    .reduce((s, d) => s + d.xp_earned, 0)
                    .toLocaleString()}
                </strong>{" "}
                XP
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        <Card>
          <CardHeader>
            <CardTitle>Activity Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityHeatmap data={data.dailyActivity} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillRadarChart trackProgress={data.trackProgress} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Track Progress Detail */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle>Track Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(data.trackProgress).map(([trackId, progress]) => {
              const track =
                SKILL_TRACKS[trackId as keyof typeof SKILL_TRACKS];
              if (!track) return null;
              const percent =
                progress.total > 0
                  ? (progress.completed / progress.total) * 100
                  : 0;
              return (
                <div key={trackId} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium truncate">
                    {track.nameEn}
                  </div>
                  <div className="flex-1">
                    <ProgressBar
                      value={percent}
                      color={track.color}
                      size="sm"
                    />
                  </div>
                  <span className="text-xs text-text-tertiary w-16 text-right">
                    {progress.completed}/{progress.total}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-wrap gap-3"
      >
        <Link href="/mentor/assign">
          <Button variant="secondary" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Assign Challenge
          </Button>
        </Link>
        <Link href="/mentor/messages">
          <Button variant="secondary" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Send Message
          </Button>
        </Link>
        <Link href="/mentor/award-xp">
          <Button variant="secondary" className="gap-2">
            <Award className="h-4 w-4" />
            Award XP
          </Button>
        </Link>
      </motion.div>

      {/* Pending Reviews */}
      {data.pendingProjects.length > 0 && (
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.pendingProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="flex items-center justify-between rounded-lg border border-border-subtle p-3 hover:bg-bg-hover transition-colors">
                    <div>
                      <p className="font-medium text-sm">{project.title}</p>
                      <p className="text-xs text-text-tertiary">
                        Submitted{" "}
                        {new Date(project.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="xp">Review</Badge>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">{icon}</div>
        <p className="text-xs text-text-tertiary">{label}</p>
        <p className="font-heading font-semibold text-sm mt-0.5">{value}</p>
      </CardContent>
    </Card>
  );
}
