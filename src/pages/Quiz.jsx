// Placeholder while the full quiz flow (question/stage-complete/stage-review/results) is
// being ported over — proves level selection + routing works end-to-end. Not the real page.
import { IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonContent, IonTitle } from "@ionic/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import { useQuiz } from "../context/QuizContext.jsx";
import { useUiLang } from "../context/UiLangContext.jsx";

export default function Quiz() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { currentLevel, state, selectLevel } = useQuiz();
  const { t, rtlAttrs } = useUiLang();

  // Handles a direct load of /quiz/:levelId (e.g. a refresh) where context state is empty
  // but the URL still names a level.
  useEffect(() => {
    if (!currentLevel || currentLevel.id !== levelId) {
      selectLevel(levelId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar {...rtlAttrs}>
          <IonButtons slot="start">
            <IonButton onClick={() => navigate("/")}>{t("back")}</IonButton>
          </IonButtons>
          <IonTitle>{currentLevel?.label ?? levelId}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" {...rtlAttrs}>
        <p>Quiz screen for level "{currentLevel?.label ?? levelId}" — coming next.</p>
        {state && (
          <p>
            Progress: {state.answers.filter((a) => a !== null).length} / {state.answers.length} answered.
          </p>
        )}
      </IonContent>
    </IonPage>
  );
}
