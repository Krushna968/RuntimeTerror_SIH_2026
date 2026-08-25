import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Wind, 
  Waves, 
  Zap, 
  Compass, 
  Eye, 
  CheckCircle2, 
  XCircle,
  Radio
} from 'lucide-react';
import { WeatherObservation } from '../types';

interface SeaSafetyBarometerProps {
  weather: WeatherObservation | null;
  portName: string;
}

export const SeaSafetyBarometer: React.FC<SeaSafetyBarometerProps> = ({
  weather,
  portName
}) => {
  if (!weather) {
    return (
      <div className="p-6 glass-panel rounded-2xl text-center text-xs text-slate-400">
        Loading real-time marine meteorological telemetry...
      </div>
    );
  }

  const isSafe = weather.safety_status === 'SAFE_FOR_VENTURE';
  const isCaution = weather.safety_status === 'EXERCISE_CAUTION';

  return (
    <div className="space-y-4">
      {/* Top Main Verdict Card */}
      <div className={`glass-panel p-5 rounded-2xl border ${
        isSafe ? 'border-emerald-500/40 bg-emerald-950/20' : (isCaution ? 'border-amber-500/40 bg-amber-950/20' : 'border-red-500/40 bg-red-950/30')
      } shadow-2xl space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isSafe ? 'bg-emerald-500/20 text-emerald-400' : (isCaution ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400')
            } border border-current shadow-lg`}>
              {isSafe ? <ShieldCheck className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Fishermen Sea-Venture Clearance · {portName}
              </div>
              <h2 className={`text-lg sm:text-xl font-black ${
                isSafe ? 'text-emerald-300' : (isCaution ? 'text-amber-300' : 'text-red-400')
              }`}>
                {weather.safety_status.replace(/_/g, ' ')}
              </h2>
            </div>
          </div>

          {/* 0-100 Score Badge */}
          <div className="flex items-center space-x-2 glass-pill px-4 py-2 rounded-xl">
            <div className="text-right">
              <div className="text-[10px] text-slate-400">Safety Index</div>
              <div className="text-lg font-black font-mono text-white">{weather.safety_index}<span className="text-xs text-slate-400">/100</span></div>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-ocean-cyan font-bold text-xs text-ocean-cyan">
              {weather.safety_index > 70 ? '✓' : '!'}
            </div>
          </div>
        </div>

        {/* Actionable Directive */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 leading-relaxed font-medium">
          📢 <strong>Official Directive:</strong> {weather.actionable_advice}
        </div>

        {/* 4 Core Meters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Wave Height */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Wave Height</span>
              <Waves className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-base font-bold text-white font-mono">
              {weather.significant_wave_height_m} <span className="text-xs text-slate-400">m</span>
            </div>
            <div className="text-[10px] text-slate-400">Swell: {weather.swell_period_seconds}s</div>
          </div>

          {/* Wind Speed & Beaufort */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Wind Speed</span>
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-base font-bold text-white font-mono">
              {weather.wind_speed_knots} <span className="text-xs text-slate-400">kts</span>
            </div>
            <div className="text-[10px] text-slate-400">Beaufort #{weather.beaufort_scale} ({weather.wind_speed_kmph} km/h)</div>
          </div>

          {/* Sea State */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Sea State</span>
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xs font-bold text-white truncate">
              {weather.sea_state}
            </div>
            <div className="text-[10px] text-slate-400">Dir: {weather.wind_direction_degrees}°</div>
          </div>

          {/* Lightning Risk */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Lightning Risk</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-base font-bold text-white font-mono">
              {weather.lightning_probability_percent}%
            </div>
            <div className="text-[10px] text-slate-400">Vis: {weather.visibility_km} km</div>
          </div>
        </div>
      </div>

      {/* Active Cyclone Radar Card */}
      {weather.cyclone_influence.active_cyclone && (
        <div className="glass-panel p-4 rounded-2xl border border-red-500/40 bg-red-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-2 text-xs font-bold text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>Severe Weather Alert · {weather.cyclone_influence.active_cyclone}</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-900/60 text-red-200 border border-red-500/30">
              {weather.cyclone_influence.intensity}
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Active cyclonic circulation located approx <strong>{weather.cyclone_influence.distance_km} km</strong> from reference port. Sustained gale force gusts reaching 65-80 knots in open ocean.
          </p>
        </div>
      )}
    </div>
  );
};
