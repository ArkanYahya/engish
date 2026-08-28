import { LEVELS, getLevel } from "./levels/index.js";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
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
  if (!raw) return "Not started";
  try {
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved.answers) || saved.answers.length !== level.questions.length) return "Not started";
    const answered = saved.answers.filter((a) => a !== null).length;
    if (saved.completed) {
      const score = saved.answers.reduce((sum, a, i) => sum + (a === level.questions[i].answer ? 1 : 0), 0);
      return `Completed — ${score}/${level.questions.length}`;
    }
    if (answered > 0) {
      return `In progress — ${answered}/${level.questions.length}`;
    }
    return "Not started";
  } catch {
    return "Not started";
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
  if (!confirm("Start over? This will erase your saved progress for this level.")) return;
  localStorage.removeItem(progressKeyFor(currentLevel.id));
  state = freshState(TOTAL_QUESTIONS);
  renderQuestion();
}

function renderLevelPicker() {
  const cards = LEVELS.map((level) => {
    const progressLabel = levelProgressSummary(level);
    return `
      <button class="level-card" data-level="${level.id}">
        <div class="level-badge">${level.label}</div>
        <div class="level-name">${level.name}</div>
        <div class="level-desc">${level.description}</div>
        <div class="level-progress">${progressLabel}</div>
      </button>
    `;
  });

  app.innerHTML = `
    <div class="level-picker">
      <h1>Choose your level</h1>
      <p class="level-picker-subtitle">Each level has 500 questions across 50 stages, with bilingual (English/Arabic) explanations.</p>
      <div class="level-grid">${cards.join("")}</div>
    </div>
  `;

  document.querySelectorAll(".level-card").forEach((btn) => {
    btn.addEventListener("click", () => selectLevel(btn.dataset.level));
  });
}

function renderHeader(subtitle) {
  const answeredCount = state.answers.filter((a) => a !== null).length;
  const pct = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);
  return `
    <div class="header">
      <div class="header-top">
        <span class="brand">English Quiz <span class="level-tag">${currentLevel.label}</span></span>
        <div class="header-actions">
          <button id="change-level-btn" class="link-btn desktop-only">Change Level</button>
          <button id="start-over-btn" class="link-btn desktop-only">Start Over</button>
          <div class="header-menu mobile-only">
            <button id="header-menu-btn" class="icon-btn" type="button" aria-label="Menu">⋯</button>
            <div class="header-menu-panel" id="header-menu-panel">
              <button id="change-level-btn-mobile" class="header-menu-item" type="button">Change Level</button>
              <button id="start-over-btn-mobile" class="header-menu-item" type="button">Start Over</button>
            </div>
          </div>
        </div>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="header-subtitle">${subtitle}</div>
    </div>
  `;
}

function attachHeaderEvents() {
  document.getElementById("start-over-btn").addEventListener("click", resetProgress);
  document.getElementById("change-level-btn").addEventListener("click", renderLevelPicker);
  document.getElementById("start-over-btn-mobile").addEventListener("click", resetProgress);
  document.getElementById("change-level-btn-mobile").addEventListener("click", renderLevelPicker);
  document.getElementById("header-menu-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("header-menu-panel").classList.toggle("open");
  });
}

// Attached once for the app's lifetime (not per render) so it never accumulates
// duplicate listeners on `document` across re-renders.
document.addEventListener("click", (e) => {
  const menuBtn = document.getElementById("header-menu-btn");
  const menuPanel = document.getElementById("header-menu-panel");
  if (!menuBtn || !menuPanel) return;
  if (!menuPanel.contains(e.target) && e.target !== menuBtn) {
    menuPanel.classList.remove("open");
  }
});

