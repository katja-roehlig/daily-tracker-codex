import type { TrackerWithCategory } from "../../types";
import styles from "./TrackerCard.module.css";
import { MinusIcon, PencilLineIcon, PlusIcon } from "@phosphor-icons/react";

export function TrackerCard({
  item,
  count,
  onIncrement,
  onDecrement,
  onEdit,
  isEditMode,
}: {
  item: TrackerWithCategory;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onEdit: () => void;
  isEditMode: boolean;
}) {
  return (
    <div className={styles.trackerWrap}>
      <div
        className={`${styles.tracker} ${isEditMode ? styles.trackerEditClickable : ""}`}
        role={isEditMode ? "button" : undefined}
        tabIndex={isEditMode ? 0 : undefined}
        onClick={() => {
          if (isEditMode) onEdit();
        }}
        onKeyDown={(event) => {
          if (isEditMode && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            onEdit();
          }
        }}
        style={
          {
            "--accent": item.color,
            "--soft": `color-mix(in srgb, ${item.color} 16%, white)`,
          } as React.CSSProperties
        }
      >
        <div className={styles.metaBlock}>
          <span className={`centerElement ${styles.trackerIcon}`}>
            {item.icon}
          </span>

          <span className={styles.trackerName}>{item.name}</span>
        </div>

        <span className={styles.countNumber}>{count}</span>

        {isEditMode ? (
          <div className={styles.controlsBlock}>
            <PencilLineIcon size={18} className={styles.iconEditTracker} />
          </div>
        ) : (
          <div className={styles.controlsBlock}>
            <button
              type="button"
              className={styles.buttonDec}
              aria-label={`${item.name} verringern`}
              onClick={(event) => {
                event.stopPropagation();
                onDecrement();
              }}
            >
              <MinusIcon size={12} weight="bold" />
            </button>

            <button
              type="button"
              className={styles.buttonInc}
              aria-label={`${item.name} erhöhen`}
              onClick={(event) => {
                event.stopPropagation();
                onIncrement();
              }}
            >
              <PlusIcon size={12} weight="bold" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
