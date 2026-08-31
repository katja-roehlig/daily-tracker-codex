import { FormEvent, useState } from "react";
import { IconPicker } from "../ui/IconPicker";
import { Modal } from "../ui/Modal";
import type { Category, Period, Tracker } from "../../types";
import styles from "./TrackerEditor.module.css";

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
