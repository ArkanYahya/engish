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

setupIonicReact();

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
                <Route path="*" element={<Navigate to="/" replace />} />
              </IonRouterOutlet>
            </IonReactRouter>
          </IonApp>
        </QuizProvider>
      </UiLangProvider>
    </ThemeProvider>
  );
}
