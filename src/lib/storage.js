// Every localStorage key/shape here is unchanged from the vanilla-JS version — this is
// deliberate: existing users already have saved progress under these exact keys, and the
// framework rewrite must not lose it.

// Fired after every local write below — SyncContext subscribes to this (while signed in) to
// push an updated backup up to Firestore, without every mutating function here needing to
// know sync exists at all.
const changeListeners = new Set();

export function onProgressChange(listener) {
  changeListeners.add(listener);
  return () => changeListeners.delete(listener);
}

function notifyChanged() {
  changeListeners.forEach((fn) => fn());
}

export const THEME_KEY = "engish-quiz-theme";
export const ACCENT_KEY = "engish-quiz-accent";
export const UI_LANG_KEY = "engish-quiz-ui-lang";
export const SELECTED_LEVEL_KEY = "engish-quiz-selected-level";
export const ONBOARDING_KEY = "engish-quiz-onboarding-complete";
export const VOCAB_MISTAKES_KEY = "engish-quiz-vocab-mistakes";
export const VOCAB_MASTERED_KEY = "engish-quiz-vocab-mastered";
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
    notifyChanged();
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

// Accent color (Violet/Red) is independent of the light/dark mode above — a learner on the
// red accent can still switch between a light and dark surface, and vice versa.
export function getStoredAccent() {
  try {
    return localStorage.getItem(ACCENT_KEY) === "red" ? "red" : "violet";
  } catch {
    return "violet";
  }
}

export function setStoredAccent(value) {
  try {
    localStorage.setItem(ACCENT_KEY, value);
    notifyChanged();
  } catch {
    // ignore — accent just won't persist across reloads
  }
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
    notifyChanged();
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
    notifyChanged();
  } catch {
    // ignore
  }
}

export function hasCompletedOnboarding() {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "true";
  } catch {
    return false;
  }
}

export function markOnboardingComplete() {
  try {
    localStorage.setItem(ONBOARDING_KEY, "true");
    notifyChanged();
  } catch {
    // ignore — worst case the first-run tutorial just shows again next time
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
  notifyChanged();
}

export function clearState(levelId) {
  localStorage.removeItem(progressKeyFor(levelId));
  notifyChanged();
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
  notifyChanged();
}

// "Mastered" tracking for the Vocabulary list — a word is marked the moment it's answered
// correctly in any quiz mode (Quiz Me, Reverse Quiz, Review Mistakes), not just opened, so
// the green highlight actually means "you've gotten this right," not just "you've looked at
// it." Categories are unique across every level (verified when the A2/B1/B2 content was
// added), so vocab words don't need level-scoping the way grammar topics do below.

export function loadVocabMastered() {
  try {
    const raw = localStorage.getItem(VOCAB_MASTERED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function isVocabWordMastered(category, en) {
  return !!loadVocabMastered()[vocabWordKey(category, en)];
}

export function markVocabWordMastered(category, en) {
  const mastered = loadVocabMastered();
  const key = vocabWordKey(category, en);
  if (mastered[key]) return;
  mastered[key] = true;
  localStorage.setItem(VOCAB_MASTERED_KEY, JSON.stringify(mastered));
  notifyChanged();
}

// Grammar topics keep the original "read = opened" tracking — there's no quiz to answer
// correctly for a topic, so "you've looked at this" is the only signal available.
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
  notifyChanged();
}

// Manual backup/restore (Settings → Backup/Restore Progress) — a PWA install has no cloud
// account behind it, so progress only exists in this browser's localStorage; uninstalling
// (or losing the device) loses it for good otherwise. Sweeps every key under our own prefix
// rather than naming each one, so a future new key is included automatically.
const STORAGE_PREFIX = "engish-quiz-";

export function exportProgressData() {
  const data = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        data[key] = localStorage.getItem(key);
      }
    }
  } catch {
    // ignore — worst case the backup file comes out empty
  }
  return {
    app: "HamoLingo",
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
}

// Used by SyncContext to decide whether a sign-in needs a merge prompt at all — checked
// against BOTH the local and cloud blobs (same shape, so the same function works on either).
// A side with nothing but default settings (fresh install, or a cloud account that's only
// ever stored a theme preference) has nothing worth protecting, so the other side can just
// silently win instead of bothering the learner with a choice that isn't really a conflict.
export function hasProgressInData(data) {
  try {
    const mistakes = data[VOCAB_MISTAKES_KEY] ? Object.keys(JSON.parse(data[VOCAB_MISTAKES_KEY])) : [];
    const mastered = data[VOCAB_MASTERED_KEY] ? Object.keys(JSON.parse(data[VOCAB_MASTERED_KEY])) : [];
    const grammarRead = data[GRAMMAR_READ_KEY] ? Object.keys(JSON.parse(data[GRAMMAR_READ_KEY])) : [];
    if (mistakes.length > 0 || mastered.length > 0 || grammarRead.length > 0) return true;
    return Object.keys(data).some((key) => key.startsWith("engish-quiz-progress-"));
  } catch {
    return false;
  }
}

export function hasLocalProgress() {
  return hasProgressInData(exportProgressData().data);
}

// Short human-readable summary of a data blob (same shape as exportProgressData().data) —
// used by the merge-conflict prompt so "keep this device or the cloud copy?" isn't a blind
// choice. Works on either a local or a cloud blob, since both use the identical shape.
// Returns raw counts rather than a formatted string — strings.js/the component format and
// translate it, same as every other piece of user-facing text in the app.
export function summarizeProgressData(data) {
  try {
    const mastered = data[VOCAB_MASTERED_KEY] ? Object.keys(JSON.parse(data[VOCAB_MASTERED_KEY])).length : 0;
    const mistakes = data[VOCAB_MISTAKES_KEY] ? Object.keys(JSON.parse(data[VOCAB_MISTAKES_KEY])).length : 0;
    let levelsInProgress = 0;
    for (const key of Object.keys(data)) {
      if (!key.startsWith("engish-quiz-progress-")) continue;
      try {
        const state = JSON.parse(data[key]);
        if (Array.isArray(state.answers) && state.answers.some((a) => a !== null)) levelsInProgress++;
      } catch {
        // skip a malformed entry rather than fail the whole summary
      }
    }
    return { levelsInProgress, mastered, mistakes };
  } catch {
    return { levelsInProgress: 0, mastered: 0, mistakes: 0 };
  }
}

// Throws on a malformed file so the caller can show an error — restoring is destructive
// (overwrites existing progress), so silently no-op-ing on bad input would be worse than
// surfacing the problem.
export function importProgressData(payload) {
  if (!payload || typeof payload !== "object" || !payload.data || typeof payload.data !== "object") {
    throw new Error("Not a valid HamoLingo backup file.");
  }
  for (const [key, value] of Object.entries(payload.data)) {
    if (key.startsWith(STORAGE_PREFIX) && typeof value === "string") {
      localStorage.setItem(key, value);
    }
  }
}
