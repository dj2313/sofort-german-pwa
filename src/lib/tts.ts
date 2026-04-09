export class TTSService {
  static speak(text: string, rate: number = 1.0) {
    if (typeof window === 'undefined') return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = rate;

    // Try to find a high-quality German voice
    const voices = window.speechSynthesis.getVoices();
    // Prioritize "Google" or "Natural" or specific known good voices
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('de') && 
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Stefan'))
    ) || voices.find(v => v.lang.startsWith('de'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  static stop() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
  }
}
