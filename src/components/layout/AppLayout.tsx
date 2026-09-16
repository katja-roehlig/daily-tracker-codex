import { Outlet } from "react-router-dom";
import { Navigation } from "../navigation/Navigation";
import styles from "./AppLayout.module.css";
import LogoMob from "../../styles/Logo_9.svg?react";
import LogoDesk from "../../styles/Logo_10.svg?react";

export function AppLayout() {
  return (
    <div className={styles.app}>
      <header className={styles.mobileHeader}>
        <div className={styles.mobileBrand}>
          <LogoMob className={styles.logo} />
          <h1>Tageskram</h1>
        </div>
      </header>

      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div>
            <LogoDesk className={styles.logo} />
          </div>
          <h1>Tageskram</h1>
        </div>
        <Navigation />
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>

      <div className={styles.mobileNav}>
        <Navigation mobile />
      </div>
    </div>
  );
}
