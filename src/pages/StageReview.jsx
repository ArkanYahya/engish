import { useNavigate, useParams } from "react-router-dom";
import { IonPage, IonContent, IonButton, IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";

import { useQuiz } from "../context/QuizContext.jsx";
import { useUiLang } from "../context/UiLangContext.jsx";
import { scoreForRange } from "../lib/quiz.js";

export default function StageReview() {
  const { levelId, stageIndex: stageIndexParam } = useParams();
  const stageIndex = Number(stageIndexParam);
  const navigate = useNavigate();
  const { currentLevel, state } = useQuiz();
  const { t, rtlAttrs, isArabicUi } = useUiLang();

  const ready = currentLevel && state && currentLevel.id === levelId;

  function goBack() {
    navigate(state?.completed ? `/quiz/${levelId}/results` : `/quiz/${levelId}`);
  }

  if (!ready) {
    return (
      <IonPage>
        <IonContent className="ion-padding" />
      </IonPage>
    );
  }

  const questions = currentLevel.questions;
  const stageSize = currentLevel.STAGE_SIZE;
  const start = stageIndex * stageSize;
  const end = start + stageSize;
  const score = scoreForRange(state, questions, start, end);

  const items = [];
  for (let i = start; i < end; i++) {
    const q = questions[i];
    const picked = state.answers[i];
    const isCorrect = picked === q.answer;
    items.push(
      <div className={`review-item ${isCorrect ? "correct" : "incorrect"}`} key={i}>
        <p className="review-question">
          {i - start + 1}. {q.question}
        </p>
        <p>
          {t("yourAnswer")} {q.options[picked]}
        </p>
        {!isCorrect && (
          <p>
            {t("correctAnswer")} {q.options[q.answer]}
          </p>
        )}
      </div>
    );
  }

  return (
    <IonPage>
      <div className="quiz-top" {...rtlAttrs}>
        <IonButton fill="clear" shape="round" onClick={goBack} aria-label={t("back")}>
          <IonIcon icon={arrowBackOutline} style={isArabicUi ? { transform: "scaleX(-1)" } : undefined} slot="icon-only" />
        </IonButton>
        <p className="quiz-top-title font-display">{t("stageReview", stageIndex + 1, score, stageSize)}</p>
      </div>
      <IonContent {...rtlAttrs}>
        <div className="quiz-body">
          <div className="review-list" dir="ltr" lang="en">
            {items}
          </div>
          <IonButton expand="block" onClick={goBack}>
            {t("back")}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
