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
    <div className="flex flex-col h-full glass-panel rounded-2xl border border-ocean-cyan/20 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-ocean-cyan/20 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-ocean-cyan/20 border border-ocean-cyan/40 flex items-center justify-center text-ocean-cyan">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>ORCA Agentic Assistant</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                Multi-Agent DAG
              </span>
            </h2>
            <p className="text-[10px] text-slate-400">
              Autonomous reasoning over ISRO Oceansat-3 & INCOIS feeds
            </p>
          </div>
        </div>

        {latestResponse && (
          <button
            onClick={() => handleSpeak(latestResponse.response.tts_speech_text, latestResponse.language.voice_code)}
            className={`p-1.5 rounded-lg border transition-all ${
              isSpeaking 
                ? 'bg-ocean-cyan text-ocean-950 border-cyan-400 animate-pulse' 
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
            title="Read aloud in regional language"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Preset Query Chips */}
      <div className="px-3 py-2 border-b border-slate-800/80 bg-slate-950/40 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
        {PRESET_QUERIES.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(preset.query)}
            disabled={isLoading}
            className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800/70 hover:bg-ocean-cyan/20 text-slate-300 hover:text-ocean-cyan border border-slate-700/60 hover:border-ocean-cyan/40 transition-all"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Main Conversation & Reasoning Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {isLoading && (
          <div className="p-4 rounded-xl glass-panel-glow border border-ocean-cyan/40 space-y-3 animate-pulse">
            <div className="flex items-center space-x-2 text-ocean-cyan text-xs font-bold">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>ORCA Multi-Agent Network Collaborating...</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ocean-cyan animate-ping" />
                <span>Decomposing spatial intent & querying Oceansat-3 OCM-3 products...</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ocean-emerald" />
                <span>Computing SST Thermal Front × Chlorophyll-a Coincidence Gradient...</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ocean-amber" />
                <span>Evaluating IMBL geofence buffer & A* weather routing clearance...</span>
              </div>
            </div>
          </div>
        )}

        {latestResponse && !isLoading && (
          <div className="space-y-4">
            {/* User Query Echo */}
            <div className="flex justify-end">
              <div className="max-w-[85%] px-3.5 py-2 rounded-2xl rounded-tr-sm bg-gradient-to-r from-ocean-cyan/20 to-blue-600/30 border border-ocean-cyan/40 text-xs text-white shadow-md">
                {latestResponse.query}
              </div>
            </div>

            {/* Agent Primary Synthesized Response Card */}
            <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-ocean-cyan border-ocean-cyan/30 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-ocean-cyan/20 flex items-center justify-center text-ocean-cyan text-[10px] font-bold">
                    ISRO
                  </div>
                  <span className="text-xs font-bold text-white">
                    Verified Advisory · {latestResponse.reference_port.name}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  {latestResponse.language.native} ({latestResponse.language.name})
                </span>
              </div>

              {/* Formatted Markdown Content */}
              <div className="text-xs leading-relaxed text-slate-200 whitespace-pre-line font-normal space-y-1">
                {latestResponse.response.markdown}
              </div>

              {/* Quick Insight Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Sea Venture Verdict</div>
                  <div className={`text-xs font-bold ${
                    latestResponse.weather_and_safety.safety_status === 'SAFE_FOR_VENTURE' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {latestResponse.weather_and_safety.safety_status.replace(/_/g, ' ')}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Dominant Species</div>
                  <div className="text-xs font-bold text-ocean-cyan">
                    {latestResponse.top_pfz.dominant_species}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-400">Nearest IMBL Distance</div>
                  <div className="text-xs font-bold text-slate-200">
                    {latestResponse.geofence_status.nearest_imbl.distance_nautical_miles} NM
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible Multi-Agent Reasoning DAG Trace */}
            <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden text-xs">
              <button
                onClick={() => setExpandedTrace(!expandedTrace)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 hover:bg-slate-800/80 flex items-center justify-between font-bold text-slate-300 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <Cpu className="w-3.5 h-3.5 text-ocean-cyan" />
                  <span>Agent Execution Chain ({latestResponse.evidence_and_provenance.execution_steps_count} Specialized Agents)</span>
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-ocean-cyan font-mono">
                    {latestResponse.execution_metadata.total_latency_ms}ms
                  </span>
                  {expandedTrace ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </button>

              {expandedTrace && (
                <div className="p-3 space-y-2.5 bg-slate-950/60">
                  {latestResponse.evidence_and_provenance.execution_trace.map((step, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/90 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-ocean-cyan flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{step.agent}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{step.duration_ms}ms</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {step.thought}
                      </p>
                      <div className="text-[10px] text-slate-400 font-mono bg-black/40 px-2 py-0.5 rounded">
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
      <form onSubmit={handleFormSubmit} className="p-3 border-t border-ocean-cyan/20 bg-slate-900/80">
        <div className="relative flex items-center glass-pill rounded-xl p-1 shadow-inner">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              currentLang === 'hi' 
                ? "मछली पकड़ने का क्षेत्र, मौसम या सुरक्षा के बारे में पूछें..." 
                : "Ask about PFZ zones, weather safety, border geofence..."
            }
            className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={handleToggleMic}
            className={`p-2 rounded-lg transition-all ${
              isListening 
                ? 'bg-red-600 text-white animate-ping' 
                : 'text-slate-400 hover:text-ocean-cyan hover:bg-slate-800'
            }`}
            title="Speak query (Web Speech STT)"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="ml-1 p-2 rounded-lg bg-gradient-to-r from-ocean-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-ocean-950 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
