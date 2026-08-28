import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IonPage, IonContent, IonButton } from "@ionic/react";

import { useQuiz } from "../context/QuizContext.jsx";
import { useUiLang } from "../context/UiLangContext.jsx";
import { scoreForRange } from "../lib/quiz.js";
import { celebrate } from "../lib/celebrate.js";
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
        <IonContent className="ion-padding" />
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent {...rtlAttrs}>
        <div className="complete-body">
          <span className="deco-dot" style={{ left: "18%", top: "12%", background: "var(--coral)", transform: "rotate(18deg)" }} />
          <span className="deco-dot" style={{ left: "76%", top: "9%", background: "var(--indigo)", transform: "rotate(-24deg)" }} />
          <span className="deco-dot" style={{ left: "10%", top: "30%", background: "var(--amber)", transform: "rotate(8deg)" }} />
          <span className="deco-dot" style={{ left: "84%", top: "26%", background: "var(--leaf)", transform: "rotate(-10deg)" }} />
          <h2 className="complete-title">{t("stageComplete", stageIndex + 1)}</h2>
          <ScoreGauge score={score} total={stageSize} size={140} />
          <IonButton expand="block" onClick={() => navigate(`/quiz/${levelId}`)}>
            {stageIndex + 1 < totalStages ? t("continueToStage", stageIndex + 2) : t("viewFinalResults")}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
