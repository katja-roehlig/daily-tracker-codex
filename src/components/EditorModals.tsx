import { FormEvent, useState } from "react";
import { IconPicker } from "./ui/IconPicker";
import { Modal } from "./ui/Modal";
import type { Category, Mood, Period, Tracker } from "../types";
import styles from "../styles/App.module.css";
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
        <h2>Deine Kategorie</h2>
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
}: {
  category: Category;
  value?: Tracker;
  onSave: (value: Tracker) => void;
  onDelete?: () => void;
  onClose: () => void;
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
  };
  return (
    <Modal onClose={onClose}>
      <form onSubmit={submit}>
        <p className={styles.eyebrow}>
          {value ? "Tracker bearbeiten" : "Neuer Unterpunkt"}
        </p>
        <h2>Was möchtest du tracken?</h2>
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
        <h2>Wie fühlt es sich an?</h2>
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
