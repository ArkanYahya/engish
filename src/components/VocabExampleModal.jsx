import { useEffect, useState } from "react";
import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonContent } from "@ionic/react";
import { closeOutline, volumeHighOutline, globeOutline } from "ionicons/icons";
import { useUiLang } from "../context/UiLangContext.jsx";
import { speak } from "../lib/tts.js";

// Shows the word's example sentence with the Arabic translation hidden until the learner
// asks for it, so they're nudged to try reading the English sentence first.
//
// `word` becomes null the instant the parent wants to close this — but IonModal plays its
// own exit animation before actually unmounting, so rendering strictly off `word` would
// blank the content out mid-animation. `displayWord` instead keeps the last non-null value
// until a new one arrives, so the content stays visible throughout the close transition.
export default function VocabExampleModal({ word, onDismiss }) {
  const { t, rtlAttrs } = useUiLang();
  const [revealed, setRevealed] = useState(false);
  const [displayWord, setDisplayWord] = useState(word);

  useEffect(() => {
    if (word) {
      setDisplayWord(word);
      setRevealed(false);
    }
  }, [word]);

  return (
    <IonModal isOpen={!!word} onDidDismiss={onDismiss} initialBreakpoint={0.5} breakpoints={[0, 0.5, 0.8]}>
      <IonHeader>
        <IonToolbar {...rtlAttrs}>
          <IonButtons slot="end">
            <IonButton onClick={onDismiss} aria-label={t("close")}>
              <IonIcon icon={closeOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      {displayWord && (
        <IonContent className="ion-padding" {...rtlAttrs}>
          <p className="modal-label">{t("exampleSentence")}</p>
          <div className="grammar-rule-row">
            <h2 style={{ margin: 0 }} dir="ltr" lang="en">
              {displayWord.en}
            </h2>
            <IonButton fill="clear" shape="round" onClick={() => speak(displayWord.en)} aria-label={t("listenToOption")}>
              <IonIcon icon={volumeHighOutline} slot="icon-only" />
            </IonButton>
          </div>
          <p dir="ltr" lang="en">
            {displayWord.ex}
          </p>
          {revealed ? (
            <p dir="rtl" lang="ar">
              {displayWord.exAr}
            </p>
          ) : (
            <IonButton fill="clear" shape="round" onClick={() => setRevealed(true)} aria-label={t("showTranslation")}>
              <IonIcon icon={globeOutline} slot="icon-only" />
            </IonButton>
          )}
        </IonContent>
      )}
    </IonModal>
  );
}
