import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Send, 
  Mic, 
  Volume2, 
  VolumeX, 
  Activity, 
  ShieldCheck, 
  Compass, 
  Layers, 
  Fish, 
  Waves, 
  Radio, 
  CheckCircle2, 
  Zap, 
  Clock, 
  ArrowRight,
  RefreshCw,
  GitBranch
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HolographicBeams from './ui/beams-background';
import { SatelliteTelemetry, ChatResponsePayload } from '../types';

interface AgentDAGStudioProps {
  satellites: SatelliteTelemetry[];
  latestResponse: ChatResponsePayload | null;
  isLoading: boolean;
  onSendMessage: (query: string, lang?: string) => void;
  currentLang: string;
}

const PRESET_QUERIES = [
  { label: "🐟 Nearest Tuna PFZ (Kochi)", query: "Where is the nearest Potential Fishing Zone for Tuna from Kochi today?" },
  { label: "🛡️ Sea Venture Safety (Chennai)", query: "Is it safe to venture into the sea tomorrow morning from Chennai?" },
  { label: "🛑 IMBL Border Check (Rameswaram)", query: "What is the closest distance to Sri Lanka IMBL from Rameswaram?" },
  { label: "🌪️ Cyclone Warnings (Bay of Bengal)", query: "Are there any cyclone or lightning alerts in Bay of Bengal?" }
];

const DOMAIN_AGENTS = [
  {
    id: "planner",
    name: "Master Supervisor DAG Planner",
    role: "Intent Decomposition & Graph Orchestration",
    model: "NVIDIA NIM (LLaMA-3.1-8B)",
    status: "Active",
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: "marine_data",
    name: "Marine EO Data Agent",
    role: "Oceansat-3 OCM-3 & INSAT-3DR TIR Ingestion",
    model: "ISRO NRSC Telemetry API",
    status: "Live Sync",
    color: "from-teal-400 to-emerald-400"
  },
  {
    id: "weather_hazard",
    name: "Weather & Marine Hazard Agent",
    role: "Wave, Wind, Squall & Cyclone Analytics",
    model: "IMD / INCOIS Hydrodynamics",
    status: "Operational",
    color: "from-amber-400 to-orange-400"
  },
  {
    id: "ocean_analytics",
    name: "Ocean Analytics & PFZ Engine",
    role: "Thermal-Chlorophyll Front Coincidence & HSI",
    model: "Coincidence Matrix Engine",
    status: "Active",
    color: "from-indigo-400 to-purple-400"
  },
  {
    id: "geospatial",
    name: "Geospatial & Geofencing Agent",
    role: "IMBL Boundary Clearance & A* Safe Routing",
    model: "Geodesic Haversine & A* Grid",
    status: "Enforcing",
    color: "from-rose-400 to-red-500"
  },
  {
    id: "synthesis",
    name: "Neural Synthesis & Multilingual Agent",
    role: "Indic Vernacular Grounding & Provenance PDF",
    model: "8-Language NMT & TTS",
    status: "Ready",
    color: "from-cyan-400 to-blue-600"
  }
];

export const AgentDAGStudio: React.FC<AgentDAGStudioProps> = ({
  satellites,
  latestResponse,
  isLoading,
  onSendMessage,
  currentLang
}) => {
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleSpeak = (text: string, voiceCode: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceCode || 'en-IN';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="relative w-full min-h-screen font-['Outfit',sans-serif] bg-black text-white overflow-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* Holographic Beams Dynamic Background */}
      <HolographicBeams 
        density={18}
        speed={1.2}
        aberration={3.2}
        opacity={80}
        className="fixed inset-0 pointer-events-none"
      />

      {/* Main Studio Content Area */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-12">
        
        {/* Holographic Hero Header */}
        <div className="text-center space-y-4 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-mono text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>NVIDIA NIM · Meta LLaMA-3.1-8B · 6 Autonomous Domain Agents</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white/95 to-white/35 drop-shadow-[0_0_40px_rgba(255,255,255,0.3)] select-none"
          >
            Autonomous Multi-Agent DAG
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-sm sm:text-base md:text-lg text-zinc-300 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            Decomposes complex maritime intent into parallel asynchronous subtasks across satellite telemetry, ocean thermal-chlorophyll front correlation, IMBL geofencing, and Indic vernacular synthesis.
          </motion.p>
        </div>

        {/* Interactive Query Launcher */}
        <div className="max-w-3xl mx-auto space-y-4">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about PFZ coordinates, sea safety, border clearance..."
              className="w-full pl-6 pr-28 py-4 rounded-full bg-zinc-900/80 border border-white/20 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-xl shadow-2xl transition-all text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="absolute right-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all flex items-center space-x-1.5 shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
              ) : (
                <>
                  <span>Execute</span>
                  <Send className="w-3.5 h-3.5 text-black" />
                </>
              )}
            </button>
          </form>

          {/* Preset Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {PRESET_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(preset.query)}
                disabled={isLoading}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white transition-all backdrop-blur-md cursor-pointer active:scale-95 whitespace-nowrap"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Domain Agent Graph Constellation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 tracking-wide">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              <span>Coordinated Domain Agent Constellation</span>
            </h3>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
              6 Active Agent Workers
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOMAIN_AGENTS.map((agent, idx) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 hover:border-cyan-400/40 backdrop-blur-xl transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-black font-black text-xs shadow-md group-hover:scale-105 transition-transform`}>
                    0{idx + 1}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 border border-white/10">
                    {agent.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {agent.name}
                  </h4>
                  <p className="text-xs text-zinc-400 font-normal mt-0.5">
                    {agent.role}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>Engine:</span>
                  <span className="text-zinc-200">{agent.model}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Live Execution Trace & Reasoning Inspector */}
        {latestResponse && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 md:p-8 rounded-3xl bg-zinc-900/80 border border-white/15 backdrop-blur-2xl shadow-2xl space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-widest font-mono">
                    DAG Trace Execution
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    Total Duration: <strong>{latestResponse.execution_metadata.total_latency_ms} ms</strong>
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">
                  Autonomous Reasoning & Provenance Chain
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSpeak(latestResponse.response.tts_speech_text, latestResponse.language.voice_code)}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-cyan-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{isSpeaking ? 'Stop Audio' : `Listen (${latestResponse.language.native})`}</span>
                </button>
              </div>
            </div>

            {/* Individual Step Inspector Cards */}
            <div className="space-y-3.5">
              {latestResponse.evidence_and_provenance.execution_trace.map((step, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-black/50 border border-white/10 hover:border-cyan-500/30 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-cyan-300 flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold font-mono">
                        {idx + 1}
                      </span>
                      <span>{step.agent}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-zinc-400 bg-zinc-900/80 px-2.5 py-0.5 rounded-md border border-white/10">
                      {step.duration_ms} ms
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 font-medium pl-8">
                    {step.thought}
                  </p>

                  <div className="ml-8 p-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-xs font-mono text-emerald-400">
                    ➔ {step.output_summary}
                  </div>
                </div>
              ))}
            </div>

            {/* Final Grounded Synthesis Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-blue-950/30 to-black border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synthesized Marine Advisory ({latestResponse.language.name})</span>
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  Confidence: <strong className="text-emerald-400">{latestResponse.evidence_and_provenance.overall_confidence_percent}%</strong>
                </span>
              </div>

              <div className="text-xs text-zinc-200 leading-relaxed whitespace-pre-line font-normal">
                {latestResponse.response.markdown}
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};
export default AgentDAGStudio;
