import { useState } from "react";
import { useParams } from "react-router-dom";
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonBackButton, IonButtons, IonHeader, IonToolbar } from "@ionic/react";

import { useUiLang } from "../context/UiLangContext.jsx";
import { getLevel } from "../levels/index.js";
import { LEVEL_GRAMMAR } from "../lib/content.js";
import { bidiSafe } from "../lib/bidi.jsx";
import { isGrammarTopicRead, markGrammarTopicRead } from "../lib/storage.js";
import BottomTabBar from "../components/BottomTabBar.jsx";
import LevelPills from "../components/LevelPills.jsx";
import GrammarTopicModal from "../components/GrammarTopicModal.jsx";

export default function Grammar() {
  const { levelId } = useParams();
  const { t, isArabicUi, rtlAttrs } = useUiLang();
  const [activeTopic, setActiveTopic] = useState(null);
  // Forces a re-read of "already read" status (localStorage, not React state) after opening
  // a topic, so its row highlights immediately without needing a full page reload.
  const [refreshKey, setRefreshKey] = useState(0);

  // Reads the level's static label directly, deliberately not through QuizContext — this
  // screen just browses reference content and must not depend on (or change) whichever
  // level is "active" for the quiz. See components/LevelPills.jsx.
  const grammar = LEVEL_GRAMMAR[levelId] || [];
  const levelLabel = getLevel(levelId)?.label ?? levelId.toUpperCase();

  function openTopic(topic) {
    markGrammarTopicRead(levelId, topic.topic);
    setActiveTopic(topic);
    setRefreshKey((k) => k + 1);
  }

  return (
    <IonPage>
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
        <LevelPills activeLevelId={levelId} basePath="grammar" />

        <IonList key={refreshKey}>
          {grammar.map((g) => (
            <IonItem
              key={g.topic}
              button
              detail
              className={isGrammarTopicRead(levelId, g.topic) ? "read-item" : ""}
              onClick={() => openTopic(g)}
            >
              <IonLabel dir="ltr" lang="en">
                <span className="grammar-topic-en">{g.topic}</span>
                {g.testedInQuiz === false && <span className="grammar-bonus-badge">{t("grammarBonusBadge")}</span>}
                <span className="grammar-topic-ar" dir="rtl" lang="ar">
                  {bidiSafe(g.topicAr)}
                </span>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>

      <GrammarTopicModal topic={activeTopic} onDismiss={() => setActiveTopic(null)} />
      <BottomTabBar active="grammar" levelId={levelId} />
    </IonPage>
  );
}
