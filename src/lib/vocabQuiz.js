import { LEVEL_VOCABULARY } from "./content.js";
import { getVocabMistakeCount } from "./storage.js";

// Unlike the main quiz (which must stay deterministic so saved progress lines up with
// question indices), this mini quiz has no persisted state at all — genuine Math.random()
// is fine here.
export function shuffleRandomly(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getAllVocabWords(vocabulary) {
  return vocabulary.flatMap((group) => group.words.map((w) => ({ ...w, category: group.category })));
}

// Every level's words, flattened together — used as the distractor pool for "Review
// Mistakes" (see getMistakenWords) so a handful of mistaken words still gets a full,
// varied set of wrong options instead of only ever drawing from a small mistaken set.
export function getAllVocabularyAcrossLevels() {
  return Object.values(LEVEL_VOCABULARY).flatMap((levelVocabulary) => getAllVocabWords(levelVocabulary));
}

// Vocab mistakes are stored level-agnostically (keyed by category+word only — see
// storage.js), so a word missed while studying any level shows up here regardless of
// which level's Vocabulary screen is currently open.
export function getMistakenWords() {
  return getAllVocabularyAcrossLevels().filter((w) => getVocabMistakeCount(w.category, w.en) > 0);
}

// `targetWords` is the pool the correct answer is drawn from; `distractorWords` (defaults
// to the same pool) supplies the wrong options — kept separate so a small target pool
// (e.g. just-mistaken words) doesn't also starve the question of good distractors.
export function pickVocabQuizQuestion(targetWords, distractorWords = targetWords) {
  const correctWord = targetWords[Math.floor(Math.random() * targetWords.length)];
  const distractorPool = distractorWords.filter((w) => w.ar !== correctWord.ar);
  const distractors = shuffleRandomly(distractorPool).slice(0, 3);
  const options = shuffleRandomly([correctWord, ...distractors]);
  return { word: correctWord.en, category: correctWord.category, correctAr: correctWord.ar, options, pickedIndex: null };
}
