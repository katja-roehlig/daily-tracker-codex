import { useState, type ReactNode } from "react";
import { Navigation, type Page } from "../Navigation";
import styles from "./AppShell.module.css";

interface AppShellProps {
  page: Page;
  onPageChange: (page: Page) => void;
  children: ReactNode;
}

export function AppShell({ page, onPageChange, children }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = (nextPage: Page) => {
    setMenuOpen(false);
    onPageChange(nextPage);
  };

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
        <Navigation page={page} setPage={navigate} />
      </aside>

      <main className={styles.main}>{children}</main>

      <div
        className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ""}`}
      >
        <Navigation page={page} setPage={navigate} />
      </div>
    </div>
  );
}
