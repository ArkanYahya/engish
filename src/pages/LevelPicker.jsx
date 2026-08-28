import { IonPage, IonContent, IonCard, IonCardContent, IonBadge, IonGrid, IonRow, IonCol } from "@ionic/react";
import { useNavigate } from "react-router-dom";

import { LEVELS } from "../levels/index.js";
import { LEVEL_TRANSLATIONS } from "../lib/strings.js";
import { levelProgressSummary } from "../lib/quiz.js";
import { useUiLang } from "../context/UiLangContext.jsx";
import { useQuiz } from "../context/QuizContext.jsx";
import AppHeader from "../components/AppHeader.jsx";

export default function LevelPicker() {
  const navigate = useNavigate();
  const { uiLang, t, rtlAttrs } = useUiLang();
  const { selectLevel } = useQuiz();

  function handleSelect(levelId) {
    const level = selectLevel(levelId);
    if (level) navigate(`/quiz/${levelId}`);
  }

  return (
    <IonPage>
      <AppHeader />
      <IonContent className="ion-padding" {...rtlAttrs}>
        <h1>{t("chooseLevel")}</h1>
        <p>{t("chooseLevelSubtitle")}</p>
        <IonGrid>
          <IonRow>
            {LEVELS.map((level) => {
              const localized = LEVEL_TRANSLATIONS[level.id]?.[uiLang] || {
                name: level.name,
                description: level.description,
              };
              return (
                <IonCol size="12" sizeMd="6" key={level.id}>
                  <IonCard button onClick={() => handleSelect(level.id)}>
                    <IonCardContent>
                      <IonBadge color="primary">{level.label}</IonBadge>
                      <h2>{localized.name}</h2>
                      <p>{localized.description}</p>
                      <p className="level-progress">{levelProgressSummary(level, t)}</p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              );
            })}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
