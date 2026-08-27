import { useRef } from "react";
import type { TrackerWithCategory } from "../../types";
import { tint } from "../../utils/color";
import styles from "./TrackerCard.module.css";

export function TrackerCard({
  item,
  count,
  onIncrement,
  onEdit,
  isEdithMode,
}: {
  item: TrackerWithCategory;
  count: number;
  onIncrement: () => void;
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
      <button
        className={styles.tracker}
        onClick={() => {
          if (isEdithMode) onEdit();
          else if (!longPressed.current) onIncrement();
        }}
        style={
          {
            "--accent": item.color,
            "--soft": tint(item.color),
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
          <small>＋</small>
        </span>
      </button>
    </div>
  );
}
