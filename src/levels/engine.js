// Shared helpers used by every level's question generator. Question order and
// option order are both fully deterministic (seeded, not Math.random) so saved
// progress — keyed by question index — stays valid across reloads.

export function withRotatedOptions(question, options, correctValue, seedIndex, explanation, questionAr, explanationAr) {
  const n = seedIndex % options.length;
  const rotated = [...options.slice(n), ...options.slice(0, n)];
  return {
    question,
    questionAr,
    options: rotated,
    answer: rotated.indexOf(correctValue),
    explanation,
    explanationAr,
  };
}

export function uniqueDistractors(correct, candidates) {
  const seen = new Set([correct]);
  const result = [];
  for (const c of candidates) {
    if (!seen.has(c)) {
      seen.add(c);
      result.push(c);
    }
    if (result.length === 3) break;
  }
  let filler = 1;
  while (result.length < 3) {
    const f = `${correct}${filler}`;
    if (!seen.has(f)) {
      seen.add(f);
      result.push(f);
    }
    filler++;
  }
  return result;
}

export function roundRobinMerge(lists) {
  const result = [];
  const pointers = lists.map(() => 0);
  let remaining = lists.reduce((sum, l) => sum + l.length, 0);
  while (remaining > 0) {
    for (let li = 0; li < lists.length; li++) {
      if (pointers[li] < lists[li].length) {
        result.push(lists[li][pointers[li]]);
        pointers[li]++;
        remaining--;
      }
    }
  }
  return result;
}

// Deterministic PRNG (mulberry32) so option order is shuffled per question yet
// stable across reloads — using Math.random() here would reshuffle every load
// and desync saved answer indices from their questions.
function mulberry32(seed) {
  let t = seed;
  return function () {
    t |= 0;
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleOptions(question, seed) {
  const rand = mulberry32(seed);
  const order = question.options.map((_, idx) => idx);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    ...question,
    options: order.map((idx) => question.options[idx]),
    answer: order.indexOf(question.answer),
  };
}

const STAGE_SIZE = 10;

export function buildLevel(categoryLists) {
  const questions = roundRobinMerge(categoryLists).map((q, i) => shuffleOptions(q, i + 1));
  return {
    questions,
    STAGE_SIZE,
    TOTAL_STAGES: Math.ceil(questions.length / STAGE_SIZE),
  };
}
