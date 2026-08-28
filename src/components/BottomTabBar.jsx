import { useState } from "react";
import { IonFooter } from "@ionic/react";
import { useNavigate } from "react-router-dom";

import { useUiLang } from "../context/UiLangContext.jsx";
import { LEVEL_VOCABULARY, LEVEL_GRAMMAR } from "../lib/content.js";
import SettingsModal from "./SettingsModal.jsx";

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l9-7 9 7" />
    <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
    <path d="M4 5.5v15" />
  </svg>
);

const GrammarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v4M5 8l3 2M19 8l-3 2M6 21h12M9 21v-4a3 3 0 0 1 6 0v4" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// Persistent bottom navigation for the "browsing" screens (Home, Vocabulary, Grammar) —
// replaces the old fixed top toolbar there. Vocabulary/Grammar are level-scoped and only
// exist for levels that actually have that content (see lib/content.js), so those tabs
// disable themselves rather than navigating somewhere broken when there's no active level
// or the active level has none. Settings opens the same popup from anywhere via this bar
// instead of needing its own top-bar icon.
export default function BottomTabBar({ active, levelId }) {
  const navigate = useNavigate();
  const { t, isArabicUi } = useUiLang();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const hasVocab = !!(levelId && LEVEL_VOCABULARY[levelId]);
  const hasGrammar = !!(levelId && LEVEL_GRAMMAR[levelId]);

  return (
    <>
      <IonFooter>
        <nav className="tabbar" dir={isArabicUi ? "rtl" : "ltr"}>
          <button className={`tab ${active === "home" ? "active" : ""}`} type="button" onClick={() => navigate("/")}>
            <HomeIcon />
            <span>{t("navHome")}</span>
          </button>
          <button
            className={`tab ${active === "vocabulary" ? "active" : ""}`}
            type="button"
            disabled={!hasVocab}
            onClick={() => hasVocab && navigate(`/quiz/${levelId}/vocabulary`)}
          >
            <BookIcon />
            <span>{t("vocabulary")}</span>
          </button>
          <button
            className={`tab ${active === "grammar" ? "active" : ""}`}
            type="button"
            disabled={!hasGrammar}
            onClick={() => hasGrammar && navigate(`/quiz/${levelId}/grammar`)}
          >
            <GrammarIcon />
            <span>{t("grammar")}</span>
          </button>
          <button className="tab" type="button" onClick={() => setSettingsOpen(true)}>
            <SettingsIcon />
            <span>{t("settings")}</span>
          </button>
        </nav>
      </IonFooter>
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
