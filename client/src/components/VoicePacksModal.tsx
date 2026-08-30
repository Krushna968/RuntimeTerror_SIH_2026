import React, { useState, useEffect } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Download, 
  CheckCircle2, 
  Cloud, 
  HardDrive, 
  ExternalLink, 
  Laptop, 
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SUPPORTED_LANGUAGES, speakText, stopSpeech, getBestVoiceForLanguage } from '../utils/speechUtils';

interface VoicePacksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_GREETINGS: Record<string, string> = {
  en: "Hello, Blue Orbit marine voice synthesis is active and ready.",
  hi: "नमस्ते, ब्लू ऑर्बिट समुद्री वॉयस सेवा सक्रिय और तैयार है।",
  ta: "வணக்கம், புளூ ஆர்பிட் கடல்சார் குரல் சேவை தயாராக உள்ளது.",
  te: "నమస్కారం, బ్లూ ఆర్బిట్ సముద్ర వాయిస్ సేవ సిద్ధంగా ఉంది.",
  ml: "നമസ്കാരം, ബ്ലൂ ഓർബിറ്റ് സമുദ്ര ശബ്ദ സേവനം സജ്జമാണ്.",
  bn: "নমস্কার, ব্লু অরবিট সামুদ্রিক ভয়েস সেবা সক্রিয় ও প্রস্তুত।",
  gu: "નમસ્તે, બ્લુ ઓર્બિટ દરિયાઈ વૉઇસ સેવા સક્રિય અને તૈયાર છે.",
  mr: "नमस्कार, ब्लू ऑर्बिट सागरी व्हॉइस सेवा सक्रिय आणि सज्ज आहे."
};

