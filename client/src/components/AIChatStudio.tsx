import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Plus, 
  ChevronDown, 
  Copy, 
  Check, 
  ArrowUp
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

  // Sync latestResponse into messages list
  useEffect(() => {
    if (latestResponse) {
      const newMsgId = `msg-${Date.now()}`;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.sender === 'user' && last.text === latestResponse.query) {
          return [
            ...prev.slice(0, -1),
            last,
            {
              id: newMsgId,
              sender: 'orca',
              text: latestResponse.response.markdown,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              data: latestResponse
            }
          ];
        } else if (prev.length === 0) {
          return [
            {
              id: `user-${Date.now()}`,
              sender: 'user',
              text: latestResponse.query,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
            {
              id: newMsgId,
              sender: 'orca',
              text: latestResponse.response.markdown,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              data: latestResponse
            }
          ];
        }
        return prev;
      });
    }
  }, [latestResponse]);

  // Scroll to bottom
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

  return (
    <div className="relative min-h-[calc(100vh-75px)] w-full bg-[#0d0e12] text-white flex flex-col justify-between overflow-hidden font-['Outfit',sans-serif]">
      {/* Subtle Central Ambient Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.05) 45%, transparent 70%)',
          filter: 'blur(90px)'
        }}
      />

      {/* 1. Main Chat Stream or Clean Centered Hero */}
      <div className="relative z-10 flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 pt-6 pb-28">
        {messages.length === 0 && !isLoading ? (
          /* Gemini-style Centered Greeting */
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 my-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              <h1 className="text-4xl sm:text-5xl font-normal text-zinc-100 tracking-tight">
                Let's jump in, Aryan
              </h1>
              <p className="text-sm text-zinc-400 font-light">
                Ask about fishing zones, weather safety, or borders in any language.
              </p>
            </motion.div>
          </div>
        ) : (
          /* Clean Conversation Flow */
          <div className="space-y-6 pt-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
                >
                  {msg.sender === 'user' ? (
                    <div className="max-w-[85%] sm:max-w-[75%] px-5 py-3 rounded-3xl bg-zinc-800 text-zinc-100 font-medium text-sm shadow-md">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="w-full space-y-3 pt-2">
                      <div className="flex items-center space-x-2 text-xs text-zinc-400 font-semibold">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>ORCA</span>
                      </div>

                      <div className="text-sm leading-relaxed text-zinc-200 whitespace-pre-line font-light pl-6">
                        {msg.text}
                      </div>

                      {/* Tool actions: Audio speaker + Copy */}
                      <div className="flex items-center space-x-2 pl-6 pt-1">
                        {msg.data && (
                          <button
                            onClick={() => handleSpeak(msg.id, msg.data!.response.tts_speech_text, msg.data!.language.voice_code)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              speakingId === msg.id 
                                ? 'text-cyan-400 animate-pulse' 
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                            title="Read aloud"
                          >
                            {speakingId === msg.id ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                        )}
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <div className="flex items-center space-x-2.5 text-zinc-400 text-xs font-medium pl-6 pt-3 animate-pulse">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>Thinking...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>
        )}
      </div>

      {/* 2. Single Gemini-Style Pill Input Bar */}
      <div className="fixed bottom-6 left-0 right-0 z-40 max-w-2xl w-full mx-auto px-4">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center bg-[#1e1f25] border border-zinc-700/60 rounded-full px-4 py-2.5 shadow-2xl focus-within:border-zinc-500 transition-all"
        >
          {/* Plus icon on left */}
          <button 
            type="button"
            onClick={() => setMessages([])}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors mr-2 cursor-pointer"
            title="New Chat"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Main Input Text */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask ORCA..."
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-normal"
            disabled={isLoading}
          />

          {/* Model indicator */}
          <div className="hidden sm:flex items-center space-x-1 text-xs text-zinc-400 px-2 py-1 rounded-full bg-zinc-800/80 mr-2 border border-zinc-700/50">
            <span>Llama 3.1</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </div>

          {/* Microphone STT Trigger */}
          <button
            type="button"
            onClick={handleToggleMic}
            className={`p-2 rounded-full transition-all mr-1 cursor-pointer ${
              isListening 
                ? 'bg-red-600 text-white animate-ping' 
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Speak query"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Send Arrow Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-8 h-8 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};
