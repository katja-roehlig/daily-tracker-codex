export type Period = "day" | "week";
export interface Goal {
  enabled: boolean;
  target: number;
  period: Period;
}
export interface Tracker {
  id: string;
  name: string;
  icon: string;
  color: string;
  gamification: Goal;
}
export interface Category {
  id: string;
  name: string;
  color: string;
  items: Tracker[];
}
export interface Mood {
  id: string;
  label: string;
  icon: string;
  color: string;
}
export interface DayEntry {
  counts: Record<string, number>;
  mood: string | null;
  note?: string;
}
export interface TrackerData {
  categories: Category[];
  moods: Mood[];
  entries: Record<string, DayEntry>;
}
export interface TrackerWithCategory extends Tracker {
  category: Category;
}
export interface Progress {
  value: number;
  target: number;
  done: boolean;
  label: string;
}
