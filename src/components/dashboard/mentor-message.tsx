"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { MessageCircle } from "lucide-react";

export interface MentorMessageData {
  id: string;
  message: string;
  messageType: string;
  createdAt: string;
}

interface MentorMessageProps {
  latestMessage?: MentorMessageData | null;
}

export function MentorMessage({ latestMessage }: MentorMessageProps) {
  if (!latestMessage) return null;

  const date = new Date(latestMessage.createdAt);
  const timeAgo = getTimeAgo(date);

  return (
    <motion.section variants={fadeInUp}>
      <h2 className="font-heading text-xl font-semibold">
        Message from Wael
      </h2>
      <div className="mt-4 rounded-xl border border-figma/20 bg-figma/5 p-4">
        <div className="flex gap-3">
          <MessageCircle className="h-5 w-5 text-figma shrink-0 mt-0.5" />
          <div>
            <p className="text-sm">{latestMessage.message}</p>
            <p className="mt-2 text-xs text-text-tertiary">{timeAgo}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}
