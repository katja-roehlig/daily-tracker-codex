import { FormEvent, useState } from "react";
import { IconPicker } from "../ui/IconPicker";
import { Modal } from "../ui/Modal";
import type { Mood } from "../../types";
import styles from "./MoodEditor.module.css";
import { DownloadSimpleIcon } from "@phosphor-icons/react";

export function MoodEditor({
  value,
  onSave,
  onClose,
}: {
  value?: Mood;
  onSave: (value: Mood) => void;
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
        <h3 className={styles.modalHeading}>Wie fühlt es sich an?</h3>
        <label className={styles.modalLabel}>
          Bezeichnung
          <input
            autoFocus
            className={styles.modalInput}
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
        </label>
        <label className={styles.modalLabel}>
          Farbe
          <input
            type="color"
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
        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            ← Abbrechen
          </button>
          <button className={styles.saveButton}>
            <DownloadSimpleIcon size={20} />
            Speichern
          </button>
        </div>
      </form>
    </Modal>
  );
}
