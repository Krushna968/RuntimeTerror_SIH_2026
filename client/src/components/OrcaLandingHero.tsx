import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Compass
} from 'lucide-react';
import { motion } from 'framer-motion';
import KineticGrid from '@/components/ui/kinetic-grid';

interface OrcaLandingHeroProps {
  onExplorePlatform: (tab: 'chat' | 'map' | 'agent-lab' | 'safety' | 'bulletin') => void;
}

export const OrcaLandingHero: React.FC<OrcaLandingHeroProps> = ({
  onExplorePlatform
}) => {
  return (
    <KineticGrid globalColor="default" className="h-screen max-h-screen flex flex-col justify-between select-none">
      
      {/* Dynamic Ambient Background Glow Highlights */}
      <div 
        className="absolute top-0 left-1/3 -translate-x-1/2 w-[900px] h-[550px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at top center, rgba(6, 182, 212, 0.25) 0%, rgba(59, 130, 246, 0.15) 45%, transparent 75%)',
          filter: 'blur(90px)'
        }}
      />

      {/* Main Left-Aligned Calibrated Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-start justify-center text-left px-6 sm:px-12 lg:px-20 pt-28 pb-8 max-w-7xl mx-auto w-full my-auto pointer-events-auto">

        {/* Calibrated Display Headline */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-4 max-w-3xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] select-none text-white drop-shadow-md">
            The Agentic Brain<br />
            for the <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,240,255,0.5)]">Indian Ocean</span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-2xl font-normal leading-relaxed pt-1">
            Autonomous multi-agent platform reasoning over ISRO satellite oceanography, SST-chlorophyll thermal fronts, and IMBL geofencing to empower 4 million+ coastal fishermen.
          </p>
        </motion.div>

        {/* Primary CTA Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3.5"
        >
          <button 
            onClick={() => onExplorePlatform('chat')}
            className="px-7 py-3.5 rounded-full text-sm font-bold text-zinc-950 bg-white hover:bg-zinc-100 transition-all shadow-[0_0_30px_rgba(0,240,255,0.4)] active:scale-95 cursor-pointer flex items-center space-x-2.5 group"
          >
            <Sparkles className="w-4 h-4 text-cyan-600 group-hover:rotate-45 transition-transform" />
            <span>Launch AI Decision Studio</span>
            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={() => onExplorePlatform('map')}
            className="px-7 py-3.5 rounded-full text-sm font-semibold text-white bg-zinc-900/80 hover:bg-zinc-800 border border-white/20 hover:border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all flex items-center space-x-2 active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>GIS Command Map</span>
          </button>
        </motion.div>
      </main>

      {/* Bottom Footer Strip */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-2">
        <div>
          Created by <strong className="text-zinc-200">Team Runtime Terror</strong> for ISRO · Smart India Hackathon 2026
        </div>
        <div className="flex items-center space-x-6 text-zinc-300">
          <span onClick={() => onExplorePlatform('chat')} className="hover:text-white cursor-pointer transition-colors">AI Chatbot</span>
          <span onClick={() => onExplorePlatform('map')} className="hover:text-white cursor-pointer transition-colors">GIS Command</span>
        </div>
      </footer>
    </KineticGrid>
  );
};
