import {
  useNavigate,
  useParams,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { quotes } from "../data/defaults";
import { CalendarPage } from "../pages/CalendarPage";
import { EntryPage } from "../pages/EntryPage";
import { HomePage } from "../pages/HomePage";
import { EvaluationPage } from "../pages/EvaluationPage";
import { AppShell } from "../components/layout/AppShell";
import { todayKey } from "../utils/date";

function EntryRoute() {
  const navigate = useNavigate();
  const { date = todayKey() } = useParams<{ date: string }>();
  return (
    <EntryPage
      date={date}
      onDate={(nextDate) => navigate(`/eintrag/${nextDate}`)}
    />
  );
}

function CalendarRoute() {
  const navigate = useNavigate();
  return (
    <CalendarPage
      selected={todayKey()}
      onOpenDay={(date) => navigate(`/eintrag/${date}`)}
    />
  );
}

export default function App() {
  const navigate = useNavigate();
  const quote = quotes[new Date().getDate() % quotes.length];
  return (
    <AppShell>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              quote={quote}
              onEntry={() => navigate("/eintrag")}
              onCalendar={() => navigate("/kalender")}
            />
          }
        />
        <Route path="/eintrag" element={<EntryRoute />} />
        <Route path="/eintrag/:date" element={<EntryRoute />} />
        <Route path="/kalender" element={<CalendarRoute />} />
        <Route path="/auswertung" element={<EvaluationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
