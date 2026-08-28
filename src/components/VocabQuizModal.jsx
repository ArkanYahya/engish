import { useEffect, useState } from "react";
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent } from "@ionic/react";
import { closeOutline, volumeHighOutline } from "ionicons/icons";
import { useUiLang } from "../context/UiLangContext.jsx";
import { speak } from "../lib/tts.js";
import { playErrorSound } from "../lib/sound.js";
import { bumpVocabMistake, markVocabWordMastered } from "../lib/storage.js";
import { pickVocabQuizQuestion } from "../lib/vocabQuiz.js";

// Shared by "Quiz Me" (current level, English prompt/Arabic choices), "Reverse Quiz"
// (`reverse` — Arabic prompt/English choices), and "Review Mistakes" (every mistaken word
// across all levels) — the only differences are which word pools the caller passes in and
// which direction the question runs. `targetWords` is drawn from for the question itself;
// `distractorWords` (defaults to the same pool) supplies the wrong options, so a small
// target pool still gets good distractors.
export default function VocabQuizModal({ isOpen, onDismiss, targetWords, distractorWords, title, reverse }) {
  const { t, rtlAttrs } = useUiLang();
  const [current, setCurrent] = useState(null);

  function nextQuestion() {
    const question = pickVocabQuizQuestion(targetWords, distractorWords);
    setCurrent(question);
    // The prompt is only in English when not in reverse mode — Arabic prompts stay silent,
    // same rule as everywhere else in the app (the TTS engine only speaks English).
    if (!reverse) speak(question.word);
    return question;
  }

  useEffect(() => {
    if (isOpen && targetWords.length > 0) {
      nextQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const answered = current?.pickedIndex != null;

  function pick(idx) {
    if (answered) return;
    const correct = current.options[idx].ar === current.correctAr;
    if (correct) {
      bumpVocabMistake(current.category, current.word, -1);
      markVocabWordMastered(current.category, current.word);
      // Only the reverse-quiz options are English words worth reading back; the normal
      // mode's options are Arabic, which the engine can't speak.
      if (reverse) speak(current.options[idx].en);
    } else {
      bumpVocabMistake(current.category, current.word, 1);
      if (reverse) playErrorSound();
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
          {reverse ? (
            // Arabic prompt — no speaker here, the app's TTS only speaks English, so the
            // per-option speaker buttons below are where "listen" actually belongs.
            <h2 style={{ margin: 0 }} dir="rtl" lang="ar">
              {current.wordAr}
            </h2>
          ) : (
            <div className="grammar-rule-row" dir="ltr">
              <h2 style={{ margin: 0 }} dir="ltr" lang="en">
                {current.word}
              </h2>
              <IonButton fill="clear" shape="round" onClick={() => speak(current.word)} aria-label={t("listenToOption")}>
                <IonIcon icon={volumeHighOutline} slot="icon-only" />
              </IonButton>
            </div>
          )}

          {current.options.map((opt, i) => {
            const isThisCorrect = opt.ar === current.correctAr;
            let color;
            if (answered) {
              if (isThisCorrect) color = "success";
              else if (i === current.pickedIndex) color = "danger";
              else color = "medium";
            }
            return (
              <div className="option-row" key={i} dir={reverse ? "ltr" : undefined}>
                <IonButton
                  expand="block"
                  fill={answered && isThisCorrect ? "solid" : "outline"}
                  color={color}
                  disabled={answered}
                  onClick={() => pick(i)}
                >
                  {reverse ? (
                    <span dir="ltr" lang="en">
                      {opt.en}
                    </span>
                  ) : (
                    <span dir="rtl" lang="ar">
                      {opt.ar}
                    </span>
                  )}
                </IonButton>
                {reverse && (
                  <IonButton fill="clear" shape="round" onClick={() => speak(opt.en)} aria-label={t("listenToOption")}>
                    <IonIcon icon={volumeHighOutline} slot="icon-only" />
                  </IonButton>
                )}
              </div>
            );
          })}

          <IonButton expand="block" disabled={!answered} onClick={nextQuestion}>
            {t("vocabQuizNext")}
          </IonButton>
        </IonContent>
      )}
    </IonModal>
  );
}
