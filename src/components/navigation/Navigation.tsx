import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Navigation.module.css";
const links: Array<[string, string, string]> = [
  ["/", "Übersicht", "⌂"],
  ["/eintrag", "Heute", "＋"],
  ["/kalender", "Kalender", "▦"],
  ["/auswertung", "Auswertung", "◔"],
];
export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className={styles.nav}>
      {links.map(([path, label, icon]) => (
        <button
          key={path}
          className={
            location.pathname === path ||
            (path === "/eintrag" && location.pathname.startsWith("/eintrag/"))
              ? styles.active
              : ""
          }
          onClick={() => navigate(path)}
        >
          <span>{icon}</span>
          {label}
        </button>
      ))}
    </nav>
  );
}
