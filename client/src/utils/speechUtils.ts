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
    speechAliases: ['en-IN', 'en_IN', 'en-GB', 'en-US', 'en', 'english', 'rishi', 'heera', 'neerja']
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    bcp47: 'hi-IN',
    speechAliases: ['hi-IN', 'hi_IN', 'hi', 'hindi', 'हिन्दी', 'madhur', 'swara', 'kalpana', 'hemant']
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    bcp47: 'ta-IN',
    speechAliases: ['ta-IN', 'ta_IN', 'ta-LK', 'ta', 'tamil', 'தமிழ்', 'valluvar', 'iniya']
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    bcp47: 'te-IN',
    speechAliases: ['te-IN', 'te_IN', 'te', 'telugu', 'తెలుగు', 'mohan', 'shruti', 'chitra']
  },
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    bcp47: 'ml-IN',
    speechAliases: ['ml-IN', 'ml_IN', 'ml', 'malayalam', 'മലയാളം', 'midhun', 'sobhana']
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    bcp47: 'bn-IN',
    speechAliases: ['bn-IN', 'bn_IN', 'bn-BD', 'bn', 'bengali', 'bangla', 'বাংলা', 'bashkar', 'tanishaa']
  },
  gu: {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    bcp47: 'gu-IN',
    speechAliases: ['gu-IN', 'gu_IN', 'gu', 'gujarati', 'ગુજરાતી', 'dhwani', 'niranjan']
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    bcp47: 'mr-IN',
    speechAliases: ['mr-IN', 'mr_IN', 'mr', 'marathi', 'मराठी', 'aarohi', 'manohar']
  }
};

// Global active utterance reference to prevent garbage collection mid-speech in Chromium
let activeUtterance: SpeechSynthesisUtterance | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

// Preload voices immediately on load
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

/**
 * Resolves BCP-47 tag from language code
 */
export function getBcp47LangTag(langCode?: string): string {
  if (!langCode) return 'en-IN';
  const cleanCode = langCode.toLowerCase().trim();
  if (SUPPORTED_LANGUAGES[cleanCode]) {
    return SUPPORTED_LANGUAGES[cleanCode].bcp47;
  }
  for (const lang of Object.values(SUPPORTED_LANGUAGES)) {
    if (
      cleanCode === lang.code || 
      cleanCode === lang.bcp47.toLowerCase() ||
      lang.speechAliases.some(alias => cleanCode === alias.toLowerCase() || cleanCode.includes(alias.toLowerCase()))
    ) {
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
    // Remove common symbol abbreviations
    .replace(/\bkts\b/gi, 'knots')
    .replace(/\bnm\b/gi, 'nautical miles')
    // Remove emojis (preserve vernacular unicode characters like Gujarati, Bengali, Telugu, Hindi, Tamil, etc.)
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    // Clean multiple whitespace / newlines
    .replace(/\n+/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Finds the best matching system voice installed on the user's OS/Browser.
 * IMPORTANT: If no native regional voice is found for an Indian regional language (e.g. Gujarati, Bengali),
 * this returns `null` so the browser's TTS engine falls back to its online cloud synthesizer for `utterance.lang`
 * rather than forcefully playing vernacular text through an English voice!
 */
export function getBestVoiceForLanguage(langCode: string): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices().length > 0 
    ? window.speechSynthesis.getVoices() 
    : cachedVoices;

  if (!voices || voices.length === 0) return null;

  const bcp47 = getBcp47LangTag(langCode).toLowerCase();
  const prefix = bcp47.split('-')[0];
  const langKey = langCode.toLowerCase().trim();
  const langInfo = SUPPORTED_LANGUAGES[langKey] || Object.values(SUPPORTED_LANGUAGES).find(l => l.bcp47.toLowerCase() === bcp47);

  // 1. Direct match on BCP-47 (e.g. "gu-in", "bn-in", "ta-in", "te-in", "hi-in", "ml-in", "mr-in")
  let match = voices.find(v => v.lang.toLowerCase().replace('_', '-') === bcp47);
  if (match) return match;

  // 2. Exact language prefix match (e.g. "gu", "bn", "ta", "te", "hi", "ml", "mr")
  match = voices.find(v => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    return vLang.startsWith(`${prefix}-`) || vLang === prefix;
  });
  if (match) return match;

  // 3. Name alias match (e.g. "Google ગુજરાતી", "Google বাংলা", "Microsoft Mohan - Telugu (India)", "Lekha", "Shruti", etc.)
  if (langInfo) {
    for (const alias of langInfo.speechAliases) {
      match = voices.find(v => 
        v.name.toLowerCase().includes(alias.toLowerCase()) || 
        v.lang.toLowerCase().includes(alias.toLowerCase())
      );
      if (match) return match;
    }
  }

  // 4. For English only, match Indian English or default voice
  if (prefix === 'en') {
    match = voices.find(v => v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('en_in'));
    return match || voices[0] || null;
  }

  // For regional languages without a local offline voice pack, return null to let browser use online cloud TTS for `utterance.lang`
  return null;
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

  activeUtterance = utterance;

  if (onStart) utterance.onstart = onStart;
  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };
  utterance.onerror = (e) => {
    console.warn('[SpeechSynthesis Error]', e);
    activeUtterance = null;
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
    activeUtterance = null;
  }
}
