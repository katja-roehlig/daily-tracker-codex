import { useMemo, useState } from "react";
import { useTracker } from "../app/TrackerProvider";
import {
  addDays,
  fromKey,
  keyOf,
  monthDays,
  todayKey,
  weekStart,
} from "../utils/date";
import { tint } from "../utils/color";
import styles from "./EvaluationPage.module.css";
type Period = "week" | "month";
export function EvaluationPage() {
  const { data, items } = useTracker();
  const [period, setPeriod] = useState<Period>("week");
  const [anchor, setAnchor] = useState(todayKey());
  const days = useMemo(
    () =>
      period === "week"
        ? Array.from({ length: 7 }, (_, i) => addDays(weekStart(anchor), i))
        : monthDays(anchor)
            .filter((day) => day.current)
            .map((day) => day.key),
    [period, anchor],
  );
  const activeDays = days.filter(
    (day) => Object.keys(data.entries[day]?.counts ?? {}).length > 0,
  );
  const byTracker = items
    .map((item) => ({
      ...item,
      count: days.reduce(
        (total, day) => total + (data.entries[day]?.counts[item.id] ?? 0),
        0,
      ),
      days: days.filter((day) => (data.entries[day]?.counts[item.id] ?? 0) > 0),
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);
  const moodCounts = data.moods
    .map((mood) => ({
      mood,
      count: days.filter((day) => data.entries[day]?.mood === mood.id).length,
    }))
    .filter((value) => value.count > 0);
  const insight =
    byTracker[0] && moodCounts[0]
      ? `${byTracker[0].name} war dein häufigster Tracker. An ${moodCounts[0].count} Tagen warst du ${moodCounts[0].mood.label.toLowerCase()}.`
      : activeDays.length
        ? "Deine Einträge werden mit der Zeit Muster sichtbar machen."
        : "Erfasse ein paar Tage, um erste Muster zu entdecken.";
  const move = (amount: number) => {
    const date = fromKey(anchor);
    if (period === "week") date.setDate(date.getDate() + amount * 7);
    else date.setMonth(date.getMonth() + amount);
    setAnchor(keyOf(date));
  };
  return (
    <>
      <header className={styles.calendarHeader}>
        <div>
          <p className={styles.eyebrow}>Erkennen & verstehen</p>
          <h2>Auswertungen</h2>
          <p className={styles.intro}>
            Deine Aktivitäten und Stimmung im Zusammenhang.
          </p>
        </div>
        <div className={styles.switch}>
          <button
            className={period === "week" ? styles.selected : ""}
            onClick={() => setPeriod("week")}
          >
            Woche
          </button>
          <button
            className={period === "month" ? styles.selected : ""}
            onClick={() => setPeriod("month")}
          >
            Monat
          </button>
        </div>
      </header>
      <div className={styles.monthControl}>
        <button onClick={() => move(-1)}>←</button>
        <h3>
          {period === "week"
            ? `Woche ab ${fromKey(days[0]).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}`
            : fromKey(anchor).toLocaleDateString("de-DE", {
                month: "long",
                year: "numeric",
              })}
        </h3>
        <button onClick={() => move(1)}>→</button>
      </div>
      <section className={styles.insight}>
        <span>💡</span>
        <div>
          <p className={styles.eyebrow}>Dein Muster</p>
          <h3>{insight}</h3>
        </div>
      </section>
      <div className={styles.evalGrid}>
        <section className={styles.evalCard}>
          <h3>Aktivitäten</h3>
          <p>{activeDays.length} aktive Tage im gewählten Zeitraum</p>
          {byTracker.length ? (
            byTracker.map((item) => (
              <div className={styles.evalRow} key={item.id}>
                <span
                  className={styles.itemIcon}
                  style={{ background: tint(item.color) }}
                >
                  {item.icon}
                </span>
                <div>
                  <b style={{ color: item.color }}>{item.name}</b>
                  <small>
                    {item.count} Erfassungen an {item.days.length} Tagen
                  </small>
                  <div className={styles.progress}>
                    <i
                      style={{
                        width: `${(item.days.length / days.length) * 100}%`,
                        background: item.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.empty}>Noch keine Aktivitäten erfasst.</p>
          )}
        </section>
        <section className={styles.evalCard}>
          <h3>Stimmung</h3>
          <p>So hast du dich im Zeitraum gefühlt</p>
          {moodCounts.length ? (
            moodCounts.map(({ mood, count }) => (
              <div className={styles.moodResult} key={mood.id}>
                <span style={{ background: tint(mood.color) }}>
                  {mood.icon}
                </span>
                <b>{mood.label}</b>
                <small>
                  {count} {count === 1 ? "Tag" : "Tage"}
                </small>
              </div>
            ))
          ) : (
            <p className={styles.empty}>Noch keine Stimmung erfasst.</p>
          )}
        </section>
      </div>
      <section className={styles.evalCard}>
        <h3>Aktivität & Stimmung</h3>
        <p>Welche Stimmung wurde an Tagen mit deinen Trackern erfasst?</p>
        <div className={styles.relations}>
          {byTracker.map((item) => {
            const linked = data.moods
              .map((mood) => ({
                mood,
                count: item.days.filter(
                  (day) => data.entries[day]?.mood === mood.id,
                ).length,
              }))
              .filter((value) => value.count);
            return (
              <div key={item.id} className={styles.relation}>
                <b style={{ color: item.color }}>
                  {item.icon} {item.name}
                </b>
                {linked.length ? (
                  <span>
                    {linked.map(({ mood, count }) => (
                      <em
                        key={mood.id}
                        style={{ background: tint(mood.color) }}
                      >
                        {mood.icon} {mood.label} · {count}×
                      </em>
                    ))}
                  </span>
                ) : (
                  <small>
                    An diesen Tagen wurde noch keine Stimmung notiert.
                  </small>
                )}
              </div>
            );
          })}
          {!byTracker.length && (
            <p className={styles.empty}>
              Sobald du Aktivitäten und Stimmungen erfasst, erscheinen hier
              mögliche Zusammenhänge.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
