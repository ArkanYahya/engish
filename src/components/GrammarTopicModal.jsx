import { useEffect, useState } from "react";
import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonContent } from "@ionic/react";
import { closeOutline, volumeHighOutline, globeOutline } from "ionicons/icons";
import { useUiLang } from "../context/UiLangContext.jsx";
import { speak } from "../lib/tts.js";
import { bidiSafe } from "../lib/bidi.jsx";

// Shows the rule plus a few example sentences, Arabic hidden until asked for — one toggle
// reveals the rule's translation and every example's translation together, rather than a
// separate reveal per line, to keep the modal from getting cluttered with icon buttons.
//
// `topic` becomes null the instant the parent wants to close this, but IonModal plays its
// own exit animation before unmounting — displayTopic holds the last non-null value so
// content stays visible through that animation instead of blanking mid-transition.
export default function GrammarTopicModal({ topic, onDismiss }) {
  const { t, rtlAttrs } = useUiLang();
  const [revealed, setRevealed] = useState(false);
  const [displayTopic, setDisplayTopic] = useState(topic);

  useEffect(() => {
    if (topic) {
      setDisplayTopic(topic);
      setRevealed(false);
    }
  }, [topic]);

  return (
    <IonModal isOpen={!!topic} onDidDismiss={onDismiss} initialBreakpoint={0.6} breakpoints={[0, 0.6, 0.95]}>
      <IonHeader>
        <IonToolbar className="close-only-toolbar" {...rtlAttrs}>
          <IonButtons slot="end">
            <IonButton onClick={onDismiss} aria-label={t("close")}>
              <IonIcon icon={closeOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      {displayTopic && (
        <IonContent className="ion-padding" {...rtlAttrs}>
          <p className="modal-label">{t("grammar")}</p>
          <h2 style={{ margin: "4px 0 14px" }}>{displayTopic.topic}</h2>
          {displayTopic.testedInQuiz === false && <p className="grammar-bonus-note">{t("grammarBonusNote")}</p>}

          <div className="grammar-rule-row">
            <p className="grammar-rule-en" dir="ltr" lang="en">
              {displayTopic.rule}
            </p>
            <IonButton fill="clear" shape="round" onClick={() => speak(displayTopic.rule)} aria-label={t("listenToOption")}>
              <IonIcon icon={volumeHighOutline} slot="icon-only" />
            </IonButton>
          </div>
          {revealed && (
            <p className="grammar-rule-ar" dir="rtl" lang="ar">
              {bidiSafe(displayTopic.ruleAr)}
            </p>
          )}

          <p className="grammar-examples-label" {...rtlAttrs}>
            {t("grammarExamplesLabel")}
          </p>
          {displayTopic.examples.map((ex, i) => (
            <div key={i}>
              <div className="grammar-example-row">
                <p className="grammar-example-en" dir="ltr" lang="en">
                  {ex.en}
                </p>
                <IonButton fill="clear" shape="round" onClick={() => speak(ex.en)} aria-label={t("listenToOption")}>
                  <IonIcon icon={volumeHighOutline} slot="icon-only" />
                </IonButton>
              </div>
              {revealed && (
                <p className="grammar-example-ar" dir="rtl" lang="ar">
                  {bidiSafe(ex.ar)}
                </p>
              )}
            </div>
          ))}

          {!revealed && (
            <IonButton fill="clear" shape="round" onClick={() => setRevealed(true)} aria-label={t("showTranslation")}>
              <IonIcon icon={globeOutline} slot="icon-only" />
            </IonButton>
          )}
        </IonContent>
      )}
    </IonModal>
  );
}
