/**
 * Multilingual Speech Synthesis (TTS) & Speech Recognition (STT) Engine
 * Provides complete BCP-47 voice tag resolution, text sanitization,
 * and system voice matching for all 8 supported Indian regional languages.
 */

export interface SupportedLanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  bcp47: string;
  speechAliases: string[];
}

export const SUPPORTED_LANGUAGES: Record<string, SupportedLanguageInfo> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    bcp47: 'en-IN',
    speechAliases: ['en-IN', 'en-GB', 'en-US', 'en']
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    bcp47: 'hi-IN',
    speechAliases: ['hi-IN', 'hi_IN', 'hi', 'hindi']
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    bcp47: 'ta-IN',
    speechAliases: ['ta-IN', 'ta_IN', 'ta-LK', 'ta', 'tamil']
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    bcp47: 'te-IN',
    speechAliases: ['te-IN', 'te_IN', 'te', 'telugu']
  },
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    bcp47: 'ml-IN',
    speechAliases: ['ml-IN', 'ml_IN', 'ml', 'malayalam']
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    bcp47: 'bn-IN',
    speechAliases: ['bn-IN', 'bn_IN', 'bn-BD', 'bn', 'bengali', 'bangla']
  },
  gu: {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    bcp47: 'gu-IN',
    speechAliases: ['gu-IN', 'gu_IN', 'gu', 'gujarati']
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    bcp47: 'mr-IN',
    speechAliases: ['mr-IN', 'mr_IN', 'mr', 'marathi']
  }
};

/**
 * Resolves BCP-47 tag from language code
 */
export function getBcp47LangTag(langCode?: string): string {
  if (!langCode) return 'en-IN';
  const cleanCode = langCode.toLowerCase().trim();
  if (SUPPORTED_LANGUAGES[cleanCode]) {
    return SUPPORTED_LANGUAGES[cleanCode].bcp47;
  }
  // Check if it's already a BCP-47 tag (e.g. te-IN)
  for (const lang of Object.values(SUPPORTED_LANGUAGES)) {
    if (lang.speechAliases.some(alias => cleanCode.includes(alias.toLowerCase()))) {
      return lang.bcp47;
    }
  }
  return 'en-IN';
}

/**
 * Strips markdown symbols, asterisks, headers, emojis, and code formatting
 * so the TTS engine speaks clean, natural vernacular sentences.
 */
export function cleanTextForSpeech(rawText: string): string {
  if (!rawText) return '';
  return rawText
    // Remove markdown headers and bullets
    .replace(/^#+\s+/gm, '')
    .replace(/^\s*[-*•]\s+/gm, '')
    // Remove bold/italics markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove inline code and code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove emojis (preserve vernacular unicode characters like Telugu/Hindi/Tamil)
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    // Clean multiple whitespace / newlines
    .replace(/\n+/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Finds the best matching system voice installed on the user's OS/Browser
 */
export function getBestVoiceForLanguage(langCode: string): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const bcp47 = getBcp47LangTag(langCode).toLowerCase();
  const langKey = langCode.toLowerCase().trim();
  const langInfo = SUPPORTED_LANGUAGES[langKey];

  // 1. Direct match on BCP-47
  let match = voices.find(v => v.lang.toLowerCase().replace('_', '-') === bcp47);
  if (match) return match;

  // 2. Prefix match (e.g. te, hi, ta, ml)
  const prefix = bcp47.split('-')[0];
  match = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(prefix));
  if (match) return match;

  // 3. Name alias match (e.g. "Google हिन्दी", "Microsoft Mohan - Telugu (India)")
  if (langInfo) {
    for (const alias of langInfo.speechAliases) {
      match = voices.find(v => 
        v.name.toLowerCase().includes(alias.toLowerCase()) || 
        v.lang.toLowerCase().includes(alias.toLowerCase())
      );
      if (match) return match;
    }
  }

  // 4. Fallback to any Indian English or default voice
  match = voices.find(v => v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('en_in'));
  return match || voices[0] || null;
}

/**
 * Speaks text in the specified language with automatic voice assignment
 */
export function speakText(
  text: string,
  langCode: string = 'en',
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (e: any) => void
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  window.speechSynthesis.cancel();
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) {
    if (onEnd) onEnd();
    return null;
  }

  const utterance = new SpeechSynthesisUtterance(cleaned);
  const bcp47Tag = getBcp47LangTag(langCode);
  utterance.lang = bcp47Tag;
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  const bestVoice = getBestVoiceForLanguage(langCode);
  if (bestVoice) {
    utterance.voice = bestVoice;
  }

  if (onStart) utterance.onstart = onStart;
  utterance.onend = () => {
    if (onEnd) onEnd();
  };
  utterance.onerror = (e) => {
    console.warn('[SpeechSynthesis Error]', e);
    if (onError) onError(e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Stops any active speech synthesis
 */
export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
