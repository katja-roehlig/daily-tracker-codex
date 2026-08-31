import { FormEvent, useState } from "react";
import { IconPicker } from "../ui/IconPicker";
import { Modal } from "../ui/Modal";
import type { Mood } from "../../types";
import styles from "./MoodEditor.module.css";

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
