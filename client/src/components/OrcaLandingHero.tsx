import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Compass
} from 'lucide-react';
import { motion } from 'framer-motion';
import KineticGrid from './ui/kinetic-grid';

interface OrcaLandingHeroProps {
  onExplorePlatform: (tab: 'chat' | 'map' | 'agent-lab' | 'safety' | 'bulletin') => void;
}

export const OrcaLandingHero: React.FC<OrcaLandingHeroProps> = ({
  onExplorePlatform
}) => {
  return (
    <KineticGrid globalColor="default" className="min-h-screen h-screen flex flex-col justify-between select-none">
      
      {/* Subtle Ambient Depth Glow */}
      <div 
        className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, rgba(6, 182, 212, 0.05) 45%, transparent 70%)',
          filter: 'blur(100px)'
        }}
      />

      {/* Main Left-Aligned Calibrated Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-start justify-center text-left px-6 sm:px-12 lg:px-20 pt-32 sm:pt-40 pb-16 max-w-7xl mx-auto w-full pointer-events-auto">
        
        {/* Calibrated Display Headline & Subtitle */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4 max-w-3xl"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12] select-none text-white drop-shadow-sm">
            The Agentic Brain<br />
            for the <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">Indian Ocean</span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl font-normal leading-relaxed pt-1">
            Autonomous multi-agent platform reasoning over ISRO satellite oceanography, SST-chlorophyll thermal fronts, and IMBL geofencing to empower 4 million+ coastal fishermen.
          </p>
        </motion.div>

        {/* Calibrated Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3.5"
        >
          <button 
            onClick={() => onExplorePlatform('chat')}
            className="px-6 py-3 rounded-full text-sm font-semibold text-zinc-950 bg-white hover:bg-zinc-100 transition-all shadow-md active:scale-95 cursor-pointer flex items-center space-x-2 group"
          >
            <Sparkles className="w-4 h-4 text-cyan-600 group-hover:rotate-12 transition-transform" />
            <span>Launch AI Decision Studio</span>
            <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button 
            onClick={() => onExplorePlatform('map')}
            className="px-6 py-3 rounded-full text-sm font-medium text-zinc-300 bg-zinc-900/90 hover:text-white hover:bg-zinc-800 border border-zinc-700/80 transition-all flex items-center space-x-2 active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>GIS Command Map</span>
          </button>
        </motion.div>
      </main>

      {/* Bottom Footer Strip */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2 shrink-0">
        <div>
          Created by <strong className="text-zinc-300">Team Runtime Terror</strong> for ISRO · Smart India Hackathon 2026
        </div>
        <div className="flex items-center space-x-6 text-zinc-400">
          <span onClick={() => onExplorePlatform('chat')} className="hover:text-zinc-200 cursor-pointer transition-colors">AI Chatbot</span>
          <span onClick={() => onExplorePlatform('map')} className="hover:text-zinc-200 cursor-pointer transition-colors">GIS Command</span>
        </div>
      </footer>
    </KineticGrid>
  );
};
