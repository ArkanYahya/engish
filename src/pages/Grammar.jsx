import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonBackButton, IonButtons, IonHeader, IonToolbar } from "@ionic/react";

import { useQuiz } from "../context/QuizContext.jsx";
import { useUiLang } from "../context/UiLangContext.jsx";
import { LEVEL_GRAMMAR } from "../lib/content.js";
import AppHeader from "../components/AppHeader.jsx";
import GrammarTopicModal from "../components/GrammarTopicModal.jsx";

export default function Grammar() {
  const { levelId } = useParams();
  const { currentLevel, selectLevel } = useQuiz();
  const { t, isArabicUi, rtlAttrs } = useUiLang();
  const [activeTopic, setActiveTopic] = useState(null);

  useEffect(() => {
    if (!currentLevel || currentLevel.id !== levelId) selectLevel(levelId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  const grammar = LEVEL_GRAMMAR[levelId] || [];
  const levelLabel = currentLevel?.label ?? levelId.toUpperCase();

  return (
    <IonPage>
      <AppHeader />
      <IonHeader>
        <IonToolbar {...rtlAttrs}>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/quiz/${levelId}`} text="" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent {...rtlAttrs}>
        <div className="ion-padding-horizontal ion-padding-top">
          <h1 className="ref-page-title">{t("grammarTitle", levelLabel)}</h1>
          <p className="ref-page-subtitle">{t("grammarSubtitle", levelLabel)}</p>
        </div>

        <IonList>
          {grammar.map((g) => (
            <IonItem key={g.topic} button detail onClick={() => setActiveTopic(g)}>
              <IonLabel dir="ltr" lang="en">
                <span className="grammar-topic-en">{g.topic}</span>
                <span className="grammar-topic-ar" dir="rtl" lang="ar">
                  {g.topicAr}
                </span>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>

      <GrammarTopicModal topic={activeTopic} onDismiss={() => setActiveTopic(null)} />
    </IonPage>
  );
}