function renderSidebar() {
  const boxes = [];
  for (let s = 0; s < TOTAL_STAGES; s++) {
    const status = stageStatus(s);
    const start = s * STAGE_SIZE;
    const answeredInStage = state.answers.slice(start, start + STAGE_SIZE).filter((a) => a !== null).length;

    let title = `Stage ${s + 1}`;
    if (status === "perfect" || status === "completed") {
      title += ` — ${scoreForRange(start, start + STAGE_SIZE)}/${STAGE_SIZE}`;
    } else if (status === "current") {
      title += ` — in progress (${answeredInStage}/${STAGE_SIZE})`;
    } else {
      title += " — locked";
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
    <aside class="sidebar" id="stage-sidebar">
      <div class="sidebar-header-row">
        <div class="sidebar-title">Stages</div>
        <button class="icon-btn sidebar-close-btn" id="sidebar-close-btn" type="button" aria-label="Close">✕</button>
      </div>
      <div class="sidebar-summary">${doneCount} / ${TOTAL_STAGES} complete</div>
      <div class="stage-grid">${boxes.join("")}</div>
      <div class="legend">
        <span><i class="dot current"></i> Current</span>
        <span><i class="dot completed"></i> Done</span>
        <span><i class="dot perfect"></i> Perfect</span>
        <span><i class="dot locked"></i> Locked</span>
      </div>
    </aside>
    <div class="sidebar-backdrop" id="sidebar-backdrop"></div>
  `;
}

// Mobile-only compact bar shown in place of the full stage grid; tapping it opens
// the grid as a bottom-sheet (the same .sidebar element, repositioned via CSS).
function renderStageBar() {
  const doneCount = Array.from({ length: TOTAL_STAGES }, (_, s) => stageStatus(s)).filter(
    (st) => st === "perfect" || st === "completed"
  ).length;
  const currentStageNum = stageOf(state.current) + 1;
  return `
    <button class="stage-bar" id="stage-bar-btn" type="button">
      <span class="stage-bar-text"><strong>Stage ${currentStageNum}</strong> of ${TOTAL_STAGES} &middot; ${doneCount} complete</span>
      <span class="stage-bar-chevron">›</span>
    </button>
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
  const stageBarBtn = document.getElementById("stage-bar-btn");
  const closeBtn = document.getElementById("sidebar-close-btn");
  if (!sidebarEl || !backdrop) return;

  const openSheet = () => sidebarEl.classList.add("open");
  const closeSheet = () => sidebarEl.classList.remove("open");

  stageBarBtn?.addEventListener("click", openSheet);
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
      <button class="modal-close" aria-label="Close">&times;</button>
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

function renderQuestion() {
  const q = questions[state.current];
  const stageIndex = stageOf(state.current);
  const posInStage = (state.current % STAGE_SIZE) + 1;
  const picked = state.answers[state.current];
  const isAnswered = picked !== null;

  app.innerHTML = `
    <div class="layout">
      ${renderSidebar()}
      <div class="main-panel">
        ${renderHeader(
          `Stage ${stageIndex + 1} of ${TOTAL_STAGES} &middot; Question ${posInStage} of ${STAGE_SIZE} &middot; Overall ${state.current + 1}/${TOTAL_QUESTIONS}`
        )}
        ${renderStageBar()}
        <div class="quiz-card">
          <div class="question-row">
            <h2>${q.question}</h2>
            <div class="question-actions">
              <button id="speak-question-btn" class="icon-btn" type="button" title="Listen to question" aria-label="Listen to question">🔊</button>
              <button id="translate-btn" class="translate-btn" type="button" title="عرض السؤال بالعربية">🌐 عربي</button>
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
                    <button class="icon-btn speak-option-btn" data-option-index="${i}" type="button" title="Listen to option" aria-label="Listen to option">🔊</button>
                  </div>`;
              })
              .join("")}
          </div>
          ${
            isAnswered
              ? `<div class="feedback ${picked === q.answer ? "feedback-correct" : "feedback-incorrect"}">
                  <strong>${picked === q.answer ? "Correct!" : "Not quite."}</strong>
                  <p>${q.explanation}</p>
                  <p class="feedback-ar" dir="rtl" lang="ar">${q.explanationAr}</p>
                </div>`
              : ""
          }
          <button id="next-btn" class="next-btn" ${isAnswered ? "" : "disabled"}>
            ${state.current === TOTAL_QUESTIONS - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  `;

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
      renderResults();
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
  const start = stageIndex * STAGE_SIZE;
  const end = start + STAGE_SIZE;
  const score = scoreForRange(start, end);

  app.innerHTML = `
    <div class="layout">
      ${renderSidebar()}
      <div class="main-panel">
        ${renderHeader(`Stage ${stageIndex + 1} of ${TOTAL_STAGES} complete`)}
        ${renderStageBar()}
        <div class="quiz-card center">
          <h2>Stage ${stageIndex + 1} Complete!</h2>
          <p class="stage-score">Score: ${score} / ${STAGE_SIZE}</p>
          <button id="continue-btn" class="next-btn">
            ${stageIndex + 1 < TOTAL_STAGES ? `Continue to Stage ${stageIndex + 2}` : "View Final Results"}
          </button>
        </div>
      </div>
    </div>
  `;

  attachHeaderEvents();
  attachSidebarEvents();

  document.getElementById("continue-btn").addEventListener("click", renderQuestion);
}

function renderStageReview(stageIndex) {
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
        <p>Your answer: ${q.options[picked]}</p>
        ${!isCorrect ? `<p>Correct answer: ${q.options[q.answer]}</p>` : ""}
      </div>
    `);
  }

  app.innerHTML = `
    <div class="layout">
      ${renderSidebar()}
      <div class="main-panel">
        ${renderHeader(`Reviewing Stage ${stageIndex + 1}`)}
        ${renderStageBar()}
        <div class="quiz-card">
          <h2>Stage ${stageIndex + 1} Review — ${score} / ${STAGE_SIZE}</h2>
          <div class="review-list">${items.join("")}</div>
          <button id="back-btn" class="next-btn">Back</button>
        </div>
      </div>
    </div>
  `;

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

function renderResults() {
  const score = scoreForRange(0, TOTAL_QUESTIONS);

  const stageRows = [];
  for (let s = 0; s < TOTAL_STAGES; s++) {
    const start = s * STAGE_SIZE;
    const stageScore = scoreForRange(start, start + STAGE_SIZE);
    stageRows.push(`
      <div class="stage-row">
        <span>Stage ${s + 1}</span>
        <span>${stageScore} / ${STAGE_SIZE}</span>
      </div>
    `);
  }

  app.innerHTML = `
    <div class="layout">
      ${renderSidebar()}
      <div class="main-panel">
        ${renderHeader("Quiz complete")}
        ${renderStageBar()}
        <div class="quiz-card">
          <h2>Final Score: ${score} / ${TOTAL_QUESTIONS}</h2>
          <div class="stage-breakdown">
            ${stageRows.join("")}
          </div>
          <button id="restart-btn" class="next-btn">Take Quiz Again</button>
        </div>
      </div>
    </div>
  `;

  attachHeaderEvents();
  attachSidebarEvents();

  document.getElementById("restart-btn").addEventListener("click", resetProgress);
}

const savedLevelId = localStorage.getItem(SELECTED_LEVEL_KEY);
if (savedLevelId && getLevel(savedLevelId)) {
  selectLevel(savedLevelId);
} else {
  renderLevelPicker();
}
