import { demoCategories, moods } from "../data/defaults";
import type { TrackerData } from "../types";
import type { PersistedTrackerState } from "./trackerTypes";

export const TRACKER_STORAGE_KEY = "daily-tracker-state";
const LEGACY_STORAGE_KEY = "daily-tracker-v1";
export const TRACKER_STATE_VERSION = 1;

export const createInitialTrackerData = (): TrackerData => ({
  categories: demoCategories,
  moods,
  entries: {},
});

const isTrackerData = (value: unknown): value is TrackerData => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<TrackerData>;
  return (
    Array.isArray(candidate.categories) &&
    Array.isArray(candidate.moods) &&
    !!candidate.entries &&
    typeof candidate.entries === "object"
  );
};

export const readTrackerState = (): TrackerData => {
  if (typeof window === "undefined") return createInitialTrackerData();
  try {
    const raw =
      window.localStorage.getItem(TRACKER_STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return createInitialTrackerData();
    const persisted = JSON.parse(raw) as Partial<PersistedTrackerState>;
    if (persisted.version === undefined && isTrackerData(persisted)) {
      return persisted;
    }
    if (
      persisted.version !== TRACKER_STATE_VERSION ||
      !isTrackerData(persisted.data)
    ) {
      return createInitialTrackerData();
    }
    return persisted.data;
  } catch {
    return createInitialTrackerData();
  }
};

export const writeTrackerState = (data: TrackerData): void => {
  if (typeof window === "undefined") return;
  const persisted: PersistedTrackerState = {
    version: TRACKER_STATE_VERSION,
    data,
  };
  try {
    window.localStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(persisted));
  } catch {
    // Storage can be unavailable or full; the in-memory state remains usable.
  }
};
