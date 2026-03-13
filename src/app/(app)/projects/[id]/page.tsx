"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showToast } from "@/components/ui/toast";
import { SKILL_TRACKS } from "@/lib/constants";
import { ArrowLeft, ExternalLink, CheckCircle, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { userId, role } = useUserStore();
  const addXP = useUserStore((s) => s.addXP);

  const [project, setProject] = useState<any>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [mentorFeedback, setMentorFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (data) {
        setProject(data);
        setSubmissionUrl(data.submission_url || "");
        setSubmissionNotes(data.submission_notes || "");
        setMentorFeedback(data.mentor_feedback || "");
      }
      setLoading(false);
    }
    load();
  }, [projectId]);

  async function handleSubmit() {
    if (!submissionUrl.trim()) return;
    setSubmitting(true);
    const supabase = createClient();

    await supabase
      .from("projects")
      .update({
        status: "submitted",
        submission_url: submissionUrl.trim(),
        submission_notes: submissionNotes.trim(),
        submitted_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    setProject((prev: any) => ({ ...prev, status: "submitted" }));
    showToast({ type: "success", title: "Project submitted for review!" });
    setSubmitting(false);
  }

  async function handleReview() {
    if (!mentorFeedback.trim()) return;
    setSubmitting(true);
    const supabase = createClient();

    await supabase
      .from("projects")
      .update({
        status: "reviewed",
        mentor_feedback: mentorFeedback.trim(),
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    // Award XP
    if (project) {
      await supabase.from("xp_ledger").insert({
        user_id: project.user_id,
        amount: project.xp_reward,
        source: "project_submit",
        source_id: projectId,
      });
      await supabase.rpc("increment_xp", {
        p_user_id: project.user_id,
        p_amount: project.xp_reward,
      });

      // Send feedback message
      await supabase.from("mentor_messages").insert({
        from_user_id: userId,
        to_user_id: project.user_id,
        message: `Project "${project.title}" reviewed! ${mentorFeedback.trim()}`,
        message_type: "feedback",
      });
    }

    setProject((prev: any) => ({ ...prev, status: "reviewed" }));
    showToast({ type: "success", title: "Review submitted!" });
    setSubmitting(false);
  }

  if (loading) {
    return <div className="animate-pulse h-64 rounded-xl bg-bg-secondary" />;
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">Project not found</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="max-w-3xl space-y-6"
    >
      <Link
        href={role === "mentor" ? "/mentor" : "/projects"}
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-bold">{project.title}</h1>
        <div className="flex gap-2 mt-2">
          {(project.skill_tracks || []).map((trackId: string) => {
            const track =
              SKILL_TRACKS[trackId as keyof typeof SKILL_TRACKS];
            return track ? (
              <Badge key={trackId} variant={trackId as any}>
                {track.nameEn}
              </Badge>
            ) : null;
          })}
          <Badge variant="xp">+{project.xp_reward} XP</Badge>
        </div>
      </div>

      {/* Brief */}
      <Card>
        <CardHeader>
          <CardTitle>Project Brief</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{project.brief}</p>
        </CardContent>
      </Card>

      {/* Submission (learner view) */}
      {role === "learner" && project.status !== "reviewed" && (
        <Card>
          <CardHeader>
            <CardTitle>Your Submission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Submission URL (Figma, GitHub, etc.)"
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              placeholder="https://figma.com/..."
            />
            <Textarea
              label="Notes"
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              placeholder="Any notes about your submission..."
            />
            <Button
              onClick={handleSubmit}
              loading={submitting}
              disabled={!submissionUrl.trim() || project.status === "submitted"}
              className="w-full gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {project.status === "submitted" ? "Awaiting Review" : "Submit Project"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Submission details (for review) */}
      {project.submission_url && (
        <Card>
          <CardHeader>
            <CardTitle>Submission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href={project.submission_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-figma hover:underline text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              View Submission
            </a>
            {project.submission_notes && (
              <p className="text-sm text-text-secondary">
                {project.submission_notes}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Mentor Review */}
      {role === "mentor" && project.status === "submitted" && (
        <Card>
          <CardHeader>
            <CardTitle>Your Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={mentorFeedback}
              onChange={(e) => setMentorFeedback(e.target.value)}
              placeholder="Provide feedback on this project..."
            />
            <Button
              onClick={handleReview}
              loading={submitting}
              disabled={!mentorFeedback.trim()}
              variant="success"
              className="w-full gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Submit Review & Award {project.xp_reward} XP
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Existing Feedback */}
      {project.mentor_feedback && (
        <Card>
          <CardHeader>
            <CardTitle>Mentor Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">
              {project.mentor_feedback}
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
