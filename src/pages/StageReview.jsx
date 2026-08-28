import { useNavigate, useParams } from "react-router-dom";
import { IonPage, IonContent, IonButton } from "@ionic/react";

import { useQuiz } from "../context/QuizContext.jsx";
import { useUiLang } from "../context/UiLangContext.jsx";
import { scoreForRange } from "../lib/quiz.js";
import AppHeader from "../components/AppHeader.jsx";
import QuizHeader from "../components/QuizHeader.jsx";

export default function StageReview() {
  const { levelId, stageIndex: stageIndexParam } = useParams();
  const stageIndex = Number(stageIndexParam);
  const navigate = useNavigate();
  const { currentLevel, state } = useQuiz();
  const { t, rtlAttrs } = useUiLang();

  const ready = currentLevel && state && currentLevel.id === levelId;

  if (!ready) {
    return (
      <IonPage>
        <AppHeader />
        <IonContent className="ion-padding" />
      </IonPage>
    );
  }

  const questions = currentLevel.questions;
  const stageSize = currentLevel.STAGE_SIZE;
  const start = stageIndex * stageSize;
  const end = start + stageSize;
  const score = scoreForRange(state, questions, start, end);
  const answeredCount = state.answers.filter((a) => a !== null).length;
  const pct = Math.round((answeredCount / questions.length) * 100);

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
      <AppHeader />
      <IonContent className="ion-padding" {...rtlAttrs}>
        <QuizHeader
          levelLabel={currentLevel.label}
          pct={pct}
          subtitle={t("subtitleReviewing", stageIndex + 1)}
          onOpenStages={() => navigate(`/quiz/${levelId}`)}
        />
        <div className="quiz-card">
          <h2 {...rtlAttrs}>{t("stageReview", stageIndex + 1, score, stageSize)}</h2>
          <div className="review-list" dir="ltr" lang="en">
            {items}
          </div>
          <IonButton
            expand="block"
            onClick={() => navigate(state.completed ? `/quiz/${levelId}/results` : `/quiz/${levelId}`)}
          >
            {t("back")}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
