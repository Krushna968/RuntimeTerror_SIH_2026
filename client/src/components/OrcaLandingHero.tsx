import React from 'react';
import { 
  ArrowRight, 
  Satellite, 
  Fish, 
  ShieldCheck, 
  AlertTriangle,
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

interface OrcaLandingHeroProps {
  onExplorePlatform: (tab: 'map' | 'agent-lab' | 'safety' | 'bulletin') => void;
}

export const OrcaLandingHero: React.FC<OrcaLandingHeroProps> = ({
  onExplorePlatform
}) => {
  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full bg-[#07090e] text-white flex flex-col justify-between overflow-hidden font-['Outfit',sans-serif] selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. Atmospheric Gradient Lighting Layers */}
      {/* Bottom-Left Directional Spotlight (Oceanic Cyan / Magenta Beam projecting diagonally) */}
      <div 
        className="absolute -bottom-28 -left-28 w-[800px] h-[650px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at bottom left, rgba(6, 182, 212, 0.45) 0%, rgba(59, 130, 246, 0.3) 35%, rgba(236, 72, 153, 0.18) 60%, transparent 75%)',
          filter: 'blur(75px)',
          transform: 'rotate(-15deg)'
        }}
      />

      {/* Bottom-Right Ambient Royal Blue / Indigo Glow */}
      <div 
        className="absolute -bottom-24 -right-24 w-[850px] h-[700px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at bottom right, rgba(59, 130, 246, 0.5) 0%, rgba(99, 102, 241, 0.35) 40%, rgba(16, 185, 129, 0.15) 65%, transparent 80%)',
          filter: 'blur(85px)'
        }}
      />

      {/* Central Soft Ambient Glow directly behind headline */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)',
          filter: 'blur(95px)'
        }}
      />

      {/* 2. Hero Centerpiece Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-12 pb-16 max-w-5xl mx-auto">
        {/* Eyebrow Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="text-zinc-400 font-medium text-sm sm:text-base tracking-wide flex items-center justify-center space-x-2">
            <Satellite className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Autonomous Marine Intelligence for ISRO & Blue Economy</span>
          </span>
        </motion.div>

        {/* Massive Display Headline ("Navigate [3D Prism Beacon] Safer") */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex items-center justify-center flex-wrap gap-x-3 sm:gap-x-5 leading-none tracking-tight select-none"
        >
          {/* Left Word: "Navigate" */}
          <span className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-white tracking-tight drop-shadow-2xl">
            Navigate
          </span>

          {/* Centerpiece 3D Translucent Neon Prism Pointer */}
          <div className="relative inline-flex items-center justify-center mx-1 sm:mx-2 group">
            {/* Ambient drop glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 rounded-3xl filter blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
            
            <svg 
              viewBox="0 0 120 120" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 drop-shadow-[0_15px_30px_rgba(6,182,212,0.6)] transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => onExplorePlatform('map')}
            >
              <defs>
                <linearGradient id="orca-prism-front" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00F0FF" />
                  <stop offset="45%" stopColor="#3B82F6" />
                  <stop offset="75%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#FF3B81" />
                </linearGradient>
                <linearGradient id="orca-prism-top" x1="30" y1="10" x2="100" y2="60" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#67E8F9" />
                  <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>
                <linearGradient id="orca-prism-glass" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                </linearGradient>
              </defs>

              <path 
                d="M22 28C22 23.5787 26.5816 20.8037 30.4199 23.0118L102.42 64.4118C106.258 66.6199 106.258 72.1558 102.42 74.3639L30.4199 115.764C26.5816 117.972 22 115.197 22 110.776V28Z" 
                fill="url(#orca-prism-front)"
              />

              <path 
                d="M22 28C22 23.5787 26.5816 20.8037 30.4199 23.0118L102.42 64.4118C95 62 65 52 22 55V28Z" 
                fill="url(#orca-prism-top)"
                opacity="0.85"
              />

              <path 
                d="M24 30L95 68L30 80L24 30Z" 
                fill="url(#orca-prism-glass)"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Right Word: "Safer" */}
          <span className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-white tracking-tight drop-shadow-2xl">
            Safer
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-zinc-300/90 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mt-8 font-normal leading-relaxed text-center"
        >
          Autonomous Agentic AI platform reasoning over ISRO Oceansat-3 satellite data, SST-chlorophyll fronts, and real-time oceanographic feeds for safe navigation and high-yield fisheries.
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4"
        >
          <button 
            onClick={() => onExplorePlatform('map')}
            className="px-7 py-3 rounded-full text-sm font-bold text-slate-950 bg-white hover:bg-zinc-100 transition-all shadow-[0_0_25px_rgba(255,255,255,0.3)] active:scale-95 cursor-pointer flex items-center space-x-2"
          >
            <span>Launch GIS Command Center</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </button>

          <button 
            onClick={() => onExplorePlatform('agent-lab')}
            className="px-7 py-3 rounded-full text-sm font-semibold text-zinc-200 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-cyan-400 transition-all flex items-center space-x-2 active:scale-95 cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Explore Multi-Agent DAG</span>
          </button>
        </motion.div>

        {/* Quick Capabilities Grid below CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-14 w-full max-w-4xl"
        >
          <div 
            onClick={() => onExplorePlatform('map')}
            className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-cyan-400/40 hover:bg-zinc-900/90 transition-all cursor-pointer text-left space-y-1 group"
          >
            <div className="flex items-center space-x-2 text-cyan-400">
              <Fish className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">PFZ Analytics</span>
            </div>
            <p className="text-[11px] text-zinc-400">Oceansat-3 SST × Chlorophyll Fronts</p>
          </div>

          <div 
            onClick={() => onExplorePlatform('safety')}
            className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-emerald-400/40 hover:bg-zinc-900/90 transition-all cursor-pointer text-left space-y-1 group"
          >
            <div className="flex items-center space-x-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">0-100 Sea Safety</span>
            </div>
            <p className="text-[11px] text-zinc-400">Cyclone Tracking & Wave Forecast</p>
          </div>

          <div 
            onClick={() => onExplorePlatform('map')}
            className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-red-400/40 hover:bg-zinc-900/90 transition-all cursor-pointer text-left space-y-1 group"
          >
            <div className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">IMBL Geofence</span>
            </div>
            <p className="text-[11px] text-zinc-400">Sri Lanka & Pak Border Buffers</p>
          </div>

          <div 
            onClick={() => onExplorePlatform('agent-lab')}
            className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-pink-400/40 hover:bg-zinc-900/90 transition-all cursor-pointer text-left space-y-1 group"
          >
            <div className="flex items-center space-x-2 text-pink-400">
              <Cpu className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">NVIDIA LLM Engine</span>
            </div>
            <p className="text-[11px] text-zinc-400">Meta Llama-3.1-8B Vernacular</p>
          </div>
        </motion.div>
      </main>

      {/* 3. Bottom Footer Strip */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-zinc-800/40 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
        <div>
          © 2026 <strong>ORCA</strong> · Indian Space Research Organisation (ISRO) · SIH 26176
        </div>
        <div className="flex items-center space-x-6 text-zinc-400">
          <span onClick={() => onExplorePlatform('map')} className="hover:text-white cursor-pointer transition-colors">GIS Command</span>
          <span onClick={() => onExplorePlatform('agent-lab')} className="hover:text-white cursor-pointer transition-colors">Agent DAG</span>
          <span onClick={() => onExplorePlatform('safety')} className="hover:text-white cursor-pointer transition-colors">Safety Barometer</span>
          <span onClick={() => onExplorePlatform('bulletin')} className="hover:text-white cursor-pointer transition-colors">Advisory Bulletin</span>
        </div>
      </footer>
    </div>
  );
};
