import React, { useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Compass 
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

  // Interactive mouse tracker for dynamic 3D tilt and fluid spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 120 });
  const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 120 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Dynamic 3D Bathymetric Ocean Currents & Particle Canvas with Bright Bioluminescence
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

    // Oceanic particle grid
    const cols = 30;
    const rows = 18;
    let stepX = width / cols;
    let stepY = height / rows;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.018;

      stepX = width / cols;
      stepY = height / rows;

      // Draw bright undulating oceanic wave current mesh
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const baseX = i * stepX + stepX / 2;
          const baseY = j * stepY + stepY / 2;

          // Wave displacement formula
          const wave = Math.sin(time + i * 0.28) * Math.cos(time + j * 0.22) * 22;
          const posX = baseX + Math.cos(time * 0.9 + j * 0.25) * 10;
          const posY = baseY + wave;

          // Bright bioluminescent glow node
          const distToCenter = Math.hypot(posX - width / 2, posY - height / 2);
          const maxDist = Math.hypot(width / 2, height / 2);
          const alpha = Math.max(0.18, 0.75 * (1 - distToCenter / maxDist));

          ctx.beginPath();
          ctx.arc(posX, posY, 2.0, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? '#00f0ff' : '#38bdf8';
          ctx.globalAlpha = alpha;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#00f0ff';
          ctx.fill();
          ctx.shadowBlur = 0;

          // Connect adjacent nodes with current lines
          if (i < cols - 1) {
            const nextWave = Math.sin(time + (i + 1) * 0.28) * Math.cos(time + j * 0.22) * 22;
            const nextX = (i + 1) * stepX + stepX / 2 + Math.cos(time * 0.9 + j * 0.25) * 10;
            const nextY = baseY + nextWave;

            ctx.beginPath();
            ctx.moveTo(posX, posY);
            ctx.lineTo(nextX, nextY);
            ctx.strokeStyle = '#06b6d4';
            ctx.globalAlpha = alpha * 0.5;
            ctx.lineWidth = 1.0;
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
      className="relative min-h-screen w-full bg-[#050811] text-white flex flex-col justify-between overflow-hidden font-['Outfit',sans-serif] selection:bg-cyan-500 selection:text-slate-950"
    >
      {/* 1. Interactive Dynamic Cursor Follower Spotlight (Ultra-Bright) */}
      <motion.div
        className="pointer-events-none absolute w-[750px] h-[750px] rounded-full z-0 opacity-70 blur-[100px]"
        style={{
          x: smoothMouseX,
          y: smoothMouseY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.5) 0%, rgba(59, 130, 246, 0.35) 40%, rgba(147, 51, 234, 0.2) 65%, transparent 80%)'
        }}
      />

      {/* 2. Top-Center High-Illumination Oceanic Spotlight */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at top center, rgba(6, 182, 212, 0.45) 0%, rgba(59, 130, 246, 0.35) 40%, rgba(99, 102, 241, 0.15) 65%, transparent 80%)',
          filter: 'blur(90px)'
        }}
      />

      {/* 3. Bottom-Left Vibrant Cyan/Emerald Marine Front Light */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-24 -left-24 w-[850px] h-[650px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.4) 0%, rgba(16, 185, 129, 0.25) 45%, transparent 75%)',
          filter: 'blur(95px)'
        }}
      />

      {/* 4. Bottom-Right Vivid Royal Blue/Violet Light */}
      <motion.div 
        animate={{
          scale: [1, 1.25, 1],
          x: [0, -30, 0],
          y: [0, -25, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-24 -right-24 w-[900px] h-[700px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(236, 72, 153, 0.25) 45%, transparent 75%)',
          filter: 'blur(95px)'
        }}
      />

      {/* 5. Glowing Particle Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-0 opacity-80" 
      />

      {/* 6. Main Ultra-Clean, Focused Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-36 pb-24 max-w-5xl mx-auto w-full my-auto">
        {/* Cinematic High-Impact Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-5 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] select-none text-white drop-shadow-lg">
            The Agentic Brain for the <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,240,255,0.6)]">Indian Ocean</span>
          </h1>

          <p className="text-zinc-200 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-normal leading-relaxed pt-2">
            Autonomous multi-agent platform reasoning over ISRO satellite oceanography, SST-chlorophyll thermal fronts, and IMBL geofencing to empower 4 million+ coastal fishermen.
          </p>
        </motion.div>

        {/* Primary CTA Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <button 
            onClick={() => onExplorePlatform('chat')}
            className="px-8 py-4 rounded-full text-sm font-bold text-slate-950 bg-white hover:bg-zinc-100 transition-all shadow-[0_0_35px_rgba(0,240,255,0.5)] active:scale-95 cursor-pointer flex items-center space-x-2.5 group"
          >
            <Sparkles className="w-4 h-4 text-cyan-600 group-hover:rotate-45 transition-transform" />
            <span>Launch AI Decision Studio</span>
            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={() => onExplorePlatform('map')}
            className="px-8 py-4 rounded-full text-sm font-semibold text-white bg-zinc-900/90 hover:bg-zinc-800 border border-cyan-400/50 hover:border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all flex items-center space-x-2 active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>GIS Command Map</span>
          </button>
        </motion.div>
      </main>

      {/* 7. Bottom Footer Strip */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-3">
        <div>
          Created by <strong className="text-zinc-200">Team Runtime Terror</strong> for ISRO · Smart India Hackathon 2026
        </div>
        <div className="flex items-center space-x-6 text-zinc-300">
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
