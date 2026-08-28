import { IonBadge, IonProgressBar, IonIcon } from "@ionic/react";
import { chevronForward } from "ionicons/icons";
import { useUiLang } from "../context/UiLangContext.jsx";

// Doubles as the tap target that opens the stages bottom-sheet (via onOpenStages) — the
// subtitle already states the current stage, so a separate "open stages" bar would just be
// duplication; the chevron hints that the whole block is tappable. The Vocabulary/Grammar
// links (level-gated, only rendered when provided) sit in their own row so tapping them
// doesn't also trigger onOpenStages.
export default function QuizHeader({ levelLabel, pct, subtitle, onOpenStages, onOpenVocab, onOpenGrammar }) {
  const { t, rtlAttrs } = useUiLang();

  return (
    <div className="quiz-header-block" {...rtlAttrs}>
      <div className="quiz-header-top">
        <IonBadge color="primary">{levelLabel}</IonBadge>
        {(onOpenVocab || onOpenGrammar) && (
          <div className="quiz-header-links">
            {onOpenVocab && (
              <button className="link-btn" onClick={onOpenVocab} type="button">
                {t("vocabulary")}
              </button>
            )}
            {onOpenGrammar && (
              <button className="link-btn" onClick={onOpenGrammar} type="button">
                {t("grammar")}
              </button>
            )}
          </div>
        )}
      </div>
      <div onClick={onOpenStages} role="button" tabIndex={0} className="quiz-header-tap">
        <IonProgressBar value={pct / 100} color="primary" />
        <div className="quiz-header-subtitle-row">
          <span className="quiz-header-subtitle">{subtitle}</span>
          <IonIcon icon={chevronForward} className="quiz-header-chevron" />
        </div>
      </div>
    </div>
  );
}
