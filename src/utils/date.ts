export const pad = (n: number) => String(n).padStart(2, "0");
export const keyOf = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
export const fromKey = (key: string) => new Date(`${key}T12:00:00`);
export const todayKey = () => keyOf(new Date());
export const formatDate = (key: string) =>
  fromKey(key).toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
export const addDays = (key: string, amount: number) => {
  const d = fromKey(key);
  d.setDate(d.getDate() + amount);
  return keyOf(d);
};
export const weekStart = (key: string) => {
  const d = fromKey(key);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return keyOf(d);
};
export const daysOfWeek = (key: string) =>
  Array.from({ length: 7 }, (_, i) => addDays(weekStart(key), i));
export const monthDays = (key: string) => {
  const d = fromKey(key),
    y = d.getFullYear(),
    m = d.getMonth(),
    first = new Date(y, m, 1),
    offset = (first.getDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, i) => {
    const x = new Date(y, m, i - offset + 1);
    return { key: keyOf(x), current: x.getMonth() === m, day: x.getDate() };
  });
};
