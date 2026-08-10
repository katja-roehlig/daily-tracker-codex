import { useState } from "react";
import {
  CategoryEditor,
  MoodEditor,
  TrackerEditor,
} from "../components/EditorModals";
import type {
  Category,
  DayEntry,
  Mood,
  Tracker,
  TrackerWithCategory,
} from "../types";
import { addDays, formatDate } from "../utils/date";
import { tint } from "../utils/color";
import styles from "../styles/App.module.css";
type Editor =
  | { kind: "category"; value?: Category }
  | { kind: "tracker"; category: Category; value?: Tracker }
  | { kind: "mood"; value?: Mood }
  | null;
export function EntryPage({
  date,
  entry,
  items,
  moods,
  onIncrement,
  onMood,
  onDate,
  onSaveCategory,
  onDeleteCategory,
  onSaveTracker,
  onDeleteTracker,
  onSaveMood,
  onDeleteMood,
}: {
  date: string;
  entry: DayEntry;
  items: TrackerWithCategory[];
  moods: Mood[];
  onIncrement: (id: string) => void;
  onMood: (id: string) => void;
  onDate: (date: string) => void;
  onSaveCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onSaveTracker: (categoryId: string, tracker: Tracker) => void;
  onDeleteTracker: (id: string) => void;
  onSaveMood: (mood: Mood) => void;
  onDeleteMood: (id: string) => void;
}) {
  const [editor, setEditor] = useState<Editor>(null);
  const categories = [
    ...new Map(items.map((item) => [item.category.id, item.category])).values(),
  ];
  return (
    <>
      <header className={styles.entryHeader}>
        <button onClick={() => onDate(addDays(date, -1))}>←</button>
        <div>
          <p className={styles.eyebrow}>Tagesansicht</p>
          <h1>{formatDate(date)}</h1>
        </div>
        <button onClick={() => onDate(addDays(date, 1))}>→</button>
      </header>
      <section>
        <div className={styles.sectionHead}>
          <div>
            <h2>Wie geht es dir?</h2>
            <p>Wähle eine Stimmung für diesen Tag.</p>
          </div>
          <button
            className={styles.roundAdd}
            onClick={() => setEditor({ kind: "mood" })}
          >
            ＋
          </button>
        </div>
        <div className={styles.moods}>
          {moods.map((mood) => (
            <div className={styles.moodWrap} key={mood.id}>
              <button
                className={entry.mood === mood.id ? styles.moodSelected : ""}
                style={{ "--mood": mood.color } as React.CSSProperties}
                onClick={() => onMood(mood.id)}
              >
                <span>{mood.icon}</span>
                {mood.label}
              </button>
              <button
                className={styles.editMini}
                aria-label={`${mood.label} bearbeiten`}
                onClick={() => setEditor({ kind: "mood", value: mood })}
              >
                ⋯
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className={styles.trackSection}>
        <div className={styles.sectionHead}>
          <div>
            <h2>Deine Tracker</h2>
            <p>Tippe zum Erfassen – mehrfaches Tippen erhöht den Zähler.</p>
          </div>
          <button
            className={styles.roundAdd}
            onClick={() => setEditor({ kind: "category" })}
          >
            ＋
          </button>
        </div>
        {categories.map((category) => (
          <div className={styles.category} key={category.id}>
            <h3 style={{ color: category.color }}>
              <i style={{ background: category.color }} />
              {category.name}
              <button
                className={styles.editMini}
                aria-label={`${category.name} bearbeiten`}
                onClick={() => setEditor({ kind: "category", value: category })}
              >
                ⋯
              </button>
              <button
                className={styles.addInline}
                onClick={() => setEditor({ kind: "tracker", category })}
              >
                ＋ Unterpunkt
              </button>
            </h3>
            <div className={styles.trackerGrid}>
              {items
                .filter((item) => item.category.id === category.id)
                .map((item) => {
                  const count = entry.counts[item.id] ?? 0;
                  return (
                    <div className={styles.trackerWrap} key={item.id}>
                      <button
                        className={styles.tracker}
                        onClick={() => onIncrement(item.id)}
                        style={
                          {
                            "--accent": item.color,
                            "--soft": tint(item.color),
                          } as React.CSSProperties
                        }
                      >
                        <span>{item.icon}</span>
                        <b style={{ color: item.color }}>{item.name}</b>
                        {count > 0 && <mark>× {count}</mark>}
                      </button>
                      <button
                        className={styles.editTracker}
                        aria-label={`${item.name} bearbeiten`}
                        onClick={() =>
                          setEditor({ kind: "tracker", category, value: item })
                        }
                      >
                        ⋯
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </section>
      {editor?.kind === "category" && (
        <CategoryEditor
          value={editor.value}
          onClose={() => setEditor(null)}
          onSave={(category) => {
            onSaveCategory(category);
            setEditor(null);
          }}
          onDelete={
            editor.value
              ? () => {
                  onDeleteCategory(editor.value!.id);
                  setEditor(null);
                }
              : undefined
          }
        />
      )}{" "}
      {editor?.kind === "tracker" && (
        <TrackerEditor
          category={editor.category}
          value={editor.value}
          onClose={() => setEditor(null)}
          onSave={(tracker) => {
            onSaveTracker(editor.category.id, tracker);
            setEditor(null);
          }}
          onDelete={
            editor.value
              ? () => {
                  onDeleteTracker(editor.value!.id);
                  setEditor(null);
                }
              : undefined
          }
        />
      )}{" "}
      {editor?.kind === "mood" && (
        <MoodEditor
          value={editor.value}
          onClose={() => setEditor(null)}
          onSave={(mood) => {
            onSaveMood(mood);
            setEditor(null);
          }}
          onDelete={
            editor.value
              ? () => {
                  onDeleteMood(editor.value!.id);
                  setEditor(null);
                }
              : undefined
          }
        />
      )}
    </>
  );
}