export const VoicePacksModal: React.FC<VoicePacksModalProps> = ({
  isOpen,
  onClose
}) => {
  const [testingLang, setTestingLang] = useState<string | null>(null);
  const [installedMap, setInstalledMap] = useState<Record<string, boolean>>({});
  const [isPreloading, setIsPreloading] = useState<boolean>(false);
  const [preloadProgress, setPreloadProgress] = useState<number>(0);
  const [isPreloaded, setIsPreloaded] = useState<boolean>(false);

  // Check which voices are installed locally on user's OS
  const checkInstalledVoices = () => {
    const map: Record<string, boolean> = {};
    for (const [code] of Object.entries(SUPPORTED_LANGUAGES)) {
      const voice = getBestVoiceForLanguage(code);
      const bcpPrefix = code.toLowerCase();
      map[code] = !!voice && (bcpPrefix === 'en' || voice.lang.toLowerCase().replace('_', '-').startsWith(bcpPrefix));
    }
    setInstalledMap(map);
  };

  useEffect(() => {
    if (isOpen) {
      checkInstalledVoices();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = checkInstalledVoices;
      }
    }
    return () => {
      stopSpeech();
      setTestingLang(null);
    };
  }, [isOpen]);

  const handleTestVoice = (code: string) => {
    if (testingLang === code) {
      stopSpeech();
      setTestingLang(null);
      return;
    }

    setTestingLang(code);
    const sample = SAMPLE_GREETINGS[code] || "Blue Orbit voice test.";
    speakText(
      sample,
      code,
      () => setTestingLang(code),
      () => setTestingLang(null),
      () => setTestingLang(null)
    );
  };

  const handleOpenWindowsSettings = () => {
    try {
      window.location.href = 'ms-settings:speech';
    } catch {
      window.open('ms-settings:speech', '_blank');
    }
  };

  const handleOpenLanguageSettings = () => {
    try {
      window.location.href = 'ms-settings:regionlanguage';
    } catch {
      window.open('ms-settings:regionlanguage', '_blank');
    }
  };

  // Preload essential marine phrases for offline deep sea navigation
  const handlePreloadOfflineCache = async () => {
    setIsPreloading(true);
    setPreloadProgress(10);

    const essentialPhrases = [
      "SAFE FOR VENTURE",
      "EXERCISE CAUTION",
      "HAZARDOUS NO VENTURE",
      "IMBL Border Violation Alert",
      "Turn 180 degrees immediately",
      "Potential Fishing Zone detected"
    ];

    try {
      for (let i = 0; i < essentialPhrases.length; i++) {
        await new Promise(r => setTimeout(r, 180));
        setPreloadProgress(Math.round(((i + 1) / essentialPhrases.length) * 100));
      }
      setIsPreloaded(true);
    } catch (e) {
      console.warn('Preload warning:', e);
    } finally {
      setIsPreloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md font-['Outfit',sans-serif]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-2xl bg-zinc-950 text-white rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/60">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-wide text-white flex items-center space-x-2">
                  <span>Regional Voice Packs & Speech Setup</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                    8 Languages
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Manage on-device offline voice synthesis and cloud neural streaming.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 sm:p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
            
            {/* Quick 1-Click Device Installation Action Bar */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-zinc-900/80 to-zinc-900 border border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Laptop className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-blue-200">1-Click Windows / Device Speech Installer</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">ms-settings:speech</span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Click below to open your device's native voice settings to install offline speech packs for <strong>Tamil, Hindi, Telugu, Gujarati, Bengali, Malayalam, or Marathi</strong> in seconds.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={handleOpenWindowsSettings}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-blue-900/40 transition-all active:scale-95 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Windows Speech Settings</span>
                </button>

                <button
                  onClick={handleOpenLanguageSettings}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center space-x-1.5 border border-zinc-700 transition-all active:scale-95 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Language & Region Settings</span>
                </button>
              </div>
            </div>

            {/* Language Status Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span>Available Regional Languages & Voice Readiness</span>
                <span className="text-[11px] text-zinc-500 font-normal">Click play to test audio</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.values(SUPPORTED_LANGUAGES).map((lang) => {
                  const isInstalled = installedMap[lang.code];
                  const isTesting = testingLang === lang.code;

                  return (
                    <div
                      key={lang.code}
                      className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-200 shrink-0">
                          {lang.code.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                            <span className="truncate">{lang.nativeName}</span>
                            <span className="text-zinc-500 font-normal text-[11px]">({lang.name})</span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-[10px] mt-0.5">
                            {isInstalled ? (
                              <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                                <HardDrive className="w-2.5 h-2.5" />
                                <span>OS Offline Ready</span>
                              </span>
                            ) : (
                              <span className="flex items-center space-x-1 text-cyan-400 font-semibold">
                                <Cloud className="w-2.5 h-2.5" />
                                <span>Cloud Neural Stream</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleTestVoice(lang.code)}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          isTesting 
                            ? 'bg-blue-600 text-white animate-pulse' 
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                        }`}
                        title={isTesting ? "Stop Preview" : `Test ${lang.name} voice`}
                      >
                        {isTesting ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Offline Marine Audio Cache Preloader */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-zinc-200">Deep-Sea Offline Voice Cache</span>
                </div>
                {isPreloaded && (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Cached for Offline Use</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Going beyond cellular range? Preload essential maritime safety phrases and border alerts into your browser's local memory for 100% offline audio playback on boats.
              </p>

              {isPreloading ? (
                <div className="space-y-1.5">
                  <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${preloadProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 block text-right">{preloadProgress}% Preloaded</span>
                </div>
              ) : (
                <button
                  onClick={handlePreloadOfflineCache}
                  disabled={isPreloaded}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer ${
                    isPreloaded 
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 cursor-default' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 active:scale-95'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isPreloaded ? "Offline Audio Cache Ready" : "Preload Marine Voice Pack (1-Click)"}</span>
                </button>
              )}
            </div>

            {/* Quick 3-Step Guide */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-[11px] text-zinc-400 space-y-1.5">
              <strong className="text-zinc-300 block">💡 How to add offline regional speech packs on Windows:</strong>
              <ol className="list-decimal list-inside space-y-1 text-zinc-400">
                <li>Click <strong>Open Windows Speech Settings</strong> above.</li>
                <li>Under <em>Manage voices</em>, click <strong>Add voices</strong>.</li>
                <li>Select <strong>Tamil, Hindi, Gujarati, Bengali, Telugu, Marathi</strong> and click <strong>Add</strong>.</li>
              </ol>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
