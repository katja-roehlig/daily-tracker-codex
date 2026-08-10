import type { ReactNode } from "react";
import styles from "../../styles/App.module.css";
export function Modal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className={styles.modalWrap} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <button
          type="button"
          aria-label="Schließen"
          className={styles.close}
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
