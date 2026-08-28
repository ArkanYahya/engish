import { useEffect, useState } from "react";
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent } from "@ionic/react";
import { closeOutline, volumeHighOutline } from "ionicons/icons";
import { useUiLang } from "../context/UiLangContext.jsx";
import { speak } from "../lib/tts.js";
import { bumpVocabMistake } from "../lib/storage.js";
import { pickVocabQuizQuestion } from "../lib/vocabQuiz.js";

// Shared by both "Quiz Me" (current level only) and "Review Mistakes" (every mistaken
// word across all levels) — the only difference is which word pools the caller passes in.
// `targetWords` is drawn from for the question itself; `distractorWords` (defaults to the
// same pool) supplies the wrong options, so a small target pool still gets good distractors.
export default function VocabQuizModal({ isOpen, onDismiss, targetWords, distractorWords, title }) {
  const { t, rtlAttrs } = useUiLang();
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (isOpen && targetWords.length > 0) {
      setCurrent(pickVocabQuizQuestion(targetWords, distractorWords));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const answered = current?.pickedIndex != null;

  function pick(idx) {
    if (answered) return;
    const correct = current.options[idx].ar === current.correctAr;
    if (correct) {
      bumpVocabMistake(current.category, current.word, -1);
    } else {
      bumpVocabMistake(current.category, current.word, 1);
    }
    setCurrent({ ...current, pickedIndex: idx });
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss} initialBreakpoint={0.65} breakpoints={[0, 0.65, 0.95]}>
      <IonHeader>
        <IonToolbar {...rtlAttrs}>
          <IonTitle>{title ?? t("quizMe")}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDismiss} aria-label={t("close")}>
              <IonIcon icon={closeOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      {current && (
        <IonContent className="ion-padding" {...rtlAttrs}>
          <div className="grammar-rule-row" dir="ltr">
            <h2 style={{ margin: 0 }} dir="ltr" lang="en">
              {current.word}
            </h2>
            <IonButton fill="clear" shape="round" onClick={() => speak(current.word)} aria-label={t("listenToOption")}>
              <IonIcon icon={volumeHighOutline} slot="icon-only" />
            </IonButton>
          </div>

          {current.options.map((opt, i) => {
            const isThisCorrect = opt.ar === current.correctAr;
            let color;
            if (answered) {
              if (isThisCorrect) color = "success";
              else if (i === current.pickedIndex) color = "danger";
              else color = "medium";
            }
            return (
              <div className="option-row" key={i}>
                <IonButton
                  expand="block"
                  fill={answered && isThisCorrect ? "solid" : "outline"}
                  color={color}
                  disabled={answered}
                  onClick={() => pick(i)}
                >
                  <span dir="rtl" lang="ar">
                    {opt.ar}
                  </span>
                </IonButton>
              </div>
            );
          })}

          <IonButton
            expand="block"
            disabled={!answered}
            onClick={() => setCurrent(pickVocabQuizQuestion(targetWords, distractorWords))}
          >
            {t("vocabQuizNext")}
          </IonButton>
        </IonContent>
      )}
    </IonModal>
  );
}
