import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { useUiLang } from "../context/UiLangContext.jsx";

export default function TranslationModal({ isOpen, onClose, questionEn, questionAr }) {
  const { t } = useUiLang();

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="popup-modal">
      <IonHeader>
        <IonToolbar className="close-only-toolbar">
          <IonButtons slot="end">
            <IonButton onClick={onClose} aria-label={t("close")}>
              <IonIcon icon={closeOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <div className="ion-padding">
        <p className="modal-label">English</p>
        <p>{questionEn}</p>
        <p className="modal-label" dir="rtl">
          بالعربية
        </p>
        <p dir="rtl" lang="ar">
          {questionAr}
        </p>
      </div>
    </IonModal>
  );
}
