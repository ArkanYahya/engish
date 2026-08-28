import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IonPage, IonContent, IonButton } from "@ionic/react";

import { useQuiz } from "../context/QuizContext.jsx";
import { useUiLang } from "../context/UiLangContext.jsx";
import { scoreForRange } from "../lib/quiz.js";
import { celebrate } from "../lib/celebrate.js";
import { LEVEL_VOCABULARY, LEVEL_GRAMMAR } from "../lib/content.js";
import AppHeader from "../components/AppHeader.jsx";
import QuizHeader from "../components/QuizHeader.jsx";
import ScoreGauge from "../components/ScoreGauge.jsx";

export default function StageComplete() {
  const { levelId, stageIndex: stageIndexParam } = useParams();
  const stageIndex = Number(stageIndexParam);
  const navigate = useNavigate();
  const { currentLevel, state } = useQuiz();
  const { t, rtlAttrs } = useUiLang();

  const ready = currentLevel && state && currentLevel.id === levelId;
  const stageSize = ready ? currentLevel.STAGE_SIZE : 0;
  const totalStages = ready ? currentLevel.TOTAL_STAGES : 0;
  const start = stageIndex * stageSize;
  const end = start + stageSize;
  const score = ready ? scoreForRange(state, currentLevel.questions, start, end) : 0;

  useEffect(() => {
    if (!ready) {
      navigate(`/quiz/${levelId}`, { replace: true });
      return;
    }
    if (score === stageSize) celebrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  if (!ready) {
    return (
      <IonPage>
        <AppHeader />
        <IonContent className="ion-padding" />
      </IonPage>
    );
  }

  const answeredCount = state.answers.filter((a) => a !== null).length;
  const pct = Math.round((answeredCount / currentLevel.questions.length) * 100);

  return (
    <IonPage>
      <AppHeader />
      <IonContent className="ion-padding" {...rtlAttrs}>
        <QuizHeader
          levelLabel={currentLevel.label}
          pct={pct}
          subtitle={t("subtitleStageComplete", stageIndex + 1, totalStages)}
          onOpenStages={() => navigate(`/quiz/${levelId}`)}
          onOpenVocab={LEVEL_VOCABULARY[levelId] ? () => navigate(`/quiz/${levelId}/vocabulary`) : undefined}
          onOpenGrammar={LEVEL_GRAMMAR[levelId] ? () => navigate(`/quiz/${levelId}/grammar`) : undefined}
        />
        <div className="quiz-card center" {...rtlAttrs}>
          <h2>{t("stageComplete", stageIndex + 1)}</h2>
          <ScoreGauge score={score} total={stageSize} size={100} />
          <IonButton expand="block" onClick={() => navigate(`/quiz/${levelId}`)}>
            {stageIndex + 1 < totalStages ? t("continueToStage", stageIndex + 2) : t("viewFinalResults")}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
