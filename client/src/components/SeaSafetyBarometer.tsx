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
      <div className="p-8 glass-card-bright rounded-3xl text-center text-xs text-slate-300 font-medium">
        Loading real-time marine meteorological telemetry...
      </div>
    );
  }

  const isSafe = weather.safety_status === 'SAFE_FOR_VENTURE';
  const isCaution = weather.safety_status === 'EXERCISE_CAUTION';

  return (
    <div className="space-y-5">
      {/* Top Main Verdict Card */}
      <div className={`glass-card-bright p-6 md:p-8 rounded-3xl border ${
        isSafe 
          ? 'border-emerald-400/50 bg-emerald-950/25 shadow-[0_0_30px_rgba(16,185,129,0.2)]' 
          : (isCaution 
              ? 'border-amber-400/50 bg-amber-950/25 shadow-[0_0_30px_rgba(245,158,11,0.2)]' 
              : 'border-red-500/60 bg-red-950/30 shadow-[0_0_30px_rgba(239,68,68,0.25)]')
      } shadow-2xl space-y-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              isSafe ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60' : (isCaution ? 'bg-amber-500/20 text-amber-300 border-amber-400/60' : 'bg-red-500/20 text-red-300 border-red-500/60')
            } border shadow-lg`}>
              {isSafe ? <ShieldCheck className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>
            <div>
              <div className="text-xs text-cyan-300 uppercase tracking-widest font-black">
                Fishermen Sea-Venture Clearance · {portName}
              </div>
              <h2 className={`text-xl sm:text-2xl font-black ${
                isSafe ? 'text-emerald-300' : (isCaution ? 'text-amber-300' : 'text-red-400')
              }`}>
                {weather.safety_status.replace(/_/g, ' ')}
              </h2>
            </div>
          </div>

          {/* 0-100 Score Badge */}
          <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-700 px-5 py-2.5 rounded-2xl shadow-inner">
            <div className="text-right">
              <div className="text-[11px] text-slate-300 font-semibold">Safety Score</div>
              <div className="text-2xl font-black font-mono text-white">{weather.safety_index}<span className="text-xs text-cyan-300">/100</span></div>
            </div>
            <div className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-cyan-400 font-black text-sm text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
              {weather.safety_index > 70 ? '✓' : '!'}
            </div>
          </div>
        </div>

        {/* Actionable Directive */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 leading-relaxed font-semibold">
          📢 <strong className="text-cyan-300">Official Directive:</strong> {weather.actionable_advice}
        </div>

        {/* 4 Core Meters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Wave Height */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-300 text-xs font-semibold">
              <span>Wave Height</span>
              <Waves className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-lg font-black text-white font-mono">
              {weather.significant_wave_height_m} <span className="text-xs text-slate-400">m</span>
            </div>
            <div className="text-[11px] text-cyan-200">Swell Period: {weather.swell_period_seconds}s</div>
          </div>

          {/* Wind Speed & Beaufort */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-300 text-xs font-semibold">
              <span>Wind Speed</span>
              <Wind className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-lg font-black text-white font-mono">
              {weather.wind_speed_knots} <span className="text-xs text-slate-400">kts</span>
            </div>
            <div className="text-[11px] text-cyan-200">Beaufort #{weather.beaufort_scale} ({weather.wind_speed_kmph} km/h)</div>
          </div>

          {/* Sea State */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-300 text-xs font-semibold">
              <span>Sea State</span>
              <Compass className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs font-bold text-white truncate">
              {weather.sea_state}
            </div>
            <div className="text-[11px] text-cyan-200">Direction: {weather.wind_direction_degrees}°</div>
          </div>

          {/* Lightning Risk */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-300 text-xs font-semibold">
              <span>Lightning Risk</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-lg font-black text-white font-mono">
              {weather.lightning_probability_percent}%
            </div>
            <div className="text-[11px] text-cyan-200">Visibility: {weather.visibility_km} km</div>
          </div>
        </div>
      </div>

      {/* Active Cyclone Radar Card */}
      {weather.cyclone_influence.active_cyclone && (
        <div className="glass-panel p-5 rounded-3xl border border-red-500/50 bg-red-950/25 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-2.5 text-xs font-black text-red-300">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <span>Severe Cyclone Early Alert · {weather.cyclone_influence.active_cyclone}</span>
            </span>
            <span className="text-[11px] font-black px-2.5 py-1 rounded-md bg-red-900/80 text-red-100 border border-red-400/50">
              {weather.cyclone_influence.intensity}
            </span>
          </div>

          <p className="text-xs text-slate-100 leading-relaxed font-medium">
            Active cyclonic storm located approximately <strong>{weather.cyclone_influence.distance_km} km</strong> from reference port. Sustained gale force gusts reaching 65-80 knots in open ocean. Total fishing suspension active in danger perimeter.
          </p>
        </div>
      )}
    </div>
  );
};
