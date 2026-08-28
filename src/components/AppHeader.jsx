import { useState } from "react";
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonModal, IonTitle, IonItem, IonLabel } from "@ionic/react";
import { moonOutline, sunnyOutline, settingsOutline, closeOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";

import { useTheme } from "../context/ThemeContext.jsx";
import { useUiLang } from "../context/UiLangContext.jsx";

// The persistent top bar (brand/home, theme toggle, settings) shown identically on every
// screen — the settings modal (currently just the UI language toggle) lives right here too
// so every page gets it for free instead of wiring it up per page.
export default function AppHeader() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { t, rtlAttrs, toggleUiLang } = useUiLang();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <IonHeader>
        <IonToolbar {...rtlAttrs}>
          <IonButtons slot="start">
            <IonButton onClick={() => navigate("/")}>{t("appName")}</IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={toggleTheme} aria-label={isDark ? t("switchToLight") : t("switchToDark")}>
              <IonIcon icon={isDark ? sunnyOutline : moonOutline} slot="icon-only" />
            </IonButton>
            <IonButton onClick={() => setSettingsOpen(true)} aria-label={t("settings")}>
              <IonIcon icon={settingsOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonModal isOpen={settingsOpen} onDidDismiss={() => setSettingsOpen(false)} className="popup-modal">
        <IonHeader>
          <IonToolbar {...rtlAttrs}>
            <IonTitle>{t("settings")}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setSettingsOpen(false)} aria-label={t("close")}>
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
        </div>
      </IonModal>
    </>
  );
}
