import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

/* Core Ionic CSS (required) */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
/* Class-based dark palette — toggled by ThemeContext via .ion-palette-dark on <html>,
   in step with our own data-theme attribute (see theme.css). */
import "@ionic/react/css/palettes/dark.class.css";

import "./theme.css";
import "./quiz.css";
import App from "./App.jsx";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
