import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IonPage, IonContent, IonFooter, IonButton, IonIcon } from "@ionic/react";
import { volumeHighOutline, globeOutline, closeOutline, appsOutline, checkmarkCircleOutline, closeCircleOutline } from "ionicons/icons";

import { useQuiz } from "../context/QuizContext.jsx";
import { useUiLang } from "../context/UiLangContext.jsx";
import { speak } from "../lib/tts.js";
import { playErrorSound } from "../lib/sound.js";
import { stageOf } from "../lib/quiz.js";
import StageSheet from "../components/StageSheet.jsx";
import TranslationModal from "../components/TranslationModal.jsx";

export default function Question() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { currentLevel, state, selectLevel, updateState } = useQuiz();
  const { t, rtlAttrs } = useUiLang();
  const [stagesOpen, setStagesOpen] = useState(false);
  const [translateOpen, setTranslateOpen] = useState(false);

  useEffect(() => {
    if (!currentLevel || currentLevel.id !== levelId) {
      const level = selectLevel(levelId);
      // A saved level that's already completed belongs on Results, not Question.
      if (level) {
        const loaded = JSON.parse(localStorage.getItem(`engish-quiz-progress-${levelId}`) || "null");
        if (loaded?.completed) navigate(`/quiz/${levelId}/results`, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  if (!currentLevel || !state || currentLevel.id !== levelId) {
    return (
      <IonPage>
        <IonContent className="ion-padding" />
      </IonPage>
    );
  }

  const questions = currentLevel.questions;
  const stageSize = currentLevel.STAGE_SIZE;
  const totalStages = currentLevel.TOTAL_STAGES;
  const totalQuestions = questions.length;

  const q = questions[state.current];
  const picked = state.answers[state.current];
  const isAnswered = picked !== null;
  const isCorrect = isAnswered && picked === q.answer;
  // Progress bar reflects the current stage (n/10), not the whole level (n/50) — it should
  // reset to empty at the start of every new stage instead of just creeping up over all 5.
  const stageStart = stageOf(state.current, stageSize) * stageSize;
  const answeredInStage = state.answers.slice(stageStart, stageStart + stageSize).filter((a) => a !== null).length;
  const pct = Math.round((answeredInStage / stageSize) * 100);

  function pickAnswer(index) {
    if (isAnswered) return;
    updateState((prev) => {
      const answers = [...prev.answers];
      answers[prev.current] = index;
      return { ...prev, answers };
    });
    if (index === q.answer) {
      speak(q.options[index]);
    } else {
      playErrorSound();
    }
  }

  function goNext() {
    if (state.answers[state.current] === null) return;

    const finishedStage = state.current % stageSize === stageSize - 1;
    const isLastQuestion = state.current === totalQuestions - 1;

    if (isLastQuestion) {
      updateState((prev) => ({ ...prev, completed: true }));
      navigate(`/quiz/${levelId}/results`);
      return;
    }

    const finishedStageIndex = stageOf(state.current, stageSize);
    updateState((prev) => ({ ...prev, current: prev.current + 1 }));

    if (finishedStage) {
      navigate(`/quiz/${levelId}/stage/${finishedStageIndex}/complete`);
    }
  }

  function handleSelectStage(index, status) {
    setStagesOpen(false);
    if (status === "perfect" || status === "completed") {
      navigate(`/quiz/${levelId}/stage/${index}/review`);
    }
  }

  return (
    <IonPage>
      <div className="quiz-top" {...rtlAttrs}>
        <IonButton fill="clear" shape="round" onClick={() => navigate("/")} aria-label={t("navHome")}>
          <IonIcon icon={closeOutline} slot="icon-only" />
        </IonButton>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <IonButton fill="clear" shape="round" onClick={() => setStagesOpen(true)} aria-label={t("stagesTitle")}>
          <IonIcon icon={appsOutline} slot="icon-only" />
        </IonButton>
      </div>

      <IonContent {...rtlAttrs}>
        <div className="quiz-body" dir="ltr" lang="en">
          <p className="quiz-question">{q.question}</p>
          <div className="question-actions">
            <IonButton fill="clear" shape="round" onClick={() => speak(q.question)} aria-label={t("listenToQuestion")}>
              <IonIcon icon={volumeHighOutline} slot="icon-only" />
            </IonButton>
            <IonButton fill="clear" shape="round" onClick={() => setTranslateOpen(true)} aria-label="عرض السؤال بالعربية">
              <IonIcon icon={globeOutline} slot="icon-only" />
            </IonButton>
          </div>

          {q.options.map((opt, i) => {
            let color;
            if (isAnswered) {
              if (i === q.answer) color = "success";
              else if (i === picked) color = "danger";
              else color = "medium";
            }
            return (
              <div className="option-row" key={i}>
                <IonButton
                  expand="block"
                  fill={isAnswered && i === q.answer ? "solid" : "outline"}
                  color={color}
                  disabled={isAnswered}
                  onClick={() => pickAnswer(i)}
                >
                  {opt}
                </IonButton>
                <IonButton fill="clear" shape="round" onClick={() => speak(opt)} aria-label={t("listenToOption")}>
                  <IonIcon icon={volumeHighOutline} slot="icon-only" />
                </IonButton>
              </div>
            );
          })}
        </div>
      </IonContent>

      {isAnswered && (
        <IonFooter>
          <div className={`feedback-band ${isCorrect ? "" : "wrong"}`} {...rtlAttrs}>
            <p className="feedback-title">
              <IonIcon icon={isCorrect ? checkmarkCircleOutline : closeCircleOutline} />
              {isCorrect ? t("correct") : t("notQuite")}
            </p>
            <p className="feedback-en" dir="ltr" lang="en">
              {q.explanation}
            </p>
            <p className="feedback-ar-line" dir="rtl" lang="ar">
              {q.explanationAr}
            </p>
            <IonButton expand="block" onClick={goNext}>
              {state.current === totalQuestions - 1 ? t("finish") : t("next")}
            </IonButton>
          </div>
        </IonFooter>
      )}

      <StageSheet
        isOpen={stagesOpen}
        onClose={() => setStagesOpen(false)}
        state={state}
        questions={questions}
        stageSize={stageSize}
        totalStages={totalStages}
        onSelectStage={handleSelectStage}
      />
      <TranslationModal
        isOpen={translateOpen}
        onClose={() => setTranslateOpen(false)}
        questionEn={q.question}
        questionAr={q.questionAr}
      />
    </IonPage>
  );
}
