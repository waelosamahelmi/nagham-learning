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
import { showToast } from "@/components/ui/toast";
import { ArrowLeft, Gift } from "lucide-react";
import Link from "next/link";

export default function AwardXPPage() {
  const router = useRouter();
  const userId = useUserStore((s) => s.userId);
  const [amount, setAmount] = useState("100");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAward(e: React.FormEvent) {
    e.preventDefault();
    const xpAmount = parseInt(amount);
    if (!xpAmount || xpAmount < 1 || xpAmount > 500) {
      showToast({ type: "error", title: "XP must be between 1 and 500" });
      return;
    }

    setLoading(true);
    const supabase = createClient();

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

    // Add XP
    await supabase.from("xp_ledger").insert({
      user_id: learner.id,
      amount: xpAmount,
      source: "mentor_bonus",
    });

    await supabase.rpc("increment_xp", {
      p_user_id: learner.id,
      p_amount: xpAmount,
    });

    // Send message
    await supabase.from("mentor_messages").insert({
      from_user_id: userId,
      to_user_id: learner.id,
      message: `Wael awarded you ${xpAmount} bonus XP! ${reason ? `Reason: ${reason}` : ""}`,
      message_type: "encouragement",
    });

    showToast({
      type: "xp",
      title: `Awarded ${xpAmount} XP!`,
      description: reason || "Bonus XP from mentor",
    });

    router.push("/mentor");
    setLoading(false);
  }

  const presets = [50, 100, 150, 200];

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="max-w-md"
    >
      <Link
        href="/mentor"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <Gift className="h-6 w-6 text-xp-gold" />
        <h1 className="font-heading text-2xl font-bold">Award Bonus XP</h1>
      </div>

      <form onSubmit={handleAward} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            Amount
          </label>
          <div className="flex gap-2 mb-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAmount(String(p))}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors border ${
                  amount === String(p)
                    ? "border-xp-gold text-xp-gold bg-xp-gold/10"
                    : "border-border-subtle text-text-secondary"
                }`}
              >
                {p} XP
              </button>
            ))}
          </div>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            max="500"
          />
        </div>

        <Textarea
          label="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Great progress on the Figma project!"
        />

        <Button type="submit" loading={loading} className="w-full gap-2">
          <Gift className="h-4 w-4" />
          Award {amount} XP
        </Button>
      </form>
    </motion.div>
  );
}
