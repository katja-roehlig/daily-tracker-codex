import { useState } from "react";
import { quotes } from "./data/defaults";
import { CalendarPage } from "./pages/CalendarPage";
import { EntryPage } from "./pages/EntryPage";
import { HomePage } from "./pages/HomePage";
import { EvaluationPage } from "./pages/EvaluationPage";
import { Navigation, type Page } from "./components/Navigation";
import { useTrackerData } from "./hooks/useTrackerData";
import { addDays, todayKey } from "./utils/date";
import styles from "./styles/App.module.css";
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selected, setSelected] = useState(todayKey());
  const tracker = useTrackerData();
  const { data, items, getEntry, increment, toggleMood, progress } = tracker;
  const openDay = (date: string) => {
    setSelected(date);
    setPage("entry");
  };
  const changePage = (next: Page) => {
    setPage(next);
    if (next === "entry") setSelected(todayKey());
  };
  const streak = (item: (typeof items)[number]) => {
    let count = 0,
      day = todayKey();
    while (progress(item, day)?.done) {
      count++;
      day = addDays(day, -1);
    }
    return count;
  };
  const quote = quotes[new Date().getDate() % quotes.length];
  return (
    <div className={styles.app}>
      <aside className={styles.side}>
        <div className={styles.brand}>
          <span>◒</span> Mein Tag
        </div>
        <Navigation page={page} setPage={changePage} />
      </aside>
      <main className={styles.main}>
        {page === "home" && (
          <HomePage
            quote={quote}
            items={items}
            progress={progress}
            streak={streak}
            onEntry={() => changePage("entry")}
            onCalendar={() => changePage("calendar")}
          />
        )}{" "}
        {page === "entry" && (
          <EntryPage
            date={selected}
            entry={getEntry(selected)}
            items={items}
            moods={data.moods}
            onIncrement={(id) => increment(selected, id)}
            onMood={(id) => toggleMood(selected, id)}
            onDate={openDay}
            onSaveCategory={tracker.saveCategory}
            onDeleteCategory={tracker.deleteCategory}
            onSaveTracker={tracker.saveTracker}
            onDeleteTracker={tracker.deleteTracker}
            onSaveMood={tracker.saveMood}
            onDeleteMood={tracker.deleteMood}
          />
        )}{" "}
        {page === "calendar" && (
          <CalendarPage
            data={data}
            items={items}
            selected={selected}
            onOpenDay={openDay}
          />
        )}{" "}
        {page === "evaluation" && <EvaluationPage data={data} items={items} />}
      </main>
      <div className={styles.mobileNav}>
        <Navigation page={page} setPage={changePage} />
      </div>
    </div>
  );
}
