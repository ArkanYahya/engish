import { IonPage, IonContent } from "@ionic/react";
import { useNavigate } from "react-router-dom";

import { LEVELS } from "../levels/index.js";
import { LEVEL_TRANSLATIONS } from "../lib/strings.js";
import { levelProgressStats, levelProgressSummary } from "../lib/quiz.js";
import { getSelectedLevelId } from "../lib/storage.js";
import { useUiLang } from "../context/UiLangContext.jsx";
import { useQuiz } from "../context/QuizContext.jsx";
import BottomTabBar from "../components/BottomTabBar.jsx";

export default function LevelPicker() {
  const navigate = useNavigate();
  const { uiLang, t, rtlAttrs } = useUiLang();
  const { selectLevel } = useQuiz();

  function handleSelect(levelId) {
    const level = selectLevel(levelId);
    if (level) navigate(`/quiz/${levelId}`);
  }

  // Every level is actually reachable at any time — there's no real gating between them —
  // so "current" here just means "the one you were last working on" (or A1, for a brand
  // new visitor), purely to give the path a visual focal point. It's never styled as locked.
  const activeLevelId = getSelectedLevelId() || LEVELS[0].id;

  return (
    <IonPage>
      <IonContent {...rtlAttrs}>
        <div className="home-scroll">
          <div className="home-head">
            <div>
              <p className="greeting-eyebrow">{t("welcomeBack")}</p>
              <p className="greeting-name font-display">{t("appName")}</p>
            </div>
          </div>

          <div className="path">
            {LEVELS.map((level, i) => {
              const localized = LEVEL_TRANSLATIONS[level.id]?.[uiLang] || {
                name: level.name,
                description: level.description,
              };
              const isActive = level.id === activeLevelId;
              const stats = levelProgressStats(level);
              const side = i % 2 === 0 ? "left" : "right";

              return (
                <div className={`path-node ${side}`} key={level.id}>
                  <button
                    type="button"
                    className={`level-tile ${isActive ? "current" : ""}`}
                    onClick={() => handleSelect(level.id)}
                  >
                    <span className="level-badge">{level.label}</span>
                    <p className="level-tile-name font-display">{localized.name}</p>
                    <p className="level-tile-desc">{localized.description}</p>
                    {isActive ? (
                      <div className="level-progress-track">
                        <div className="level-progress-fill" style={{ width: `${stats?.pct ?? 0}%` }} />
                      </div>
                    ) : (
                      <p className="level-tile-status">{levelProgressSummary(level, t)}</p>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </IonContent>
      <BottomTabBar active="home" levelId={activeLevelId} />
    </IonPage>
  );
}
