"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/ui/toast";
import { ArrowLeft, Send, MessageCircle } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  message: string;
  messageType: string;
  createdAt: string;
  fromMe: boolean;
}

export default function MentorMessagesPage() {
  const userId = useUserStore((s) => s.userId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [messageType, setMessageType] = useState<string>("encouragement");
  const [loading, setLoading] = useState(false);
  const [learnerId, setLearnerId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const { data: learner } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "learner")
        .single();

      if (!learner) return;
      setLearnerId(learner.id);

      const { data: msgs } = await supabase
        .from("mentor_messages")
        .select("*")
        .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
        .order("created_at", { ascending: false })
        .limit(50);

      setMessages(
        (msgs || []).map((m) => ({
          id: m.id,
          message: m.message,
          messageType: m.message_type,
          createdAt: m.created_at,
          fromMe: m.from_user_id === userId,
        }))
      );
    }
    if (userId) load();
  }, [userId]);

  async function handleSend() {
    if (!newMessage.trim() || !learnerId || !userId) return;
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from("mentor_messages").insert({
      from_user_id: userId,
      to_user_id: learnerId,
      message: newMessage.trim(),
      message_type: messageType,
    });

    if (error) {
      showToast({ type: "error", title: "Failed to send message" });
    } else {
      setMessages((prev) => [
        {
          id: Date.now().toString(),
          message: newMessage.trim(),
          messageType,
          createdAt: new Date().toISOString(),
          fromMe: true,
        },
        ...prev,
      ]);
      setNewMessage("");
      showToast({ type: "success", title: "Message sent!" });
    }
    setLoading(false);
  }

  const types = [
    { value: "encouragement", label: "Encouragement" },
    { value: "feedback", label: "Feedback" },
    { value: "milestone", label: "Milestone" },
  ];

  return (
    <motion.div
      variants={staggerContainer}
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

      <motion.div variants={fadeInUp}>
        <h1 className="font-heading text-2xl font-bold">Messages</h1>
        <p className="mt-1 text-text-secondary">
          Send encouragement and feedback to Nagham
        </p>
      </motion.div>

      {/* Compose */}
      <motion.div
        variants={fadeInUp}
        className="mt-6 rounded-xl border border-border-subtle bg-bg-secondary p-5"
      >
        <div className="flex gap-2 mb-3">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => setMessageType(t.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                messageType === t.value
                  ? "border-figma text-figma bg-figma/10"
                  : "border-border-subtle text-text-secondary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a message..."
          className="min-h-[80px]"
        />
        <div className="mt-3 flex justify-end">
          <Button
            onClick={handleSend}
            loading={loading}
            disabled={!newMessage.trim()}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>
      </motion.div>

      {/* Message History */}
      <motion.div variants={fadeInUp} className="mt-6 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-8 w-8 text-text-tertiary mx-auto mb-2" />
            <p className="text-text-secondary text-sm">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="rounded-xl border border-border-subtle bg-bg-secondary p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-tertiary capitalize">
                  {msg.messageType}
                </span>
                <span className="text-xs text-text-tertiary">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm">{msg.message}</p>
            </div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
