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
export function Navigation({ mobile = false }: { mobile?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className={`${styles.navList} ${mobile ? styles.navListMobile : ""}`}>
      {links.map(([path, label, IconComponent]) => (
        <button
          key={path}
          className={`${styles.navButton} ${mobile ? styles.navButtonMobile : ""} ${
            location.pathname === path ||
            (path === "/eintrag" && location.pathname.startsWith("/eintrag/"))
              ? styles.navButtonActive
              : ""
          }`}
          onClick={() => navigate(path)}
        >
          <span
            className={`${styles.iconWrapper} ${mobile ? styles.iconWrapperMobile : ""}`}
          >
            <IconComponent size={24} className={styles.icon} />
          </span>
          <span
            className={`${styles.label} ${mobile ? styles.labelMobile : ""}`}
          >
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}
