import { PencilLineIcon, XIcon } from "@phosphor-icons/react";
import styles from "./EditModeButton.module.css"; // Falls du ein eigenes CSS-Modul dafür willst

interface ToggleButtonProps {
  isEditMode: boolean;
  onToggle: () => void;
  className?: string;
}

export function EditModeButton({
  isEditMode,
  onToggle,
  className,
}: ToggleButtonProps) {
  return (
    <button
      className={`${styles.editModeToggle} ${className || ""}`}
      type="button"
      aria-label={
        isEditMode ? "Bearbeiten-Modus schließen" : "Bearbeiten-Modus öffnen"
      }
      aria-pressed={isEditMode}
      onClick={onToggle}
    >
      {isEditMode ? (
        <XIcon size={22} weight="bold" />
      ) : (
        <PencilLineIcon size={22} weight="bold" />
      )}
    </button>
  );
}
