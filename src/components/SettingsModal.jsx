import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonItem, IonLabel, IonToggle } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

import { useTheme } from "../context/ThemeContext.jsx";
import { useUiLang } from "../context/UiLangContext.jsx";

const ACCENTS = ["violet", "red"];

// App-wide preferences — language, accent color, and light/dark mode — reachable from the
// Settings tab in the bottom bar. Presented as a real bottom-sheet menu (drag handle, same
// pattern as StageSheet) rather than the centered "popup-modal" card style — About opens
// from here as its own popup-modal, and a floating card stacked on top of another floating
// card read as visually confusing, whereas a card over a sheet reads as an actual menu item
// opening.
//
// About and the backup/restore file-picker live as siblings in BottomTabBar, not nested
// here — see the comment there for why.
export default function SettingsModal({ isOpen, onClose, onOpenAbout, onBackup, onRestoreClick }) {
  const { isDark, selectMode, accent, selectAccent } = useTheme();
  const { uiLang, t, rtlAttrs, toggleUiLang } = useUiLang();

  // Every choice in this sheet dismisses it, same as a native action sheet — picking a
  // language, an accent, flipping dark mode, or picking About/Backup/Restore all close the
  // menu behind them rather than leaving it sitting open once its job is done.
  function selectLanguage(lang) {
    if (lang !== uiLang) toggleUiLang();
    onClose();
  }

  function handleSelectAccent(next) {
    selectAccent(next);
    onClose();
  }

  function handleToggleMode() {
    selectMode(isDark ? "light" : "dark");
    onClose();
  }

  function openAbout() {
    onOpenAbout();
    onClose();
  }

  function backup() {
    onBackup();
    onClose();
  }

  function restore() {
    onRestoreClick();
    onClose();
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} initialBreakpoint={0.68} breakpoints={[0, 0.68]}>
      <IonHeader>
        <IonToolbar {...rtlAttrs}>
          <IonTitle>{t("settings")}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose} aria-label={t("close")}>
              <IonIcon icon={closeOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent {...rtlAttrs} className="settings-sheet-body">
        <p className="settings-section-label">{t("language")}</p>
        <div className="settings-choice-row">
          <button
            type="button"
            className={`settings-choice-btn ${uiLang === "en" ? "active" : ""}`}
            onClick={() => selectLanguage("en")}
          >
            English
          </button>
          <button
            type="button"
            className={`settings-choice-btn ${uiLang === "ar" ? "active" : ""}`}
            dir="rtl"
            lang="ar"
            onClick={() => selectLanguage("ar")}
          >
            العربية
          </button>
        </div>
        <p className="settings-section-label">{t("theme")}</p>
        <div className="settings-choice-row">
          {ACCENTS.map((value) => (
            <button
              key={value}
              type="button"
              className={`settings-choice-btn ${accent === value ? "active" : ""}`}
              onClick={() => handleSelectAccent(value)}
            >
              {t(`accent${value[0].toUpperCase()}${value.slice(1)}`)}
            </button>
          ))}
        </div>
        <IonItem lines="none">
          <IonLabel>{t("darkMode")}</IonLabel>
          <IonToggle
            checked={isDark}
            onIonChange={handleToggleMode}
            slot="end"
            aria-label={isDark ? t("switchToLight") : t("switchToDark")}
          />
        </IonItem>
        <p className="settings-section-label">{t("data")}</p>
        <IonItem button onClick={backup} lines="none">
          <IonLabel>{t("backupProgress")}</IonLabel>
        </IonItem>
        <IonItem button onClick={restore} lines="none">
          <IonLabel>{t("restoreProgress")}</IonLabel>
        </IonItem>
        <IonItem button onClick={openAbout} lines="none" detail>
          <IonLabel>{t("about")}</IonLabel>
        </IonItem>
      </IonContent>
    </IonModal>
  );
}
