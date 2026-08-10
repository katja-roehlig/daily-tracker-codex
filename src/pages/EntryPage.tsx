import { useState } from "react";
import {
  CategoryEditor,
  MoodDeleteModal,
  MoodEditor,
  TrackerEditor,
} from "../components/EditorModals";
import { TrackerCard } from "../components/TrackerCard";
import { Tooltip } from "../components/ui/Tooltip";
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
  | { kind: "mood" }
  | { kind: "mood-delete" }
  | null;
export function EntryPage({
  date,
  entry,
  items,
  moods,
  onIncrement,
  onSetCount,
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
  onSetCount: (id: string, count: number) => void;
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
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() =>
    categories.length ? { [categories[0].id]: true } : {},
  );
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
            <Tooltip text="Wähle eine Stimmung für diesen Tag." />
          </div>
          <div className={styles.sectionActions}>
            <button
              className={styles.editMoodCatalog}
              aria-label="Stimmungen löschen"
              onClick={() => setEditor({ kind: "mood-delete" })}
            >
              ✎
            </button>
            <button
              className={styles.roundAdd}
              onClick={() => setEditor({ kind: "mood" })}
            >
              ＋
            </button>
          </div>
        </div>
        <div className={styles.moods}>
          {moods.map((mood) => (
            <button
              key={mood.id}
              className={entry.mood === mood.id ? styles.moodSelected : ""}
              style={
                {
                  "--mood": mood.color,
                  background: tint(mood.color),
                } as React.CSSProperties
              }
              onClick={() => onMood(mood.id)}
            >
              <span>{mood.icon}</span>
              {mood.label}
            </button>
          ))}
        </div>
      </section>
      <section className={styles.trackSection}>
        <div className={styles.sectionHead}>
          <div>
            <h2>Deine Tracker</h2>
            <Tooltip text="Tippe zum Erfassen. Mehrfaches Tippen erhöht den Zähler. Lange drücken öffnet die Bearbeitung." />
          </div>
          <button
            className={styles.roundAdd}
            onClick={() => setEditor({ kind: "category" })}
          >
            ＋
          </button>
        </div>
        {categories.map((category) => (
          <div className={styles.categoryCard} key={category.id}>
            <div className={styles.categoryCardHead} style={{ color: category.color }}>
              <button className={styles.accordionTrigger} onClick={() => setOpenCategories(current => ({ ...current, [category.id]: !current[category.id] }))} aria-expanded={Boolean(openCategories[category.id])}>
                <span className={styles.accordionChevron}>{openCategories[category.id] ? '⌄' : '›'}</span>
                <h3>{category.name}</h3>
              </button>
              <button className={styles.editMini} aria-label={`${category.name} bearbeiten`} onClick={() => setEditor({ kind: "category", value: category })}>✎</button>
            </div>
            {openCategories[category.id] && <div className={styles.trackerGrid}>
              {items
                .filter((item) => item.category.id === category.id)
                .map((item) => {
                  const count = entry.counts[item.id] ?? 0;
                  return (
                    <TrackerCard item={item} count={count} onIncrement={() => onIncrement(item.id)} onEdit={() => setEditor({ kind: "tracker", category, value: item })} />
                  );
                })}
              <button className={styles.newTrackerButton} onClick={() => setEditor({ kind: "tracker", category })}>＋ neuer Unterpunkt</button>
            </div>}
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
          count={editor.value ? entry.counts[editor.value.id] ?? 0 : undefined}
          onCountSave={editor.value ? (count) => onSetCount(editor.value!.id, count) : undefined}
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
          onClose={() => setEditor(null)}
          onSave={(mood) => {
            onSaveMood(mood);
            setEditor(null);
          }}
        />
      )}
      {editor?.kind === "mood-delete" && (
        <MoodDeleteModal
          moods={moods}
          onClose={() => setEditor(null)}
          onDelete={onDeleteMood}
        />
      )}
    </>
  );
}
