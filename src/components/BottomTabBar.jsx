import { useState } from "react";
import { IonFooter } from "@ionic/react";
import { useNavigate } from "react-router-dom";

import { useUiLang } from "../context/UiLangContext.jsx";
import { LEVEL_VOCABULARY, LEVEL_GRAMMAR } from "../lib/content.js";
import { HomeIcon, BookIcon, GrammarIcon, SettingsIcon } from "./icons.jsx";
import SettingsModal from "./SettingsModal.jsx";

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
