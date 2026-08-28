import { useEffect, useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { Navigation } from "../navigation/Navigation";
import styles from "./AppLayout.module.css";

export function AppLayout() {
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

      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span>◒</span> Mein Tag
        </div>
        <Navigation />
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>

      <div
        className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ""}`}
      >
        <Navigation />
      </div>
    </div>
  );
}
