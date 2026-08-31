import { FormEvent, useState } from "react";
import { Modal } from "../ui/Modal";
import type { Category } from "../../types";
import styles from "./CategoryEditor.module.css";
import { TrashIcon } from "@phosphor-icons/react";
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
              <TrashIcon size={22} />
            </button>
          )}
          <button className={styles.primary}>Speichern</button>
        </div>
      </form>
    </Modal>
  );
}
