import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IonPage, IonContent, IonList, IonItemDivider, IonItem, IonLabel, IonButton, IonIcon, IonBackButton, IonButtons, IonHeader, IonToolbar } from "@ionic/react";
import { volumeHighOutline } from "ionicons/icons";

import { useQuiz } from "../context/QuizContext.jsx";
import { useUiLang } from "../context/UiLangContext.jsx";
import { LEVEL_VOCABULARY } from "../lib/content.js";
import { getVocabMistakeCount } from "../lib/storage.js";
import { speak } from "../lib/tts.js";
import AppHeader from "../components/AppHeader.jsx";
import VocabExampleModal from "../components/VocabExampleModal.jsx";
import VocabQuizModal from "../components/VocabQuizModal.jsx";

export default function Vocabulary() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { currentLevel, selectLevel } = useQuiz();
  const { t, isArabicUi, rtlAttrs } = useUiLang();
  const [activeWord, setActiveWord] = useState(null);
  const [quizOpen, setQuizOpen] = useState(false);
  // Forces a re-read of mistake counts (localStorage, not React state) after the example
  // modal or quiz modal changes them, so badges stay current without a full page reload.
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!currentLevel || currentLevel.id !== levelId) selectLevel(levelId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  const vocabulary = LEVEL_VOCABULARY[levelId] || [];
  const levelLabel = currentLevel?.label ?? levelId.toUpperCase();

  function openExample(category, word) {
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
          <h1 className="ref-page-title">{t("vocabularyTitle", levelLabel)}</h1>
          <p className="ref-page-subtitle">{t("vocabularySubtitle", levelLabel)}</p>
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
                return (
                  <IonItem key={w.en} button detail onClick={() => openExample(group.category, w)}>
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
    </IonPage>
  );
}
