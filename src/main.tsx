import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { TrackerProvider } from "./app/TrackerProvider";
import "./styles/global.css";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TrackerProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TrackerProvider>
  </StrictMode>,
);
