import { IonBadge, IonProgressBar, IonIcon } from "@ionic/react";
import { chevronForward } from "ionicons/icons";
import { useUiLang } from "../context/UiLangContext.jsx";

// Doubles as the tap target that opens the stages bottom-sheet (via onOpenStages) — the
// subtitle already states the current stage, so a separate "open stages" bar would just be
// duplication; the chevron hints that the whole block is tappable.
export default function QuizHeader({ levelLabel, pct, subtitle, onOpenStages }) {
  const { rtlAttrs } = useUiLang();

  return (
    <div className="quiz-header-block" {...rtlAttrs} onClick={onOpenStages} role="button" tabIndex={0}>
      <div className="quiz-header-top">
        <IonBadge color="primary">{levelLabel}</IonBadge>
      </div>
      <IonProgressBar value={pct / 100} color="primary" />
      <div className="quiz-header-subtitle-row">
        <span className="quiz-header-subtitle">{subtitle}</span>
        <IonIcon icon={chevronForward} className="quiz-header-chevron" />
      </div>
    </div>
  );
}
