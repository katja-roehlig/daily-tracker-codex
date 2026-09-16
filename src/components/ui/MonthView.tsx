import type { CSSProperties } from "react";
import styles from "./MonthView.module.css";

interface MonthViewProps {
  days: Array<{ key: string; current: boolean; day: number }>;
  detailDay: string;
  setDetailDay: (key: string) => void;
  dayMood: (key: string) => any;
  dayEvents: (key: string) => any[];
}

export function MonthView({
  days,
  detailDay,
  setDetailDay,
  dayMood,
  dayEvents,
}: MonthViewProps) {
  return (
    <>
      {/* Wochentags-Leiste oben drüber */}
      <div className={styles.weekdays}>
        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
          <span className={styles.weekday} key={d}>
            {d}
          </span>
        ))}
      </div>

      {/* Das 7-Spalten-Gitter */}
      <div className={styles.calendar}>
        {days.map((day) => {
          const mood = dayMood(day.key);
          const events = dayEvents(day.key);
          const isSelected = day.key === detailDay;

          return (
            <button
              key={day.key}
              onClick={() => setDetailDay(day.key)}
              className={`${styles.monthDay} ${!day.current ? styles.muted : ""} ${isSelected ? styles.daySelected : ""}`}
              style={
                mood
                  ? ({ "--local-mood-color": mood.color } as CSSProperties)
                  : undefined
              }
            >
              <div className={styles.dayTop}>
                <span className={styles.dayNumber}>{day.day}</span>
                {mood && <span className={styles.dayMood}>{mood.icon}</span>}
              </div>

              {/* Die Tracker-Icons */}
              <div className={styles.calendarEvents}>
                {events.map((item) => (
                  <span
                    key={item.id}
                    className={styles.calendarEvent}
                    style={{ "--item-color": item.color } as CSSProperties}
                  >
                    <span className={styles.calendarEventIcon}>
                      {item.icon}
                    </span>
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
