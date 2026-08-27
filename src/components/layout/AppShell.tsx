import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Navigation } from "../navigation/Navigation";
import styles from "./AppShell.module.css";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className={styles.app}>
      <header className={styles.mobileHeader}>
        <div className={styles.mobileBrand}>
          <span>◒</span> Mein Tag
        </div>
        <button
          className={styles.menuButton}
          type="button"
          aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <i />
          <i />
          <i />
        </button>
      </header>

      <aside className={styles.side}>
        <div className={styles.brand}>
          <span>◒</span> Mein Tag
        </div>
        <Navigation />
      </aside>

      <main className={styles.main}>{children}</main>

      <div
        className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ""}`}
      >
        <Navigation />
      </div>
    </div>
  );
}
