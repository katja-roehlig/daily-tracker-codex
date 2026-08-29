import {
  useNavigate,
  useParams,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { quotes } from "../data/quotes";
import { CalendarPage } from "../pages/CalendarPage";
import { EntryPage } from "../pages/EntryPage";
import { HomePage } from "../pages/HomePage";
import { EvaluationPage } from "../pages/EvaluationPage";
import { AppLayout } from "../components/layout/AppLayout";
import { todayKey } from "../utils/date";
import type { Quote } from "../types";

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
  const getDaySeed = () => {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  };
  const quoteIndex = getDaySeed() % quotes.length;
  const quote: Quote = quotes[quoteIndex];

  return (
    <Routes>
      <Route element={<AppLayout />}>
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
      </Route>
    </Routes>
  );
}
