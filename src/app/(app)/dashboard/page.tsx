"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/animations";
import { WelcomeCard } from "@/components/dashboard/welcome-card";
import { ContinueLearning } from "@/components/dashboard/continue-learning";
import { TodayRecommended } from "@/components/dashboard/today-recommended";
import { SkillTracksGrid } from "@/components/dashboard/skill-tracks-grid";
import { RecentAchievements } from "@/components/dashboard/recent-achievements";
import { MentorMessage } from "@/components/dashboard/mentor-message";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { SkeletonDashboard } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const userId = useUserStore((s) => s.userId);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    inProgress: any[];
    recommended: any[];
    trackProgress: any[];
    achievements: any[];
    mentorMessage: any;
  }>({
    inProgress: [],
    recommended: [],
    trackProgress: [],
    achievements: [],
    mentorMessage: null,
  });

  useEffect(() => {
    if (!userId) return;
    async function loadDashboard() {
      const supabase = createClient();

      const [
        { data: inProgress },
        { data: achievements },
        { data: mentorMessages },
      ] = await Promise.all([
        supabase
          .from("lesson_progress")
          .select(
            "lesson_id, status, lessons(id, name_en, module_id, modules(id, name_en, track_id))"
          )
          .eq("user_id", userId!)
          .eq("status", "in_progress")
          .limit(5),
        supabase
          .from("user_achievements")
          .select("achievement_id, unlocked_at, achievements(id, name_en, icon)")
          .eq("user_id", userId!)
          .order("unlocked_at", { ascending: false })
          .limit(6),
        supabase
          .from("mentor_messages")
          .select("*")
          .eq("to_user_id", userId!)
          .order("created_at", { ascending: false })
          .limit(1),
      ]);

      setData({
        inProgress: (inProgress || []).map((lp: any) => ({
          lessonId: lp.lesson_id,
          lessonName: lp.lessons?.name_en || "",
          trackId: lp.lessons?.modules?.track_id || "",
          moduleId: lp.lessons?.module_id || "",
          moduleName: lp.lessons?.modules?.name_en || "",
          progress: 50, // estimate
        })),
        recommended: [],
        trackProgress: [],
        achievements: (achievements || []).map((ua: any) => ({
          id: ua.achievement_id,
          nameEn: ua.achievements?.name_en || "",
          icon: ua.achievements?.icon || "🏆",
          unlockedAt: ua.unlocked_at,
        })),
        mentorMessage: mentorMessages?.[0]
          ? {
              id: mentorMessages[0].id,
              message: mentorMessages[0].message,
              messageType: mentorMessages[0].message_type,
              createdAt: mentorMessages[0].created_at,
            }
          : null,
      });

      setLoading(false);
    }

    loadDashboard();
  }, [userId]);

  if (loading && !userId) {
    return <SkeletonDashboard />;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-8 max-w-6xl"
    >
      <WelcomeCard />
      <ContinueLearning lessons={data.inProgress} />
      <TodayRecommended lessons={data.recommended} />
      <SkillTracksGrid trackProgress={data.trackProgress} />
      <RecentAchievements achievements={data.achievements} />
      <MentorMessage latestMessage={data.mentorMessage} />
    </motion.div>
  );
}
