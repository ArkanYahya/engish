import { LEVELS, getLevel } from "./levels/index.js";
import { VOCABULARY as A1_VOCABULARY } from "./levels/a1-vocabulary.js";

// Vocabulary is level-specific (each level will eventually get its own list) — a level
// with no entry here simply has no "Vocabulary" link/screen at all.
const LEVEL_VOCABULARY = { a1: A1_VOCABULARY };

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

// Small inline-SVG icon set (feather-style) so icons look identical across every OS/browser,
// instead of relying on emoji glyphs that render differently per platform.
const ICONS = {
  speaker:
    '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
  globe:
    '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/></svg>',
  moreVertical:
    '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>',
  x: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  chevronRight:
    '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  sun: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/></svg>',
  moon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>',
  settings:
    '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
};

function icon(name) {
  return ICONS[name] || "";
}

// Theme: "light" | "dark" | null (null = follow system preference).
const THEME_KEY = "engish-quiz-theme";

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function isDarkActive() {
  const stored = getStoredTheme();
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme() {
  const stored = getStoredTheme();
  if (stored === "dark" || stored === "light") {
    document.documentElement.setAttribute("data-theme", stored);
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

function toggleTheme() {
  const next = isDarkActive() ? "light" : "dark";
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // ignore — theme just won't persist across reloads
  }
  applyTheme();
  updateThemeToggleIcon();
}

function updateThemeToggleIcon() {
  document.querySelectorAll(".theme-toggle-btn").forEach((btn) => {
    btn.innerHTML = isDarkActive() ? icon("sun") : icon("moon");
    btn.setAttribute("aria-label", isDarkActive() ? t("switchToLight") : t("switchToDark"));
  });
}

applyTheme();

// UI language: translates interface chrome (buttons, headers, labels) only — the quiz
// questions/options themselves always stay in English, since that's the content being
// learned. "ar" strings also drive dir="rtl"/lang="ar" on chrome-only containers below.
const UI_LANG_KEY = "engish-quiz-ui-lang";

const LEVEL_TRANSLATIONS = {
  a1: {
    en: { name: "Beginner", description: "Basic words, 'to be', simple present, everyday vocabulary." },
    ar: { name: "مبتدئ", description: "كلمات أساسية، فعل الكينونة، المضارع البسيط، مفردات يومية." },
  },
  a2: {
    en: { name: "Elementary", description: "Past simple, present continuous, comparatives, modals." },
    ar: { name: "أساسي", description: "الماضي البسيط، المضارع المستمر، صيغ المقارنة، الأفعال الناقصة." },
  },
  b1: {
    en: { name: "Intermediate", description: "Present perfect, conditionals, passive voice, phrasal verbs." },
    ar: { name: "متوسط", description: "المضارع التام، الجمل الشرطية، المبني للمجهول، الأفعال المركبة." },
  },
  b2: {
    en: { name: "Upper-Intermediate", description: "Second/third conditionals, deduction modals, collocations." },
    ar: { name: "فوق المتوسط", description: "الشرط الثاني والثالث، أفعال الاستنتاج، المتلازمات اللفظية." },
  },
};

const STRINGS = {
  en: {
    appName: "English Quiz",
    settings: "Settings",
    language: "Language",
    cancel: "Cancel",
    confirmYes: "Yes, Start Over",
    menu: "Menu",
    close: "Close",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    switchUiLang: "عربي",
    vocabulary: "Vocabulary",
    vocabularyTitle: (label) => `${label} Vocabulary`,
    vocabularySubtitle: (label) => `Browse core words from the ${label} level, with Arabic meanings and pronunciation.`,
    quizMe: "Quiz Me",
    vocabQuizNext: "Next Word",
    vocabQuizScore: (score, total) => `Score: ${score}/${total}`,
    missedTimes: (count) => `Missed ${count} time${count === 1 ? "" : "s"} recently`,
    exampleSentence: "Example Sentence",
    showTranslation: "Show Translation",
    stagesTitle: "Stages",
    stagesCompleteOf: (done, total) => `${done} / ${total} complete`,
    legendCurrent: "Current",
    legendDone: "Done",
    legendPerfect: "Perfect",
    legendLocked: "Locked",
    stageN: (n) => `Stage ${n}`,
    stageTitleScore: (n, score, size) => `Stage ${n} — ${score}/${size}`,
    stageTitleInProgress: (n, x, size) => `Stage ${n} — in progress (${x}/${size})`,
    stageTitleLocked: (n) => `Stage ${n} — locked`,
    subtitleQuestion: (stage, totalStages, q, stageSize, overall, total) =>
      `Stage ${stage} of ${totalStages} · Question ${q} of ${stageSize} · Overall ${overall}/${total}`,
    subtitleStageComplete: (stage, total) => `Stage ${stage} of ${total} complete`,
    subtitleReviewing: (stage) => `Reviewing Stage ${stage}`,
    subtitleQuizComplete: "Quiz complete",
    chooseLevel: "Choose your level",
    chooseLevelSubtitle: "Each level has 500 questions across 50 stages, with bilingual (English/Arabic) explanations.",
    notStarted: "Not started",
    inProgress: (a, b) => `In progress — ${a}/${b}`,
    completedScore: (a, b) => `Completed — ${a}/${b}`,
    listenToQuestion: "Listen to question",
    listenToOption: "Listen to option",
    correct: "Correct!",
    notQuite: "Not quite.",
    next: "Next",
    finish: "Finish",
    stageComplete: (n) => `Stage ${n} Complete!`,
    continueToStage: (n) => `Continue to Stage ${n}`,
    viewFinalResults: "View Final Results",
    stageReview: (n, score, size) => `Stage ${n} Review — ${score}/${size}`,
    yourAnswer: "Your answer:",
    correctAnswer: "Correct answer:",
    back: "Back",
    quizComplete: "Quiz Complete!",
    resultOutstanding: "Outstanding work!",
    resultGreat: "Great job!",
    resultGood: "Good effort — keep practicing!",
    resultKeepGoing: "Keep going, you'll get there!",
    takeQuizAgain: "Take Quiz Again",
    confirmStartOver: "Start over? This will erase your saved progress for this level.",
  },
  ar: {
    appName: "اختبار الإنجليزية",
    settings: "الإعدادات",
    language: "اللغة",
    cancel: "إلغاء",
    confirmYes: "نعم، ابدأ من جديد",
    menu: "القائمة",
    close: "إغلاق",
    switchToLight: "التبديل إلى الوضع الفاتح",
    switchToDark: "التبديل إلى الوضع الداكن",
    switchUiLang: "English",
    vocabulary: "المفردات",
    vocabularyTitle: (label) => `مفردات المستوى ${label}`,
    vocabularySubtitle: (label) => `تصفح الكلمات الأساسية لمستوى ${label}، مع معانيها بالعربية ونطقها.`,
    quizMe: "اختبرني",
    vocabQuizNext: "الكلمة التالية",
    vocabQuizScore: (score, total) => `النتيجة: ${score}/${total}`,
    missedTimes: (count) => `أخطأت بها ${count} ${count === 1 ? "مرة" : "مرات"} مؤخرًا`,
    exampleSentence: "جملة توضيحية",
    showTranslation: "إظهار الترجمة",
    stagesTitle: "المراحل",
    stagesCompleteOf: (done, total) => `${done} / ${total} مكتملة`,
    legendCurrent: "الحالية",
    legendDone: "منتهية",
    legendPerfect: "ممتازة",
    legendLocked: "مغلقة",
    stageN: (n) => `المرحلة ${n}`,
    stageTitleScore: (n, score, size) => `المرحلة ${n} — ${score}/${size}`,
    stageTitleInProgress: (n, x, size) => `المرحلة ${n} — قيد التقدم (${x}/${size})`,
    stageTitleLocked: (n) => `المرحلة ${n} — مغلقة`,
    subtitleQuestion: (stage, totalStages, q, stageSize, overall, total) =>
      `المرحلة ${stage} من ${totalStages} · السؤال ${q} من ${stageSize} · الإجمالي ${overall}/${total}`,
    subtitleStageComplete: (stage, total) => `اكتملت المرحلة ${stage} من ${total}`,
    subtitleReviewing: (stage) => `مراجعة المرحلة ${stage}`,
    subtitleQuizComplete: "اكتمل الاختبار",
    chooseLevel: "اختر مستواك",
    chooseLevelSubtitle: "يحتوي كل مستوى على 500 سؤال موزعة على 50 مرحلة، مع شروحات ثنائية اللغة (إنجليزي/عربي).",
    notStarted: "لم يبدأ",
    inProgress: (a, b) => `قيد التقدم — ${a}/${b}`,
    completedScore: (a, b) => `مكتمل — ${a}/${b}`,
    listenToQuestion: "استمع إلى السؤال",
    listenToOption: "استمع إلى الخيار",
    correct: "إجابة صحيحة!",
    notQuite: "ليست صحيحة تماماً.",
    next: "التالي",
    finish: "إنهاء",
    stageComplete: (n) => `اكتملت المرحلة ${n}!`,
    continueToStage: (n) => `المتابعة إلى المرحلة ${n}`,
    viewFinalResults: "عرض النتيجة النهائية",
    stageReview: (n, score, size) => `مراجعة المرحلة ${n} — ${score}/${size}`,
    yourAnswer: "إجابتك:",
    correctAnswer: "الإجابة الصحيحة:",
    back: "رجوع",
    quizComplete: "اكتمل الاختبار!",
    resultOutstanding: "أداء رائع!",
    resultGreat: "عمل ممتاز!",
    resultGood: "جهد جيد — واصل التدرب!",
    resultKeepGoing: "واصل التقدم، ستصل قريباً!",
    takeQuizAgain: "أعد الاختبار",
    confirmStartOver: "هل تريد البدء من جديد؟ سيتم حذف تقدمك المحفوظ لهذا المستوى.",
  },
};

let uiLang = "en";
try {
  uiLang = localStorage.getItem(UI_LANG_KEY) === "ar" ? "ar" : "en";
} catch {
  // default to "en"
}

function t(key, ...args) {
  const entry = STRINGS[uiLang][key];
  return typeof entry === "function" ? entry(...args) : entry;
}

function isArabicUi() {
  return uiLang === "ar";
}

function rtlAttrs() {
  return isArabicUi() ? 'dir="rtl" lang="ar"' : 'dir="ltr" lang="en"';
}

function toggleUiLang() {
  uiLang = isArabicUi() ? "en" : "ar";
  try {
    localStorage.setItem(UI_LANG_KEY, uiLang);
  } catch {
    // selection just won't persist across reloads
  }
  rerenderCurrentScreen();
}

const SELECTED_LEVEL_KEY = "engish-quiz-selected-level";
const progressKeyFor = (levelId) => `engish-quiz-progress-${levelId}`;

const app = document.getElementById("app");

let currentLevel = null;
let questions = [];
let STAGE_SIZE = 10;
let TOTAL_STAGES = 0;
let TOTAL_QUESTIONS = 0;
let state = null;

// Tracks which screen is currently shown so toggling UI language (which needs to
// regenerate all text, unlike the theme toggle) can re-render the same screen in place.
let currentView = { name: "levelPicker" };

function rerenderCurrentScreen() {
  switch (currentView.name) {
    case "question":
      renderQuestion();
      break;
    case "stageComplete":
      renderStageComplete(currentView.stageIndex);
      break;
    case "stageReview":
      renderStageReview(currentView.stageIndex);
      break;
    case "results":
      renderResults();
      break;
    case "vocabulary":
      // Re-rendering the same screen in place (e.g. a language toggle while already
      // viewing it) — must not overwrite the "return to" target with itself.
      renderVocabulary(true);
      break;
    default:
      renderLevelPicker();
  }
}

function freshState(totalQuestions) {
  return {
    current: 0,
    answers: new Array(totalQuestions).fill(null),
    completed: false,
  };
}

function loadState(levelId, totalQuestions) {
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

function saveState() {
  localStorage.setItem(progressKeyFor(currentLevel.id), JSON.stringify(state));
}

function stageOf(index) {
  return Math.floor(index / STAGE_SIZE);
}

function scoreForRange(start, end) {
  let score = 0;
  for (let i = start; i < end; i++) {
    if (state.answers[i] === questions[i].answer) score++;
  }
  return score;
}

function stageStatus(stageIndex) {
  const start = stageIndex * STAGE_SIZE;
  const end = start + STAGE_SIZE;
  const answeredInStage = state.answers.slice(start, end).filter((a) => a !== null).length;

  if (answeredInStage === STAGE_SIZE) {
    const score = scoreForRange(start, end);
    return score === STAGE_SIZE ? "perfect" : "completed";
  }
  if (stageIndex === stageOf(state.current)) {
    return "current";
  }
  return "locked";
}

function levelProgressSummary(level) {
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

function selectLevel(levelId) {
  const level = getLevel(levelId);
  if (!level) return;
  currentLevel = level;
  questions = level.questions;
  STAGE_SIZE = level.STAGE_SIZE;
  TOTAL_STAGES = level.TOTAL_STAGES;
  TOTAL_QUESTIONS = questions.length;
  state = loadState(level.id, TOTAL_QUESTIONS) || freshState(TOTAL_QUESTIONS);
  localStorage.setItem(SELECTED_LEVEL_KEY, level.id);

  if (state.completed) {
    renderResults();
  } else {
    renderQuestion();
  }
}

function resetProgress() {
  openConfirmModal(t("confirmStartOver"), () => {
    localStorage.removeItem(progressKeyFor(currentLevel.id));
    state = freshState(TOTAL_QUESTIONS);
    renderQuestion();
  });
}

// Generic styled Yes/Cancel confirmation, replacing the browser's native confirm() so
// destructive actions look and behave like the rest of the app (themed, RTL-aware).
function openConfirmModal(message, onConfirm) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-box confirm-box" ${rtlAttrs()}>
      <p class="confirm-message">${message}</p>
      <div class="confirm-actions">
        <button class="confirm-cancel-btn" type="button">${t("cancel")}</button>
        <button class="confirm-ok-btn" type="button">${t("confirmYes")}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => {
    document.removeEventListener("keydown", onKey);
    overlay.remove();
  };
  function onKey(e) {
    if (e.key === "Escape") close();
  }
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", onKey);

  overlay.querySelector(".confirm-cancel-btn").addEventListener("click", close);
  overlay.querySelector(".confirm-ok-btn").addEventListener("click", () => {
    close();
    onConfirm();
  });
}

// Persistent app chrome (brand/home, theme toggle, settings) rendered identically at the
// top of every screen — Level Picker, Vocabulary, and every quiz screen alike — instead of
// being duplicated (and inconsistently available) per screen.
function renderTopBar() {
  return `
    <div class="top-bar" ${rtlAttrs()}>
      <button class="brand-home-btn" type="button">${t("appName")}</button>
      <div class="top-bar-actions">
        <button class="icon-btn theme-toggle-btn" type="button">${isDarkActive() ? icon("sun") : icon("moon")}</button>
        <button class="icon-btn settings-btn" type="button" aria-label="${t("settings")}" title="${t("settings")}">${icon("settings")}</button>
      </div>
    </div>
  `;
}

function attachTopBarEvents() {
  document.querySelectorAll(".brand-home-btn").forEach((btn) => btn.addEventListener("click", renderLevelPicker));
  document.querySelectorAll(".theme-toggle-btn").forEach((btn) => btn.addEventListener("click", toggleTheme));
  document.querySelectorAll(".settings-btn").forEach((btn) => btn.addEventListener("click", openSettingsModal));
  updateThemeToggleIcon();
}

// App-wide preferences live here instead of being repeated in every screen's header —
// currently just the UI language, with room to grow.
function openSettingsModal() {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  document.body.appendChild(overlay);

  const close = () => {
    document.removeEventListener("keydown", onKey);
    overlay.remove();
  };
  function onKey(e) {
    if (e.key === "Escape") close();
  }
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", onKey);

  function render() {
    overlay.innerHTML = `
      <div class="modal-box settings-box" ${rtlAttrs()}>
        <button class="modal-close" aria-label="${t("close")}">${icon("x")}</button>
        <p class="modal-label">${t("settings")}</p>
        <div class="settings-row">
          <span class="settings-row-label">${t("language")}</span>
          <button class="lang-toggle-btn" type="button">${t("switchUiLang")}</button>
        </div>
      </div>
    `;
    overlay.querySelector(".modal-close").addEventListener("click", close);
    overlay.querySelector(".lang-toggle-btn").addEventListener("click", () => {
      toggleUiLang();
      render();
    });
  }

  render();
}

function renderLevelPicker() {
  currentView = { name: "levelPicker" };

  const cards = LEVELS.map((level) => {
    const progressLabel = levelProgressSummary(level);
    const localized = LEVEL_TRANSLATIONS[level.id]?.[uiLang] || { name: level.name, description: level.description };
    return `
      <button class="level-card" data-level="${level.id}">
        <div class="level-badge">${level.label}</div>
        <div class="level-name">${localized.name}</div>
        <div class="level-desc">${localized.description}</div>
        <div class="level-progress">${progressLabel}</div>
      </button>
    `;
  });

  app.innerHTML = `
    <div class="page">
      ${renderTopBar()}
      <div class="level-picker" ${rtlAttrs()}>
        <h1>${t("chooseLevel")}</h1>
        <p class="level-picker-subtitle">${t("chooseLevelSubtitle")}</p>
        <div class="level-grid">${cards.join("")}</div>
      </div>
    </div>
  `;

  attachTopBarEvents();
  document.querySelectorAll(".level-card").forEach((btn) => {
    btn.addEventListener("click", () => selectLevel(btn.dataset.level));
  });
}

// The subtitle here already states the current stage ("Stage 3 of 50 · ..."), which made
// the old separate mobile-only "Stage 3 of 50" bar (with its own tap-to-open-stages
// affordance) pure duplication. The header itself is now the tap target for that instead —
// id'd and given a chevron hint (mobile only, see CSS) so it visibly acts as one button.
function renderHeader(subtitle) {
  const answeredCount = state.answers.filter((a) => a !== null).length;
  const pct = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);
  const hasVocab = !!LEVEL_VOCABULARY[currentLevel.id];
  return `
    <div class="header" id="header-stages-trigger" ${rtlAttrs()}>
      <div class="header-top">
        <span class="level-tag">${currentLevel.label}</span>
        ${hasVocab ? `<button id="vocabulary-btn" class="link-btn" type="button">${t("vocabulary")}</button>` : ""}
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="header-subtitle-row">
        <div class="header-subtitle">${subtitle}</div>
        <span class="header-subtitle-chevron">${icon("chevronRight")}</span>
      </div>
    </div>
  `;
}

function attachHeaderEvents() {
  // Wrapped in an arrow function — a bare `renderVocabulary` reference would receive the
  // click Event as its first argument, which collides with the preserveReturn parameter.
  document.getElementById("vocabulary-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    renderVocabulary();
  });
}

function renderSidebar() {
  const boxes = [];
  for (let s = 0; s < TOTAL_STAGES; s++) {
    const status = stageStatus(s);
    const start = s * STAGE_SIZE;
    const answeredInStage = state.answers.slice(start, start + STAGE_SIZE).filter((a) => a !== null).length;

    let title;
    if (status === "perfect" || status === "completed") {
      title = t("stageTitleScore", s + 1, scoreForRange(start, start + STAGE_SIZE), STAGE_SIZE);
    } else if (status === "current") {
      title = t("stageTitleInProgress", s + 1, answeredInStage, STAGE_SIZE);
    } else {
      title = t("stageTitleLocked", s + 1);
    }

    boxes.push(
      `<button class="stage-box ${status}" data-stage="${s}" title="${title}" ${
        status === "locked" ? "disabled" : ""
      }>${s + 1}</button>`
    );
  }

  const doneCount = Array.from({ length: TOTAL_STAGES }, (_, s) => stageStatus(s)).filter(
    (st) => st === "perfect" || st === "completed"
  ).length;

  return `
    <aside class="sidebar" id="stage-sidebar" ${rtlAttrs()}>
      <div class="sidebar-header-row">
        <div class="sidebar-title">${t("stagesTitle")}</div>
        <button class="icon-btn sidebar-close-btn" id="sidebar-close-btn" type="button" aria-label="${t("close")}">${icon("x")}</button>
      </div>
      <div class="sidebar-summary">${t("stagesCompleteOf", doneCount, TOTAL_STAGES)}</div>
      <div class="stage-grid">${boxes.join("")}</div>
      <div class="legend">
        <span><i class="dot current"></i> ${t("legendCurrent")}</span>
        <span><i class="dot completed"></i> ${t("legendDone")}</span>
        <span><i class="dot perfect"></i> ${t("legendPerfect")}</span>
        <span><i class="dot locked"></i> ${t("legendLocked")}</span>
      </div>
    </aside>
    <div class="sidebar-backdrop" id="sidebar-backdrop"></div>
  `;
}

function attachSidebarEvents() {
  document.querySelectorAll(".stage-box").forEach((btn) => {
    if (btn.disabled) return;
    btn.addEventListener("click", () => {
      const stageIndex = Number(btn.dataset.stage);
      const status = stageStatus(stageIndex);
      if (status === "perfect" || status === "completed") {
        renderStageReview(stageIndex);
      } else if (status === "current") {
        renderQuestion();
      }
    });
  });

  const sidebarEl = document.getElementById("stage-sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const headerTrigger = document.getElementById("header-stages-trigger");
  const closeBtn = document.getElementById("sidebar-close-btn");
  if (!sidebarEl || !backdrop) return;

  const openSheet = () => sidebarEl.classList.add("open");
  const closeSheet = () => sidebarEl.classList.remove("open");

  // On desktop the stage grid is already always visible in the sidebar, so this is a
  // harmless no-op there — the mobile bottom-sheet behavior (see CSS) is what it's for.
  headerTrigger?.addEventListener("click", openSheet);
  backdrop.addEventListener("click", closeSheet);
  closeBtn?.addEventListener("click", closeSheet);
}

function speakableText(text) {
  return text.replace(/_+/g, "blank");
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(speakableText(text));
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
}

function openTranslationModal(questionEn, questionAr) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" aria-label="Close">${icon("x")}</button>
      <p class="modal-label">English</p>
      <p class="modal-question-en">${questionEn}</p>
      <p class="modal-label" dir="rtl">بالعربية</p>
      <p class="modal-question-ar" dir="rtl" lang="ar">${questionAr}</p>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  overlay.querySelector(".modal-close").addEventListener("click", close);
  document.addEventListener("keydown", function onKey(e) {
    if (e.key === "Escape") {
      close();
      document.removeEventListener("keydown", onKey);
    }
  });
}

function renderScoreGauge(score, total, size) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const targetOffset = circumference * (1 - pct / 100);
  return `
    <div class="score-gauge" style="width:${size}px;height:${size}px;">
      <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
        <circle class="gauge-track" cx="${center}" cy="${center}" r="${radius}" />
        <circle class="gauge-fill" cx="${center}" cy="${center}" r="${radius}"
          stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"
          data-target-offset="${targetOffset}" transform="rotate(-90 ${center} ${center})" />
      </svg>
      <div class="gauge-label">
        <div class="gauge-percent">${pct}%</div>
        <div class="gauge-score">${score}/${total}</div>
      </div>
    </div>
  `;
}

