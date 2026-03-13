"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { SKILL_TRACKS, type SkillTrackId } from "@/lib/constants";
import { buildLessonSystemPrompt } from "@/lib/ai-system-prompt";
import {
  ChatInterface,
  type ChatMessage,
} from "@/components/lesson/chat-interface";
import { showToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";

interface LessonData {
  id: string;
  nameEn: string;
  lessonType: string;
  aiSystemPrompt: string | null;
  aiContext: Record<string, any> | null;
  xpReward: number;
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const trackId = params.track as string;
  const moduleId = params.module as string;
  const lessonId = params.lesson as string;

  const track = SKILL_TRACKS[trackId as SkillTrackId];
  const { userId, currentLevel, currentStreak } = useUserStore();
  const addXP = useUserStore((s) => s.addXP);

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [existingMessages, setExistingMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    async function load() {
      const supabase = createClient();

      const [{ data: lessonData }, { data: progress }] = await Promise.all([
        supabase
          .from("lessons")
          .select("id, name_en, lesson_type, ai_system_prompt, ai_context, xp_reward")
          .eq("id", lessonId)
          .single(),
        supabase
          .from("lesson_progress")
          .select("ai_conversation, status")
          .eq("user_id", userId!)
          .eq("lesson_id", lessonId)
          .single(),
      ]);

      if (lessonData) {
        setLesson({
          id: lessonData.id,
          nameEn: lessonData.name_en,
          lessonType: lessonData.lesson_type,
          aiSystemPrompt: lessonData.ai_system_prompt,
          aiContext: lessonData.ai_context,
          xpReward: lessonData.xp_reward,
        });
      }

      if (progress?.ai_conversation) {
        setExistingMessages(progress.ai_conversation as ChatMessage[]);
      }

      // Mark as in_progress
      await supabase.from("lesson_progress").upsert(
        {
          user_id: userId!,
          lesson_id: lessonId,
          status: "in_progress",
          started_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" }
      );

      setLoading(false);
    }
    load();
  }, [userId, lessonId]);

  async function handleSaveProgress(messages: ChatMessage[]) {
    if (!userId) return;
    const supabase = createClient();
    await supabase
      .from("lesson_progress")
      .update({ ai_conversation: messages })
      .eq("user_id", userId)
      .eq("lesson_id", lessonId);
  }

  async function handleComplete(messages: ChatMessage[], feedback: string) {
    if (!userId || !lesson) return;
    const supabase = createClient();

    // Update lesson progress
    await supabase
      .from("lesson_progress")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        ai_conversation: messages,
        ai_feedback: feedback,
      })
      .eq("user_id", userId)
      .eq("lesson_id", lessonId);

    // Award XP
    await supabase.from("xp_ledger").insert({
      user_id: userId,
      amount: lesson.xpReward,
      source: "lesson_complete",
      source_id: lessonId,
      skill_track: trackId,
    });

    // Update user_levels
    await supabase.rpc("increment_xp", {
      p_user_id: userId,
      p_amount: lesson.xpReward,
    });

    addXP(lesson.xpReward);

    showToast({
      type: "xp",
      title: `+${lesson.xpReward} XP`,
      description: `Completed: ${lesson.nameEn}`,
    });

    // Update daily activity
    const today = new Date().toISOString().split("T")[0];
    await supabase.from("daily_activity").upsert(
      {
        user_id: userId,
        activity_date: today,
        lessons_completed: 1,
        xp_earned: lesson.xpReward,
      },
      { onConflict: "user_id,activity_date" }
    );

    // Navigate back to track
    setTimeout(() => {
      router.push(`/skill/${trackId}`);
    }, 1500);
  }

  if (loading || !lesson) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  const systemPrompt = buildLessonSystemPrompt({
    lessonPrompt: lesson.aiSystemPrompt || undefined,
    lessonContext: lesson.aiContext || undefined,
    userLevel: currentLevel.level,
    streakCount: currentStreak,
  });

  return (
    <div className="-m-4 md:-m-6">
      <ChatInterface
        systemPrompt={systemPrompt}
        initialMessages={existingMessages}
        trackColor={track?.color || "var(--color-figma)"}
        lessonTitle={lesson.nameEn}
        onBack={() => router.push(`/skill/${trackId}`)}
        onComplete={handleComplete}
        onSaveProgress={handleSaveProgress}
      />
    </div>
  );
}
