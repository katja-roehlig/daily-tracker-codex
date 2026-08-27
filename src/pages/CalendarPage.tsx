import { useState } from "react";
import { useTracker } from "../app/TrackerProvider";
import {
  daysOfWeek,
  formatDate,
  fromKey,
  keyOf,
  monthDays,
} from "../utils/date";
import { tint } from "../utils/color";
import styles from "./CalendarPage.module.css";
type View = "week" | "month";
export function CalendarPage({
  selected,
  onOpenDay,
}: {
  selected: string;
  onOpenDay: (day: string) => void;
}) {
  const { data, items } = useTracker();
  const [month, setMonth] = useState(selected);
  const [view, setView] = useState<View>("month");
  const days =
    view === "month"
      ? monthDays(month)
      : daysOfWeek(month).map((key) => ({
          key,
          current: true,
          day: fromKey(key).getDate(),
        }));
  const move = (amount: number) => {
    const date = fromKey(month);
    date.setMonth(date.getMonth() + amount);
    setMonth(keyOf(date));
  };
  const mood = (id: string | null | undefined) =>
    data.moods.find((value) => value.id === id);
  const selectedEntry = data.entries[selected] ?? { counts: {}, mood: null };
  const selectedMood = mood(selectedEntry.mood);
  const recorded = items.filter((item) => selectedEntry.counts[item.id]);
  return (
    <>
      <header className={styles.calendarHeader}>
        <div>
          <p className={styles.eyebrow}>Rückblick</p>
          <h2>Kalender</h2>
        </div>
        <div className={styles.switch}>
          <button
            className={view === "week" ? styles.selected : ""}
            onClick={() => setView("week")}
          >
            Woche
          </button>
          <button
            className={view === "month" ? styles.selected : ""}
            onClick={() => setView("month")}
          >
            Monat
          </button>
        </div>
      </header>
      <div className={styles.monthControl}>
        <button onClick={() => move(-1)}>←</button>
        <h3>
          {fromKey(month).toLocaleDateString("de-DE", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <button onClick={() => move(1)}>→</button>
      </div>
      {view === "month" && (
        <div className={styles.weekdays}>
          {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      )}
      <div className={view === "month" ? styles.calendar : styles.weekCalendar}>
        {days.map((day) => {
          const entry = data.entries[day.key],
            dayMood = mood(entry?.mood),
            events = items.filter((item) => entry?.counts[item.id]);
          return (
            <button
              key={day.key}
              onClick={() => onOpenDay(day.key)}
              className={`${styles.day} ${!day.current ? styles.muted : ""} ${day.key === selected ? styles.daySelected : ""}`}
              style={
                dayMood ? { background: tint(dayMood.color, 0.76) } : undefined
              }
            >
              <b>{day.day}</b>
              {dayMood && (
                <span
                  className={styles.dayMood}
                  style={{ background: dayMood.color }}
                >
                  {dayMood.icon}
                </span>
              )}
              <div className={styles.calendarEvents}>
                {events.slice(0, 8).map((item) => (
                  <span
                    key={item.id}
                    style={{ background: tint(item.color), color: item.color }}
                  >
                    {item.icon}
                    <small> {item.name}</small>
                    {(entry?.counts[item.id] ?? 0) > 1 && (
                      <b>×{entry?.counts[item.id]}</b>
                    )}
                  </span>
                ))}
              </div>
              <div
                className={styles.calendarDots}
                aria-label={`${events.length} Aktivitäten`}
              >
                {events.slice(0, 4).map((item) => (
                  <i key={item.id} style={{ background: item.color }} />
                ))}
              </div>
              {events.length > 4 && (
                <small className={styles.moreEvents}>
                  +{events.length - 4} weitere
                </small>
              )}
            </button>
          );
        })}
      </div>
      <section className={styles.detail}>
        <div>
          <p className={styles.eyebrow}>Details</p>
          <h3>{formatDate(selected)}</h3>
        </div>
        {selectedMood && (
          <div
            className={styles.detailMood}
            style={{ background: tint(selectedMood.color) }}
          >
            {selectedMood.icon} {selectedMood.label}
          </div>
        )}
        <div className={styles.eventList}>
          {recorded.length ? (
            recorded.map((item) => (
              <span
                key={item.id}
                style={{ background: tint(item.color), color: item.color }}
              >
                {item.icon} {item.name} <b>× {selectedEntry.counts[item.id]}</b>
              </span>
            ))
          ) : (
            <p>Noch keine Einträge an diesem Tag.</p>
          )}
        </div>
      </section>
    </>
  );
}
