import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface HolographicBeamsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Theme mode: 'dark' or 'light'
   * Default: 'light'
   */
  theme?: 'dark' | 'light';
  /**
   * Density of the light pillars.
   * Default: 15
   */
  density?: number;
  /**
   * Speed of the animation.
   * Default: 1.5
   */
  speed?: number;
  /**
   * Intensity of the chromatic aberration (RGB shift).
   * Default: 3
   */
  aberration?: number;
  /**
   * Base color weight (mostly influences the center white-hot area).
   * Default: 80 (opacity percentage)
   */
  opacity?: number;
}

export const HolographicBeams: React.FC<HolographicBeamsProps> = ({
  className,
  theme = 'light',
  density = 15,
  speed = 1.5,
  aberration = 3,
  opacity = 80,
  style,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.offsetWidth;
    let height = container.offsetHeight;
    let time = 0;
    let animationFrameId: number;

    const isLight = theme === 'light';

    // --- NOISE GENERATOR (Sine Superposition) ---
    const noise = (x: number, t: number) => {
      return (
        Math.sin(x * 0.01 + t) +
        Math.sin(x * 0.03 + t * 2) * 0.5 +
        Math.sin(x * 0.1 + t * 4) * 0.25
      ) / 1.75; // Normalize roughly to -1..1
    };

    const resize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const drawBeam = (x: number, t: number, color: string, widthMod: number) => {
      const n = noise(x, t * 0.5);
      const beamHeight = height * (0.65 + n * 0.35); 
      const beamWidth = (width / density) * widthMod;

      const gradient = ctx.createLinearGradient(x, height, x, height - beamHeight);
      gradient.addColorStop(0, color); // Base
      gradient.addColorStop(1, "transparent"); // Tip

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(x - beamWidth / 2, height);
      ctx.lineTo(x + beamWidth / 2, height);
      ctx.lineTo(x + beamWidth, height - beamHeight);
      ctx.lineTo(x - beamWidth, height - beamHeight);
      ctx.fill();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // On light theme, use source-over for rich vivid jewel tones; on dark, use screen for glowing additive blending
      ctx.globalCompositeOperation = isLight ? "source-over" : "screen";

      time += 0.01 * speed;
      const beamWidth = width / density;

      for (let i = 0; i <= density; i++) {
        const x = i * beamWidth;
        
        if (isLight) {
          // 1. CRIMSON / RUBY RED CHANNEL (Shifted Left) - Rich and vivid
          const rAlpha = (opacity / 100) * (0.45 + 0.45 * Math.cos(i * 0.5 + time));
          drawBeam(
              x - aberration, 
              time + i * 0.1, 
              `rgba(225, 29, 72, ${rAlpha * 0.45})`, 
              1.6
          );

          // 2. VIOLET / INDIGO / PURPLE CHANNEL (Shifted Right) - Rich chromatic shift
          const bAlpha = (opacity / 100) * (0.45 + 0.45 * Math.sin(i * 0.6 + time * 1.1));
          drawBeam(
              x + aberration, 
              time + i * 0.12 + 10, 
              `rgba(99, 102, 241, ${bAlpha * 0.45})`, 
              1.6
          );

          // 3. ELECTRIC CYAN / TURQUOISE CHANNEL (Center Core)
          const coreAlpha = (opacity / 100) * (0.5 + 0.35 * Math.sin(i * 0.3 - time));
          drawBeam(
              x, 
              time + i * 0.1 + 5, 
              `rgba(6, 182, 212, ${coreAlpha * 0.38})`, 
              0.9
          );
        } else {
          // Dark Hologram Mode (Pure RGB)
          const rAlpha = (opacity / 100) * (0.5 + 0.5 * Math.cos(i * 0.5 + time));
          drawBeam(
              x - aberration, 
              time + i * 0.1, 
              `rgba(255, 0, 0, ${rAlpha * 0.5})`, 
              1.5
          );

          const bAlpha = (opacity / 100) * (0.5 + 0.5 * Math.sin(i * 0.6 + time * 1.1));
          drawBeam(
              x + aberration, 
              time + i * 0.12 + 10, 
              `rgba(0, 50, 255, ${bAlpha * 0.5})`, 
              1.5
          );

          const coreAlpha = (opacity / 100) * (0.6 + 0.4 * Math.sin(i * 0.3 - time));
          drawBeam(
              x, 
              time + i * 0.1 + 5, 
              `rgba(200, 255, 255, ${coreAlpha * 0.3})`, 
              0.8
          );
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, density, speed, aberration, opacity]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 z-0 overflow-hidden",
        theme === 'light' ? "bg-[#fcfbf8]" : "bg-black",
        className
      )}
      style={style}
      {...props}
    >
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full filter blur-[6px]" // Soft holographic diffusion
      />
      
      {/* Texture Overlay (Scanlines) for extra Holographic feel */}
      <div 
        className={cn(
          "absolute inset-0 z-10 pointer-events-none",
          theme === 'light' ? "opacity-10" : "opacity-20"
        )}
        style={{
            backgroundImage: theme === 'light'
              ? "linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.06) 50%), linear-gradient(90deg, rgba(225,29,72,0.05), rgba(99,102,241,0.03), rgba(6,182,212,0.05))"
              : "linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,1) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))",
            backgroundSize: "100% 4px, 3px 100%"
        }}
      />
      
      {/* Vignette */}
      <div className={cn(
        "absolute inset-0 z-20",
        theme === 'light'
          ? "bg-[radial-gradient(circle_at_center,transparent_0%,rgba(252,251,248,0.5)_100%)]"
          : "bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]"
      )} />
    </div>
  );
};

export default HolographicBeams;
