import { useTracker } from "../app/TrackerProvider";
import { useTrackerProgress } from "../hooks/useTrackerProgress";
import styles from "./HomePage.module.css";
import type { Quote } from "../types";

export function HomePage({
  quote,
  onEntry,
  onCalendar,
}: {
  quote: Quote;
  onEntry: () => void;
  onCalendar: () => void;
}) {
  const { items } = useTracker();
  const progress = useTrackerProgress();
  const active = items.filter((item) => item.gamification.enabled);
  return (
    <div className={styles.homeContainer}>
      <header className={styles.top}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>Dein täglicher Begleiter</p>
          <h2>Schön, dich zu sehen!</h2>
        </div>
        <span className={styles.avatar}>☀️</span>
      </header>
      <section className={styles.hero}>
        <div className={styles.quoteContainer}>
          <p className={styles.eyebrow}>Zitat des Tages</p>
          <blockquote>{quote.text}</blockquote>
          <cite>{quote.author}</cite>
        </div>
      </section>
      <section className={styles.sectionHead}>
        <div className={styles.heading}>
          <h3>Deine Ziele</h3>
          <p>Ein kleiner Schritt jeden Tag.</p>
        </div>
        <button className={styles.linkBtn} onClick={onEntry}>
          Heute erfassen →
        </button>
      </section>
      <div className={styles.goals}>
        {active.map((item) => {
          const value = progress(item);
          return (
            <div
              className={styles.goalCard}
              key={item.id}
              style={{ "--accent": item.color } as React.CSSProperties}
            >
              <div className={`centerElement ${styles.itemIcon}`}>
                {item.icon}
              </div>
              <div className={styles.goalBody}>
                <p className={styles.goalName}>{item.name}</p>
                {value && (
                  <>
                    <strong className={styles.goalProgressNumber}>
                      {value.value} / {value.target}
                    </strong>
                    <div className={styles.progress}>
                      <i
                        className={styles.progressBar}
                        style={{
                          width: `${Math.min(100, (value.value / value.target) * 100)}%`,
                        }}
                      />
                    </div>
                    <small className={styles.goalPeriod}>{value.label}</small>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!active.length && (
        <p className={styles.empty}>Noch keine Ziele angelegt.</p>
      )}
      <section className={styles.quick}>
        <div className={styles.heading}>
          <h3>Direkt loslegen</h3>
          <p>Was möchtest du heute festhalten?</p>
        </div>
        <div className={styles.quickActions}>
          <button onClick={onEntry}>
            <b>＋</b>
            <span>
              Eintrag erfassen<small>Aktivität oder Stimmung</small>
            </span>
          </button>
          <button onClick={onCalendar}>
            <b>▦</b>
            <span>
              Kalender ansehen<small>Deinen Verlauf entdecken</small>
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
