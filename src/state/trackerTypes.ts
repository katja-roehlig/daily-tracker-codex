import type {
  Category,
  DayEntry,
  Mood,
  Tracker,
  TrackerData,
  TrackerWithCategory,
} from "../types";

export type TrackerId = string;
export type CategoryId = string;
export type MoodId = string;
export type DateKey = string;

export interface PersistedTrackerState {
  version: number;
  data: TrackerData;
}

export interface TrackerContextValue {
  data: TrackerData;
  items: TrackerWithCategory[];
  getEntry: (date: DateKey) => DayEntry;
  increment: (date: DateKey, id: TrackerId) => void;
  setCount: (date: DateKey, id: TrackerId, value: number) => void;
  toggleMood: (date: DateKey, id: MoodId) => void;
  createCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: CategoryId) => void;
  createTracker: (categoryId: CategoryId, tracker: Tracker) => void;
  updateTracker: (categoryId: CategoryId, tracker: Tracker) => void;
  deleteTracker: (id: TrackerId) => void;
  createMood: (mood: Mood) => void;
  deleteMood: (id: MoodId) => void;
}
