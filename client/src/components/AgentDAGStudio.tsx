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
    color: "from-blue-600 to-cyan-500"
  },
  {
    id: "marine_data",
    name: "Marine EO Data Agent",
    role: "Oceansat-3 OCM-3 & INSAT-3DR TIR Ingestion",
    model: "ISRO NRSC Telemetry API",
    status: "Live Sync",
    color: "from-teal-500 to-emerald-500"
  },
  {
    id: "weather_hazard",
    name: "Weather & Marine Hazard Agent",
    role: "Wave, Wind, Squall & Cyclone Analytics",
    model: "IMD / INCOIS Hydrodynamics",
    status: "Operational",
    color: "from-amber-500 to-orange-500"
  },
  {
    id: "ocean_analytics",
    name: "Ocean Analytics & PFZ Engine",
    role: "Thermal-Chlorophyll Front Coincidence & HSI",
    model: "Coincidence Matrix Engine",
    status: "Active",
    color: "from-indigo-600 to-purple-500"
  },
  {
    id: "geospatial",
    name: "Geospatial & Geofencing Agent",
    role: "IMBL Boundary Clearance & A* Safe Routing",
    model: "Geodesic Haversine & A* Grid",
    status: "Enforcing",
    color: "from-rose-500 to-red-600"
  },
  {
    id: "synthesis",
    name: "Neural Synthesis & Multilingual Agent",
    role: "Indic Vernacular Grounding & Provenance PDF",
    model: "8-Language NMT & TTS",
    status: "Ready",
    color: "from-cyan-500 to-blue-600"
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

  const renderFormattedMarkdown = (text: string) => {
    return text.split('\n').map((line, lineIdx) => {
      if (!line.trim()) return <div key={lineIdx} className="h-1.5" />;
      
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={partIdx} className="font-bold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={lineIdx} className="flex items-start space-x-2 pl-2 py-0.5">
            <span className="text-blue-500 font-bold">•</span>
            <span className="text-slate-800">{formattedLine}</span>
          </div>
        );
      }

      return (
        <p key={lineIdx} className="text-slate-800 py-0.5">
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <div className="relative w-full min-h-screen font-sans bg-[#fcfbf8] text-slate-900 overflow-hidden flex flex-col justify-between select-none">
      
      {/* Holographic Beams with Rich Crimson, Indigo, Cyan Chromatic Colors on Bright Background */}
      <HolographicBeams 
        theme="light"
        density={20}
        speed={1.4}
        aberration={3.5}
        opacity={95}
      />

      {/* Main Content Area */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-12 w-full">
        
        {/* Centered Heading */}
        <div className="text-center space-y-3">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="px-4 text-center text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-slate-900 drop-shadow-sm select-none"
          >
            Autonomous Multi-Agent DAG
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="text-slate-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto text-center font-normal leading-relaxed"
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
              className="w-full pl-6 pr-28 py-4 rounded-full bg-white/90 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 backdrop-blur-xl shadow-xl transition-all text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="absolute right-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center space-x-1.5 shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <>
                  <span>Execute</span>
                  <Send className="w-3.5 h-3.5 text-white" />
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
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/80 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 transition-all backdrop-blur-md shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Domain Agent Graph Constellation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 tracking-wide">
              <GitBranch className="w-4 h-4 text-blue-600" />
              <span>Coordinated Domain Agent Constellation</span>
            </h3>
            <span className="text-xs font-mono text-blue-700 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              6 Active Domain Agents
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOMAIN_AGENTS.map((agent, idx) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-5 rounded-2xl bg-white/85 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 backdrop-blur-xl transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-white font-black text-xs shadow-xs group-hover:scale-105 transition-transform`}>
                    0{idx + 1}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {agent.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {agent.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">
                    {agent.role}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Engine:</span>
                  <span className="text-slate-800 font-semibold">{agent.model}</span>
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
            className="p-6 md:p-8 rounded-3xl bg-white/90 border border-slate-200 shadow-xl backdrop-blur-2xl space-y-6 text-slate-900"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-widest font-mono">
                    DAG Trace Execution
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Total Duration: <strong className="text-slate-900">{latestResponse.execution_metadata.total_latency_ms} ms</strong>
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Autonomous Reasoning & Provenance Chain
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSpeak(latestResponse.response.tts_speech_text, latestResponse.language.voice_code)}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-all cursor-pointer shadow-xs"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-blue-700" /> : <Volume2 className="w-3.5 h-3.5 text-blue-700" />}
                  <span>{isSpeaking ? 'Stop Audio' : `Listen (${latestResponse.language.native})`}</span>
                </button>
              </div>
            </div>

            {/* Individual Step Inspector Cards */}
            <div className="space-y-3.5">
              {latestResponse.evidence_and_provenance.execution_trace.map((step, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200 hover:border-blue-300 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-blue-700 flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold font-mono">
                        {idx + 1}
                      </span>
                      <span>{step.agent}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                      {step.duration_ms} ms
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium pl-8">
                    {step.thought}
                  </p>

                  <div className="ml-8 p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-emerald-700">
                    ➔ {step.output_summary}
                  </div>
                </div>
              ))}
            </div>

            {/* Final Grounded Synthesis Box */}
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3 text-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Synthesized Marine Advisory ({latestResponse.language.name})</span>
                </span>
                <span className="text-[11px] font-mono text-slate-600">
                  Confidence: <strong className="text-emerald-700">{latestResponse.evidence_and_provenance.overall_confidence_percent}%</strong>
                </span>
              </div>

              <div className="text-xs text-slate-800 leading-relaxed font-normal">
                {renderFormattedMarkdown(latestResponse.response.markdown)}
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};
export default AgentDAGStudio;
