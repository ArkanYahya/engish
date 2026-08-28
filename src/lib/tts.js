// Mobile browsers (especially iOS Safari, and some Android WebViews when the app is
// installed to the home screen) have several well-documented quirks that don't show up on
// desktop: the very first speak() call per page load can be silently dropped unless the
// engine was already "warmed" by an earlier call inside a real user gesture; the engine can
// get stuck "paused" after the screen locks or the tab loses focus, silently queuing
// utterances that never play; and getVoices() can return empty until the async
// `voiceschanged` event fires, which some engines treat as "nothing to speak with."

let primed = false;

function primeSpeechSynthesis() {
  if (primed || !("speechSynthesis" in window)) return;
  primed = true;
  try {
    const warmup = new SpeechSynthesisUtterance(" ");
    warmup.volume = 0;
    window.speechSynthesis.speak(warmup);
  } catch {
    // best-effort only — a failed warm-up just means the real speak() call below has to
    // carry the same risk it always did, not a new failure mode.
  }
}

// Prime on the very first touch/click anywhere in the app — pointerdown fires before
// click, so priming happens as early as possible within that same first gesture.
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.addEventListener("pointerdown", primeSpeechSynthesis, { once: true, passive: true });
}

function speakableText(text) {
  return text.replace(/_+/g, "blank");
}

function speakNow(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(speakableText(text));
  utterance.lang = "en-US";
  synth.speak(utterance);
}

// Diagnostic only — reachable from Settings ("Test Speaker") when debugging a device where
// speech is silent. Runs an actual speak() attempt and reports exactly what happened
// (whether the browser exposes the API at all, how many voices it sees, whether the engine
// ever fired onstart/onerror, and what error code if any) as one readable block of text, so
// a report can come back from a phone with no dev tools attached at all.
export function diagnoseSpeech() {
  return new Promise((resolve) => {
    const lines = [];
    lines.push(`userAgent: ${navigator.userAgent}`);
    lines.push(`standalone display: ${window.matchMedia("(display-mode: standalone)").matches}`);
    lines.push(`"speechSynthesis" in window: ${"speechSynthesis" in window}`);

    if (!("speechSynthesis" in window)) {
      lines.push("--> Speech Synthesis API isn't exposed at all in this browser.");
      resolve(lines.join("\n"));
      return;
    }

    const synth = window.speechSynthesis;
    lines.push(`initial voices.length: ${synth.getVoices().length}`);
    lines.push(`synth.speaking/pending/paused before: ${synth.speaking}/${synth.pending}/${synth.paused}`);
    if ("userActivation" in navigator) {
      lines.push(`navigator.userActivation.isActive: ${navigator.userActivation.isActive}`);
    }

    const finish = (outcome) => {
      lines.push(`voices.length at finish: ${synth.getVoices().length}`);
      lines.push(`synth.speaking/pending/paused after: ${synth.speaking}/${synth.pending}/${synth.paused}`);
      lines.push(`OUTCOME: ${outcome}`);
      resolve(lines.join("\n"));
    };

    let settled = false;
    const settle = (outcome) => {
      if (settled) return;
      settled = true;
      finish(outcome);
    };

    try {
      const utterance = new SpeechSynthesisUtterance("Testing one two three.");
      utterance.lang = "en-US";
      utterance.onstart = () => settle("onstart fired — engine attempted playback. If you didn't hear anything, check device volume/mute/silent-switch and that a TTS voice is installed.");
      utterance.onerror = (e) => settle(`onerror fired — error code: "${e.error}"`);
      utterance.onend = () => settle("onend fired with no onstart/onerror first (unusual) — treated as silently completed.");
      synth.speak(utterance);
      lines.push("speak() called without throwing.");
      setTimeout(() => settle("TIMEOUT after 4s — neither onstart nor onerror ever fired. The engine silently swallowed the utterance."), 4000);
    } catch (err) {
      settle(`speak() THREW SYNCHRONOUSLY — ${err.name}: ${err.message}`);
    }
  });
}

export function speak(text) {
  if (!("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;

  // A stuck-paused engine (common on iOS after the screen locks) silently queues new
  // utterances without ever playing them.
  if (synth.paused) synth.resume();
  if (synth.speaking) synth.cancel();

  // If voices haven't loaded yet, some mobile engines refuse to speak at all rather than
  // falling back to a default. Wait for them once, but don't block indefinitely — speak
  // anyway after a short timeout so a browser that never fires the event isn't stuck mute.
  if (synth.getVoices().length === 0) {
    let spoken = false;
    const trySpeak = () => {
      if (spoken) return;
      spoken = true;
      speakNow(text);
    };
    synth.addEventListener("voiceschanged", trySpeak, { once: true });
    setTimeout(trySpeak, 250);
    return;
  }

  speakNow(text);
}
