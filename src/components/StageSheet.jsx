import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

import { stageStatus, scoreForRange } from "../lib/quiz.js";
import { useUiLang } from "../context/UiLangContext.jsx";

// A real native bottom-sheet (drag handle, swipe-to-dismiss) via IonModal's breakpoints,
// replacing the vanilla version's hand-rolled CSS sheet — used identically on every screen
// size instead of also being an always-visible desktop sidebar, for one consistent pattern.
export default function StageSheet({ isOpen, onClose, state, questions, stageSize, totalStages, onSelectStage }) {
  const { t, rtlAttrs } = useUiLang();

  const boxes = [];
  let doneCount = 0;
  for (let s = 0; s < totalStages; s++) {
    const status = stageStatus(state, questions, stageSize, s);
    if (status === "perfect" || status === "completed") doneCount++;
    const start = s * stageSize;
    const answeredInStage = state.answers.slice(start, start + stageSize).filter((a) => a !== null).length;

    let title;
    if (status === "perfect" || status === "completed") {
      title = t("stageTitleScore", s + 1, scoreForRange(state, questions, start, start + stageSize), stageSize);
    } else if (status === "current") {
      title = t("stageTitleInProgress", s + 1, answeredInStage, stageSize);
    } else {
      title = t("stageTitleLocked", s + 1);
    }

    boxes.push(
      <button
        key={s}
        className={`stage-box ${status}`}
        title={title}
        disabled={status === "locked"}
        onClick={() => onSelectStage(s, status)}
      >
        {s + 1}
      </button>
    );
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} initialBreakpoint={0.75} breakpoints={[0, 0.75, 1]}>
      <IonHeader>
        <IonToolbar {...rtlAttrs}>
          <IonTitle>{t("stagesTitle")}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose} aria-label={t("close")}>
              <IonIcon icon={closeOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" {...rtlAttrs}>
        <p className="sidebar-summary">{t("stagesCompleteOf", doneCount, totalStages)}</p>
        <div className="stage-grid">{boxes}</div>
        <div className="legend">
          <span>
            <i className="dot current"></i> {t("legendCurrent")}
          </span>
          <span>
            <i className="dot completed"></i> {t("legendDone")}
          </span>
          <span>
            <i className="dot perfect"></i> {t("legendPerfect")}
          </span>
          <span>
            <i className="dot locked"></i> {t("legendLocked")}
          </span>
        </div>
      </IonContent>
    </IonModal>
  );
}
