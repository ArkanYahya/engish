import { useState } from "react";
import { useParams } from "react-router-dom";
import { IonPage, IonContent, IonList, IonItemDivider, IonItem, IonLabel, IonButton, IonIcon } from "@ionic/react";
import { volumeHighOutline } from "ionicons/icons";

import { useUiLang } from "../context/UiLangContext.jsx";
import { getLevel } from "../levels/index.js";
import { LEVEL_VOCABULARY } from "../lib/content.js";
import { getVocabMistakeCount, isVocabWordRead, markVocabWordRead } from "../lib/storage.js";
import { speak } from "../lib/tts.js";
import BottomTabBar from "../components/BottomTabBar.jsx";
import LevelPills from "../components/LevelPills.jsx";
import VocabExampleModal from "../components/VocabExampleModal.jsx";
import VocabQuizModal from "../components/VocabQuizModal.jsx";

export default function Vocabulary() {
  const { levelId } = useParams();
  const { t, isArabicUi, rtlAttrs } = useUiLang();
  const [activeWord, setActiveWord] = useState(null);
  const [quizOpen, setQuizOpen] = useState(false);
  // Forces a re-read of mistake counts (localStorage, not React state) after the example
  // modal or quiz modal changes them, so badges stay current without a full page reload.
  const [refreshKey, setRefreshKey] = useState(0);

  // Reads the level's static label directly, deliberately not through QuizContext — this
  // screen just browses reference content and must not depend on (or change) whichever
  // level is "active" for the quiz. See components/LevelPills.jsx.
  const vocabulary = LEVEL_VOCABULARY[levelId] || [];
  const levelLabel = getLevel(levelId)?.label ?? levelId.toUpperCase();

  function openExample(category, word) {
    markVocabWordRead(category, word.en);
    setActiveWord({ ...word, category });
  }

  function closeExample() {
    setActiveWord(null);
    setRefreshKey((k) => k + 1);
  }

  function closeQuiz() {
    setQuizOpen(false);
    setRefreshKey((k) => k + 1);
  }

  return (
    <IonPage>
      <IonContent {...rtlAttrs}>
        <div className="ion-padding-horizontal ion-padding-top">
          <h1 className="ref-page-title">{t("vocabularyTitle", levelLabel)}</h1>
          <p className="ref-page-subtitle">{t("vocabularySubtitle", levelLabel)}</p>
        </div>
        <LevelPills activeLevelId={levelId} basePath="vocabulary" />
        <div className="ion-padding-horizontal">
          <IonButton expand="block" onClick={() => setQuizOpen(true)}>
            {t("quizMe")}
          </IonButton>
        </div>

        <IonList key={refreshKey}>
          {vocabulary.map((group) => (
            <div key={group.category}>
              <IonItemDivider {...rtlAttrs}>{isArabicUi ? group.categoryAr : group.category}</IonItemDivider>
              {group.words.map((w) => {
                const missCount = getVocabMistakeCount(group.category, w.en);
                const tier = Math.min(missCount, 3);
                const isRead = isVocabWordRead(group.category, w.en);
                return (
                  <IonItem
                    key={w.en}
                    button
                    detail
                    className={isRead ? "read-item" : ""}
                    onClick={() => openExample(group.category, w)}
                    {...rtlAttrs}
                  >
                    <IonLabel dir="ltr" lang="en">
                      <span className="vocab-en">{w.en}</span>
                      {missCount > 0 && (
                        <span
                          className={`vocab-mistake-badge tier-${tier}`}
                          title={t("missedTimes", missCount)}
                          style={{ marginLeft: 8 }}
                        >
                          {missCount}
                        </span>
                      )}
                      <span className="vocab-ar" dir="rtl" lang="ar">
                        {w.ar}
                      </span>
                    </IonLabel>
                    <IonButton
                      fill="clear"
                      shape="round"
                      slot="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(w.en);
                      }}
                      aria-label={t("listenToOption")}
                    >
                      <IonIcon icon={volumeHighOutline} slot="icon-only" />
                    </IonButton>
                  </IonItem>
                );
              })}
            </div>
          ))}
        </IonList>
      </IonContent>

      <VocabExampleModal word={activeWord} onDismiss={closeExample} />
      <VocabQuizModal isOpen={quizOpen} onDismiss={closeQuiz} vocabulary={vocabulary} />
      <BottomTabBar active="vocabulary" levelId={levelId} />
    </IonPage>
  );
}
