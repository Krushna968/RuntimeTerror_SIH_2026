import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Satellite, 
  Fish, 
  ShieldCheck, 
  AlertTriangle,
  Cpu,
  Sparkles
} from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface OrcaLandingHeroProps {
  onExplorePlatform: (tab: 'chat' | 'map' | 'agent-lab' | 'safety' | 'bulletin') => void;
}

export const OrcaLandingHero: React.FC<OrcaLandingHeroProps> = ({
  onExplorePlatform
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse coordinate tracker for interactive spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 25, stiffness: 120 });
  const smoothMouseY = useSpring(mouseY, { damping: 25, stiffness: 120 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Subtle bioluminescent satellite/oceanic constellation particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 0.6,
      opacity: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.6 ? '#06b6d4' : Math.random() > 0.3 ? '#3b82f6' : '#ec4899'
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle nodes & proximity connection threads
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#06b6d4';
            ctx.globalAlpha = (1 - dist / 130) * 0.15;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full bg-[#07090e] text-white flex flex-col justify-between overflow-hidden font-['Outfit',sans-serif] selection:bg-cyan-500 selection:text-slate-950"
    >
      {/* 1. Interactive Dynamic Cursor Follower Spotlight */}
      <motion.div
        className="pointer-events-none absolute w-[550px] h-[550px] rounded-full z-0 opacity-40 blur-[100px]"
        style={{
          x: smoothMouseX,
          y: smoothMouseY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, rgba(59, 130, 246, 0.2) 40%, rgba(236, 72, 153, 0.1) 65%, transparent 80%)'
        }}
      />

      {/* 2. Dynamic Floating Aurora Orbs (Endlessly Breathing & Morphed) */}
      {/* Orb 1: Cyan / Emerald Lagoon (Bottom-Left) */}
      <motion.div 
        animate={{
          x: [0, 45, -30, 0],
          y: [0, -35, 20, 0],
          scale: [1, 1.2, 0.95, 1],
          rotate: [0, 15, -10, 0]
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -bottom-36 -left-36 w-[850px] h-[750px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.5) 0%, rgba(59, 130, 246, 0.3) 40%, rgba(16, 185, 129, 0.15) 65%, transparent 75%)',
          filter: 'blur(80px)'
        }}
      />

      {/* Orb 2: Neon Magenta / Royal Violet (Bottom-Right) */}
      <motion.div 
        animate={{
          x: [0, -50, 30, 0],
          y: [0, -40, 25, 0],
          scale: [1, 1.25, 0.9, 1],
          rotate: [0, -20, 10, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -bottom-32 -right-32 w-[900px] h-[800px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.35) 0%, rgba(99, 102, 241, 0.4) 40%, rgba(59, 130, 246, 0.2) 65%, transparent 80%)',
          filter: 'blur(90px)'
        }}
      />

      {/* Orb 3: Central Deep Oceanic Wave Pulse */}
      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.35, 0.6, 0.35]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(6, 182, 212, 0.12) 45%, transparent 70%)',
          filter: 'blur(100px)'
        }}
      />

      {/* 3. Subtle Particle Constellation Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-0 opacity-60" 
      />

      {/* 4. Hero Centerpiece Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-16 max-w-5xl mx-auto">
        {/* Eyebrow Badge with Pulse */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="text-zinc-400 font-medium text-sm sm:text-base tracking-wide flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full bg-zinc-900/60 border border-zinc-800 backdrop-blur-md shadow-sm">
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

          {/* Levitating 3D Translucent Neon Prism Pointer */}
          <motion.div 
            animate={{
              y: [0, -10, 0],
              rotate: [0, 2, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative inline-flex items-center justify-center mx-1 sm:mx-2 group"
          >
            {/* Ambient drop glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 rounded-3xl filter blur-xl opacity-80 group-hover:opacity-100 transition-opacity" />
            
            <svg 
              viewBox="0 0 120 120" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 drop-shadow-[0_15px_30px_rgba(6,182,212,0.6)] transform hover:scale-110 hover:rotate-3 transition-transform duration-300 cursor-pointer"
              onClick={() => onExplorePlatform('chat')}
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
          </motion.div>

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
            onClick={() => onExplorePlatform('chat')}
            className="px-7 py-3 rounded-full text-sm font-bold text-slate-950 bg-white hover:bg-zinc-100 transition-all shadow-[0_0_25px_rgba(255,255,255,0.35)] active:scale-95 cursor-pointer flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span>Launch AI Chatbot</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </button>

          <button 
            onClick={() => onExplorePlatform('map')}
            className="px-7 py-3 rounded-full text-sm font-semibold text-zinc-200 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-cyan-400 transition-all flex items-center space-x-2 active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <span>GIS Command Map</span>
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
            className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-cyan-400/40 hover:bg-zinc-900/90 transition-all cursor-pointer text-left space-y-1 group backdrop-blur-md"
          >
            <div className="flex items-center space-x-2 text-cyan-400">
              <Fish className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">PFZ Analytics</span>
            </div>
            <p className="text-[11px] text-zinc-400">Oceansat-3 SST × Chlorophyll Fronts</p>
          </div>

          <div 
            onClick={() => onExplorePlatform('safety')}
            className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-emerald-400/40 hover:bg-zinc-900/90 transition-all cursor-pointer text-left space-y-1 group backdrop-blur-md"
          >
            <div className="flex items-center space-x-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">0-100 Sea Safety</span>
            </div>
            <p className="text-[11px] text-zinc-400">Cyclone Tracking & Wave Forecast</p>
          </div>

          <div 
            onClick={() => onExplorePlatform('map')}
            className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-red-400/40 hover:bg-zinc-900/90 transition-all cursor-pointer text-left space-y-1 group backdrop-blur-md"
          >
            <div className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">IMBL Geofence</span>
            </div>
            <p className="text-[11px] text-zinc-400">Sri Lanka & Pak Border Buffers</p>
          </div>

          <div 
            onClick={() => onExplorePlatform('agent-lab')}
            className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-pink-400/40 hover:bg-zinc-900/90 transition-all cursor-pointer text-left space-y-1 group backdrop-blur-md"
          >
            <div className="flex items-center space-x-2 text-pink-400">
              <Cpu className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">NVIDIA LLM Engine</span>
            </div>
            <p className="text-[11px] text-zinc-400">Meta Llama-3.1-8B Vernacular</p>
          </div>
        </motion.div>
      </main>

      {/* 5. Bottom Footer Strip */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-zinc-800/40 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
        <div>
          Created by <strong>Team Runtime Terror</strong> for ISRO · SIH 26176
        </div>
        <div className="flex items-center space-x-6 text-zinc-400">
          <span onClick={() => onExplorePlatform('chat')} className="hover:text-white cursor-pointer transition-colors">AI Chatbot</span>
          <span onClick={() => onExplorePlatform('map')} className="hover:text-white cursor-pointer transition-colors">GIS Command</span>
          <span onClick={() => onExplorePlatform('agent-lab')} className="hover:text-white cursor-pointer transition-colors">Agent DAG</span>
          <span onClick={() => onExplorePlatform('safety')} className="hover:text-white cursor-pointer transition-colors">Safety Barometer</span>
          <span onClick={() => onExplorePlatform('bulletin')} className="hover:text-white cursor-pointer transition-colors">Advisory Bulletin</span>
        </div>
      </footer>
    </div>
  );
};
