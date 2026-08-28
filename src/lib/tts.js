function speakableText(text) {
  return text.replace(/_+/g, "blank");
}

export function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(speakableText(text));
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
}
