import type { Progress, TrackerWithCategory } from "../types";
import { tint } from "../utils/color";
import styles from "./HomePage.module.css";
export function HomePage({
  quote,
  items,
  progress,
  streak,
  onEntry,
  onCalendar,
}: {
  quote: readonly string[];
  items: TrackerWithCategory[];
  progress: (item: TrackerWithCategory) => Progress | null;
  streak: (item: TrackerWithCategory) => number;
  onEntry: () => void;
  onCalendar: () => void;
}) {
  const active = items.filter((item) => item.gamification.enabled);
  return (
    <>
      <header className={styles.top}>
        <div>
          <p className={styles.eyebrow}>Dein täglicher Begleiter</p>
          <h1>Hallo, schön dass du da bist.</h1>
        </div>
        <button className={styles.avatar}>M</button>
      </header>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Zitat des Tages</p>
          <blockquote>{quote[0]}</blockquote>
          <cite>— {quote[1]}</cite>
        </div>
        <span className={styles.heroIcon}>☀️</span>
      </section>
      <section className={styles.sectionHead}>
        <div>
          <h2>Dein Fortschritt</h2>
          <p>Kleine Schritte zählen.</p>
        </div>
        <button className={styles.linkBtn} onClick={onEntry}>
          Heute eintragen →
        </button>
      </section>
      <div className={styles.goals}>
        {active.map((item) => {
          const result = progress(item)!;
          const days = streak(item);
          return (
            <article
              key={item.id}
              className={styles.goalCard}
              style={{ "--accent": item.category.color } as React.CSSProperties}
            >
              <span
                className={styles.itemIcon}
                style={{ background: tint(item.category.color) }}
              >
                {item.icon}
              </span>
              <div className={styles.goalBody}>
                <p>{item.name}</p>
                <strong>
                  {result.value}{" "}
                  <small>
                    von {result.target} {result.label}
                  </small>
                </strong>
                <div className={styles.progress}>
                  <i
                    style={{
                      width: `${Math.min(100, (result.value / result.target) * 100)}%`,
                    }}
                  />
                </div>
                {result.done ? (
                  <em>
                    ✓ Ziel erreicht{days > 1 ? ` · ${days} Tage Streak` : ""}
                  </em>
                ) : (
                  <span>Noch {result.target - result.value} bis zum Ziel</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {!active.length && (
        <p className={styles.empty}>
          Aktiviere bei einem Tracker die Gamification, um hier Fortschritte zu
          sehen.
        </p>
      )}
      <section className={styles.quick}>
        <div>
          <h2>Was möchtest du tun?</h2>
          <p>Dein Tag, ganz in deinem Tempo.</p>
        </div>
        <div className={styles.quickActions}>
          <button onClick={onEntry}>
            <b>＋</b>
            <span>
              Heute erfassen<small>Aktivitäten & Stimmung</small>
            </span>
          </button>
          <button onClick={onCalendar}>
            <b>▦</b>
            <span>
              Kalender ansehen<small>Muster entdecken</small>
            </span>
          </button>
        </div>
      </section>
    </>
  );
}
