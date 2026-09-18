import { FormEvent, useState } from "react";
import { Modal } from "../ui/Modal";
import type { Category } from "../../types";
import styles from "./CategoryEditor.module.css";
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
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
        <h3 className={styles.modalHeading}>Deine Kategorie</h3>
        <label className={styles.modalLabel}>
          Name
          <input
            autoFocus
            className={styles.modalInput}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
