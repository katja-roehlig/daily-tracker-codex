import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useTracker } from "../app/TrackerProvider";
import {
  daysOfWeek,
  formatDate,
  fromKey,
  keyOf,
  monthDays,
} from "../utils/date";

import { MonthView } from "../components/ui/MonthView";
import { WeekView } from "../components/ui/WeekView";
import styles from "./CalendarPage.module.css";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";

type View = "week" | "month";

export function CalendarPage({ selected }: { selected: string }) {
  const { data, items } = useTracker();
  const [month, setMonth] = useState(selected);
  const [view, setView] = useState<View>("month");
  const [detailDay, setDetailDay] = useState(selected);
  const [detailDays, setDetailDays] = useState<string[]>([]);

  useEffect(() => {
    setDetailDay(selected);
  }, [selected]);

  useEffect(() => {
    if (view === "week") {
      setDetailDay(selected);
      setDetailDays([selected]);
    }
  }, [view, selected]);

  // Berechnet die Tage für Monat oder Woche
  const days =
    view === "month"
      ? (() => {
          const list = monthDays(month);
          const lastCurrent = list.reduce(
            (last, d, i) => (d.current ? i : last),
            -1,
          );
          if (lastCurrent < 0) return list;
          return list.slice(0, lastCurrent + (6 - (lastCurrent % 7)) + 1);
        })()
      : daysOfWeek(month).map((key) => ({
          key,
          current: true,
          day: fromKey(key).getDate(),
        }));

  const move = (amount: number) => {
    const date = fromKey(month);
    if (view === "month") date.setMonth(date.getMonth() + amount);
    else date.setDate(date.getDate() + amount * 7);
    setMonth(keyOf(date));
  };

  const getMood = (dayKey: string) => {
    const entry = data.entries[dayKey];
    return data.moods.find((m) => m.id === entry?.mood);
  };

  const getEvents = (dayKey: string) => {
    const entry = data.entries[dayKey];
    return items.filter((item) => entry?.counts[item.id]);
  };

  // Holt sich den ersten und den letzten Tag aus unserem fertigen days-Array
  const firstDayKey = days?.[0]?.key;
  const lastDayKey = days?.[days.length - 1]?.key;

  const timePeriodTitle =
    view === "month"
      ? fromKey(month).toLocaleDateString("de-DE", {
          month: "long",
          year: "numeric",
        })
      : firstDayKey && lastDayKey
        ? (() => {
            const startDate = fromKey(firstDayKey);
            const endDate = fromKey(lastDayKey);

            if (startDate.getMonth() === endDate.getMonth()) {
              return `${startDate.getDate()}. – ${endDate.getDate()}. ${endDate.toLocaleDateString("de-DE", { month: "short", year: "numeric" })}`;
            }

            // Wenn die Woche zwei Monate schneidet (z.B. "31. Aug. – 6. Sept. 2026")
            const startMonth = startDate.toLocaleDateString("de-DE", {
              month: "short",
            });
            const endMonth = endDate.toLocaleDateString("de-DE", {
              month: "short",
            });
            return `${startDate.getDate()}. ${startMonth} – ${endDate.getDate()}. ${endMonth} ${endDate.getFullYear()}`;
          })()
        : "";

  // Diese Details werden in der Woche ins Akkordeon geschoben, im Monat nach unten
  const renderDetailsContent = (dayKey: string) => {
    const entry = data.entries[dayKey] ?? { counts: {}, mood: null, note: "" };
    const mood = getMood(dayKey);
    const recorded = getEvents(dayKey);

    return (
      <div className={styles.detailInnerContent}>
        {mood && (
          <div
            className={styles.detailMood}
            style={{ "--local-mood-color": mood.color } as CSSProperties}
          >
            {mood.icon} {mood.label}
          </div>
        )}
        <div className={styles.eventList}>
          {recorded.length ? (
            recorded.map((item) => (
              <span
                key={item.id}
                className={styles.eventListItem}
                style={{ "--item-color": item.color } as CSSProperties}
              >
                {item.icon} {item.name}{" "}
                <b className={styles.eventListCount}>
                  × {entry.counts[item.id]}
                </b>
              </span>
            ))
          ) : (
            <p className={styles.eventListEmpty}>
              Noch keine Einträge an diesem Tag.
            </p>
          )}
        </div>
        {entry.note && <p className={styles.dayNote}>{entry.note}</p>}
      </div>
    );
  };

  return (
    <div className={styles.calendarContainer}>
      <header className={styles.calendarHeader}>
        <div>
          <p className={styles.eyebrow}>Rückblick</p>
          <h2 className={styles.calendarTitle}>Kalender</h2>
        </div>
        <div className={styles.switch}>
          <button
            className={`${styles.switchButton} ${view === "week" ? styles.selected : ""}`}
            onClick={() => setView("week")}
          >
            Woche
          </button>
          <button
            className={`${styles.switchButton} ${view === "month" ? styles.selected : ""}`}
            onClick={() => setView("month")}
          >
            Monat
          </button>
        </div>
      </header>

      {/* BLÄTTER-STEUERUNG */}
      <div className={styles.monthControl}>
        <button className={styles.monthButton} onClick={() => move(-1)}>
          <ArrowLeftIcon size={22} />
        </button>
        <h3 className={styles.monthTitle}>{timePeriodTitle}</h3>
        <button className={styles.monthButton} onClick={() => move(1)}>
          <ArrowRightIcon size={22} />
        </button>
      </div>

      {/* DIE WEICHE FÜR DIE ANSICHTEN */}
      {view === "month" ? (
        <MonthView
          days={days}
          detailDay={detailDay}
          setDetailDay={setDetailDay}
          dayMood={getMood}
          dayEvents={getEvents}
        />
      ) : (
        <WeekView
          days={days}
          detailDays={detailDays}
          setDetailDays={setDetailDays}
          renderDetailsContent={renderDetailsContent}
          dayMood={getMood}
        />
      )}

      {/* Details Block (Nur noch im Monat sichtbar) */}
      {view === "month" && (
        <section className={styles.detail}>
          <div>
            <p className={styles.eyebrow}>Details</p>
            <h3 className={styles.detailTitle}>{formatDate(detailDay)}</h3>
          </div>
          {renderDetailsContent(detailDay)}
        </section>
      )}
    </div>
  );
}
