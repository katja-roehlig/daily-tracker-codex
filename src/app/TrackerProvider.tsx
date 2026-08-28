import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Category,
  DayEntry,
  Mood,
  Tracker,
  TrackerWithCategory,
} from "../types";
import type { TrackerContextValue } from "../state/trackerTypes";
import { readTrackerState, writeTrackerState } from "../state/trackerStorage";

const TrackerContext = createContext<TrackerContextValue | null>(null);

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(readTrackerState);

  useEffect(() => {
    writeTrackerState(data);
  }, [data]);

  const items = useMemo<TrackerWithCategory[]>(
    () =>
      data.categories.flatMap((category) =>
        category.items.map((item) => ({
          ...item,
          color: item.color ?? category.color,
          category,
        })),
      ),
    [data.categories],
  );

  const getEntry = (date: string): DayEntry =>
    data.entries[date] ?? { counts: {}, mood: null };

  const updateEntry = (date: string, changes: Partial<DayEntry>) =>
    setData((prev) => ({
      ...prev,
      entries: {
        ...prev.entries,
        [date]: {
          ...(prev.entries[date] ?? { counts: {}, mood: null }),
          ...changes,
        },
      },
    }));

  const increment = (date: string, id: string) => {
    const entry = getEntry(date);
    updateEntry(date, {
      counts: { ...entry.counts, [id]: (entry.counts[id] ?? 0) + 1 },
    });
  };

  const decrement = (date: string, id: string) => {
    const entry = getEntry(date);
    updateEntry(date, {
      counts: {
        ...entry.counts,
        [id]: Math.max(0, (entry.counts[id] ?? 0) - 1),
      },
    });
  };

  const setCount = (date: string, id: string, value: number) => {
    const entry = getEntry(date);
    updateEntry(date, {
      counts: { ...entry.counts, [id]: Math.max(0, value) },
    });
  };

  const setNote = (date: string, note: string) => {
    updateEntry(date, { note });
  };

  const toggleMood = (date: string, id: string) => {
    const entry = getEntry(date);
    updateEntry(date, { mood: entry.mood === id ? null : id });
  };

  const createCategory = (newCategory: Category) => {
    setData((prev) => {
      const alreadyExists = prev.categories.some(
        (item) => item.id === newCategory.id,
      );
      if (alreadyExists) {
        return prev;
      }
      return {
        ...prev,
        categories: [...prev.categories, newCategory],
      };
    });
  };

  const updateCategory = (updatedCategory: Category) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((item) =>
        item.id === updatedCategory.id ? updatedCategory : item,
      ),
    }));
  };

  const deleteCategory = (deleteId: string) =>
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter(
        (category) => category.id !== deleteId,
      ),
    }));

  const createTracker = (categoryId: string, newTracker: Tracker) => {
    setData((prev) => {
      const targetCategory = prev.categories.find(
        (cat) => cat.id === categoryId,
      );
      if (!targetCategory) return prev;
      const alreadyExists = targetCategory.items
        .map((item) => item.id)
        .includes(newTracker.id);
      if (alreadyExists) {
        return prev;
      }
      return {
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId
            ? { ...cat, items: [...cat.items, newTracker] } //add tracker
            : cat,
        ), //continue
      };
    });
  };

  const updateTracker = (categoryId: string, updatedTracker: Tracker) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === updatedTracker.id ? updatedTracker : item,
              ),
            }
          : cat,
      ),
    }));
  };

  const deleteTracker = (id: string) =>
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((category) => ({
        ...category,
        items: category.items.filter((item) => item.id !== id),
      })),
    }));

  //   const saveMood = (mood: Mood) =>
  //     setData((prev) => ({
  //       ...prev,
  //       moods: prev.moods.some((value) => value.id === mood.id)
  //         ? prev.moods.map((value) => (value.id === mood.id ? mood : value))
  //         : [...prev.moods, mood],
  //     }));

  const createMood = (newMood: Mood) => {
    setData((prev) => {
      const alreadyExists = prev.moods.some((mood) => mood.id === newMood.id);
      if (alreadyExists) {
        return prev;
      }
      return {
        ...prev,
        moods: [...prev.moods, newMood],
      };
    });
  };

  const deleteMood = (id: string) =>
    setData((prev) => ({
      ...prev,
      moods: prev.moods.filter((mood) => mood.id !== id),
    }));

  const infoContainer = useMemo<TrackerContextValue>(
    () => ({
      data,
      items,
      getEntry,
      increment,
      decrement,
      setCount,
      setNote,
      toggleMood,
      createCategory,
      updateCategory,
      deleteCategory,
      createTracker,
      updateTracker,
      deleteTracker,
      createMood,
      deleteMood,
    }),
    [data, items],
  );

  return (
    <TrackerContext.Provider value={infoContainer}>
      {children}
    </TrackerContext.Provider>
  );
}

export function useTracker(): TrackerContextValue {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error("useTracker must be used within a TrackerProvider");
  }
  return context;
}
