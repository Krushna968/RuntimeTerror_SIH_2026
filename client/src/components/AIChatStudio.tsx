import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Fish, 
  ShieldCheck, 
  AlertTriangle, 
  Compass, 
  Layers, 
  ArrowRight, 
  PlusCircle, 
  History, 
  Satellite, 
  Languages, 
  Copy, 
  Check,
  Zap,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatResponsePayload, AgentExecutionStep } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'orca';
  text: string;
  timestamp: string;
  data?: ChatResponsePayload;
  modelEngine?: string;
  isStreaming?: boolean;
}

interface AIChatStudioProps {
  onSendMessage: (query: string, langOverride?: string) => Promise<void>;
  isLoading: boolean;
  latestResponse: ChatResponsePayload | null;
  currentLang: string;
  setCurrentLang: (lang: string) => void;
  onNavigateToMap: () => void;
  onNavigateToSafety: () => void;
  onNavigateToBulletin: () => void;
}

export const AIChatStudio: React.FC<AIChatStudioProps> = ({
  onSendMessage,
  isLoading,
  latestResponse,
  currentLang,
  setCurrentLang,
  onNavigateToMap,
  onNavigateToSafety,
  onNavigateToBulletin
}) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Suggested Prompts by Category
  const PROMPT_CARDS = [
    {
      icon: <Fish className="w-5 h-5 text-cyan-400" />,
      category: "Fisheries Intelligence",
      title: "Nearest Tuna PFZ from Kochi",
      query: "Where is the nearest Potential Fishing Zone for Tuna from Kochi today?"
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      category: "Sea Venture Safety",
      title: "Tomorrow's Clearance at Chennai",
      query: "Is it safe to venture into the sea tomorrow morning from Chennai?"
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      category: "Geofence Compliance",
      title: "Sri Lanka IMBL Proximity",
      query: "What is the closest distance to Sri Lanka IMBL from Rameswaram?"
    },
    {
      icon: <Compass className="w-5 h-5 text-indigo-400" />,
      category: "Cyclone & Squall Radar",
      title: "Bay of Bengal Warnings",
      query: "Are there any lightning or cyclone alerts in Bay of Bengal?"
    }
  ];

  // Sync latestResponse into messages list
  useEffect(() => {
    if (latestResponse) {
      const newMsgId = `msg-${Date.now()}`;
      setMessages((prev) => {
        // If query was already added, attach response
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
              data: latestResponse,
              modelEngine: latestResponse.execution_metadata.llm_engine || "NVIDIA NIM (Meta Llama-3.1-8B)"
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
              data: latestResponse,
              modelEngine: latestResponse.execution_metadata.llm_engine || "NVIDIA NIM (Meta Llama-3.1-8B)"
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

    // Add user message immediately
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

  const handleNewChat = () => {
    setMessages([]);
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
    <div className="w-full h-[calc(100vh-100px)] min-h-[700px] flex flex-col md:flex-row gap-4 max-w-7xl mx-auto p-2 sm:p-4 text-white font-['Outfit',sans-serif]">
      {/* 1. Left Missions & Intelligence Sidebar */}
      <aside className="w-full md:w-80 shrink-0 bg-zinc-900/90 rounded-3xl border border-zinc-800 p-5 flex flex-col justify-between shadow-2xl backdrop-blur-xl hidden md:flex">
        <div className="space-y-5">
          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-cyan-600" />
            <span>New Marine Query</span>
          </button>

          {/* Model Status Card */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-zinc-400 font-semibold text-[11px]">
              <span>Active Cognitive Engine</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div className="flex items-center space-x-2 text-white font-bold">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>NVIDIA NIM · Llama 3.1</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-snug">
              Retrieval & Agent Augmented Generation over ISRO Oceansat-3 feeds.
            </p>
          </div>

          {/* Preset Mission Queries */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
              Sample Inquiries
            </div>
            <div className="space-y-1.5">
              {PROMPT_CARDS.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(card.query)}
                  disabled={isLoading}
                  className="w-full text-left p-2.5 rounded-xl bg-zinc-950/40 hover:bg-zinc-800/80 border border-zinc-800/60 hover:border-cyan-400/40 text-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-2">
                    <span className="group-hover:scale-110 transition-transform">{card.icon}</span>
                    <span className="font-semibold text-zinc-200 group-hover:text-white truncate">
                      {card.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Constellation Telemetry Strip */}
        <div className="pt-4 border-t border-zinc-800 space-y-2 text-[11px] text-zinc-400">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5 text-zinc-300">
              <Satellite className="w-3.5 h-3.5 text-cyan-400" />
              <span>Oceansat-3 L3</span>
            </span>
            <span className="text-emerald-400 font-mono font-bold">98.4% Synced</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5 text-zinc-300">
              <Satellite className="w-3.5 h-3.5 text-indigo-400" />
              <span>INSAT-3DR TIR</span>
            </span>
            <span className="text-emerald-400 font-mono font-bold">12m Latency</span>
          </div>
        </div>
      </aside>

      {/* 2. Main Full-Screen Conversational Stream */}
      <section className="flex-1 bg-zinc-900/90 rounded-3xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl">
        {/* Chat Studio Header */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-2 text-white shadow-md">
              <Cpu className="w-full h-full animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>ORCA Conversational Decision Support Studio</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  Multi-Agent AAG
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                ISRO Earth Observation & Indian Regional Vernacular Dialogue
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleNewChat}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors md:hidden cursor-pointer"
              title="New Chat"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Stream Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* If no messages yet, show Welcome Hero Prompt Cards */}
          {messages.length === 0 && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-8 py-10">
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  How can ORCA assist your sea mission today?
                </h1>
                <p className="text-sm text-zinc-400 max-w-lg mx-auto">
                  Ask about high-yield fishing zones, ocean safety clearance, storm warnings, or border compliance in your preferred language.
                </p>
              </div>

              {/* 4 Interactive Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full text-left">
                {PROMPT_CARDS.map((card, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSend(card.query)}
                    className="p-4 rounded-2xl bg-zinc-950/60 hover:bg-zinc-800/80 border border-zinc-800 hover:border-cyan-400/50 transition-all cursor-pointer space-y-1.5 group shadow-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="group-hover:scale-110 transition-transform">{card.icon}</span>
                      <span className="text-xs font-bold text-cyan-300">{card.category}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-cyan-200">
                      "{card.title}"
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {card.query}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Render Active Conversation */}
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
              >
                {/* User Message */}
                {msg.sender === 'user' ? (
                  <div className="max-w-[85%] sm:max-w-[70%] px-5 py-3 rounded-3xl rounded-tr-sm bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium text-sm shadow-xl">
                    {msg.text}
                  </div>
                ) : (
                  /* ORCA Agentic Response Card */
                  <div className="w-full max-w-4xl bg-zinc-950/80 p-5 sm:p-6 rounded-3xl border border-zinc-800 space-y-4 shadow-xl">
                    {/* Header with verified badge and action buttons */}
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-xs border border-cyan-400/40">
                          ORCA
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center space-x-2">
                            <span>ISRO Marine Intelligence Advisory</span>
                            {msg.data && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {msg.data.reference_port.name}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-zinc-500">
                            {msg.modelEngine || "NVIDIA NIM (Meta Llama-3.1-8B)"}
                          </span>
                        </div>
                      </div>

                      {/* Right Action Tools: TTS + Copy */}
                      <div className="flex items-center space-x-1.5">
                        {msg.data && (
                          <button
                            onClick={() => handleSpeak(msg.id, msg.data!.response.tts_speech_text, msg.data!.language.voice_code)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                              speakingId === msg.id 
                                ? 'bg-cyan-500 text-slate-950 border-cyan-400 animate-pulse' 
                                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700'
                            }`}
                            title="Read aloud in regional language"
                          >
                            {speakingId === msg.id ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                        )}
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Markdown Body */}
                    <div className="text-sm leading-relaxed text-zinc-200 whitespace-pre-line font-medium space-y-2">
                      {msg.text}
                    </div>

                    {/* Quick Insight KPI Chips */}
                    {msg.data && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-zinc-800/80">
                        <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                          <div className="text-[10px] text-zinc-400 uppercase font-semibold">Sea Venture Verdict</div>
                          <div className={`text-xs font-bold ${
                            msg.data.weather_and_safety.safety_status === 'SAFE_FOR_VENTURE' ? 'text-emerald-400' : 'text-amber-400'
                          }`}>
                            {msg.data.weather_and_safety.safety_status.replace(/_/g, ' ')}
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                          <div className="text-[10px] text-zinc-400 uppercase font-semibold">Dominant Catch</div>
                          <div className="text-xs font-bold text-cyan-300">
                            {msg.data.top_pfz.dominant_species} ({msg.data.top_pfz.catch_enhancement_multiplier})
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                          <div className="text-[10px] text-zinc-400 uppercase font-semibold">IMBL Boundary</div>
                          <div className="text-xs font-mono font-bold text-white">
                            {msg.data.geofence_status.nearest_imbl.distance_nautical_miles} NM Distance
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Jumps */}
                    {msg.data && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          onClick={onNavigateToMap}
                          className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-cyan-300 flex items-center space-x-1.5 transition-all cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>View on GIS Command Map ➔</span>
                        </button>

                        <button
                          onClick={onNavigateToSafety}
                          className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-emerald-300 flex items-center space-x-1.5 transition-all cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Check Safety Barometer ➔</span>
                        </button>

                        <button
                          onClick={onNavigateToBulletin}
                          className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-amber-300 flex items-center space-x-1.5 transition-all cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Print Official Advisory ➔</span>
                        </button>
                      </div>
                    )}

                    {/* Collapsible Multi-Agent Reasoning DAG Trace */}
                    {msg.data && (
                      <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800 overflow-hidden text-xs">
                        <button
                          onClick={() => setExpandedTraceId(expandedTraceId === msg.id ? null : msg.id)}
                          className="w-full px-4 py-2.5 bg-zinc-900/80 hover:bg-zinc-800 flex items-center justify-between font-bold text-zinc-300 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center space-x-2">
                            <Cpu className="w-4 h-4 text-cyan-400" />
                            <span>Multi-Agent DAG Telemetry ({msg.data.evidence_and_provenance.execution_steps_count} Specialized Agents)</span>
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] font-mono text-cyan-400">
                              {msg.data.execution_metadata.total_latency_ms} ms
                            </span>
                            {expandedTraceId === msg.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </button>

                        {expandedTraceId === msg.id && (
                          <div className="p-3.5 space-y-2.5 bg-zinc-950/90 border-t border-zinc-800">
                            {msg.data.evidence_and_provenance.execution_trace.map((step, idx) => (
                              <div key={idx} className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-cyan-400 flex items-center space-x-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>{step.agent}</span>
                                  </span>
                                  <span className="text-[10px] text-zinc-500 font-mono">{step.duration_ms} ms</span>
                                </div>
                                <p className="text-xs text-zinc-300 leading-snug font-medium">
                                  {step.thought}
                                </p>
                                <div className="text-[11px] text-emerald-400 font-mono bg-black/50 px-2.5 py-1 rounded-lg border border-zinc-800">
                                  ➔ {step.output_summary}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-5 rounded-3xl bg-zinc-950/80 border border-cyan-500/30 space-y-3.5 animate-pulse max-w-2xl">
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>NVIDIA NIM & ORCA Multi-Agent Network Reasoning...</span>
              </div>
              <div className="space-y-2 text-xs text-zinc-400">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Discovering Oceansat-3 OCM-3 products & thermal fronts...</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Computing Beaufort wind risk & wave hazard indices...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar with Voice & Language */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 border-t border-zinc-800 bg-zinc-950/60">
          <div className="relative flex items-center bg-zinc-900 border border-zinc-700/80 rounded-2xl p-2 shadow-inner focus-within:border-cyan-400 transition-all">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                currentLang === 'hi'
                  ? "मछली पकड़ने का क्षेत्र, मौसम या सुरक्षा के बारे में पूछें..."
                  : "Ask about PFZ zones, weather safety, border geofence..."
              }
              className="flex-1 bg-transparent px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none font-medium"
              disabled={isLoading}
            />

            {/* STT Microphone */}
            <button
              type="button"
              onClick={handleToggleMic}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                isListening 
                  ? 'bg-red-600 text-white animate-ping' 
                  : 'text-zinc-400 hover:text-cyan-300 hover:bg-zinc-800'
              }`}
              title="Speak query (Web Speech STT)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="ml-1 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer flex items-center space-x-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
