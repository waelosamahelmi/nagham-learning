"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SKILL_TRACKS } from "@/lib/constants";
import { showToast } from "@/components/ui/toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AssignChallengePage() {
  const router = useRouter();
  const userId = useUserStore((s) => s.userId);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [xpReward, setXpReward] = useState("200");
  const [dueDate, setDueDate] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !brief.trim()) return;
    setLoading(true);

    const supabase = createClient();

    // Find learner
    const { data: learner } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "learner")
      .single();

    if (!learner) {
      showToast({ type: "error", title: "Learner not found" });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("projects").insert({
      user_id: learner.id,
      title: title.trim(),
      brief: brief.trim(),
      skill_tracks: selectedTracks,
      status: "assigned",
      assigned_by: userId,
      xp_reward: parseInt(xpReward) || 200,
      due_date: dueDate || null,
    });

    if (error) {
      showToast({ type: "error", title: "Failed to assign challenge" });
    } else {
      // Send notification message
      await supabase.from("mentor_messages").insert({
        from_user_id: userId,
        to_user_id: learner.id,
        message: `New challenge assigned: "${title.trim()}"`,
        message_type: "assignment",
      });

      showToast({
        type: "success",
        title: "Challenge assigned!",
        description: title.trim(),
      });
      router.push("/mentor");
    }
    setLoading(false);
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="max-w-2xl"
    >
      <Link
        href="/mentor"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <h1 className="font-heading text-2xl font-bold">Assign Challenge</h1>
      <p className="mt-1 text-text-secondary">
        Create a new challenge for Nagham
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <Input
          label="Challenge Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Design a restaurant menu page"
          required
        />

        <Textarea
          label="Brief"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="Describe the challenge requirements, deliverables, and any specific instructions..."
          required
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            Skill Tracks
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SKILL_TRACKS).map(([id, track]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSelectedTracks((prev) =>
                    prev.includes(id)
                      ? prev.filter((t) => t !== id)
                      : [...prev, id]
                  );
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all border ${
                  selectedTracks.includes(id)
                    ? "border-white/20 bg-white/10"
                    : "border-border-subtle bg-bg-tertiary text-text-secondary"
                }`}
                style={
                  selectedTracks.includes(id)
                    ? { borderColor: track.color, color: track.color }
                    : {}
                }
              >
                {track.nameEn}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="XP Reward"
            type="number"
            value={xpReward}
            onChange={(e) => setXpReward(e.target.value)}
            min="50"
            max="500"
          />
          <Input
            label="Due Date (optional)"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Assign Challenge
        </Button>
      </form>
    </motion.div>
  );
}
