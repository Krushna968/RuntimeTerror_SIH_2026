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

// Active audio elements and speech synthesis trackers
let activeUtterance: SpeechSynthesisUtterance | null = null;
let activeAudio: HTMLAudioElement | null = null;
let audioQueue: string[] = [];
let isAudioPlaying = false;
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
    // Remove emojis (preserve vernacular unicode characters like Tamil, Telugu, Hindi, Gujarati, Bengali, etc.)
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    // Clean multiple whitespace / newlines
    .replace(/\n+/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Finds the best matching system voice installed on the user's OS/Browser.
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

  // 1. Direct match on BCP-47 (e.g. "ta-in", "hi-in", "te-in", "ml-in", "bn-in", "gu-in", "mr-in")
  let match = voices.find(v => v.lang.toLowerCase().replace('_', '-') === bcp47);
  if (match) return match;

  // 2. Exact language prefix match (e.g. "ta", "hi", "te", "ml", "bn", "gu", "mr")
  match = voices.find(v => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    return vLang.startsWith(`${prefix}-`) || vLang === prefix;
  });
  if (match) return match;

  // 3. Name alias match (e.g. "Google தமிழ்", "Microsoft Mohan - Telugu", "Google हिन्दी")
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

  return null;
}

/**
 * Splits long text into natural sentence chunks for smooth streaming audio
 */
function splitIntoAudioChunks(text: string, maxChunkLen: number = 180): string[] {
  const sentences = text.split(/([।!?.]+|\n+)/).filter(Boolean);
  const chunks: string[] = [];
  let current = '';

  for (let i = 0; i < sentences.length; i++) {
    const part = sentences[i].trim();
    if (!part) continue;
    if ((current + ' ' + part).length <= maxChunkLen) {
      current = current ? `${current} ${part}` : part;
    } else {
      if (current) chunks.push(current);
      if (part.length > maxChunkLen) {
        // Break long clause by commas or spaces
        const words = part.split(/\s+/);
        let sub = '';
        for (const w of words) {
          if ((sub + ' ' + w).length <= maxChunkLen) {
            sub = sub ? `${sub} ${w}` : w;
          } else {
            if (sub) chunks.push(sub);
            sub = w;
          }
        }
        if (sub) current = sub;
      } else {
        current = part;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.length > 0 ? chunks : [text];
}

/**
 * Plays queued audio chunks sequentially
 */
function playNextAudioChunk(
  langPrefix: string,
  onEnd?: () => void,
  onError?: (e: any) => void
) {
  if (audioQueue.length === 0) {
    isAudioPlaying = false;
    activeAudio = null;
    if (onEnd) onEnd();
    return;
  }

  const chunk = audioQueue.shift()!;
  const encoded = encodeURIComponent(chunk);
  const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langPrefix}&client=tw-ob&q=${encoded}`;

  const audio = new Audio(audioUrl);
  activeAudio = audio;
  isAudioPlaying = true;

  audio.onended = () => {
    playNextAudioChunk(langPrefix, onEnd, onError);
  };

  audio.onerror = (err) => {
    console.warn('[Audio chunk error, proceeding to next]', err);
    playNextAudioChunk(langPrefix, onEnd, onError);
  };

  audio.play().catch((err) => {
    console.warn('[Audio play interrupted]', err);
    isAudioPlaying = false;
    activeAudio = null;
    if (onEnd) onEnd();
  });
}

/**
 * Speaks text in the specified language.
 * Uses local SpeechSynthesis if a native regional voice is present;
 * otherwise automatically streams high-fidelity native vernacular audio.
 */
export function speakText(
  text: string,
  langCode: string = 'en',
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (e: any) => void
): SpeechSynthesisUtterance | HTMLAudioElement | null {
  stopSpeech();
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) {
    if (onEnd) onEnd();
    return null;
  }

  const bcp47 = getBcp47LangTag(langCode).toLowerCase();
  const prefix = bcp47.split('-')[0];
  const bestVoice = getBestVoiceForLanguage(langCode);

  // 1. If English OR if a genuine native voice matching the language prefix is installed in OS
  if (bestVoice && (prefix === 'en' || bestVoice.lang.toLowerCase().replace('_', '-').startsWith(prefix))) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = bcp47;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.voice = bestVoice;
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
  }

  // 2. High-Fidelity Vernacular Streaming for Indian Languages without an OS voice pack
  try {
    const chunks = splitIntoAudioChunks(cleaned, 180);
    audioQueue = [...chunks];

    if (onStart) onStart();
    playNextAudioChunk(prefix, onEnd, onError);
    return activeAudio;
  } catch (err) {
    console.warn('[TTS Streaming Init Error]', err);
    if (onError) onError(err);
    if (onEnd) onEnd();
    return null;
  }
}

/**
 * Stops any active speech synthesis or streaming audio
 */
export function stopSpeech() {
  audioQueue = [];
  isAudioPlaying = false;
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

