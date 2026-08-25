import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Plus, 
  Copy, 
  Check, 
  ArrowUp,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatResponsePayload } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'orca';
  text: string;
  timestamp: string;
  data?: ChatResponsePayload;
}

interface AIChatStudioProps {
  onSendMessage: (query: string, langOverride?: string) => Promise<void>;
  isLoading: boolean;
  latestResponse: ChatResponsePayload | null;
  currentLang: string;
  setCurrentLang: (lang: string) => void;
}

export const AIChatStudio: React.FC<AIChatStudioProps> = ({
  onSendMessage,
  isLoading,
  latestResponse,
  currentLang,
  setCurrentLang
}) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isChatActive, setIsChatActive] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync latestResponse into messages list ONLY if there is an ongoing conversation
  useEffect(() => {
    if (latestResponse && messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last && last.sender === 'user' && last.text === latestResponse.query) {
        const newMsgId = `msg-${Date.now()}`;
        setMessages(prev => [
          ...prev,
          {
            id: newMsgId,
            sender: 'orca',
            text: latestResponse.response.markdown,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            data: latestResponse
          }
        ]);
      }
    }
  }, [latestResponse]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    setIsChatActive(true);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    await onSendMessage(textToSend);
  };

  // Speech to Text (STT)
  const handleToggleMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please type your query.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = currentLang === 'hi' ? 'hi-IN' : (currentLang === 'ta' ? 'ta-IN' : 'en-IN');

    if (!isListening) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  // Text to Speech (TTS)
  const handleSpeak = (msgId: string, text: string, voiceCode: string = 'en-IN') => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceCode;
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const hasMessages = messages.length > 0 || isChatActive;

  return (
    <div className="relative min-h-screen w-full bg-[#fcfbf8] text-[#111113] flex flex-col font-['Outfit',sans-serif] overflow-hidden selection:bg-blue-100 selection:text-blue-950">
      
      {/* EXACT 1:1 LOVABLE VIBRANT BLUE ANNULAR HALO */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
        <div 
          className="w-[880px] sm:w-[1020px] h-[640px] sm:h-[720px] rounded-[100%]"
          style={{
            background: 'radial-gradient(ellipse 55% 48% at 50% 50%, rgba(252, 251, 248, 0) 0%, rgba(252, 251, 248, 0) 26%, rgba(96, 165, 250, 0.85) 54%, rgba(37, 99, 235, 0.95) 68%, rgba(96, 165, 250, 0.7) 78%, rgba(252, 251, 248, 0) 95%)',
            filter: 'blur(45px)',
          }}
        />
      </div>

      {/* STATE 1: EXACT 1:1 LOVABLE HERO (PIXEL-PERFECT CLONE WITH RELEVANT TEXT) */}
      {!hasMessages && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-4xl w-full mx-auto px-6 my-auto pt-20 pb-16">
          
          {/* Main Headline: Single Line Bold */}
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl sm:text-7xl md:text-8xl font-black text-[#111113] tracking-[-0.04em] leading-tight select-none whitespace-nowrap mb-6"
          >
            Reasoning by design
          </motion.h1>

          {/* 2-Line Subtitle Description */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[#52525b] text-base sm:text-[17px] max-w-[640px] font-normal leading-[1.6] mb-8 text-center"
          >
            Reason over ISRO satellite oceanography, verify 0–100 ocean safety clearance,<br className="hidden sm:inline" />
            discover high-yield fishing zones, and maintain strict maritime border compliance.
          </motion.p>

          {/* Action Buttons (Exact Lovable Geometry: rounded-lg) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <button
              onClick={() => handleSend("Where is the nearest Potential Fishing Zone for Tuna from Kochi today?")}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#111113] hover:bg-zinc-800 shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              Tuna PFZ Advisory
            </button>

            <button
              onClick={() => handleSend("Is it safe to venture into the sea tomorrow morning?")}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#18181b] bg-white hover:bg-zinc-50 border border-[#e4e4e7] shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              Sea Safety Clearance
            </button>
          </motion.div>
        </div>
      )}

      {/* STATE 2: Active Chat Conversation Stream */}
      {hasMessages && (
        <div className="relative z-10 flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 pt-24 pb-28">
          <div className="space-y-6">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
                >
                  {msg.sender === 'user' ? (
                    <div className="max-w-[85%] sm:max-w-[75%] px-5 py-3 rounded-2xl bg-[#111113] text-white font-medium text-sm shadow-sm">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="w-full bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-[#e4e4e7] shadow-sm space-y-3">
                      <div className="flex items-center space-x-2 text-xs font-bold text-blue-600">
                        <Sparkles className="w-4 h-4" />
                        <span>ORCA AI Advisory</span>
                      </div>

                      <div className="text-sm leading-relaxed text-zinc-800 whitespace-pre-line font-normal">
                        {msg.text}
                      </div>

                      {/* Tool actions: Audio speaker + Copy */}
                      <div className="flex items-center space-x-2 pt-2 border-t border-zinc-100">
                        {msg.data && (
                          <button
                            onClick={() => handleSpeak(msg.id, msg.data!.response.tts_speech_text, msg.data!.language.voice_code)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              speakingId === msg.id 
                                ? 'text-blue-600 animate-pulse' 
                                : 'text-zinc-400 hover:text-zinc-700'
                            }`}
                            title="Read aloud"
                          >
                            {speakingId === msg.id ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                        )}
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <div className="flex items-center space-x-2.5 text-zinc-500 text-xs font-medium pl-2 pt-3 animate-pulse">
                <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                <span>Thinking...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Docked Bottom Search Box when in Conversation */}
          <div className="fixed bottom-6 left-0 right-0 z-40 max-w-2xl w-full mx-auto px-4">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative flex items-center bg-white border border-[#e4e4e7] rounded-full px-5 py-3 shadow-xl focus-within:border-blue-500 transition-all"
            >
              <button 
                type="button"
                onClick={() => { setMessages([]); setIsChatActive(false); }}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 transition-colors mr-2 cursor-pointer"
                title="Reset to Landing"
              >
                <Plus className="w-4 h-4" />
              </button>

              <input
                type="text"
                autoFocus
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask ORCA AI anything..."
                className="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none font-normal"
                disabled={isLoading}
              />

              <button
                type="button"
                onClick={handleToggleMic}
                className={`p-2 rounded-full transition-all mr-1 cursor-pointer ${
                  isListening 
                    ? 'bg-red-600 text-white animate-ping' 
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
                title="Speak query"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="w-8 h-8 rounded-full bg-[#111113] hover:bg-zinc-800 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-sm"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
