// Pure helpers ported from the vanilla version's module-level functions, parameterized
// instead of closing over module-level globals (state/questions/etc. now live in React
// component state).
import { loadState, progressKeyFor } from "./storage.js";

export function stageOf(index, stageSize) {
  return Math.floor(index / stageSize);
}

export function scoreForRange(state, questions, start, end) {
  let score = 0;
  for (let i = start; i < end; i++) {
    if (state.answers[i] === questions[i].answer) score++;
  }
  return score;
}

export function stageStatus(state, questions, stageSize, stageIndex) {
  const start = stageIndex * stageSize;
  const end = start + stageSize;
  const answeredInStage = state.answers.slice(start, end).filter((a) => a !== null).length;

  if (answeredInStage === stageSize) {
    const score = scoreForRange(state, questions, start, end);
    return score === stageSize ? "perfect" : "completed";
  }
  if (stageIndex === stageOf(state.current, stageSize)) {
    return "current";
  }
  return "locked";
}

// Reads a level's saved progress straight from localStorage (not from live component
// state) — used on the Level Picker, which shows a summary for every level, not just
// whichever one is currently loaded into memory.
export function levelProgressSummary(level, t) {
  const raw = localStorage.getItem(progressKeyFor(level.id));
  if (!raw) return t("notStarted");
  try {
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved.answers) || saved.answers.length !== level.questions.length) return t("notStarted");
    const answered = saved.answers.filter((a) => a !== null).length;
    if (saved.completed) {
      const score = saved.answers.reduce((sum, a, i) => sum + (a === level.questions[i].answer ? 1 : 0), 0);
      return t("completedScore", score, level.questions.length);
    }
    if (answered > 0) {
      return t("inProgress", answered, level.questions.length);
    }
    return t("notStarted");
  } catch {
    return t("notStarted");
  }
}
