import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Compass,
  Waves,
  Fish,
  ShieldCheck,
  Cpu,
  Radio,
  Send,
  Mic,
  ChevronRight,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import KineticGrid from './ui/kinetic-grid';
import { WeatherObservation, PFZHotspot } from '../types';

interface BlueOrbitLandingHeroProps {
  onExplorePlatform: (tab: 'home' | 'chat' | 'map' | 'agent-lab' | 'safety' | 'bulletin') => void;
  weather?: WeatherObservation | null;
  selectedPFZ?: PFZHotspot | null;
  onQuickQuery?: (query: string) => void;
}

export const BlueOrbitLandingHero: React.FC<BlueOrbitLandingHeroProps> = ({
  onExplorePlatform,
  weather,
  selectedPFZ,
  onQuickQuery
}) => {
  const [quickInput, setQuickInput] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) {
      onExplorePlatform('chat');
      return;
    }
    if (onQuickQuery) {
      onQuickQuery(quickInput);
      onExplorePlatform('chat');
    } else {
      onExplorePlatform('chat');
    }
  };

  const quickFeatures = [
    {
      id: 'pfz',
      tab: 'map' as const,
      title: 'Fishing Hotspots (PFZ)',
      desc: selectedPFZ?.name || 'Off Kochi Thermal Front',
      metric: '4.5× Yield Potential',
      icon: Fish,
      color: 'from-blue-600 to-cyan-500',
      badge: 'Oceansat-3'
    },
    {
      id: 'safety',
      tab: 'safety' as const,
      title: 'Sea Safety Barometer',
      desc: weather?.actionable_advice || 'Safe for venture · Wave 1.0m',
      metric: `${weather?.safety_index || 74}/100 Score`,
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-600',
      badge: 'INCOIS Live'
    },
    {
      id: 'gis',
      tab: 'map' as const,
      title: 'GIS Command & IMBL',
      desc: '176 NM Safe Border Clearance',
      metric: 'A* Safe Route',
      icon: Compass,
      color: 'from-purple-600 to-indigo-600',
      badge: 'Geofenced'
    },
    {
      id: 'dag',
      tab: 'agent-lab' as const,
      title: 'Agent DAG Studio',
      desc: '6 Domain Agents in Parallel',
      metric: 'Multi-Agent DAG',
      icon: Cpu,
      color: 'from-rose-500 to-amber-500',
      badge: 'NVIDIA NIM'
    }
  ];

  return (
    <KineticGrid globalColor="light" className="min-h-screen flex flex-col justify-between select-none pb-20 md:pb-6 overflow-y-auto">
      
      {/* Ambient Depth Glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[750px] h-[340px] sm:h-[520px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(14, 165, 233, 0.12) 40%, transparent 70%)',
          filter: 'blur(90px)'
        }}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-8 lg:px-20 pt-20 sm:pt-32 pb-8 max-w-6xl mx-auto w-full pointer-events-auto space-y-6 sm:space-y-8">
        
        {/* Live Satellite Ticker Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-blue-200/80 shadow-xs text-[11px] sm:text-xs font-semibold text-slate-800"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>ISRO Oceansat-3 & INSAT-3DR Telemetry Active</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline font-mono text-blue-600 font-bold">SIH 2026 · PS 26176</span>
        </motion.div>

        {/* Hero Title & Subtitle */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-3 sm:space-y-4 max-w-3xl"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] leading-[1.12] text-slate-900 drop-shadow-xs">
            The Agentic Brain<br />
            for the <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">Indian Ocean</span>
          </h1>

          <p className="text-slate-600 text-xs sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-[1.65]">
            Autonomous multi-agent platform reasoning over ISRO satellite oceanography, SST-chlorophyll thermal fronts, and IMBL geofencing to empower 4 million+ coastal fishermen.
          </p>
        </motion.div>

        {/* Quick Question / Voice Capsule on Home Screen */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-xl"
        >
          <form 
            onSubmit={handleQuickSubmit}
            className="relative flex items-center bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-blue-400 focus-within:border-blue-600 rounded-full px-4 py-2.5 sm:py-3 shadow-lg shadow-blue-500/5 transition-all"
          >
            <Sparkles className="w-4 h-4 text-blue-600 mr-2.5 shrink-0" />
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="Ask anything in English, हिन्दी, தமிழ்..."
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
            />
            <button
              type="submit"
              className="px-3.5 sm:px-4 py-1.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <span>Ask AI</span>
              <Send className="w-3 h-3 text-white" />
            </button>
          </form>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-md sm:max-w-none"
        >
          <button 
            onClick={() => onExplorePlatform('chat')}
            className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center space-x-2 group"
          >
            <Sparkles className="w-4 h-4 text-cyan-300 group-hover:rotate-12 transition-transform" />
            <span>Launch AI Decision Studio</span>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button 
            onClick={() => onExplorePlatform('map')}
            className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer shadow-xs"
          >
            <Compass className="w-4 h-4 text-blue-600" />
            <span>GIS Command Map</span>
          </button>
        </motion.div>

        {/* Interactive Feature Cards Grid (Optimized for Mobile Touch) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 w-full text-left pt-2"
        >
          {quickFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => onExplorePlatform(feat.tab)}
                className="p-3.5 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 hover:border-blue-400 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-2 active:scale-98"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform`}>
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    {feat.badge}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {feat.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-blue-700 font-bold">
                  <span>{feat.metric}</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-slate-400" />
                </div>
              </div>
            );
          })}
        </motion.div>

      </main>

      {/* Bottom Footer Strip */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 py-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-slate-500 gap-1.5 shrink-0">
        <div>
          Created by <strong className="text-slate-700 font-medium">Team Runtime Terror</strong> for ISRO · Smart India Hackathon 2026
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          Oceansat-3 · INSAT-3DR · INCOIS OSF
        </div>
      </footer>
    </KineticGrid>
  );
};

export const OrcaLandingHero = BlueOrbitLandingHero;
