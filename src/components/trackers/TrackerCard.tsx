import { useRef } from "react";
import type { TrackerWithCategory } from "../../types";
import styles from "./TrackerCard.module.css";

export function TrackerCard({
  item,
  count,
  onIncrement,
  onDecrement,
  onEdit,
  isEdithMode,
}: {
  item: TrackerWithCategory;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onEdit: () => void;
  isEdithMode: boolean;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressed = useRef(false);
  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };
  const startPress = () => {
    longPressed.current = false;
    clearTimer();
    if (isEdithMode) {
      timer.current = setTimeout(() => {
        longPressed.current = true;
        onEdit();
      }, 550);
    }
  };
  const endPress = () => clearTimer();
  return (
    <div
      className={styles.trackerWrap}
      onPointerDown={startPress}
      onPointerUp={endPress}
      onPointerLeave={endPress}
      onContextMenu={(event) => {
        event.preventDefault();
        if (isEdithMode) onEdit();
      }}
    >
      <div
        className={styles.tracker}
        role="button"
        tabIndex={0}
        onClick={() => {
          if (isEdithMode) onEdit();
          else if (!longPressed.current) onIncrement();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (isEdithMode) onEdit();
            else onIncrement();
          }
        }}
        style={
          {
            "--accent": item.color,
            "--soft": `color-mix(in srgb, ${item.color} 16%, white)`,
          } as React.CSSProperties
        }
        title={
          isEdithMode ? "Lange drücken: bearbeiten" : "Tippen: Anzahl erhöhen"
        }
      >
        <span>{item.icon}</span>
        <b style={{ color: item.color }}>{item.name}</b>
        <span className={styles.countBadge}>
          <strong>{count}</strong>
        </span>
        {!isEdithMode && (
          <div className={styles.countControls}>
            <button
              type="button"
              aria-label={`${item.name} verringern`}
              onClick={(event) => {
                event.stopPropagation();
                onDecrement();
              }}
            >
              −
            </button>
            <button
              type="button"
              aria-label={`${item.name} erhöhen`}
              onClick={(event) => {
                event.stopPropagation();
                onIncrement();
              }}
            >
              ＋
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
