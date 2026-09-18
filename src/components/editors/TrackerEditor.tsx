import { FormEvent, useState } from "react";
import { IconPicker } from "../ui/IconPicker";
import { Modal } from "../ui/Modal";
import type { Category, Period, Tracker } from "../../types";
import styles from "./TrackerEditor.module.css";
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";

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
      gamification: {
        enabled: false,
        target: "" as unknown as number,
        period: "day",
      },
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
        <h3>Was möchtest du tracken?</h3>
        <label htmlFor="trackername" className={styles.modalLabel}>
          Name
          <input
            id="trackername"
            name="trackername"
            autoFocus
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`${styles.modalInput} ${styles.nameInput}`}
          />
        </label>

        <label htmlFor="color" className={styles.modalLabel}>
          Farbe
          <input
            type="color"
            id="color"
            name="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            style={{ "--selected": form.color } as React.CSSProperties}
            className={`${styles.modalInput} ${styles.colorInput}`}
          />
        </label>
        <label className={styles.modalLabel}>
          Icon
          <IconPicker
            value={form.icon}
            onChange={(icon) => setForm({ ...form, icon })}
          />
        </label>
        <label className={styles.gamificationCheck} htmlFor="gamification">
          <input
            type="checkbox"
            id="gamification"
            name="gamification"
            className={styles.checkIcon}
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
          />
          an Gamification teilnehmen
        </label>
        {form.gamification.enabled && (
          <div className={styles.goalFields}>
            <label htmlFor="goal" className={styles.modalLabel}>
              Ziel
              <input
                type="number"
                className={styles.modalInput}
                id="goal"
                name="goal"
                min="1"
                value={form.gamification.target}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gamification: {
                      ...form.gamification,
                      target:
                        e.target.value === ""
                          ? ("" as unknown as number)
                          : Number(e.target.value),
                    },
                  })
                }
              />
            </label>
            <label htmlFor="timeSpan" className={styles.modalLabel}>
              Zeitraum
              <select
                id="timeSpan"
                name="timeSpan"
                className={styles.modalSelect}
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
          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              <ArrowLeftIcon size={20} />
              <div className={styles.desktopText}>Abbrechen</div>
            </button>
            {onDelete && (
              <button
                type="button"
                className={styles.deleteButton}
                onClick={onDelete}
              >
                <TrashIcon size={22} />
                <div className={styles.desktopText}>Löschen</div>
              </button>
            )}
          </div>
          <button className={styles.saveButton}>
            <DownloadSimpleIcon size={20} />
            Speichern
          </button>
        </div>
      </form>
    </Modal>
  );
}
