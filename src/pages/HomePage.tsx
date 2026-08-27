import { useTracker } from "../app/TrackerProvider";
import { useTrackerProgress } from "../hooks/useTrackerProgress";
import { tint } from "../utils/color";
import styles from "./HomePage.module.css";

export function HomePage({
  quote,
  onEntry,
  onCalendar,
}: {
  quote: readonly string[];
  onEntry: () => void;
  onCalendar: () => void;
}) {
  const { items } = useTracker();
  const progress = useTrackerProgress();
  const active = items.filter((item) => item.gamification.enabled);
  return (
    <>
      <header className={styles.top}>
        <div>
          <p className={styles.eyebrow}>Dein täglicher Begleiter</p>
          <h1>Übersicht</h1>
        </div>
        <button className={styles.avatar}>M</button>
      </header>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Zitat des Tages</p>
          <blockquote>{quote[0]}</blockquote>
          <cite>{quote[1]}</cite>
        </div>
        <span className={styles.heroIcon}>☀️</span>
      </section>
      <section className={styles.sectionHead}>
        <div>
          <h2>Deine Ziele</h2>
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
            <div className={styles.goalCard} key={item.id}>
              <div
                className={styles.itemIcon}
                style={{ background: tint(item.color) }}
              >
                {item.icon}
              </div>
              <div className={styles.goalBody}>
                <p>{item.name}</p>
                {value && (
                  <>
                    <strong>
                      {value.value} / {value.target}
                    </strong>
                    <div className={styles.progress}>
                      <i
                        style={{
                          width: `${Math.min(100, (value.value / value.target) * 100)}%`,
                          background: item.color,
                        }}
                      />
                    </div>
                    <small>{value.label}</small>
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
        <div>
          <h2>Direkt loslegen</h2>
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
    </>
  );
}
