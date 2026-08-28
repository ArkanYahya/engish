import { createContext, useContext, useState, useCallback } from "react";
import { getLevel } from "../levels/index.js";
import { freshState, loadState, saveState, clearState, setSelectedLevelId } from "../lib/storage.js";

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [currentLevel, setCurrentLevel] = useState(null);
  const [state, setState] = useState(null);

  const selectLevel = useCallback((levelId) => {
    const level = getLevel(levelId);
    if (!level) return null;
    const totalQuestions = level.questions.length;
    const loaded = loadState(levelId, totalQuestions) || freshState(totalQuestions);
    setCurrentLevel(level);
    setState(loaded);
    setSelectedLevelId(levelId);
    return level;
  }, []);

  // Persists immediately (mirrors the vanilla version's saveState-on-every-change instead
  // of batching) so progress survives a hard refresh/tab close mid-question.
  const updateState = useCallback(
    (updater) => {
      setState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        if (currentLevel) saveState(currentLevel.id, next);
        return next;
      });
    },
    [currentLevel]
  );

  const resetProgress = useCallback(() => {
    if (!currentLevel) return;
    clearState(currentLevel.id);
    const fresh = freshState(currentLevel.questions.length);
    setState(fresh);
  }, [currentLevel]);

  return (
    <QuizContext.Provider value={{ currentLevel, state, selectLevel, updateState, resetProgress }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
}
