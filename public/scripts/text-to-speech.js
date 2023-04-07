export function speakOutLoud(text) {
  text = text.replace(/(?<=world war )i(?!i)/i, "one");
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    window.speechSynthesis.speak(msg);
  } else {
    console.warn("Browser doesn't support text to speech");
  }
}
