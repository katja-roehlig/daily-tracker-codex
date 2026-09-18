import type { ReactNode } from "react";
import styles from "./Modal.module.css";
import { XIcon } from "@phosphor-icons/react";
export function Modal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className={styles.modalWrap} role="dialog" aria-modal="true">
      <div className={styles.modalBox}>
        <button
          type="button"
          aria-label="Schließen"
          className={styles.closeButton}
          onClick={onClose}
        >
          <XIcon size={22} weight="bold" />
        </button>
        {children}
      </div>
    </div>
  );
}
