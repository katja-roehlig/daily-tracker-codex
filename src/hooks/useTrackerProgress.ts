import { useCallback } from "react";
import { daysOfWeek, todayKey } from "../utils/date";
import type { Progress, TrackerWithCategory } from "../types";
import { useTracker } from "../app/TrackerProvider";

export function useTrackerProgress() {
  const { data } = useTracker();

  return useCallback(
    (item: TrackerWithCategory, date = todayKey()): Progress | null => {
      if (!item.gamification.enabled) return null;
      const periodDays =
        item.gamification.period === "week" ? daysOfWeek(date) : [date];
      const count = (day: string) => data.entries[day]?.counts[item.id] ?? 0;
      const value =
        item.gamification.period === "week"
          ? periodDays.filter((day) => count(day) > 0).length
          : count(date);
      return {
        value,
        target: item.gamification.target,
        done: value >= item.gamification.target,
        label: item.gamification.period === "week" ? "diese Woche" : "heute",
      };
    },
    [data.entries],
  );
}
