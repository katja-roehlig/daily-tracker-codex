import { useEffect, useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { Navigation } from "../navigation/Navigation";
import styles from "./AppLayout.module.css";
import LogoMob from "../../styles/Logo_9.svg?react";
import LogoDesk from "../../styles/Logo_10.svg?react";

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
          <div>
            <LogoMob className={styles.logo} />
          </div>
          <h1>Gedöhns</h1>
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
          <div>
            <LogoDesk className={styles.logo} />
          </div>
          <h1>Gedöhns</h1>
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
