import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IonPage, IonContent, IonButton, IonAlert } from "@ionic/react";
import { useState } from "react";

import { useQuiz } from "../context/QuizContext.jsx";
import { useUiLang } from "../context/UiLangContext.jsx";
import { scoreForRange } from "../lib/quiz.js";
import { celebrate } from "../lib/celebrate.js";
import AppHeader from "../components/AppHeader.jsx";
import QuizHeader from "../components/QuizHeader.jsx";
import ScoreGauge from "../components/ScoreGauge.jsx";
import StageSheet from "../components/StageSheet.jsx";

function resultsMessageKey(pct) {
  if (pct >= 90) return "resultOutstanding";
  if (pct >= 75) return "resultGreat";
  if (pct >= 50) return "resultGood";
  return "resultKeepGoing";
}

export default function Results() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { currentLevel, state, selectLevel, resetProgress } = useQuiz();
  const { t, rtlAttrs } = useUiLang();
  const [stagesOpen, setStagesOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const celebrated = useRef(false);

  useEffect(() => {
    if (!currentLevel || currentLevel.id !== levelId) {
      selectLevel(levelId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  const ready = currentLevel && state && currentLevel.id === levelId;

  useEffect(() => {
    if (ready && state.completed && !celebrated.current) {
      celebrated.current = true;
      celebrate();
    }
  }, [ready, state?.completed]);

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
  const totalStages = currentLevel.TOTAL_STAGES;
  const totalQuestions = questions.length;
  const score = scoreForRange(state, questions, 0, totalQuestions);
  const pct = Math.round((score / totalQuestions) * 100);

  const stageRows = [];
  for (let s = 0; s < totalStages; s++) {
    const start = s * stageSize;
    const stageScore = scoreForRange(state, questions, start, start + stageSize);
    stageRows.push(
      <div className="stage-row" key={s}>
        <span>{t("stageN", s + 1)}</span>
        <span>
          {stageScore} / {stageSize}
        </span>
      </div>
    );
  }

  function handleSelectStage(index, status) {
    setStagesOpen(false);
    if (status === "perfect" || status === "completed") {
      navigate(`/quiz/${levelId}/stage/${index}/review`);
    }
  }

  return (
    <IonPage>
      <AppHeader />
      <IonContent className="ion-padding" {...rtlAttrs}>
        <QuizHeader
          levelLabel={currentLevel.label}
          pct={pct}
          subtitle={t("subtitleQuizComplete")}
          onOpenStages={() => setStagesOpen(true)}
        />
        <div className="quiz-card center" {...rtlAttrs}>
          <h2>{t("quizComplete")}</h2>
          <ScoreGauge score={score} total={totalQuestions} size={140} />
          <p className="results-message">{t(resultsMessageKey(pct))}</p>
          <div className="stage-breakdown">{stageRows}</div>
          <IonButton expand="block" onClick={() => setConfirmOpen(true)}>
            {t("takeQuizAgain")}
          </IonButton>
        </div>
      </IonContent>

      <StageSheet
        isOpen={stagesOpen}
        onClose={() => setStagesOpen(false)}
        state={state}
        questions={questions}
        stageSize={stageSize}
        totalStages={totalStages}
        onSelectStage={handleSelectStage}
      />

      <IonAlert
        isOpen={confirmOpen}
        onDidDismiss={() => setConfirmOpen(false)}
        header={t("confirmStartOver")}
        buttons={[
          { text: t("cancel"), role: "cancel" },
          {
            text: t("confirmYes"),
            role: "destructive",
            handler: () => {
              resetProgress();
              navigate(`/quiz/${levelId}`);
            },
          },
        ]}
      />
    </IonPage>
  );
}
