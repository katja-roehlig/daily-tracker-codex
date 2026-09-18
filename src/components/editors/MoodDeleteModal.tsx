import { Modal } from "../ui/Modal";
import type { Mood } from "../../types";
import styles from "./MoodDeleteModal.module.css";
import { TrashIcon } from "@phosphor-icons/react";

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
      <h3 className={styles.modalHeading}>Stimmungen löschen</h3>
      <p className={styles.modalHint}>
        Entferne Stimmungen, die du nicht mehr verwendest.
      </p>
      <div className={styles.moodDeleteList}>
        {moods.map((mood) => (
          <div
            key={mood.id}
            className={styles.moodDeleteItem}
            style={{ "--moodColor": mood.color } as React.CSSProperties}
          >
            <span className={styles.moodIcon}>{mood.icon}</span>
            <b>{mood.label}</b>
            <button
              type="button"
              className={`centerElement ${styles.deleteButton}`}
              onClick={() => onDelete(mood.id)}
            >
              <TrashIcon size={24} weight="bold" />
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
