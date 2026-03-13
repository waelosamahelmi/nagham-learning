"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { createClient } from "@/lib/supabase/client";
import { SKILL_TRACKS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Sparkles, Filter } from "lucide-react";

interface InspirationItem {
  id: string;
  title: string;
  url: string;
  imageUrl: string | null;
  source: string;
  tags: string[];
  skillTracks: string[];
}

export default function InspirationPage() {
  const [items, setItems] = useState<InspirationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      let query = supabase
        .from("inspiration_items")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      const { data } = await query;
      setItems(
        (data || []).map((item) => ({
          id: item.id,
          title: item.title || "",
          url: item.url,
          imageUrl: item.image_url,
          source: item.source || "",
          tags: item.tags || [],
          skillTracks: item.skill_tracks || [],
        }))
      );
      setLoading(false);
    }
    load();
  }, []);

  const filteredItems =
    filter === "all"
      ? items
      : items.filter((item) => item.skillTracks.includes(filter));

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="max-w-6xl space-y-6"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="font-heading text-3xl font-bold">Inspiration</h1>
        <p className="mt-1 text-text-secondary">
          Feed your eyes — curated design inspiration
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeInUp} className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors border ${
            filter === "all"
              ? "border-figma text-figma bg-figma/10"
              : "border-border-subtle text-text-secondary"
          }`}
        >
          <Filter className="inline h-3 w-3 mr-1" />
          All
        </button>
        {Object.entries(SKILL_TRACKS).map(([id, track]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors border ${
              filter === id
                ? "bg-white/10"
                : "border-border-subtle text-text-secondary"
            }`}
            style={
              filter === id
                ? { borderColor: track.color, color: track.color }
                : {}
            }
          >
            {track.nameEn}
          </button>
        ))}
      </motion.div>

      {/* Masonry Grid */}
      {loading ? (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton
              key={i}
              className="mb-4 rounded-xl"
              style={{ height: `${150 + Math.random() * 150}px` }}
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <motion.div variants={fadeInUp} className="text-center py-20">
          <Sparkles className="h-10 w-10 text-text-tertiary mx-auto mb-3" />
          <p className="text-text-secondary">
            {filter === "all"
              ? "No inspiration items yet. Your mentor will curate content soon!"
              : "No items for this category yet."}
          </p>
        </motion.div>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
              className="mb-4 break-inside-avoid"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group rounded-xl border border-border-subtle bg-bg-secondary overflow-hidden transition-all hover:border-border-active hover:shadow-lg"
              >
                {item.imageUrl && (
                  <div className="aspect-[4/3] overflow-hidden bg-bg-tertiary">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading text-sm font-semibold line-clamp-2">
                      {item.title || "Untitled"}
                    </h3>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-text-tertiary group-hover:text-text-primary" />
                  </div>
                  {item.source && (
                    <p className="mt-1 text-xs text-text-tertiary capitalize">
                      {item.source}
                    </p>
                  )}
                  {item.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-bg-tertiary px-2 py-0.5 text-[10px] text-text-tertiary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
