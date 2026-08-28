import { useState } from "react";
import { useParams } from "react-router-dom";
import { IonPage, IonContent, IonList, IonItemDivider, IonItem, IonLabel, IonButton, IonIcon } from "@ionic/react";
import { volumeHighOutline } from "ionicons/icons";

import { useUiLang } from "../context/UiLangContext.jsx";
import { getLevel } from "../levels/index.js";
import { LEVEL_VOCABULARY } from "../lib/content.js";
import { getVocabMistakeCount, isVocabWordMastered } from "../lib/storage.js";
import { getAllVocabWords, getAllVocabularyAcrossLevels, getMistakenWords } from "../lib/vocabQuiz.js";
import { speak } from "../lib/tts.js";
import BottomTabBar from "../components/BottomTabBar.jsx";
import LevelPills from "../components/LevelPills.jsx";
import VocabExampleModal from "../components/VocabExampleModal.jsx";
import VocabQuizModal from "../components/VocabQuizModal.jsx";

export default function Vocabulary() {
  const { levelId } = useParams();
  const { t, isArabicUi, rtlAttrs } = useUiLang();
  const [activeWord, setActiveWord] = useState(null);
  // null | "level" | "reverse" | "mistakes" — one modal instance serves "Quiz Me" (this
  // level, English prompt), "Reverse Quiz" (this level, Arabic prompt), and "Review
  // Mistakes" (every mistaken word across every level, since mistakes are stored
  // level-agnostically — see lib/vocabQuiz.js).
  const [quizMode, setQuizMode] = useState(null);
  // Forces a re-read of mistake/mastered status (localStorage, not React state) after the
  // example modal or quiz modal changes them, so the list stays current without a reload.
  const [refreshKey, setRefreshKey] = useState(0);

  // Reads the level's static label directly, deliberately not through QuizContext — this
  // screen just browses reference content and must not depend on (or change) whichever
  // level is "active" for the quiz. See components/LevelPills.jsx.
  const vocabulary = LEVEL_VOCABULARY[levelId] || [];
  const levelLabel = getLevel(levelId)?.label ?? levelId.toUpperCase();
  const mistakenWords = getMistakenWords();

  function openExample(category, word) {
    setActiveWord({ ...word, category });
  }

  function closeExample() {
    setActiveWord(null);
    setRefreshKey((k) => k + 1);
  }

  function closeQuiz() {
    setQuizMode(null);
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
        <div className="ion-padding-horizontal quiz-me-actions">
          <div className="quiz-me-row">
            <IonButton expand="block" onClick={() => setQuizMode("level")}>
              {t("quizMe")}
            </IonButton>
            <IonButton expand="block" onClick={() => setQuizMode("reverse")}>
              {t("reverseQuiz")}
            </IonButton>
          </div>
          <IonButton
            expand="block"
            fill="outline"
            disabled={mistakenWords.length === 0}
            onClick={() => setQuizMode("mistakes")}
          >
            {t("reviewMistakes", mistakenWords.length)}
          </IonButton>
        </div>

        <IonList key={refreshKey}>
          {vocabulary.map((group) => (
            <div key={group.category}>
              <IonItemDivider {...rtlAttrs}>{isArabicUi ? group.categoryAr : group.category}</IonItemDivider>
              {group.words.map((w) => {
                const missCount = getVocabMistakeCount(group.category, w.en);
                const isMastered = isVocabWordMastered(group.category, w.en);
                // A currently-mistaken word gets the same light-red the main quiz uses for a
                // wrong answer (--coral-soft) — takes priority over the "mastered" green
                // tint, since it's the more actionable signal of the two. "Mastered" only
                // lights up once the word's been answered correctly in a quiz, not just
                // opened — see lib/storage.js.
                const rowClass = missCount > 0 ? "mistake-item" : isMastered ? "mastered-item" : "";
                return (
                  <IonItem
                    key={w.en}
                    button
                    detail
                    className={rowClass}
                    onClick={() => openExample(group.category, w)}
                    {...rtlAttrs}
                  >
                    <IonLabel dir="ltr" lang="en" style={{ textAlign: isArabicUi ? "right" : "left" }}>
                      <span className="vocab-en">{w.en}</span>
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
      <VocabQuizModal
        isOpen={quizMode !== null}
        onDismiss={closeQuiz}
        targetWords={quizMode === "mistakes" ? mistakenWords : getAllVocabWords(vocabulary)}
        distractorWords={quizMode === "mistakes" ? getAllVocabularyAcrossLevels() : undefined}
        title={quizMode === "mistakes" ? t("reviewMistakesTitle") : quizMode === "reverse" ? t("reverseQuiz") : t("quizMe")}
        reverse={quizMode === "reverse"}
      />
      <BottomTabBar active="vocabulary" levelId={levelId} />
    </IonPage>
  );
}
