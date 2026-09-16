import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import { fromKey } from "../../utils/date";
import styles from "./WeekView.module.css";

interface WeekViewProps {
  days: Array<{ key: string }>;
  detailDay: string;
  setDetailDay: (key: string) => void;
  renderDetailsContent: (key: string) => React.ReactNode;
  dayMood: (key: string) => any;
}

export function WeekView({
  days,
  detailDay,
  setDetailDay,
  renderDetailsContent,
  dayMood,
}: WeekViewProps) {
  return (
    <div className={styles.weekCalendar}>
      {days.map((day) => {
        const isAccordionOpen = detailDay === day.key;
        const mood = dayMood(day.key);

        return (
          <div
            key={day.key}
            className={`${styles.weekDay} ${isAccordionOpen ? styles.daySelected : ""}`}
          >
            {/* Die Kopfzeile des Riegels */}
            <div
              className={styles.weekDayHeaderRow}
              onClick={() => setDetailDay(isAccordionOpen ? "" : day.key)}
            >
              <span className={styles.weekDayLabel}>
                <span className={styles.weekDayNumber}>
                  {fromKey(day.key).getDate()}
                </span>

                <span className={styles.weekDayName}>
                  {fromKey(day.key).toLocaleDateString("de-DE", {
                    weekday: "long",
                  })}
                </span>
              </span>

              <span className={styles.weekDayCenterMood}>
                {mood && <span className={styles.dayMood}>{mood.icon}</span>}
              </span>
              <span className={styles.weekDayArrowWrapper}>
                {isAccordionOpen ? (
                  <CaretUpIcon size={20} />
                ) : (
                  <CaretDownIcon size={20} />
                )}
              </span>
            </div>

            {/*  ausklappbarer Inhalt */}
            <div
              className={`${styles.accordionContent} ${isAccordionOpen ? styles.contentOpen : ""}`}
            >
              {renderDetailsContent(day.key)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
