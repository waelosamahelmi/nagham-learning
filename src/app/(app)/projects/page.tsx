"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SKILL_TRACKS } from "@/lib/constants";
import { FolderKanban, Clock, CheckCircle, AlertCircle, Eye } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  skillTracks: string[];
  status: string;
  brief: string;
  xpReward: number;
  dueDate: string | null;
  submittedAt: string | null;
  mentorFeedback: string | null;
  createdAt: string;
}

const statusConfig = {
  assigned: { label: "Assigned", color: "bg-figma/15 text-figma", icon: AlertCircle },
  in_progress: { label: "In Progress", color: "bg-ai/15 text-ai", icon: Clock },
  submitted: { label: "Submitted", color: "bg-xp-gold/15 text-xp-gold", icon: Eye },
  reviewed: { label: "Reviewed", color: "bg-level-up/15 text-level-up", icon: CheckCircle },
};

export default function ProjectsPage() {
  const userId = useUserStore((s) => s.userId);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });

      setProjects(
        (data || []).map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description || "",
          skillTracks: p.skill_tracks || [],
          status: p.status,
          brief: p.brief || "",
          xpReward: p.xp_reward,
          dueDate: p.due_date,
          submittedAt: p.submitted_at,
          mentorFeedback: p.mentor_feedback,
          createdAt: p.created_at,
        }))
      );
      setLoading(false);
    }
    load();
  }, [userId]);

  if (loading) {
    return (
      <div className="max-w-4xl space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="max-w-4xl space-y-8"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="font-heading text-3xl font-bold">Projects</h1>
        <p className="mt-1 text-text-secondary">
          Build your portfolio with real-world projects
        </p>
      </motion.div>

      {projects.length === 0 ? (
        <motion.div variants={fadeInUp}>
          <Card>
            <CardContent className="py-12 text-center">
              <FolderKanban className="h-10 w-10 text-text-tertiary mx-auto mb-3" />
              <p className="text-text-secondary">No projects yet</p>
              <p className="text-sm text-text-tertiary mt-1">
                Your mentor will assign projects as you progress
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const status =
              statusConfig[project.status as keyof typeof statusConfig] ||
              statusConfig.assigned;
            const StatusIcon = status.icon;

            return (
              <motion.div key={project.id} variants={fadeInUp}>
                <Link href={`/projects/${project.id}`}>
                  <Card className="p-5 cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusIcon className="h-4 w-4 shrink-0" />
                          <h3 className="font-heading font-semibold truncate">
                            {project.title}
                          </h3>
                        </div>
                        <p className="text-sm text-text-secondary line-clamp-2">
                          {project.brief}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.skillTracks.map((trackId) => {
                            const track =
                              SKILL_TRACKS[
                                trackId as keyof typeof SKILL_TRACKS
                              ];
                            return track ? (
                              <Badge
                                key={trackId}
                                variant={
                                  trackId as any
                                }
                              >
                                {track.nameEn}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}
                        >
                          {status.label}
                        </div>
                        <p className="mt-2 text-xs text-xp-gold font-medium">
                          +{project.xpReward} XP
                        </p>
                        {project.dueDate && (
                          <p className="mt-1 text-xs text-text-tertiary">
                            Due {new Date(project.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
