import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Navigation.module.css";
import {
  PlusCircleIcon,
  CalendarDotsIcon,
  ChartBarIcon,
  HouseIcon,
} from "@phosphor-icons/react";

const links: Array<[string, string, React.ComponentType<any>]> = [
  ["/", "Übersicht", HouseIcon],
  ["/eintrag", "Heute", PlusCircleIcon],
  ["/kalender", "Kalender", CalendarDotsIcon],
  ["/auswertung", "Auswertung", ChartBarIcon],
];

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className={styles.navList}>
      {links.map(([path, label, IconComponent]) => {
        const isActive =
          location.pathname === path ||
          (path === "/eintrag" && location.pathname.startsWith("/eintrag/"));

        return (
          <button
            key={path}
            className={`${styles.navButton} ${isActive ? styles.navButtonActive : ""}`}
            onClick={() => navigate(path)}
          >
            <span className={styles.iconWrapper}>
              <IconComponent size={28} className={styles.icon} />
            </span>
            <span className={styles.label}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
