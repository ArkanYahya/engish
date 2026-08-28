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

export function pickVocabQuizQuestion(vocabulary) {
  const allWords = getAllVocabWords(vocabulary);
  const correctWord = allWords[Math.floor(Math.random() * allWords.length)];
  const distractorPool = allWords.filter((w) => w.ar !== correctWord.ar);
  const distractors = shuffleRandomly(distractorPool).slice(0, 3);
  const options = shuffleRandomly([correctWord, ...distractors]);
  return { word: correctWord.en, category: correctWord.category, correctAr: correctWord.ar, options, pickedIndex: null };
}
