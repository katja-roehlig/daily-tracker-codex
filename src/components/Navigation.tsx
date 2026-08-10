import styles from "../styles/App.module.css";
export type Page = "home" | "entry" | "calendar" | "evaluation";
const links: Array<[Page, string, string]> = [
  ["home", "Übersicht", "⌂"],
  ["entry", "Heute", "＋"],
  ["calendar", "Kalender", "▦"],
  ["evaluation", "Auswertung", "◔"],
];
export function Navigation({
  page,
  setPage,
}: {
  page: Page;
  setPage: (page: Page) => void;
}) {
  return (
    <nav className={styles.nav}>
      {links.map(([id, label, icon]) => (
        <button
          key={id}
          className={page === id ? styles.active : ""}
          onClick={() => setPage(id)}
        >
          <span>{icon}</span>
          {label}
        </button>
      ))}
    </nav>
  );
}
