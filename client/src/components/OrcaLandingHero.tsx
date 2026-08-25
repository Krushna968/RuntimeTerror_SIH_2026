import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Satellite, 
  Fish, 
  ShieldCheck, 
  AlertTriangle,
  Cpu,
  Sparkles,
  Compass,
  Waves,
  Wind,
  Languages,
  Activity,
  Anchor,
  Radio,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface OrcaLandingHeroProps {
  onExplorePlatform: (tab: 'chat' | 'map' | 'agent-lab' | 'safety' | 'bulletin') => void;
}

const LIVE_PORTS = [
  { name: "Kochi Harbour", state: "Kerala", seaStatus: "SAFE", wave: "1.0m", wind: "14 kts", temp: "27.8°C", safetyScore: 88 },
  { name: "Chennai Port", state: "Tamil Nadu", seaStatus: "SAFE", wave: "1.2m", wind: "12 kts", temp: "28.4°C", safetyScore: 85 },
  { name: "Mumbai Sassoon", state: "Maharashtra", seaStatus: "SAFE", wave: "0.9m", wind: "10 kts", temp: "26.9°C", safetyScore: 92 },
  { name: "Visakhapatnam", state: "Andhra Pradesh", seaStatus: "SAFE", wave: "1.3m", wind: "15 kts", temp: "28.1°C", safetyScore: 82 },
  { name: "Porbandar Harbour", state: "Gujarat", seaStatus: "CAUTION", wave: "1.8m", wind: "19 kts", temp: "26.2°C", safetyScore: 68 },
];

