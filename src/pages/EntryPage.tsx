import { useState } from "react";
import {
  CategoryEditor,
  MoodDeleteModal,
  MoodEditor,
  TrackerEditor,
} from "../components/editors/EditorModals";
import { TrackerCard } from "../components/trackers/TrackerCard";
import type { Category, Tracker } from "../types";
import { addDays, formatDate } from "../utils/date";
import { useTracker } from "../app/TrackerProvider";
import styles from "./EntryPage.module.css";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CaretDownIcon,
  CaretUpIcon,
  PencilLineIcon,
  PlusIcon,
  XIcon,
} from "@phosphor-icons/react";
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
          <button
            onClick={() => onDate(addDays(date, -1))}
            className="centerElement"
          >
            <ArrowLeftIcon size={22} />
          </button>
          <h2>{formatDate(date)}</h2>
          <button
            onClick={() => onDate(addDays(date, 1))}
            className="centerElement"
          >
            <ArrowRightIcon size={22} />
          </button>
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
          {isEdithMode ? (
            <XIcon size={22} weight="bold" className={styles.iconX} />
          ) : (
            <PencilLineIcon size={22} weight="bold" />
          )}
        </button>
      </header>
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h3 className={styles.sectionHeading}>Wie geht es dir?</h3>

          <div className={styles.sectionActions}>
            {isEdithMode && (
              <>
                <button
                  className={styles.actionButton}
                  aria-label="Stimmungen löschen"
                  onClick={() => setEditor({ kind: "mood-delete" })}
                >
                  <PencilLineIcon size={22} />
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => setEditor({ kind: "mood" })}
                >
                  <PlusIcon
                    size={18}
                    weight="bold"
                    className={styles.iconPlus}
                  />
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
                  background: `color-mix(in srgb, ${mood.color} 16%, white)`,
                } as React.CSSProperties
              }
              onClick={() => {
                if (!isEdithMode) toggleMood(date, mood.id);
              }}
            >
              <span className={styles.iconMood}>{mood.icon}</span>
              {mood.label}
            </button>
          ))}
        </div>
      </section>
      <section className={`${styles.noteField} ${styles.section}`}>
        <label id="note" className="visually-hidden">
          Platz für Notizen
        </label>
        <h3 className={styles.sectionHeading}>Was war heute wichtig?</h3>
        <textarea
          value={entry.note ?? ""}
          onChange={(event) => setNote(date, event.target.value)}
          placeholder="Schreib etwas."
          id="note"
          rows={3}
        />
      </section>
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h3 className={styles.sectionHeading}>Deine Aktivitäten</h3>

          {isEdithMode && (
            <button
              className={styles.actionButton}
              onClick={() => setEditor({ kind: "category" })}
            >
              <PlusIcon size={18} weight="bold" className={styles.iconPlus} />
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
                className={styles.accordionButton}
                onClick={() =>
                  setOpenCategories((prev) => ({
                    ...prev,
                    [category.id]: !prev[category.id],
                  }))
                }
                aria-expanded={Boolean(openCategories[category.id])}
              >
                <h4>{category.name}</h4>

                {openCategories[category.id] ? (
                  <CaretDownIcon size={22} weight="fill" />
                ) : (
                  <CaretUpIcon size={22} weight="fill" />
                )}
              </button>
              {isEdithMode && (
                <button
                  aria-label={`${category.name} bearbeiten`}
                  onClick={() =>
                    setEditor({ kind: "category", edithData: category })
                  }
                >
                  <PencilLineIcon size={22} />
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
      )}
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
