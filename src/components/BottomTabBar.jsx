import { useRef, useState } from "react";
import { IonFooter, IonAlert } from "@ionic/react";
import { useNavigate } from "react-router-dom";

import { useUiLang } from "../context/UiLangContext.jsx";
import { useSync } from "../context/SyncContext.jsx";
import { LEVEL_VOCABULARY, LEVEL_GRAMMAR } from "../lib/content.js";
import { exportProgressData, importProgressData, summarizeProgressData } from "../lib/storage.js";
import { HomeIcon, BookIcon, GrammarIcon, SettingsIcon } from "./icons.jsx";
import SettingsModal from "./SettingsModal.jsx";
import AboutModal from "./AboutModal.jsx";

// Persistent bottom navigation for the "browsing" screens (Home, Vocabulary, Grammar) —
// replaces the old fixed top toolbar there. Vocabulary/Grammar are level-scoped and only
// exist for levels that actually have that content (see lib/content.js), so those tabs
// disable themselves rather than navigating somewhere broken when there's no active level
// or the active level has none. Settings opens the same popup from anywhere via this bar
// instead of needing its own top-bar icon.
export default function BottomTabBar({ active, levelId }) {
  const navigate = useNavigate();
  const { t, isArabicUi } = useUiLang();
  const { conflict, resolveConflict } = useSync();
  const [settingsOpen, setSettingsOpen] = useState(false);
  // Owned up here, not inside SettingsModal — Settings closes itself the instant About/
  // Backup/Restore is picked (see SettingsModal), and IonModal drops its children while
  // isOpen is false, so anything nested inside SettingsModal's own JSX would get unmounted
  // right along with it (a real bug caught with an earlier Firebase-test panel — the hidden
  // file input below would lose its pending file-picker interaction the same way). Keeping
  // all of these as siblings, each independently controlled, avoids that.
  const [aboutOpen, setAboutOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [pendingImport, setPendingImport] = useState(null);
  const [importError, setImportError] = useState(false);

  const hasVocab = !!(levelId && LEVEL_VOCABULARY[levelId]);
  const hasGrammar = !!(levelId && LEVEL_GRAMMAR[levelId]);

  function handleBackup() {
    const payload = exportProgressData();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hamolingo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleRestoreClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so picking the same file again still fires onChange
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed || typeof parsed.data !== "object" || parsed.data === null) throw new Error("bad shape");
        setPendingImport(parsed);
      } catch {
        setImportError(true);
      }
    };
    reader.onerror = () => setImportError(true);
    reader.readAsText(file);
  }

  function confirmRestore() {
    if (!pendingImport) return;
    importProgressData(pendingImport);
    // Simplest way to get every context (theme, UI language, quiz progress, ...) back in
    // sync with the just-restored localStorage — each was only read once at mount.
    window.location.reload();
  }

  // "N level(s) in progress · N word(s) mastered · N mistake(s) tracked", or a "no progress"
  // fallback — same formatting for either side of the merge-conflict prompt below.
  function formatSummary(data) {
    const { levelsInProgress, mastered, mistakes } = summarizeProgressData(data);
    const parts = [];
    if (levelsInProgress > 0) parts.push(t("syncSummaryLevels", levelsInProgress));
    if (mastered > 0) parts.push(t("syncSummaryMastered", mastered));
    if (mistakes > 0) parts.push(t("syncSummaryMistakes", mistakes));
    return parts.length > 0 ? parts.join(" · ") : t("syncNoProgress");
  }

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
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onOpenAbout={() => setAboutOpen(true)}
        onBackup={handleBackup}
        onRestoreClick={handleRestoreClick}
      />
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <IonAlert
        isOpen={!!pendingImport}
        onDidDismiss={() => setPendingImport(null)}
        header={t("restoreConfirmTitle")}
        message={t("restoreConfirmBody")}
        buttons={[
          { text: t("cancel"), role: "cancel" },
          { text: t("restoreConfirmYes"), role: "destructive", handler: confirmRestore },
        ]}
      />
      <IonAlert
        isOpen={importError}
        onDidDismiss={() => setImportError(false)}
        header={t("restoreInvalidFile")}
        buttons={[{ text: t("close") }]}
      />

      {/* Only real conflict case: both this device and the signed-in account have their own
          real progress and they differ (see SyncContext) — every other combination resolves
          itself silently. No dismiss-by-backdrop: this needs an actual choice, not a "close
          and pretend it didn't happen" that would just re-prompt on next launch anyway. */}
      <IonAlert
        isOpen={!!conflict}
        backdropDismiss={false}
        header={t("syncConflictTitle")}
        message={conflict ? t("syncConflictBody", formatSummary(conflict.localData), formatSummary(conflict.cloudData)) : ""}
        buttons={[
          { text: t("syncConflictKeepDevice"), handler: () => resolveConflict("local") },
          { text: t("syncConflictKeepCloud"), handler: () => resolveConflict("cloud") },
        ]}
      />
    </>
  );
}
