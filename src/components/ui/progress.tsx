"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  barClassName?: string;
  color?: string;
  showLabel?: boolean;
  size?: "sm" | "default" | "lg";
}

export function ProgressBar({
  value,
  className,
  barClassName,
  color,
  showLabel = false,
  size = "default",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const heights = { sm: "h-1", default: "h-2", lg: "h-3" };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "w-full rounded-full bg-bg-tertiary overflow-hidden",
          heights[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            !color && "bg-gradient-to-r from-figma to-ai",
            barClassName
          )}
          style={{
            width: `${clamped}%`,
            ...(color ? { backgroundColor: color } : {}),
          }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-right text-xs text-text-tertiary">
          {Math.round(clamped)}%
        </p>
      )}
    </div>
  );
}

interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
  children?: React.ReactNode;
}

export function CircularProgress({
  value,
  size = 80,
  strokeWidth = 6,
  color = "var(--color-figma)",
  className,
  children,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className="stroke-bg-tertiary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
