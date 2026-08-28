import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonToggle } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

import { useTheme } from "../context/ThemeContext.jsx";
import { useUiLang } from "../context/UiLangContext.jsx";
import { diagnoseSpeech } from "../lib/tts.js";

// App-wide preferences — currently language and dark mode — reachable from the Settings
// tab in the bottom bar (browsing screens) and, mid-quiz, from the close-flow top bar.
export default function SettingsModal({ isOpen, onClose }) {
  const { isDark, toggleTheme } = useTheme();
  const { t, rtlAttrs, toggleUiLang } = useUiLang();

  // Temporary diagnostic for the mobile-silent-speaker investigation — shows exactly what
  // happened (onstart/onerror/timeout, voice count, standalone mode) via a native alert(),
  // so a report can come back from a phone with no dev tools attached. Safe to remove once
  // the root cause is confirmed.
  async function testSpeaker() {
    const report = await diagnoseSpeech();
    window.alert(report);
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="popup-modal">
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
      <div {...rtlAttrs}>
        <IonItem button onClick={toggleUiLang} lines="none">
          <IonLabel>{t("language")}</IonLabel>
          <IonLabel slot="end">{t("switchUiLang")}</IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>{t("darkMode")}</IonLabel>
          <IonToggle
            checked={isDark}
            onIonChange={toggleTheme}
            slot="end"
            aria-label={isDark ? t("switchToLight") : t("switchToDark")}
          />
        </IonItem>
        <IonItem button onClick={testSpeaker} lines="none">
          <IonLabel>{t("testSpeaker")}</IonLabel>
        </IonItem>
      </div>
    </IonModal>
  );
}
