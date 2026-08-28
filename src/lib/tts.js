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
