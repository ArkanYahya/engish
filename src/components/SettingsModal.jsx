import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonItem, IonLabel, IonToggle } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

import { useTheme } from "../context/ThemeContext.jsx";
import { useUiLang } from "../context/UiLangContext.jsx";

// App-wide preferences — currently language and dark mode — reachable from the Settings
// tab in the bottom bar. Presented as a real bottom-sheet menu (drag handle, same pattern
// as StageSheet) rather than the centered "popup-modal" card style — About opens from here
// as its own popup-modal, and a floating card stacked on top of another floating card read
// as visually confusing, whereas a card over a sheet reads as an actual menu item opening.
//
// About lives as a sibling in BottomTabBar, not nested here — see the comment there for why.
export default function SettingsModal({ isOpen, onClose, onOpenAbout }) {
  const { isDark, toggleTheme } = useTheme();
  const { uiLang, t, rtlAttrs, toggleUiLang } = useUiLang();

  // Every choice in this sheet dismisses it, same as a native action sheet — picking a
  // language, flipping dark mode, or opening About all close the menu behind them rather
  // than leaving it sitting open once its job is done.
  function selectLanguage(lang) {
    if (lang !== uiLang) toggleUiLang();
    onClose();
  }

  function handleToggleTheme() {
    toggleTheme();
    onClose();
  }

  function openAbout() {
    onOpenAbout();
    onClose();
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} initialBreakpoint={0.36} breakpoints={[0, 0.36]}>
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
        <div className="settings-lang-row">
          <button
            type="button"
            className={`settings-lang-btn ${uiLang === "en" ? "active" : ""}`}
            onClick={() => selectLanguage("en")}
          >
            English
          </button>
          <button
            type="button"
            className={`settings-lang-btn ${uiLang === "ar" ? "active" : ""}`}
            dir="rtl"
            lang="ar"
            onClick={() => selectLanguage("ar")}
          >
            العربية
          </button>
        </div>
        <IonItem lines="none">
          <IonLabel>{t("darkMode")}</IonLabel>
          <IonToggle
            checked={isDark}
            onIonChange={handleToggleTheme}
            slot="end"
            aria-label={isDark ? t("switchToLight") : t("switchToDark")}
          />
        </IonItem>
        <IonItem button onClick={openAbout} lines="none" detail>
          <IonLabel>{t("about")}</IonLabel>
        </IonItem>
      </IonContent>
    </IonModal>
  );
}
