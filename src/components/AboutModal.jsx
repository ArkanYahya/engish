import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from "@ionic/react";
import { closeOutline, mailOutline, heartOutline } from "ionicons/icons";

import { useUiLang } from "../context/UiLangContext.jsx";

// Version comes from package.json via a Vite `define` (see vite.config.js) — replaced at
// build time with a literal string, so there's no runtime fetch and no risk of it drifting
// out of sync with what actually shipped.
const APP_VERSION = __APP_VERSION__;
const DEVELOPER_EMAIL = "arkan.yahya.noah@gmail.com";

// Reached from Settings ("About") — static info only, no preferences to change here.
export default function AboutModal({ isOpen, onClose }) {
  const { t, rtlAttrs } = useUiLang();

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="popup-modal">
      <IonHeader>
        <IonToolbar {...rtlAttrs}>
          <IonTitle>{t("about")}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose} aria-label={t("close")}>
              <IonIcon icon={closeOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <div className="about-scroll" {...rtlAttrs}>
        <div className="about-body">
          <img src="/icon-512.png" alt={t("appName")} className="about-icon" />
          <h2 className="about-app-name">{t("appName")}</h2>
          <p className="about-version">{t("aboutVersion", APP_VERSION)}</p>

          <p className="about-text">{t("aboutDescription")}</p>
          <p className="about-text about-text-muted">{t("aboutWordListCredit")}</p>

          <a className="about-developer" href={`mailto:${DEVELOPER_EMAIL}`}>
            <IonIcon icon={mailOutline} />
            <span>
              {t("aboutDeveloper")}
              <br />
              <span dir="ltr">{DEVELOPER_EMAIL}</span>
            </span>
          </a>

          <div className="about-thanks">
            <IonIcon icon={heartOutline} />
            <span>{t("aboutThanks")}</span>
          </div>
        </div>
      </div>
    </IonModal>
  );
}
