// A short, synthesized "wrong answer" buzz — two quick descending square-wave tones. No
// audio asset needed (keeps the PWA fully offline-capable and the bundle small), matching
// how celebrate.js does its confetti with pure JS/CSS instead of a media file.
export function playErrorSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    gain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(160, now + 0.15);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.32);
    osc.onended = () => ctx.close();
  } catch {
    // best effort — a blocked/missing AudioContext just means no error sound, not a crash
  }
}
