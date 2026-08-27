import { useState } from "react";
import {
  CategoryEditor,
  MoodDeleteModal,
  MoodEditor,
  TrackerEditor,
} from "../components/editors/EditorModals";
import { TrackerCard } from "../components/trackers/TrackerCard";
import { Tooltip } from "../components/ui/Tooltip";
import type { Category, Tracker } from "../types";
import { addDays, formatDate } from "../utils/date";
import { tint } from "../utils/color";
import { useTracker } from "../app/TrackerProvider";
import styles from "./EntryPage.module.css";
type Editor =
  | { kind: "category"; edithData?: Category }
  | { kind: "tracker"; category: Category; edithData?: Tracker }
  | { kind: "mood" }
  | { kind: "mood-delete" }
  | null;
export function EntryPage({
  date,
  onDate,
}: {
  date: string;
  onDate: (date: string) => void;
}) {
  const [isEdithMode, setIsEdithMode] = useState(false);
  const {
    data,
    items,
    getEntry,
    increment,
    decrement,
    setCount,
    setNote,
    toggleMood,
    createCategory,
    updateCategory,
    deleteCategory,
    createTracker,
    updateTracker,
    deleteTracker,
    createMood,
    deleteMood,
  } = useTracker();
  const entry = getEntry(date);
  const moods = data.moods;
  const [editor, setEditor] = useState<Editor>(null);
  const categories = [
    ...new Map(items.map((item) => [item.category.id, item.category])).values(),
  ];
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () => (categories.length ? { [categories[0].id]: true } : {}),
  );
  return (
    <>
      <header className={styles.entryHeader}>
        <p className={styles.eyebrow}>Tagesansicht</p>

        <div className={styles.dateClicker}>
          <button onClick={() => onDate(addDays(date, -1))}>←</button>
          <h2>{formatDate(date)}</h2>
          <button onClick={() => onDate(addDays(date, 1))}>→</button>
        </div>
        <button
          className={styles.editModeToggle}
          type="button"
          aria-label={
            isEdithMode
              ? "Bearbeiten-Modus schließen"
              : "Bearbeiten-Modus öffnen"
          }
          aria-pressed={isEdithMode}
          onClick={() => setIsEdithMode((open) => !open)}
        >
          {isEdithMode ? "×" : "✎"}
        </button>
      </header>
      <section>
        <div className={styles.sectionHead}>
          <div className={styles.tip}>
            <h3>Wie geht es dir?</h3>
            <Tooltip text="Wähle eine Stimmung für diesen Tag." />
          </div>
          <div className={styles.sectionActions}>
            {isEdithMode && (
              <>
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
              </>
            )}
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
              onClick={() => {
                if (!isEdithMode) toggleMood(date, mood.id);
              }}
            >
              <span>{mood.icon}</span>
              {mood.label}
            </button>
          ))}
        </div>
      </section>
      <section className={`${styles.sectionHead} ${styles.noteField}`}>
        <label id="note" className="visually-hidden">
          Platz für Notizen
        </label>
        <h3>Was war heute wichtig?</h3>
        <textarea
          value={entry.note ?? ""}
          onChange={(event) => setNote(date, event.target.value)}
          placeholder="Schreib etwas."
          id="note"
          rows={3}
        />
      </section>
      <section className={styles.trackSection}>
        <div className={styles.sectionHead}>
          <h3>Deine Aktivitäten</h3>

          {isEdithMode && (
            <button
              className={styles.roundAdd}
              onClick={() => setEditor({ kind: "category" })}
            >
              ＋
            </button>
          )}
        </div>
        {categories.map((category) => (
          <div className={styles.categoryCard} key={category.id}>
            <div
              className={styles.categoryCardHead}
              style={{ color: category.color }}
            >
              <button
                className={styles.accordionTrigger}
                onClick={() =>
                  setOpenCategories((prev) => ({
                    ...prev,
                    [category.id]: !prev[category.id],
                  }))
                }
                aria-expanded={Boolean(openCategories[category.id])}
              >
                <h4>{category.name}</h4>
                <span className={styles.accordionChevron}>
                  {openCategories[category.id] ? "⌄" : "›"}
                </span>
              </button>
              {isEdithMode && (
                <button
                  className={styles.editMini}
                  aria-label={`${category.name} bearbeiten`}
                  onClick={() =>
                    setEditor({ kind: "category", edithData: category })
                  }
                >
                  ✎
                </button>
              )}
            </div>
            {openCategories[category.id] && (
              <div className={styles.trackerGrid}>
                {items
                  .filter((item) => item.category.id === category.id)
                  .map((item) => {
                    const count = entry.counts[item.id] ?? 0;
                    return (
                      <TrackerCard
                        key={item.id}
                        item={item}
                        count={count}
                        onIncrement={() => increment(date, item.id)}
                        onDecrement={() => decrement(date, item.id)}
                        onEdit={() =>
                          setEditor({
                            kind: "tracker",
                            category,
                            edithData: item,
                          })
                        }
                        isEdithMode={isEdithMode}
                      />
                    );
                  })}
                {isEdithMode && (
                  <button
                    className={styles.newTrackerButton}
                    onClick={() => setEditor({ kind: "tracker", category })}
                  >
                    ＋ neuer Unterpunkt
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </section>
      {editor?.kind === "category" && (
        <CategoryEditor
          value={editor.edithData}
          onClose={() => setEditor(null)}
          onSave={(category) => {
            if (editor.edithData) {
              updateCategory(category);
            } else {
              createCategory(category);
            }
            setEditor(null);
          }}
          onDelete={
            editor.edithData
              ? () => {
                  deleteCategory(editor.edithData!.id);
                  setEditor(null);
                }
              : undefined
          }
        />
      )}{" "}
      {editor?.kind === "tracker" && (
        <TrackerEditor
          category={editor.category}
          value={editor.edithData}
          onClose={() => setEditor(null)}
          onSave={(tracker) => {
            if (editor.edithData) {
              updateTracker(editor.category.id, tracker);
            } else {
              createTracker(editor.category.id, tracker);
            }
            setEditor(null);
          }}
          count={
            editor.edithData
              ? (entry.counts[editor.edithData.id] ?? 0)
              : undefined
          }
          onCountSave={
            editor.edithData
              ? (count) => setCount(date, editor.edithData!.id, count)
              : undefined
          }
          onDelete={
            editor.edithData
              ? () => {
                  deleteTracker(editor.edithData!.id);
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
            createMood(mood);
            setEditor(null);
          }}
        />
      )}
      {editor?.kind === "mood-delete" && (
        <MoodDeleteModal
          moods={moods}
          onClose={() => setEditor(null)}
          onDelete={deleteMood}
        />
      )}
    </>
  );
}
