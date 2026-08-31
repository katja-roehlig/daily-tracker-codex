import { Modal } from "../ui/Modal";
import type { Mood } from "../../types";
import styles from "./MoodDeleteModal.module.css";

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
            style={{
              background: `color-mix(in srgb, ${mood.color} 16%, white)`,
            }}
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