// Gauges render at 0% first, then animate to their target on the next frame — this only
// works as a CSS transition if the change happens *after* the initial paint.
function animateGaugeFills() {
  document.querySelectorAll(".gauge-fill").forEach((el) => {
    const target = el.dataset.targetOffset;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.strokeDashoffset = target;
      });
    });
  });
}

function resultsMessage(pct) {
  if (pct >= 90) return t("resultOutstanding");
  if (pct >= 75) return t("resultGreat");
  if (pct >= 50) return t("resultGood");
  return t("resultKeepGoing");
}

function celebrate() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899"];
  const container = document.createElement("div");
  container.className = "confetti-container";
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
    piece.style.animationDuration = `${1.6 + Math.random() * 1.2}s`;
    piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 160}px`);
    container.appendChild(piece);
  }
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 3200);
}

function renderQuestion() {
  currentView = { name: "question" };
  const q = questions[state.current];
  const stageIndex = stageOf(state.current);
  const posInStage = (state.current % STAGE_SIZE) + 1;
  const picked = state.answers[state.current];
  const isAnswered = picked !== null;

  app.innerHTML = `
    <div class="page">
      ${renderTopBar()}
      <div class="layout">
      ${renderSidebar()}
      <div class="main-panel">
        ${renderHeader(
          t(
            "subtitleQuestion",
            stageIndex + 1,
            TOTAL_STAGES,
            posInStage,
            STAGE_SIZE,
            state.current + 1,
            TOTAL_QUESTIONS
          )
        )}
        <div class="quiz-card">
          <div class="question-row">
            <h2>${q.question}</h2>
            <div class="question-actions">
              <button id="speak-question-btn" class="icon-btn" type="button" title="${t("listenToQuestion")}" aria-label="${t("listenToQuestion")}">${icon("speaker")}</button>
              <button id="translate-btn" class="icon-btn" type="button" title="عرض السؤال بالعربية" aria-label="عرض السؤال بالعربية">${icon("globe")}</button>
            </div>
          </div>
          <div class="options">
            ${q.options
              .map((opt, i) => {
                let cls = "option";
                if (isAnswered) {
                  cls += " locked";
                  if (i === q.answer) cls += " correct";
                  else if (i === picked) cls += " incorrect";
                }
                return `
                  <div class="option-row">
                    <button class="${cls}" data-index="${i}" ${isAnswered ? "disabled" : ""}>${opt}</button>
                    <button class="icon-btn speak-option-btn" data-option-index="${i}" type="button" title="${t("listenToOption")}" aria-label="${t("listenToOption")}">${icon("speaker")}</button>
                  </div>`;
              })
              .join("")}
          </div>
          ${
            isAnswered
              ? `<div class="feedback ${picked === q.answer ? "feedback-correct" : "feedback-incorrect"}">
                  <strong ${rtlAttrs()}>${picked === q.answer ? t("correct") : t("notQuite")}</strong>
                  <p>${q.explanation}</p>
                  <p class="feedback-ar" dir="rtl" lang="ar">${q.explanationAr}</p>
                </div>`
              : ""
          }
          <button id="next-btn" class="next-btn" ${isAnswered ? "" : "disabled"} ${rtlAttrs()}>
            ${state.current === TOTAL_QUESTIONS - 1 ? t("finish") : t("next")}
          </button>
        </div>
      </div>
      </div>
    </div>
  `;

  attachTopBarEvents();
  attachHeaderEvents();
  attachSidebarEvents();

  document.getElementById("translate-btn").addEventListener("click", () => {
    openTranslationModal(q.question, q.questionAr);
  });

  document.getElementById("speak-question-btn").addEventListener("click", () => {
    speak(q.question);
  });

  app.querySelectorAll(".speak-option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      speak(q.options[Number(btn.dataset.optionIndex)]);
    });
  });

  if (!isAnswered) {
    app.querySelectorAll(".option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(btn.dataset.index);
        state.answers[state.current] = index;
        saveState();
        speak(q.options[index]);
        renderQuestion();
      });
    });
  }

  document.getElementById("next-btn").addEventListener("click", () => {
    if (state.answers[state.current] === null) return;

    const finishedStage = state.current % STAGE_SIZE === STAGE_SIZE - 1;
    const isLastQuestion = state.current === TOTAL_QUESTIONS - 1;

    if (isLastQuestion) {
      state.completed = true;
      saveState();
      renderResults(true);
      return;
    }

    const finishedStageIndex = stageOf(state.current);
    state.current += 1;
    saveState();

    if (finishedStage) {
      renderStageComplete(finishedStageIndex);
    } else {
      renderQuestion();
    }
  });
}

function renderStageComplete(stageIndex) {
  currentView = { name: "stageComplete", stageIndex };
  const start = stageIndex * STAGE_SIZE;
  const end = start + STAGE_SIZE;
  const score = scoreForRange(start, end);

  app.innerHTML = `
    <div class="page">
      ${renderTopBar()}
      <div class="layout">
      ${renderSidebar()}
      <div class="main-panel">
        ${renderHeader(t("subtitleStageComplete", stageIndex + 1, TOTAL_STAGES))}
        <div class="quiz-card center" ${rtlAttrs()}>
          <h2>${t("stageComplete", stageIndex + 1)}</h2>
          ${renderScoreGauge(score, STAGE_SIZE, 100)}
          <button id="continue-btn" class="next-btn">
            ${stageIndex + 1 < TOTAL_STAGES ? t("continueToStage", stageIndex + 2) : t("viewFinalResults")}
          </button>
        </div>
      </div>
      </div>
    </div>
  `;

  attachTopBarEvents();
  attachHeaderEvents();
  attachSidebarEvents();
  animateGaugeFills();
  if (score === STAGE_SIZE) celebrate();

  document.getElementById("continue-btn").addEventListener("click", renderQuestion);
}

function renderStageReview(stageIndex) {
  currentView = { name: "stageReview", stageIndex };
  const start = stageIndex * STAGE_SIZE;
  const end = start + STAGE_SIZE;
  const score = scoreForRange(start, end);

  const items = [];
  for (let i = start; i < end; i++) {
    const q = questions[i];
    const picked = state.answers[i];
    const isCorrect = picked === q.answer;
    items.push(`
      <div class="review-item ${isCorrect ? "correct" : "incorrect"}">
        <p class="review-question">${i - start + 1}. ${q.question}</p>
        <p>${t("yourAnswer")} ${q.options[picked]}</p>
        ${!isCorrect ? `<p>${t("correctAnswer")} ${q.options[q.answer]}</p>` : ""}
      </div>
    `);
  }

  app.innerHTML = `
    <div class="page">
      ${renderTopBar()}
      <div class="layout">
      ${renderSidebar()}
      <div class="main-panel">
        ${renderHeader(t("subtitleReviewing", stageIndex + 1))}
        <div class="quiz-card">
          <h2 ${rtlAttrs()}>${t("stageReview", stageIndex + 1, score, STAGE_SIZE)}</h2>
          <div class="review-list">${items.join("")}</div>
          <button id="back-btn" class="next-btn" ${rtlAttrs()}>${t("back")}</button>
        </div>
      </div>
      </div>
    </div>
  `;

  attachTopBarEvents();
  attachHeaderEvents();
  attachSidebarEvents();

  document.getElementById("back-btn").addEventListener("click", () => {
    if (state.completed) {
      renderResults();
    } else {
      renderQuestion();
    }
  });
}

function renderResults(justCompleted) {
  currentView = { name: "results" };
  const score = scoreForRange(0, TOTAL_QUESTIONS);
  const pct = Math.round((score / TOTAL_QUESTIONS) * 100);

  const stageRows = [];
  for (let s = 0; s < TOTAL_STAGES; s++) {
    const start = s * STAGE_SIZE;
    const stageScore = scoreForRange(start, start + STAGE_SIZE);
    stageRows.push(`
      <div class="stage-row">
        <span>${t("stageN", s + 1)}</span>
        <span>${stageScore} / ${STAGE_SIZE}</span>
      </div>
    `);
  }

  app.innerHTML = `
    <div class="page">
      ${renderTopBar()}
      <div class="layout">
      ${renderSidebar()}
      <div class="main-panel">
        ${renderHeader(t("subtitleQuizComplete"))}
        <div class="quiz-card center" ${rtlAttrs()}>
          <h2>${t("quizComplete")}</h2>
          ${renderScoreGauge(score, TOTAL_QUESTIONS, 140)}
          <p class="results-message">${resultsMessage(pct)}</p>
          <div class="stage-breakdown">
            ${stageRows.join("")}
          </div>
          <button id="restart-btn" class="next-btn">${t("takeQuizAgain")}</button>
        </div>
      </div>
      </div>
    </div>
  `;

  attachTopBarEvents();
  attachHeaderEvents();
  attachSidebarEvents();
  animateGaugeFills();
  if (justCompleted) celebrate();

  document.getElementById("restart-btn").addEventListener("click", resetProgress);
}

// Standalone reference screen (not tied to quiz progress) — reachable from any quiz
// screen via the header menu. Remembers whichever screen it was opened from so the
// back button returns there, and so a language toggle mid-view re-renders correctly.
let vocabularyReturnView = { name: "levelPicker" };

// Tracks recent struggle with individual vocabulary words, based on answers given in the
// "Quiz Me" mini-quiz: a wrong answer nudges a word's count up, a later correct answer
// nudges it back down (floored at 0) — so the indicator reflects recent trouble, not a
// lifetime tally. Keyed by category+word (not just the English word) because a couple of
// words repeat across categories with different meanings — e.g. "orange" is both a fruit
// (Food) and a color (Colors) — and those must not share a counter.
const VOCAB_MISTAKES_KEY = "engish-quiz-vocab-mistakes";
const vocabWordKey = (category, en) => `${category}::${en}`;

function loadVocabMistakes() {
  try {
    const raw = localStorage.getItem(VOCAB_MISTAKES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getVocabMistakeCount(category, en) {
  return loadVocabMistakes()[vocabWordKey(category, en)] || 0;
}

function bumpVocabMistake(category, en, delta) {
  const mistakes = loadVocabMistakes();
  const key = vocabWordKey(category, en);
  const next = Math.max(0, (mistakes[key] || 0) + delta);
  if (next === 0) delete mistakes[key];
  else mistakes[key] = next;
  localStorage.setItem(VOCAB_MISTAKES_KEY, JSON.stringify(mistakes));
}

// `preserveReturn` is used when refreshing the list in place (e.g. after the quiz modal
// closes, to pick up updated mistake badges) — a normal navigation into this screen should
// remember where it came from, but a same-screen refresh must not overwrite that memory.
function currentLevelVocabulary() {
  return LEVEL_VOCABULARY[currentLevel?.id] || [];
}

function renderVocabulary(preserveReturn = false) {
  if (!preserveReturn) vocabularyReturnView = currentView;
  currentView = { name: "vocabulary" };

  const sections = currentLevelVocabulary().map((group) => {
    const catName = isArabicUi() ? group.categoryAr : group.category;
    const rows = group.words
      .map((w, i) => {
        const missCount = getVocabMistakeCount(group.category, w.en);
        const tier = Math.min(missCount, 3);
        const badge =
          missCount > 0
            ? `<span class="vocab-mistake-badge tier-${tier}" title="${t("missedTimes", missCount)}">${missCount}</span>`
            : "";
        return `
          <div class="vocab-row" data-category="${group.category}" data-en="${w.en.replace(/"/g, "&quot;")}" role="button" tabindex="0" aria-label="${t("exampleSentence")}: ${w.en}">
            <div class="vocab-word">
              <span class="vocab-en">${w.en}</span>
              ${badge}
              <span class="vocab-ar" dir="rtl" lang="ar">${w.ar}</span>
            </div>
            <button class="icon-btn vocab-speak-btn" data-en="${w.en.replace(/"/g, "&quot;")}" type="button" title="${t("listenToOption")}" aria-label="${t("listenToOption")}">${icon("speaker")}</button>
          </div>
        `;
      })
      .join("");
    return `
      <div class="vocab-category">
        <h3 ${rtlAttrs()}>${catName}</h3>
        <div class="vocab-list" dir="ltr">${rows}</div>
      </div>
    `;
  }).join("");

  app.innerHTML = `
    <div class="page">
      ${renderTopBar()}
      <div class="vocab-page" ${rtlAttrs()}>
        <div class="vocab-header">
          <button class="icon-btn vocab-back-btn" type="button" aria-label="${t("back")}">${icon("chevronRight")}</button>
          <h1>${t("vocabularyTitle", currentLevel.label)}</h1>
        </div>
        <p class="vocab-subtitle">${t("vocabularySubtitle", currentLevel.label)}</p>
        <button class="next-btn vocab-quiz-trigger-btn" type="button">${t("quizMe")}</button>
        ${sections}
      </div>
    </div>
  `;

  attachTopBarEvents();
  document.querySelector(".vocab-back-btn").addEventListener("click", () => {
    currentView = vocabularyReturnView;
    rerenderCurrentScreen();
  });

  document.querySelectorAll(".vocab-speak-btn").forEach((btn) => {
    // Stop the click from bubbling up to the row, which opens the example-sentence card —
    // the speaker button is a separate action (just pronounce the word).
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      speak(btn.dataset.en);
    });
  });

  document.querySelectorAll(".vocab-row").forEach((row) => {
    const openExample = () => {
      const word = findVocabWord(row.dataset.category, row.dataset.en);
      if (word) openVocabExampleModal(word);
    };
    row.addEventListener("click", openExample);
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openExample();
      }
    });
  });

  document.querySelector(".vocab-quiz-trigger-btn").addEventListener("click", openVocabQuizModal);
}

function findVocabWord(category, en) {
  const group = currentLevelVocabulary().find((g) => g.category === category);
  return group?.words.find((w) => w.en === en);
}

// Shows the word's example sentence with the Arabic translation hidden until the learner
// asks for it, so they're nudged to try reading the English sentence first.
function openVocabExampleModal(word) {
  let revealed = false;

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  document.body.appendChild(overlay);

  function close() {
    document.removeEventListener("keydown", onKey);
    overlay.remove();
  }
  function onKey(e) {
    if (e.key === "Escape") close();
  }
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", onKey);

  function render() {
    overlay.innerHTML = `
      <div class="modal-box vocab-example-box" ${rtlAttrs()}>
        <button class="modal-close" aria-label="${t("close")}">${icon("x")}</button>
        <p class="modal-label">${t("exampleSentence")}</p>
        <div class="vocab-example-word-row">
          <h2 class="vocab-example-word">${word.en}</h2>
          <button class="icon-btn vocab-example-speak-btn" type="button" title="${t("listenToOption")}" aria-label="${t("listenToOption")}">${icon("speaker")}</button>
        </div>
        <p class="vocab-example-sentence" dir="ltr" lang="en">${word.ex}</p>
        ${
          revealed
            ? `<p class="vocab-example-sentence-ar" dir="rtl" lang="ar">${word.exAr}</p>`
            : `<button class="icon-btn vocab-example-reveal-btn" type="button" title="${t("showTranslation")}" aria-label="${t("showTranslation")}">${icon("globe")}</button>`
        }
      </div>
    `;

    overlay.querySelector(".modal-close").addEventListener("click", close);
    overlay.querySelector(".vocab-example-speak-btn").addEventListener("click", () => speak(word.ex));

    const revealBtn = overlay.querySelector(".vocab-example-reveal-btn");
    if (revealBtn) {
      revealBtn.addEventListener("click", () => {
        revealed = true;
        render();
      });
    }
  }

  render();
}

// Recomputed on demand (not cached at module load) since it needs to reflect whichever
// level is currently active.
function getAllVocabWords() {
  return currentLevelVocabulary().flatMap((group) =>
    group.words.map((w) => ({ ...w, category: group.category }))
  );
}

function shuffleRandomly(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Unlike the main quiz (which must stay deterministic so saved progress lines up with
// question indices), this mini quiz has no persisted state at all — genuine Math.random()
// is fine and is what the user asked for.
function pickVocabQuizQuestion() {
  const allWords = getAllVocabWords();
  const correctWord = allWords[Math.floor(Math.random() * allWords.length)];
  const distractorPool = allWords.filter((w) => w.ar !== correctWord.ar);
  const distractors = shuffleRandomly(distractorPool).slice(0, 3);
  const options = shuffleRandomly([correctWord, ...distractors]);
  return { word: correctWord.en, category: correctWord.category, correctAr: correctWord.ar, options, pickedIndex: null };
}

function openVocabQuizModal() {
  let score = 0;
  let total = 0;
  let current = pickVocabQuizQuestion();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  document.body.appendChild(overlay);

  function close() {
    document.removeEventListener("keydown", onKey);
    overlay.remove();
    // Refresh the list behind the modal so any mistake badges picked up during this
    // session are visible immediately, without disturbing the back-button's memory
    // of which screen opened the vocabulary page.
    if (currentView.name === "vocabulary") renderVocabulary(true);
  }
  function onKey(e) {
    if (e.key === "Escape") close();
  }
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", onKey);

  function renderModalContent() {
    const answered = current.pickedIndex !== null;
    const isCorrect = answered && current.options[current.pickedIndex].ar === current.correctAr;

    overlay.innerHTML = `
      <div class="modal-box vocab-quiz-box" ${rtlAttrs()}>
        <button class="modal-close" aria-label="${t("close")}">${icon("x")}</button>
        <p class="modal-label">${t("quizMe")}</p>
        <p class="vocab-quiz-score">${t("vocabQuizScore", score, total)}</p>
        <div class="vocab-quiz-word-row">
          <h2 class="vocab-quiz-word">${current.word}</h2>
          <button class="icon-btn vocab-quiz-speak-btn" type="button" title="${t("listenToOption")}" aria-label="${t("listenToOption")}">${icon("speaker")}</button>
        </div>
        <div class="vocab-quiz-options">
          ${current.options
            .map((opt, i) => {
              let cls = "option";
              if (answered) {
                cls += " locked";
                if (opt.ar === current.correctAr) cls += " correct";
                else if (i === current.pickedIndex) cls += " incorrect";
              }
              return `<button class="${cls}" data-index="${i}" dir="rtl" lang="ar" ${answered ? "disabled" : ""}>${opt.ar}</button>`;
            })
            .join("")}
        </div>
        ${
          answered
            ? `<div class="feedback ${isCorrect ? "feedback-correct" : "feedback-incorrect"}">
                <strong ${rtlAttrs()}>${isCorrect ? t("correct") : t("notQuite")}</strong>
              </div>`
            : ""
        }
        <button class="next-btn vocab-quiz-next-btn" type="button" ${answered ? "" : "disabled"}>${t("vocabQuizNext")}</button>
      </div>
    `;

    overlay.querySelector(".modal-close").addEventListener("click", close);
    overlay.querySelector(".vocab-quiz-speak-btn").addEventListener("click", () => speak(current.word));

    if (!answered) {
      overlay.querySelectorAll(".vocab-quiz-options .option").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.dataset.index);
          current.pickedIndex = idx;
          total += 1;
          if (current.options[idx].ar === current.correctAr) {
            score += 1;
            bumpVocabMistake(current.category, current.word, -1);
          } else {
            bumpVocabMistake(current.category, current.word, 1);
          }
          renderModalContent();
        });
      });
    }

    overlay.querySelector(".vocab-quiz-next-btn").addEventListener("click", () => {
      if (current.pickedIndex === null) return;
      current = pickVocabQuizQuestion();
      renderModalContent();
    });
  }

  renderModalContent();
}

const savedLevelId = localStorage.getItem(SELECTED_LEVEL_KEY);
if (savedLevelId && getLevel(savedLevelId)) {
  selectLevel(savedLevelId);
} else {
  renderLevelPicker();
}
