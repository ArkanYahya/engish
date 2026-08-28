import { useEffect, useState } from "react";
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent } from "@ionic/react";
import { closeOutline, volumeHighOutline } from "ionicons/icons";
import { useUiLang } from "../context/UiLangContext.jsx";
import { speak } from "../lib/tts.js";
import { bumpVocabMistake } from "../lib/storage.js";
import { pickVocabQuizQuestion } from "../lib/vocabQuiz.js";

export default function VocabQuizModal({ isOpen, onDismiss, vocabulary }) {
  const { t, rtlAttrs } = useUiLang();
  const [current, setCurrent] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrent(pickVocabQuizQuestion(vocabulary));
      setScore(0);
      setTotal(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const answered = current?.pickedIndex != null;
  const isCorrect = answered && current.options[current.pickedIndex].ar === current.correctAr;

  function pick(idx) {
    if (answered) return;
    const correct = current.options[idx].ar === current.correctAr;
    setTotal((n) => n + 1);
    if (correct) {
      setScore((s) => s + 1);
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
          <IonTitle>{t("quizMe")}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDismiss} aria-label={t("close")}>
              <IonIcon icon={closeOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      {current && (
        <IonContent className="ion-padding" {...rtlAttrs}>
          <p>{t("vocabQuizScore", score, total)}</p>
          <div className="grammar-rule-row">
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

          {answered && (
            <div className={`feedback ${isCorrect ? "feedback-correct" : "feedback-incorrect"}`}>
              <strong {...rtlAttrs}>{isCorrect ? t("correct") : t("notQuite")}</strong>
            </div>
          )}

          <IonButton
            expand="block"
            disabled={!answered}
            onClick={() => setCurrent(pickVocabQuizQuestion(vocabulary))}
          >
            {t("vocabQuizNext")}
          </IonButton>
        </IonContent>
      )}
    </IonModal>
  );
}
