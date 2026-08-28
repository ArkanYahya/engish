import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Navigate, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext.jsx";
import { UiLangProvider } from "./context/UiLangContext.jsx";
import { QuizProvider } from "./context/QuizContext.jsx";
import LevelPicker from "./pages/LevelPicker.jsx";
import Question from "./pages/Question.jsx";
import StageComplete from "./pages/StageComplete.jsx";
import StageReview from "./pages/StageReview.jsx";
import Results from "./pages/Results.jsx";
import Vocabulary from "./pages/Vocabulary.jsx";
import Grammar from "./pages/Grammar.jsx";

// Force the iOS-style push/pop transition on every platform. It slides pages fully
// off/on screen, so the outgoing page never visually overlaps the incoming one — the
// default "md" transition cross-fades both pages in place instead, which briefly showed
// Home's title superimposed on the quiz screen. This also matches the custom brand look
// (not stock Material) we've built everywhere else.
setupIonicReact({ mode: "ios" });

export default function App() {
  return (
    <ThemeProvider>
      <UiLangProvider>
        <QuizProvider>
          <IonApp>
            <IonReactRouter>
              <IonRouterOutlet>
                <Route path="/" element={<LevelPicker />} />
                <Route path="/quiz/:levelId" element={<Question />} />
                <Route path="/quiz/:levelId/stage/:stageIndex/complete" element={<StageComplete />} />
                <Route path="/quiz/:levelId/stage/:stageIndex/review" element={<StageReview />} />
                <Route path="/quiz/:levelId/results" element={<Results />} />
                <Route path="/quiz/:levelId/vocabulary" element={<Vocabulary />} />
                <Route path="/quiz/:levelId/grammar" element={<Grammar />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </IonRouterOutlet>
            </IonReactRouter>
          </IonApp>
        </QuizProvider>
      </UiLangProvider>
    </ThemeProvider>
  );
}
