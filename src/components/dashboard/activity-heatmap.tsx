"use client";

import { cn } from "@/lib/utils";

interface ActivityData {
  activity_date: string;
  minutes_spent: number;
  lessons_completed: number;
  xp_earned: number;
}

interface ActivityHeatmapProps {
  data: ActivityData[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  // Generate last 90 days
  const days: Array<{ date: string; level: number; tooltip: string }> = [];
  const dataMap = new Map(data.map((d) => [d.activity_date, d]));

  for (let i = 89; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const activity = dataMap.get(dateStr);

    let level = 0;
    let tooltip = `${dateStr}: No activity`;

    if (activity) {
      if (activity.minutes_spent >= 120) level = 4;
      else if (activity.minutes_spent >= 60) level = 3;
      else if (activity.minutes_spent >= 30) level = 2;
      else if (activity.minutes_spent > 0) level = 1;

      tooltip = `${dateStr}: ${activity.minutes_spent}m, ${activity.lessons_completed} lessons, ${activity.xp_earned} XP`;
    }

    days.push({ date: dateStr, level, tooltip });
  }

  const colors = [
    "bg-bg-tertiary",
    "bg-figma/20",
    "bg-figma/40",
    "bg-figma/60",
    "bg-figma/80",
  ];

  // Group by weeks
  const weeks: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div>
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={day.tooltip}
                className={cn(
                  "h-3 w-3 rounded-sm transition-colors cursor-default",
                  colors[day.level]
                )}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs text-text-tertiary">
        <span>Less</span>
        {colors.map((color, i) => (
          <div
            key={i}
            className={cn("h-3 w-3 rounded-sm", color)}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