export const OrcaLandingHero: React.FC<OrcaLandingHeroProps> = ({
  onExplorePlatform
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPort, setSelectedPort] = useState(LIVE_PORTS[0]);

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

      {/* 6. Main Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 max-w-6xl mx-auto w-full">
        {/* Live Telemetry Ticker Pill with Glow */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center space-x-2.5 px-4 py-2 rounded-full bg-zinc-900/80 border border-cyan-400/40 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.25)]"
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-90"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
          </span>
          <span className="text-xs font-semibold text-zinc-200">
            <strong className="text-white">ISRO Oceansat-3 (EOS-06)</strong> & INSAT-3DR TIR Live Telemetry Synced
          </span>
          <span className="text-xs font-mono font-bold text-slate-950 bg-cyan-400 px-2.5 py-0.5 rounded-full shadow-sm">
            15 PFZ Hotspots
          </span>
        </motion.div>

        {/* Cinematic High-Impact Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-4 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] select-none text-white drop-shadow-lg">
            The Agentic Brain for the <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,240,255,0.6)]">Indian Ocean</span>
          </h1>

          <p className="text-zinc-200 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-normal leading-relaxed pt-2">
            Autonomous multi-agent platform reasoning over ISRO satellite oceanography, SST-chlorophyll thermal fronts, and IMBL geofencing to empower 4 million+ coastal fishermen.
          </p>
        </motion.div>

        {/* Interactive Query Launcher Pills */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto"
        >
          <button
            onClick={() => onExplorePlatform('chat')}
            className="px-4 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-cyan-500/40 hover:border-cyan-400 text-xs font-medium text-zinc-200 hover:text-white transition-all cursor-pointer flex items-center space-x-2 group backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <Fish className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>"Where is the nearest Tuna PFZ from Kochi today?"</span>
            <ChevronRight className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => onExplorePlatform('safety')}
            className="px-4 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-emerald-500/40 hover:border-emerald-400 text-xs font-medium text-zinc-200 hover:text-white transition-all cursor-pointer flex items-center space-x-2 group backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>"Is it safe to venture into the sea tomorrow morning?"</span>
            <ChevronRight className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => onExplorePlatform('map')}
            className="px-4 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-red-500/40 hover:border-red-400 text-xs font-medium text-zinc-200 hover:text-white transition-all cursor-pointer flex items-center space-x-2 group backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
            <span>"Check Sri Lanka IMBL boundary proximity"</span>
            <ChevronRight className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>

        {/* Primary CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-9 flex flex-col sm:flex-row items-center gap-4"
        >
          <button 
            onClick={() => onExplorePlatform('chat')}
            className="px-8 py-3.5 rounded-full text-sm font-bold text-slate-950 bg-white hover:bg-zinc-100 transition-all shadow-[0_0_35px_rgba(0,240,255,0.5)] active:scale-95 cursor-pointer flex items-center space-x-2.5 group"
          >
            <Sparkles className="w-4 h-4 text-cyan-600 group-hover:rotate-45 transition-transform" />
            <span>Launch AI Decision Studio</span>
            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={() => onExplorePlatform('map')}
            className="px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-zinc-900/90 hover:bg-zinc-800 border border-cyan-400/50 hover:border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all flex items-center space-x-2 active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>GIS Command Map</span>
          </button>
        </motion.div>

        {/* 7. Live Coastal Port Safety Telemetry Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-16 w-full max-w-5xl bg-zinc-900/80 border border-cyan-500/30 rounded-3xl p-5 md:p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.15)] text-left space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <Anchor className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Live Indian Coastal Ports Ocean State
              </h3>
            </div>
            <span className="text-xs text-zinc-300 font-medium">
              Click any port to inspect real-time satellite metrics
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {LIVE_PORTS.map((port, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedPort(port);
                  onExplorePlatform('map');
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedPort.name === port.name 
                    ? 'bg-zinc-800/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]' 
                    : 'bg-zinc-950/70 hover:bg-zinc-850 border-zinc-800 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">{port.name}</span>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                    port.seaStatus === 'SAFE' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {port.seaStatus}
                  </span>
                </div>

                <div className="text-[11px] text-zinc-300 font-mono space-y-0.5">
                  <div className="flex justify-between">
                    <span>Wave:</span>
                    <strong className="text-white">{port.wave}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Wind:</span>
                    <strong className="text-white">{port.wind}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>SST:</span>
                    <strong className="text-cyan-300">{port.temp}</strong>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-800">
                  <span>Safety Score</span>
                  <strong className="text-emerald-400 font-mono font-bold">{port.safetyScore}/100</strong>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 8. Four Specialized AI Domain Engine Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 w-full max-w-5xl text-left"
        >
          <div 
            onClick={() => onExplorePlatform('map')}
            className="p-5 rounded-3xl bg-zinc-900/80 hover:bg-zinc-850 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all cursor-pointer space-y-2 group backdrop-blur-md"
          >
            <div className="flex items-center space-x-2 text-cyan-400">
              <Fish className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">PFZ Analytics</h4>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Mathematical gradient correlation (|∇SST| × |∇Chl-a|) from Oceansat-3 identifying 4.5x catch enhancement fronts.
            </p>
          </div>

          <div 
            onClick={() => onExplorePlatform('safety')}
            className="p-5 rounded-3xl bg-zinc-900/80 hover:bg-zinc-850 border border-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] transition-all cursor-pointer space-y-2 group backdrop-blur-md"
          >
            <div className="flex items-center space-x-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">0-100 Sea Barometer</h4>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Real-time wave hazard index, Beaufort wind scale, and Cyclone ASNA radar for decisive safe-venture verdicts.
            </p>
          </div>

          <div 
            onClick={() => onExplorePlatform('map')}
            className="p-5 rounded-3xl bg-zinc-900/80 hover:bg-zinc-850 border border-red-500/30 hover:border-red-400 hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] transition-all cursor-pointer space-y-2 group backdrop-blur-md"
          >
            <div className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">IMBL Geofence</h4>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Automated 3 NM buffer warning for Sri Lanka & Pakistan maritime boundaries preventing unintentional border crossing.
            </p>
          </div>

          <div 
            onClick={() => onExplorePlatform('agent-lab')}
            className="p-5 rounded-3xl bg-zinc-900/80 hover:bg-zinc-850 border border-indigo-500/30 hover:border-indigo-400 hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] transition-all cursor-pointer space-y-2 group backdrop-blur-md"
          >
            <div className="flex items-center space-x-2 text-indigo-400">
              <Cpu className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">NVIDIA NIM DAG</h4>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Meta Llama-3.1-8B cognitive synthesis with 8 Indian regional language translations and voice speech support.
            </p>
          </div>
        </motion.div>
      </main>

      {/* 9. Bottom Footer Strip */}
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
