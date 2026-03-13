import { SKILL_TRACKS, type SkillTrackId } from "./constants";

interface TrackActivity {
  trackId: string;
  lessonsCompleted: number;
  totalLessons: number;
  lastActive: string | null;
}

interface AvailableLesson {
  id: string;
  name: string;
  trackId: string;
  moduleId: string;
  estimatedMinutes: number;
  lessonType: string;
  sortOrder: number;
}

/**
 * Daily recommendation algorithm:
 * 1. Track balance — suggest underrepresented tracks
 * 2. Momentum — continue current active module
 * 3. Variety — mix lesson types
 * 4. Time budget — total ≤ 45 min
 */
export function generateRecommendations(
  trackActivity: TrackActivity[],
  availableLessons: AvailableLesson[],
  maxMinutes: number = 45
): AvailableLesson[] {
  if (availableLessons.length === 0) return [];

  const recommendations: AvailableLesson[] = [];
  let totalMinutes = 0;

  // Score each track by how underrepresented it is
  const trackScores = new Map<string, number>();
  const allTrackIds = Object.keys(SKILL_TRACKS);

  for (const trackId of allTrackIds) {
    const activity = trackActivity.find((t) => t.trackId === trackId);
    if (!activity || activity.totalLessons === 0) {
      trackScores.set(trackId, 100); // Highest priority for untouched tracks
    } else {
      const progress = activity.lessonsCompleted / activity.totalLessons;
      // Lower progress = higher score (more need)
      trackScores.set(trackId, Math.round((1 - progress) * 80));
    }

    // Boost recently active tracks (momentum)
    if (activity?.lastActive) {
      const daysSince = Math.floor(
        (Date.now() - new Date(activity.lastActive).getTime()) / 86400000
      );
      if (daysSince <= 1) {
        trackScores.set(
          trackId,
          (trackScores.get(trackId) || 0) + 20
        );
      }
    }
  }

  // Sort available lessons by track score, then by sort order
  const sorted = [...availableLessons].sort((a, b) => {
    const scoreA = trackScores.get(a.trackId) || 0;
    const scoreB = trackScores.get(b.trackId) || 0;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return a.sortOrder - b.sortOrder;
  });

  // Pick lessons within time budget, ensuring variety
  const usedTracks = new Set<string>();
  const usedTypes = new Set<string>();

  for (const lesson of sorted) {
    if (totalMinutes + lesson.estimatedMinutes > maxMinutes) continue;

    // Prefer variety: prioritize new tracks and lesson types
    const trackBonus = usedTracks.has(lesson.trackId) ? 0 : 1;
    const typeBonus = usedTypes.has(lesson.lessonType) ? 0 : 1;

    if (recommendations.length < 3 || trackBonus + typeBonus > 0) {
      recommendations.push(lesson);
      totalMinutes += lesson.estimatedMinutes;
      usedTracks.add(lesson.trackId);
      usedTypes.add(lesson.lessonType);
    }

    if (recommendations.length >= 5 || totalMinutes >= maxMinutes) break;
  }

  return recommendations;
}
