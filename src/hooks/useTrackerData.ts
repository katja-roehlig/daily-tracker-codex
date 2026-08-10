import { useEffect, useMemo, useState } from 'react';
import { demoCategories, moods } from '../data/defaults';
import type { DayEntry, Progress, TrackerData, TrackerWithCategory } from '../types';
import { daysOfWeek, todayKey } from '../utils/date';

const storageKey = 'daily-tracker-v1';
const initial: TrackerData = { categories: demoCategories, moods, entries: {} };
const readData = (): TrackerData => { try { return JSON.parse(localStorage.getItem(storageKey) ?? '') as TrackerData || initial; } catch { return initial; } };

export function useTrackerData() {
  const [data, setData] = useState<TrackerData>(readData);
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(data)), [data]);
  const items = useMemo<TrackerWithCategory[]>(() => data.categories.flatMap(category => category.items.map(item => ({ ...item, category }))), [data.categories]);
  const getEntry = (date: string): DayEntry => data.entries[date] ?? { counts: {}, mood: null };
  const updateEntry = (date: string, changes: Partial<DayEntry>) => setData(current => ({ ...current, entries: { ...current.entries, [date]: { ...getEntry(date), ...changes } } }));
  const increment = (date: string, id: string) => { const entry = getEntry(date); updateEntry(date, { counts: { ...entry.counts, [id]: (entry.counts[id] ?? 0) + 1 } }); };
  const toggleMood = (date: string, id: string) => { const entry = getEntry(date); updateEntry(date, { mood: entry.mood === id ? null : id }); };
  const progress = (item: TrackerWithCategory, date = todayKey()): Progress | null => {
    if (!item.gamification.enabled) return null;
    const periodDays = item.gamification.period === 'week' ? daysOfWeek(date) : [date];
    const count = (day: string) => data.entries[day]?.counts[item.id] ?? 0;
    const value = item.gamification.period === 'week' ? periodDays.filter(day => count(day) > 0).length : count(date);
    return { value, target: item.gamification.target, done: value >= item.gamification.target, label: item.gamification.period === 'week' ? 'Tage diese Woche' : 'heute' };
  };
  return { data, setData, items, getEntry, increment, toggleMood, progress };
}
