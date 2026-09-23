import { useState } from "react";
import { CategoryEditor } from "../components/editors/CategoryEditor";
import { TrackerEditor } from "../components/editors/TrackerEditor";
import { MoodEditor } from "../components/editors/MoodEditor";
import { MoodDeleteModal } from "../components/editors/MoodDeleteModal";
import { TrackerCard } from "../components/trackers/TrackerCard";
import { EditModeButton } from "../components/ui/EditModeButton";
import type { Category, Tracker } from "../types";
import { addDays, formatDateShort } from "../utils/date";
import { useTracker } from "../app/TrackerProvider";
import styles from "./EntryPage.module.css";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CaretDownIcon,
  CaretUpIcon,
  PencilLineIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";
type Editor =
  | { kind: "category"; editData?: Category }
  | { kind: "tracker"; category: Category; editData?: Tracker }
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
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    data,
    items,
    getEntry,
    increment,
    decrement,
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
  const categories = data.categories || [];
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
            className={`centerElement ${styles.dateButton}`}
          >
            <ArrowLeftIcon size={22} />
          </button>
          <h2 className={styles.date}>{formatDateShort(date)}</h2>
          <button
            onClick={() => onDate(addDays(date, 1))}
            className={`centerElement ${styles.dateButton}`}
          >
            <ArrowRightIcon size={22} />
          </button>
        </div>
        {isEditMode && (
          <button
            className={styles.closeEditButton}
            type="button"
            onClick={() => setIsEditMode(false)}
          >
            <XIcon size={22} weight="bold" className={styles.iconX} />
          </button>
        )}
      </header>
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.toggleContainer}>
            <h3 className={styles.sectionHeading}>Wie geht es dir?</h3>
            {!isEditMode && (
              <button
                className={styles.openEditButton}
                onClick={() => setIsEditMode(true)}
              >
                <PencilLineIcon size={28} />
              </button>
            )}
          </div>
          <div className={styles.sectionActions}>
            {isEditMode && (
              <>
                <button
                  className={`centerElement ${styles.actionButton}`}
                  aria-label="Stimmungen löschen"
                  onClick={() => setEditor({ kind: "mood-delete" })}
                >
                  <TrashIcon size={22} />
                </button>
                <button
                  className={`centerElement ${styles.actionButton}`}
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
              className={`${styles.moodButton} ${entry.mood === mood.id ? styles.moodSelected : ""}`}
              style={{ "--mood": mood.color } as React.CSSProperties}
              onClick={() => {
                if (!isEditMode) toggleMood(date, mood.id);
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
        <h3 className={`${styles.sectionHeading} ${styles.noteHeading}`}>
          Was war heute wichtig?
        </h3>
        <textarea
          value={entry.note ?? ""}
          className={styles.noteText}
          onChange={(event) => setNote(date, event.target.value)}
          placeholder="Schreib etwas."
          id="note"
          rows={3}
        />
      </section>
      <section className={styles.section}>
        <div className={`${styles.sectionHead} ${styles.toggleContainer}`}>
          <h3 className={styles.sectionHeading}>Deine Aktivitäten</h3>
          {!isEditMode && (
            <button
              className={styles.openEditButton}
              onClick={() => setIsEditMode(true)}
            >
              <PencilLineIcon size={28} />
            </button>
          )}
          {/* </div> */}
          {isEditMode && (
            <button
              className={`centerElement ${styles.actionButton}`}
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
              {isEditMode && (
                <button
                  aria-label={`${category.name} bearbeiten`}
                  onClick={() =>
                    setEditor({ kind: "category", editData: category })
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
                            editData: item,
                          })
                        }
                        isEditMode={isEditMode}
                      />
                    );
                  })}
                {isEditMode && (
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
          value={editor.editData}
          onClose={() => setEditor(null)}
          onSave={(category) => {
            if (editor.editData) {
              updateCategory(category);
            } else {
              createCategory(category);
            }
            setEditor(null);
          }}
          onDelete={
            editor.editData
              ? () => {
                  deleteCategory(editor.editData!.id);
                  setEditor(null);
                  setIsEditMode(false);
                }
              : undefined
          }
        />
      )}
      {editor?.kind === "tracker" && (
        <TrackerEditor
          category={editor.category}
          value={editor.editData}
          onClose={() => setEditor(null)}
          onSave={(tracker) => {
            if (editor.editData) {
              updateTracker(editor.category.id, tracker);
            } else {
              createTracker(editor.category.id, tracker);
            }
            setEditor(null);
          }}
          onDelete={
            editor.editData
              ? () => {
                  deleteTracker(editor.editData!.id);
                  setEditor(null);
                  setIsEditMode(false);
                }
              : undefined
          }
        />
      )}
      {editor?.kind === "mood" && (
        <MoodEditor
          onClose={() => setEditor(null)}
          onSave={(mood) => {
            createMood(mood);
            setEditor(null);
            setIsEditMode(false);
          }}
        />
      )}
      {editor?.kind === "mood-delete" && (
        <MoodDeleteModal
          moods={moods}
          onClose={() => setEditor(null)}
          onDelete={(moodId) => {
            deleteMood(moodId);
            setEditor(null);
            setIsEditMode(false);
          }}
        />
      )}
    </>
  );
}
