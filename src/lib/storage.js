// Every localStorage key/shape here is unchanged from the vanilla-JS version — this is
// deliberate: existing users already have saved progress under these exact keys, and the
// framework rewrite must not lose it.

export const THEME_KEY = "engish-quiz-theme";
export const UI_LANG_KEY = "engish-quiz-ui-lang";
export const SELECTED_LEVEL_KEY = "engish-quiz-selected-level";
export const VOCAB_MISTAKES_KEY = "engish-quiz-vocab-mistakes";
export const progressKeyFor = (levelId) => `engish-quiz-progress-${levelId}`;

export function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

export function setStoredTheme(value) {
  try {
    localStorage.setItem(THEME_KEY, value);
  } catch {
    // ignore — theme just won't persist across reloads
  }
}

export function isDarkActive() {
  const stored = getStoredTheme();
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function getStoredUiLang() {
  try {
    return localStorage.getItem(UI_LANG_KEY) === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}

export function setStoredUiLang(lang) {
  try {
    localStorage.setItem(UI_LANG_KEY, lang);
  } catch {
    // selection just won't persist across reloads
  }
}

export function getSelectedLevelId() {
  try {
    return localStorage.getItem(SELECTED_LEVEL_KEY);
  } catch {
    return null;
  }
}

export function setSelectedLevelId(levelId) {
  try {
    localStorage.setItem(SELECTED_LEVEL_KEY, levelId);
  } catch {
    // ignore
  }
}

export function freshState(totalQuestions) {
  return {
    current: 0,
    answers: new Array(totalQuestions).fill(null),
    completed: false,
  };
}

export function loadState(levelId, totalQuestions) {
  try {
    const raw = localStorage.getItem(progressKeyFor(levelId));
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!Array.isArray(data.answers) || data.answers.length !== totalQuestions) return null;
    if (typeof data.current !== "number") return null;
    return data;
  } catch {
    return null;
  }
}

export function saveState(levelId, state) {
  localStorage.setItem(progressKeyFor(levelId), JSON.stringify(state));
}

export function clearState(levelId) {
  localStorage.removeItem(progressKeyFor(levelId));
}

export function loadVocabMistakes() {
  try {
    const raw = localStorage.getItem(VOCAB_MISTAKES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const vocabWordKey = (category, en) => `${category}::${en}`;

export function getVocabMistakeCount(category, en) {
  return loadVocabMistakes()[vocabWordKey(category, en)] || 0;
}

export function bumpVocabMistake(category, en, delta) {
  const mistakes = loadVocabMistakes();
  const key = vocabWordKey(category, en);
  const next = Math.max(0, (mistakes[key] || 0) + delta);
  if (next === 0) delete mistakes[key];
  else mistakes[key] = next;
  localStorage.setItem(VOCAB_MISTAKES_KEY, JSON.stringify(mistakes));
}
