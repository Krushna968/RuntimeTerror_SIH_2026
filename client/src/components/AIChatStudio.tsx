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
  Fish,
  ShieldCheck,
  Compass
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

  const hasMessages = messages.length > 0;

  return (
    <div className="relative min-h-screen w-full bg-[#fbf9f5] text-zinc-900 flex flex-col font-['Outfit',sans-serif] overflow-hidden selection:bg-blue-200 selection:text-blue-950">
      {/* 1. Lovable-Style Massive Soft Blue Radial Aura in Center */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] sm:w-[1050px] h-[650px] sm:h-[800px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.45) 0%, rgba(96, 165, 250, 0.3) 35%, rgba(191, 219, 254, 0.15) 55%, transparent 75%)',
          filter: 'blur(90px)'
        }}
      />

      {/* STATE 1: Lovable-Style Clean Landing Page */}
      {!hasMessages && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-3xl w-full mx-auto px-6 my-auto pt-24 pb-16">
          {/* Main Display Headline ("Secure by design" -> "Reasoning by design") */}
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl sm:text-7xl md:text-8xl font-black text-zinc-950 tracking-tight leading-[1.05] mb-6 select-none"
          >
            Reasoning by design
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-zinc-600 text-base sm:text-lg md:text-xl max-w-2xl font-normal leading-relaxed mb-10 text-center"
          >
            Choose where your vessel sails, discover high-yield fishing zones, verify 0–100 sea safety clearance, and maintain strict international maritime border compliance.
          </motion.p>

          {/* Search Input Capsule */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-2xl mb-8"
          >
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative flex items-center bg-white/95 border border-zinc-200/80 hover:border-zinc-300 focus-within:border-blue-500 rounded-full px-5 py-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] transition-all"
            >
              {/* Plus icon on left */}
              <button 
                type="button"
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 transition-colors mr-2 cursor-pointer"
                title="New Query"
              >
                <Plus className="w-5 h-5" />
              </button>

              {/* Main Input Field */}
              <input
                ref={inputRef}
                type="text"
                autoFocus
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask ORCA anything..."
                className="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none font-normal"
                disabled={isLoading}
              />

              {/* Microphone Trigger */}
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
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Send Arrow Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="w-9 h-9 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-md"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </motion.div>

          {/* Lovable-Style Pill Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center space-x-3"
          >
            <button
              onClick={() => handleSend("Where is the nearest Potential Fishing Zone for Tuna from Kochi today?")}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-800 shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-1.5"
            >
              <Fish className="w-3.5 h-3.5" />
              <span>Tuna PFZ Kochi</span>
            </button>

            <button
              onClick={() => handleSend("Is it safe to venture into the sea tomorrow morning?")}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-zinc-800 bg-white/90 hover:bg-white border border-zinc-200 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center space-x-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Sea Safety Clearance</span>
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
                    <div className="max-w-[85%] sm:max-w-[75%] px-5 py-3 rounded-3xl bg-zinc-950 text-white font-medium text-sm shadow-md">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="w-full bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-zinc-200/80 shadow-sm space-y-3">
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
              className="relative flex items-center bg-white/95 border border-zinc-200 rounded-full px-5 py-3 shadow-xl focus-within:border-blue-500 transition-all"
            >
              <button 
                type="button"
                onClick={() => setMessages([])}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 transition-colors mr-2 cursor-pointer"
                title="New Chat"
              >
                <Plus className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask ORCA anything..."
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
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="w-9 h-9 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-md"
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
