import { FormEvent, useState } from "react";
import { IconPicker } from "../ui/IconPicker";
import { Modal } from "../ui/Modal";
import type { Category, Mood, Period, Tracker } from "../../types";
import { tint } from "../../utils/color";
import styles from "./EditorModals.module.css";
export function CategoryEditor({
  value,
  onSave,
  onDelete,
  onClose,
}: {
  value?: Category;
  onSave: (value: Category) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(
    value ?? { id: crypto.randomUUID(), name: "", color: "#6c9ed3", items: [] },
  );
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (form.name.trim()) onSave({ ...form, name: form.name.trim() });
  };
  return (
    <Modal onClose={onClose}>
      <form onSubmit={submit}>
        <p className={styles.eyebrow}>
          {value ? "Kategorie bearbeiten" : "Neue Kategorie"}
        </p>
        <h3>Deine Kategorie</h3>
        <label>
          Name
          <input
            autoFocus
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label>
          Farbe
          <input
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />
        </label>
        <div className={styles.modalActions}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            ← Abbrechen
          </button>
          {onDelete && (
            <button type="button" className={styles.danger} onClick={onDelete}>
              Löschen
            </button>
          )}
          <button className={styles.primary}>Speichern</button>
        </div>
      </form>
    </Modal>
  );
}
export function TrackerEditor({
  category,
  value,
  onSave,
  onDelete,
  onClose,
  count,
  onCountSave,
}: {
  category: Category;
  value?: Tracker;
  onSave: (value: Tracker) => void;
  onDelete?: () => void;
  onClose: () => void;
  count?: number;
  onCountSave?: (count: number) => void;
}) {
  const [form, setForm] = useState<Tracker>(
    value ?? {
      id: crypto.randomUUID(),
      name: "",
      icon: "✨",
      color: category.color,
      gamification: { enabled: false, target: 1, period: "day" },
    },
  );
  const [dailyCount, setDailyCount] = useState(count ?? 0);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (form.name.trim())
      onSave({
        ...form,
        name: form.name.trim(),
        gamification: {
          ...form.gamification,
          target: Math.max(1, Number(form.gamification.target)),
        },
      });
    if (onCountSave && count !== undefined)
      onCountSave(Math.max(0, Number(dailyCount)));
  };
  return (
    <Modal onClose={onClose}>
      <form onSubmit={submit}>
        <p className={styles.eyebrow}>
          {value ? "Tracker bearbeiten" : "Neuer Unterpunkt"}
        </p>
        <h3>Was möchtest du tracken?</h3>
        <label>
          Name
          <input
            autoFocus
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        {count !== undefined && (
          <label>
            Heute erfasst
            <input
              type="number"
              min="0"
              value={dailyCount}
              onChange={(e) =>
                setDailyCount(Math.max(0, Number(e.target.value) || 0))
              }
            />
          </label>
        )}
        <label>
          Farbe
          <input
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />
        </label>
        <label>
          Icon
          <IconPicker
            value={form.icon}
            onChange={(icon) => setForm({ ...form, icon })}
          />
        </label>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={form.gamification.enabled}
            onChange={(e) =>
              setForm({
                ...form,
                gamification: {
                  ...form.gamification,
                  enabled: e.target.checked,
                },
              })
            }
          />{" "}
          An der Gamification teilnehmen
        </label>
        {form.gamification.enabled && (
          <div className={styles.goalFields}>
            <label>
              Ziel
              <input
                type="number"
                min="1"
                value={form.gamification.target}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gamification: {
                      ...form.gamification,
                      target: Number(e.target.value),
                    },
                  })
                }
              />
            </label>
            <label>
              Zeitraum
              <select
                value={form.gamification.period}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gamification: {
                      ...form.gamification,
                      period: e.target.value as Period,
                    },
                  })
                }
              >
                <option value="day">pro Tag (Erfassungen)</option>
                <option value="week">pro Woche (aktive Tage)</option>
              </select>
            </label>
          </div>
        )}
        <div className={styles.modalActions}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            ← Abbrechen
          </button>
          {onDelete && (
            <button type="button" className={styles.danger} onClick={onDelete}>
              Löschen
            </button>
          )}
          <button className={styles.primary}>Speichern</button>
        </div>
      </form>
    </Modal>
  );
}
export function MoodEditor({
  value,
  onSave,
  onDelete,
  onClose,
}: {
  value?: Mood;
  onSave: (value: Mood) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Mood>(
    value ?? {
      id: crypto.randomUUID(),
      label: "",
      icon: "😊",
      color: "#e2a23c",
    },
  );
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (form.label.trim()) onSave({ ...form, label: form.label.trim() });
  };
  return (
    <Modal onClose={onClose}>
      <form onSubmit={submit}>
        <p className={styles.eyebrow}>
          {value ? "Stimmung bearbeiten" : "Neue Stimmung"}
        </p>
        <h3>Wie fühlt es sich an?</h3>
        <label>
          Bezeichnung
          <input
            autoFocus
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
        </label>
        <label>
          Farbe
          <input
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />
        </label>
        <label>
          Icon
          <IconPicker
            value={form.icon}
            onChange={(icon) => setForm({ ...form, icon })}
          />
        </label>
        <div className={styles.modalActions}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            ← Abbrechen
          </button>
          {onDelete && (
            <button type="button" className={styles.danger} onClick={onDelete}>
              Löschen
            </button>
          )}
          <button className={styles.primary}>Speichern</button>
        </div>
      </form>
    </Modal>
  );
}

export function MoodDeleteModal({
  moods,
  onDelete,
  onClose,
}: {
  moods: Mood[];
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose}>
      <p className={styles.eyebrow}>Stimmungskatalog</p>
      <h3>Stimmungen löschen</h3>
      <p className={styles.modalHint}>
        Entferne Stimmungen, die du nicht mehr verwendest.
      </p>
      <div className={styles.moodDeleteList}>
        {moods.map((mood) => (
          <div
            key={mood.id}
            className={styles.moodDeleteItem}
            style={{ background: tint(mood.color) }}
          >
            <span>{mood.icon}</span>
            <b>{mood.label}</b>
            <button type="button" onClick={() => onDelete(mood.id)}>
              Löschen
            </button>
          </div>
        ))}
      </div>
      <div className={styles.modalActions}>
        <button type="button" className={styles.cancel} onClick={onClose}>
          ← Abbrechen
        </button>
      </div>
    </Modal>
  );
}

export function TrackerManageModal({
  category,
  onEdit,
  onDelete,
  onClose,
}: {
  category: Category;
  onEdit: (tracker: Tracker) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose}>
      <p className={styles.eyebrow}>Kategorie</p>
      <h3>{category.name}</h3>
      <p className={styles.modalHint}>Unterpunkte bearbeiten oder löschen.</p>
      <div className={styles.moodDeleteList}>
        {category.items.map((tracker) => (
          <div
            key={tracker.id}
            className={styles.moodDeleteItem}
            style={{ background: tint(tracker.color) }}
          >
            <span>{tracker.icon}</span>
            <b>{tracker.name}</b>
            <div className={styles.rowActions}>
              <button
                type="button"
                onClick={() => onEdit(tracker)}
                aria-label={`${tracker.name} bearbeiten`}
              >
                ✎
              </button>
              <button type="button" onClick={() => onDelete(tracker.id)}>
                Löschen
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.modalActions}>
        <button type="button" className={styles.cancel} onClick={onClose}>
          ← Abbrechen
        </button>
      </div>
    </Modal>
  );
}
