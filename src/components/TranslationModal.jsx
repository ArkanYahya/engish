import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonContent } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { useUiLang } from "../context/UiLangContext.jsx";

export default function TranslationModal({ isOpen, onClose, questionEn, questionAr }) {
  const { t } = useUiLang();

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} initialBreakpoint={0.4} breakpoints={[0, 0.4, 0.6]}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={onClose} aria-label={t("close")}>
              <IonIcon icon={closeOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p className="modal-label">English</p>
        <p>{questionEn}</p>
        <p className="modal-label" dir="rtl">
          بالعربية
        </p>
        <p dir="rtl" lang="ar">
          {questionAr}
        </p>
      </IonContent>
    </IonModal>
  );
}
