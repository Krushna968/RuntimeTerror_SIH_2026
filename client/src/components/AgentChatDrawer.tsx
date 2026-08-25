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
  Clock, 
  Compass, 
  ShieldCheck, 
  Satellite,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ChatResponsePayload, AgentExecutionStep } from '../types';

interface AgentChatDrawerProps {
  onSendMessage: (query: string) => void;
  isLoading: boolean;
  latestResponse: ChatResponsePayload | null;
  currentLang: string;
}

export const AgentChatDrawer: React.FC<AgentChatDrawerProps> = ({
  onSendMessage,
  isLoading,
  latestResponse,
  currentLang
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [expandedTrace, setExpandedTrace] = useState(true);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Quick preset chips
  const PRESET_QUERIES = [
    { label: "🐟 Nearest Tuna PFZ (Kochi)", query: "Where is the nearest Potential Fishing Zone for Tuna from Kochi today?" },
    { label: "🛡️ Sea Venture Safety", query: "Is it safe to venture into the sea tomorrow morning from Chennai?" },
    { label: "🛑 IMBL Border Check", query: "What is the closest distance to Sri Lanka IMBL from Rameswaram?" },
    { label: "🌪️ Cyclone Warnings", query: "Are there any cyclone or lightning alerts in Bay of Bengal?" }
  ];

  // Speech Recognition (STT)
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
        setInputText(transcript);
        setIsListening(false);
        onSendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  // Text to Speech (TTS)
  const handleSpeak = (text: string, voiceCode: string = 'en-IN') => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceCode;
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full glass-card-bright rounded-3xl border border-cyan-400/30 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-cyan-400/20 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white flex items-center space-x-2">
              <span>ORCA Agentic Assistant</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-400/50">
                Multi-Agent DAG
              </span>
            </h2>
            <p className="text-[11px] text-cyan-200/80 font-medium">
              Autonomous reasoning over Oceansat-3 & INCOIS feeds
            </p>
          </div>
        </div>

        {latestResponse && (
          <button
            onClick={() => handleSpeak(latestResponse.response.tts_speech_text, latestResponse.language.voice_code)}
            className={`p-2 rounded-xl border transition-all ${
              isSpeaking 
                ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_15px_#22d3ee] animate-pulse' 
                : 'bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border-slate-600'
            }`}
            title="Read aloud in regional language"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Preset Query Chips */}
      <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/60 flex items-center space-x-2 overflow-x-auto no-scrollbar">
        {PRESET_QUERIES.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(preset.query)}
            disabled={isLoading}
            className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-800/90 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-400/50 transition-all shadow-sm cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Main Conversation & Reasoning Area */}
      <div className="flex-1 p-4 md:p-5 overflow-y-auto space-y-4">
        {isLoading && (
          <div className="p-5 rounded-2xl glass-panel-glow border border-cyan-400/50 space-y-3.5 animate-pulse shadow-xl">
            <div className="flex items-center space-x-2 text-cyan-300 text-xs font-extrabold">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>ORCA Multi-Agent Network Collaborating...</span>
            </div>
            <div className="space-y-2 text-xs text-slate-200">
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Decomposing spatial intent & querying Oceansat-3 OCM-3 products...</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Computing SST Thermal Front × Chlorophyll-a Coincidence Gradient...</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Evaluating IMBL geofence buffer & A* weather routing clearance...</span>
              </div>
            </div>
          </div>
        )}

        {latestResponse && !isLoading && (
          <div className="space-y-4">
            {/* User Query Echo */}
            <div className="flex justify-end">
              <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium text-xs shadow-lg border border-blue-400/40">
                {latestResponse.query}
              </div>
            </div>

            {/* Agent Primary Synthesized Response Card */}
            <div className="glass-panel p-5 rounded-3xl border-l-4 border-l-cyan-400 border-cyan-400/40 space-y-3.5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-[10px] font-black shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                    ISRO
                  </div>
                  <span className="text-xs font-black text-white">
                    Verified Advisory · {latestResponse.reference_port.name}
                  </span>
                </div>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-sm">
                  {latestResponse.language.native} ({latestResponse.language.name})
                </span>
              </div>

              {/* Formatted Markdown Content */}
              <div className="text-xs leading-relaxed text-slate-100 whitespace-pre-line font-medium space-y-1.5">
                {latestResponse.response.markdown}
              </div>

              {/* Quick Insight Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2.5 border-t border-slate-800">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80">
                  <div className="text-[10px] text-slate-400 font-semibold">Sea Venture Verdict</div>
                  <div className={`text-xs font-black mt-0.5 ${
                    latestResponse.weather_and_safety.safety_status === 'SAFE_FOR_VENTURE' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {latestResponse.weather_and_safety.safety_status.replace(/_/g, ' ')}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80">
                  <div className="text-[10px] text-slate-400 font-semibold">Dominant Species</div>
                  <div className="text-xs font-black text-cyan-300 mt-0.5">
                    {latestResponse.top_pfz.dominant_species}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-400 font-semibold">Nearest IMBL Distance</div>
                  <div className="text-xs font-black text-white mt-0.5 font-mono">
                    {latestResponse.geofence_status.nearest_imbl.distance_nautical_miles} NM
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible Multi-Agent Reasoning DAG Trace */}
            <div className="glass-panel rounded-2xl border border-cyan-400/30 overflow-hidden text-xs shadow-lg">
              <button
                onClick={() => setExpandedTrace(!expandedTrace)}
                className="w-full px-4 py-3 bg-slate-900/90 hover:bg-slate-850 flex items-center justify-between font-extrabold text-slate-200 transition-colors cursor-pointer"
              >
                <span className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-cyan-300 animate-pulse" />
                  <span>Agent Execution Chain ({latestResponse.evidence_and_provenance.execution_steps_count} Specialized Agents)</span>
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-cyan-300 font-mono font-bold">
                    {latestResponse.execution_metadata.total_latency_ms}ms
                  </span>
                  {expandedTrace ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {expandedTrace && (
                <div className="p-3.5 space-y-3 bg-slate-950/80 border-t border-slate-800">
                  {latestResponse.evidence_and_provenance.execution_trace.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/95 border border-slate-700/80 space-y-1.5 shadow-sm">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-cyan-300 flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{step.agent}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono font-semibold">{step.duration_ms}ms</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-snug font-medium">
                        {step.thought}
                      </p>
                      <div className="text-[11px] text-emerald-300 font-mono bg-black/60 px-2.5 py-1 rounded-lg border border-slate-800">
                        ➔ {step.output_summary}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Box & Voice Trigger */}
      <form onSubmit={handleFormSubmit} className="p-3.5 border-t border-cyan-400/20 bg-slate-900/90">
        <div className="relative flex items-center bg-slate-950/90 border border-slate-700 rounded-2xl p-1.5 shadow-inner focus-within:border-cyan-400/60 transition-all">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              currentLang === 'hi' 
                ? "मछली पकड़ने का क्षेत्र, मौसम या सुरक्षा के बारे में पूछें..." 
                : "Ask about PFZ zones, weather safety, border geofence..."
            }
            className="flex-1 bg-transparent px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none font-medium"
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={handleToggleMic}
            className={`p-2.5 rounded-xl transition-all ${
              isListening 
                ? 'bg-red-600 text-white animate-ping' 
                : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800'
            }`}
            title="Speak query (Web Speech STT)"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="ml-1 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
