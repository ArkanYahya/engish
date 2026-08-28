// Every localStorage key/shape here is unchanged from the vanilla-JS version — this is
// deliberate: existing users already have saved progress under these exact keys, and the
// framework rewrite must not lose it.

export const THEME_KEY = "engish-quiz-theme";
export const UI_LANG_KEY = "engish-quiz-ui-lang";
export const SELECTED_LEVEL_KEY = "engish-quiz-selected-level";
export const VOCAB_MISTAKES_KEY = "engish-quiz-vocab-mistakes";
export const VOCAB_READ_KEY = "engish-quiz-vocab-read";
export const GRAMMAR_READ_KEY = "engish-quiz-grammar-read";
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

// "Already read" tracking for the Vocabulary/Grammar reference lists — a word or topic is
// marked the moment its detail sheet is opened, so a returning learner can see at a glance
// what they've already been through. Categories are unique across every level (verified
// when the A2/B1/B2 content was added), so vocab words don't need level-scoping the way
// grammar topics do — a few topic names (e.g. "There is / There are") intentionally repeat
// across levels, so those keys include levelId to keep them distinct.

export function loadVocabRead() {
  try {
    const raw = localStorage.getItem(VOCAB_READ_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function isVocabWordRead(category, en) {
  return !!loadVocabRead()[vocabWordKey(category, en)];
}

export function markVocabWordRead(category, en) {
  const read = loadVocabRead();
  const key = vocabWordKey(category, en);
  if (read[key]) return;
  read[key] = true;
  localStorage.setItem(VOCAB_READ_KEY, JSON.stringify(read));
}

const grammarTopicKey = (levelId, topic) => `${levelId}::${topic}`;

export function loadGrammarRead() {
  try {
    const raw = localStorage.getItem(GRAMMAR_READ_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function isGrammarTopicRead(levelId, topic) {
  return !!loadGrammarRead()[grammarTopicKey(levelId, topic)];
}

export function markGrammarTopicRead(levelId, topic) {
  const read = loadGrammarRead();
  const key = grammarTopicKey(levelId, topic);
  if (read[key]) return;
  read[key] = true;
  localStorage.setItem(GRAMMAR_READ_KEY, JSON.stringify(read));
}
