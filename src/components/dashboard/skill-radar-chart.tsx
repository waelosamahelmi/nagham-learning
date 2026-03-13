"use client";

import { SKILL_TRACKS } from "@/lib/constants";

interface SkillRadarChartProps {
  trackProgress: Record<string, { completed: number; total: number }>;
}

export function SkillRadarChart({ trackProgress }: SkillRadarChartProps) {
  const tracks = Object.entries(SKILL_TRACKS);
  const n = tracks.length;
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 120;

  const angleStep = (2 * Math.PI) / n;

  // Background rings
  const rings = [0.25, 0.5, 0.75, 1];

  // Data points
  const points = tracks.map(([id, track], i) => {
    const progress = trackProgress[id];
    const value =
      progress && progress.total > 0
        ? progress.completed / progress.total
        : 0;
    const angle = angleStep * i - Math.PI / 2;
    const r = maxRadius * value;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
      labelX: centerX + (maxRadius + 20) * Math.cos(angle),
      labelY: centerY + (maxRadius + 20) * Math.sin(angle),
      name: track.nameEn,
      color: track.color,
      value: Math.round(value * 100),
    };
  });

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[300px] mx-auto">
      {/* Background rings */}
      {rings.map((r) => {
        const ringPoints = tracks
          .map((_, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const radius = maxRadius * r;
            return `${centerX + radius * Math.cos(angle)},${
              centerY + radius * Math.sin(angle)
            }`;
          })
          .join(" ");
        return (
          <polygon
            key={r}
            points={ringPoints}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {tracks.map(([, track], i) => {
        const angle = angleStep * i - Math.PI / 2;
        return (
          <line
            key={i}
            x1={centerX}
            y1={centerY}
            x2={centerX + maxRadius * Math.cos(angle)}
            y2={centerY + maxRadius * Math.sin(angle)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill="rgba(162,89,255,0.15)"
        stroke="rgba(162,89,255,0.6)"
        strokeWidth="2"
      />

      {/* Data points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill={p.color}
          stroke="var(--color-bg-primary)"
          strokeWidth="2"
        />
      ))}

      {/* Labels */}
      {points.map((p, i) => (
        <text
          key={i}
          x={p.labelX}
          y={p.labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fill="var(--color-text-secondary)"
          className="font-body"
        >
          {p.name.split(" ")[0]}
        </text>
      ))}
    </svg>
  );
}
