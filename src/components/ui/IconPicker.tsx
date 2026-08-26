import { iconCatalog } from "../../icons/catalog";
import styles from "./IconPicker.module.css";
export function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (icon: string) => void;
}) {
  return (
    <div className={styles.iconPicker}>
      {iconCatalog.map((icon) => (
        <button
          type="button"
          aria-label={`Icon ${icon}`}
          className={value === icon ? styles.iconChosen : ""}
          onClick={() => onChange(icon)}
          key={icon}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
