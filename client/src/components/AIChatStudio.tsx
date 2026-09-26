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
  Download,
  Loader2,
  History,
  Trash2,
  Search,
  MessageSquare,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatResponsePayload } from '../types';
import { speakText, stopSpeech, getBcp47LangTag, isAudioCachePreloaded, preloadAllRegionalAudioPacks } from '../utils/speechUtils';
import { FormattedMarkdown } from './FormattedMarkdown';

export interface Message {
  id: string;
  sender: 'user' | 'blueorbit' | 'orca';
  text: string;
  timestamp: string;
  data?: ChatResponsePayload;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
}

interface AIChatStudioProps {
  onSendMessage: (query: string, langOverride?: string) => Promise<any>;
  isLoading: boolean;
  latestResponse: ChatResponsePayload | null;
  currentLang: string;
  setCurrentLang: (lang: string) => void;
  onVoiceSetupClick?: () => void;
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
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const raw = localStorage.getItem('blueorbit_chat_history');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('blueorbit_active_session_id') || null;
    } catch {
      return null;
    }
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState<string>('');

  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAudioCached, setIsAudioCached] = useState(() => isAudioCachePreloaded());
  const [isCaching, setIsCaching] = useState(false);
  const [cacheProgress, setCacheProgress] = useState(0);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load active session messages on initial mount if available
  useEffect(() => {
    if (currentSessionId) {
      const active = sessions.find(s => s.id === currentSessionId);
      if (active && active.messages.length > 0) {
        setMessages(active.messages);
      }
    }
  }, []);

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    try { localStorage.removeItem('blueorbit_active_session_id'); } catch {}
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSelectSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    try { localStorage.setItem('blueorbit_active_session_id', session.id); } catch {}
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    try { localStorage.setItem('blueorbit_chat_history', JSON.stringify(updated)); } catch {}
    if (currentSessionId === id) {
      handleNewChat();
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to clear all conversation history?")) {
      setSessions([]);
      handleNewChat();
      try { localStorage.removeItem('blueorbit_chat_history'); } catch {}
    }
  };

  const handleDirectCache = async () => {
    if (isCaching) return;
    setIsCaching(true);
    setCacheProgress(5);
    const success = await preloadAllRegionalAudioPacks((pct) => {
      setCacheProgress(pct);
    });
    if (success) {
      setIsAudioCached(true);
    }
    setIsCaching(false);
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // When language is switched from Header dropdown or parent, dynamically sync the last AI response
  useEffect(() => {
    if (latestResponse && latestResponse.response?.markdown) {
      setMessages(prev => {
        if (prev.length === 0) return prev;
        const lastIdx = prev.length - 1;
        if (prev[lastIdx].sender === 'blueorbit' || prev[lastIdx].sender === 'orca') {
          if (prev[lastIdx].text !== latestResponse.response.markdown) {
            const updated = [...prev];
            updated[lastIdx] = {
              ...updated[lastIdx],
              text: latestResponse.response.markdown,
              data: latestResponse
            };
            if (currentSessionId) {
              setSessions(prevSessions => {
                const next = prevSessions.map(s => s.id === currentSessionId ? { ...s, messages: updated } : s);
                try { localStorage.setItem('blueorbit_chat_history', JSON.stringify(next)); } catch {}
                return next;
              });
            }
            return updated;
          }
        }
        return prev;
      });
    }
  }, [latestResponse, currentSessionId]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let activeId = currentSessionId;
    let nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputText('');

    if (!activeId) {
      activeId = `session-${Date.now()}`;
      setCurrentSessionId(activeId);
      try { localStorage.setItem('blueorbit_active_session_id', activeId); } catch {}
      const newSession: ChatSession = {
        id: activeId,
        title: textToSend.length > 38 ? textToSend.slice(0, 38) + '...' : textToSend,
        timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        messages: nextMessages
      };
      setSessions(prev => {
        const next = [newSession, ...prev];
        try { localStorage.setItem('blueorbit_chat_history', JSON.stringify(next)); } catch {}
        return next;
      });
    } else {
      setSessions(prev => {
        const next = prev.map(s => s.id === activeId ? { ...s, messages: nextMessages } : s);
        try { localStorage.setItem('blueorbit_chat_history', JSON.stringify(next)); } catch {}
        return next;
      });
    }

    const res = await onSendMessage(textToSend, currentLang);
    const aiMsg: Message = res && res.response?.markdown ? {
      id: `msg-${Date.now()}`,
      sender: 'blueorbit',
      text: res.response.markdown,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      data: res
    } : {
      id: `msg-err-${Date.now()}`,
      sender: 'blueorbit',
      text: "⚠️ **Service Notice**: Unable to connect to Blue Orbit AI reasoning engine. Please ensure your device has internet access and try again.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => {
      const fullList = [...prev, aiMsg];
      setSessions(prevSessions => {
        const next = prevSessions.map(s => s.id === activeId ? { ...s, messages: fullList } : s);
        try { localStorage.setItem('blueorbit_chat_history', JSON.stringify(next)); } catch {}
        return next;
      });
      return fullList;
    });
  };

  // Speech to Text (STT) - Full 8 Indian Languages Support
  const handleToggleMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please type your query.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = getBcp47LangTag(currentLang);

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

  // Text to Speech (TTS) - Full 8 Indian Languages Support
  const handleSpeak = (msgId: string, text: string, voiceCode?: string) => {
    if (speakingId === msgId) {
      stopSpeech();
      setSpeakingId(null);
      return;
    }

    const effectiveLang = voiceCode || currentLang || 'en';
    speakText(
      text,
      effectiveLang,
      () => setSpeakingId(msgId),
      () => setSpeakingId(null),
      () => setSpeakingId(null)
    );
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="relative min-h-screen w-full bg-[#fcfbf8] text-[#111113] flex flex-col font-['Outfit',sans-serif] overflow-hidden selection:bg-blue-100 selection:text-blue-950">
      
      {/* 1. EXACT 1:1 LOVABLE VIBRANT BLUE ANNULAR HALO */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
        <div 
          className="w-[880px] sm:w-[1020px] h-[640px] sm:h-[720px] rounded-[100%]"
          style={{
            background: 'radial-gradient(ellipse 55% 48% at 50% 50%, rgba(252, 251, 248, 0) 0%, rgba(252, 251, 248, 0) 26%, rgba(96, 165, 250, 0.85) 54%, rgba(37, 99, 235, 0.95) 68%, rgba(96, 165, 250, 0.7) 78%, rgba(252, 251, 248, 0) 95%)',
            filter: 'blur(45px)',
          }}
        />
      </div>

      {/* History Sidebar Floating Trigger Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-20 left-4 sm:left-6 z-30 flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-zinc-200/90 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-sm transition-all cursor-pointer hover:border-zinc-300"
        title="Toggle conversation history"
      >
        <History className="w-3.5 h-3.5 text-blue-600" />
        <span className="hidden xs:inline">History</span>
        {sessions.length > 0 && (
          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
            {sessions.length}
          </span>
        )}
      </button>

      {/* Quick "New Chat" button when active thread exists */}
      {hasMessages && (
        <button
          onClick={handleNewChat}
          className="absolute top-20 left-28 sm:left-32 z-30 flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-zinc-200/90 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-sm transition-all cursor-pointer hover:border-zinc-300"
          title="Start fresh conversation"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-600" />
          <span>New Chat</span>
        </button>
      )}

      {/* Left Collapsible History Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
            />

            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-white/95 backdrop-blur-2xl border-r border-zinc-200/90 shadow-2xl z-50 flex flex-col pt-16 pb-4"
            >
              {/* Sidebar Header */}
              <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-zinc-900">
                  <History className="w-4 h-4 text-blue-600" />
                  <span>Chat History</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={handleNewChat}
                    className="p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer"
                    title="Start New Chat"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                    title="Close Sidebar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search History Filter */}
              <div className="p-3 border-b border-zinc-100">
                <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1.5 focus-within:border-blue-500">
                  <Search className="w-3.5 h-3.5 text-zinc-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchHistoryQuery}
                    onChange={(e) => setSearchHistoryQuery(e.target.value)}
                    placeholder="Search past chats..."
                    className="w-full bg-transparent text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none"
                  />
                  {searchHistoryQuery && (
                    <button onClick={() => setSearchHistoryQuery('')} className="text-zinc-400 hover:text-zinc-600 p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sessions List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {sessions.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-400 px-4">
                    <MessageSquare className="w-8 h-8 text-zinc-300 mx-auto mb-2 opacity-60" />
                    No previous conversations yet. Ask a question to start history.
                  </div>
                ) : (
                  sessions
                    .filter(s => !searchHistoryQuery.trim() || s.title.toLowerCase().includes(searchHistoryQuery.toLowerCase()) || s.messages.some(m => m.text.toLowerCase().includes(searchHistoryQuery.toLowerCase())))
                    .map(session => {
                      const isActive = session.id === currentSessionId;
                      return (
                        <div
                          key={session.id}
                          onClick={() => handleSelectSession(session)}
                          className={`group flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                            isActive
                              ? 'bg-blue-50/80 border border-blue-200 text-blue-950 font-semibold'
                              : 'text-zinc-700 hover:bg-zinc-100 border border-transparent'
                          }`}
                        >
                          <div className="flex items-start space-x-2 min-w-0 flex-1 pr-2">
                            <MessageSquare className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-zinc-400'}`} />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-xs">{session.title}</div>
                              <div className="text-[10px] text-zinc-400">{session.timestamp} · {session.messages.length} msgs</div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleDeleteSession(session.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer shrink-0"
                            title="Delete thread"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                )}
              </div>

              {/* Sidebar Footer */}
              {sessions.length > 0 && (
                <div className="p-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>{sessions.length} saved chats</span>
                  <button
                    onClick={handleClearAllHistory}
                    className="text-red-600 hover:text-red-700 font-medium hover:underline cursor-pointer flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* STATE 1: EXACT 1:1 LOVABLE HERO WITH CENTER CHATBOX */}
      {!hasMessages && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-4xl w-full mx-auto px-4 sm:px-6 my-auto pt-24 pb-16">
          
          {/* Main Headline: Responsive Sizing */}
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#111113] tracking-[-0.035em] leading-[1.1] select-none mb-4 sm:mb-6"
          >
            Reasoning by design
          </motion.h1>

          {/* 2-Line Subtitle Description */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[#52525b] text-sm sm:text-base md:text-[17px] max-w-[640px] font-normal leading-[1.6] mb-6 sm:mb-8 text-center px-2"
          >
            Reason over ISRO satellite oceanography, verify 0–100 ocean safety clearance,<br className="hidden sm:inline" />
            discover high-yield fishing zones, and maintain strict maritime border compliance.
          </motion.p>

          {/* Action Buttons (Responsive Wrap) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 w-full max-w-lg"
          >
            <button
              onClick={() => handleSend("Where is the nearest Potential Fishing Zone for Tuna from Kochi today?")}
              className="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-white bg-[#111113] hover:bg-zinc-800 shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              🐟 Tuna PFZ Advisory
            </button>

            <button
              onClick={() => handleSend("Is it safe to venture into the sea tomorrow morning?")}
              className="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#18181b] bg-white hover:bg-zinc-50 border border-[#e4e4e7] shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              🛡️ Sea Safety Clearance
            </button>

            <button
              onClick={handleDirectCache}
              disabled={isCaching}
              className="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow-sm transition-all active:scale-98 cursor-pointer flex items-center space-x-1.5"
              title="Preload 8 Regional Indian Audio Packs into Local Device Cache"
            >
              {isCaching ? (
                <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
              ) : isAudioCached ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              ) : (
                <Download className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span>{isCaching ? `Caching ${cacheProgress}%` : (isAudioCached ? "✓ Audio Cached" : "📥 Cache Audio Packs")}</span>
            </button>
          </motion.div>

          {/* Center Chat Box Capsule */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-xl px-2 sm:px-0"
          >
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative flex items-center bg-white border border-[#e4e4e7] hover:border-zinc-400 focus-within:border-blue-500 rounded-full px-3.5 sm:px-5 py-2.5 sm:py-3 shadow-[0_10px_35px_rgba(0,0,0,0.06)] transition-all"
            >
              {/* Plus icon on left */}
              <button 
                type="button"
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 transition-colors mr-2 cursor-pointer"
                title="New Query"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Main Input Field */}
              <input
                ref={inputRef}
                type="text"
                autoFocus
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Blue Orbit AI anything..."
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
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Send Arrow Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="w-8 h-8 rounded-full bg-[#111113] hover:bg-zinc-800 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-sm"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* STATE 2: Active Chat Conversation Stream */}
      {hasMessages && (
        <div className="relative z-10 flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 pt-24 pb-36 sm:pb-32">
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
                        <span>Blue Orbit AI Advisory</span>
                      </div>

                      <FormattedMarkdown 
                        content={msg.text} 
                        className="text-sm leading-relaxed text-zinc-800 font-normal" 
                        strongClassName="font-bold text-zinc-950"
                        bulletClassName="text-blue-600"
                      />

                      {/* Tool actions: Audio speaker + Copy */}
                      <div className="flex items-center space-x-2 pt-2 border-t border-zinc-100">
                        <button
                          onClick={() => handleSpeak(
                            msg.id, 
                            msg.data?.response?.tts_speech_text || msg.text, 
                            msg.data?.language?.voice_code || currentLang
                          )}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            speakingId === msg.id 
                              ? 'text-blue-600 bg-blue-50 animate-pulse' 
                              : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50'
                          }`}
                          title={speakingId === msg.id ? "Stop voice" : "Read aloud"}
                        >
                          {speakingId === msg.id ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
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
                onClick={() => setMessages([])}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 transition-colors mr-2 cursor-pointer"
                title="New Chat"
              >
                <Plus className="w-4 h-4" />
              </button>

              <input
                type="text"
                autoFocus
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Blue Orbit AI anything..."
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
