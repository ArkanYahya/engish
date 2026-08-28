import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Navigate, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext.jsx";
import { UiLangProvider } from "./context/UiLangContext.jsx";
import { QuizProvider } from "./context/QuizContext.jsx";
import LevelPicker from "./pages/LevelPicker.jsx";
import Quiz from "./pages/Quiz.jsx";

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
                <Route path="/quiz/:levelId" element={<Quiz />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </IonRouterOutlet>
            </IonReactRouter>
          </IonApp>
        </QuizProvider>
      </UiLangProvider>
    </ThemeProvider>
  );
}
