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
   * Default: 30
   */
  density?: number;
  /**
   * Speed of the animation.
   * Default: 1
   */
  speed?: number;
  /**
   * Intensity of the chromatic aberration (RGB shift).
   * Default: 2.5
   */
  aberration?: number;
  /**
   * Base color weight (mostly influences the center white-hot area).
   * Default: 50 (opacity percentage)
   */
  opacity?: number;
}

export const HolographicBeams: React.FC<HolographicBeamsProps> = ({
  className,
  theme = 'light',
  density = 30,
  speed = 1,
  aberration = 2.5,
  opacity = 50,
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

    // --- NOISE GENERATOR (Sine Superposition) ---
    // A cheap way to get smooth, organic noise without a heavy library
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
      // Calculate height based on noise
      // We use different noise offsets for "chaotic" look
      const n = noise(x, t * 0.5);
      
      // Beam Geometry
      // We want them to fade out at the top, like spotlights
      const beamHeight = height * (0.6 + n * 0.4); 
      const beamWidth = (width / density) * widthMod;

      const gradient = ctx.createLinearGradient(x, height, x, height - beamHeight);
      gradient.addColorStop(0, color); // Base
      gradient.addColorStop(1, "transparent"); // Tip

      ctx.fillStyle = gradient;
      ctx.beginPath();
      // Draw a long thin triangle/trapezoid
      ctx.moveTo(x - beamWidth / 2, height);
      ctx.lineTo(x + beamWidth / 2, height);
      ctx.lineTo(x + beamWidth, height - beamHeight);
      ctx.lineTo(x - beamWidth, height - beamHeight);
      ctx.fill();
    };

    const isLight = theme === 'light';

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Enable additive blending on dark or smooth overlay on light
      ctx.globalCompositeOperation = isLight ? "source-over" : "screen";

      time += 0.01 * speed;
      const beamWidth = width / density;

      for (let i = 0; i <= density; i++) {
        const x = i * beamWidth;
        
        if (isLight) {
          // Light Mode Colors (Oceanic Azure, Electric Cyan, Emerald)
          const cAlpha = (opacity / 100) * (0.35 + 0.35 * Math.cos(i * 0.5 + time));
          drawBeam(
              x - aberration, 
              time + i * 0.1, 
              `rgba(14, 165, 233, ${cAlpha * 0.35})`, 
              1.6
          );

          const bAlpha = (opacity / 100) * (0.35 + 0.35 * Math.sin(i * 0.6 + time * 1.1));
          drawBeam(
              x + aberration, 
              time + i * 0.12 + 10, 
              `rgba(59, 130, 246, ${bAlpha * 0.4})`, 
              1.6
          );

          const coreAlpha = (opacity / 100) * (0.4 + 0.3 * Math.sin(i * 0.3 - time));
          drawBeam(
              x, 
              time + i * 0.1 + 5, 
              `rgba(20, 184, 166, ${coreAlpha * 0.3})`, 
              1.0
          );
        } else {
          // Dark Holographic RGB mode
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
        className="block w-full h-full filter blur-[5px]" // Soft blur to merge the glowing channels
      />
      
      {/* Texture Overlay (Scanlines) for extra Holographic feel */}
      <div 
        className={cn(
          "absolute inset-0 z-10 pointer-events-none",
          theme === 'light' ? "opacity-5" : "opacity-20"
        )}
        style={{
            backgroundImage: theme === 'light'
              ? "linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.04) 50%), linear-gradient(90deg, rgba(14,165,233,0.03), rgba(0,0,0,0), rgba(59,130,246,0.03))"
              : "linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,1) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))",
            backgroundSize: "100% 4px, 3px 100%"
        }}
      />
      
      {/* Vignette */}
      <div className={cn(
        "absolute inset-0 z-20",
        theme === 'light'
          ? "bg-[radial-gradient(circle_at_center,transparent_0%,rgba(245,248,252,0.4)_100%)]"
          : "bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]"
      )} />
    </div>
  );
};

export default HolographicBeams;
