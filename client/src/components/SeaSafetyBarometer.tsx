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
      <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500 font-medium">
        Loading real-time marine meteorological telemetry...
      </div>
    );
  }

  const isSafe = weather.safety_status === 'SAFE_FOR_VENTURE';
  const isCaution = weather.safety_status === 'EXERCISE_CAUTION';

  return (
    <div className="space-y-5">
      {/* Top Main Verdict Card */}
      <div className={`p-6 md:p-8 rounded-3xl border ${
        isSafe 
          ? 'border-emerald-300 bg-emerald-50/70 shadow-sm' 
          : (isCaution 
              ? 'border-amber-300 bg-amber-50/70 shadow-sm' 
              : 'border-red-300 bg-red-50/70 shadow-sm')
      } space-y-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              isSafe ? 'bg-emerald-600 text-white' : (isCaution ? 'bg-amber-500 text-white' : 'bg-red-600 text-white')
            } shadow-md`}>
              {isSafe ? <ShieldCheck className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>
            <div>
              <div className="text-xs text-slate-600 uppercase tracking-widest font-extrabold">
                Fishermen Sea-Venture Clearance · {portName}
              </div>
              <h2 className={`text-xl sm:text-2xl font-black ${
                isSafe ? 'text-emerald-900' : (isCaution ? 'text-amber-900' : 'text-red-900')
              }`}>
                {weather.safety_status.replace(/_/g, ' ')}
              </h2>
            </div>
          </div>

          {/* 0-100 Score Badge */}
          <div className="flex items-center space-x-3 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl shadow-xs">
            <div className="text-right">
              <div className="text-[11px] text-slate-500 font-semibold">Safety Score</div>
              <div className="text-2xl font-black font-mono text-slate-900">{weather.safety_index}<span className="text-xs text-slate-400">/100</span></div>
            </div>
            <div className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-blue-600 font-black text-sm text-blue-700 bg-blue-50">
              {weather.safety_index > 70 ? '✓' : '!'}
            </div>
          </div>
        </div>

        {/* Actionable Directive */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed font-semibold shadow-xs">
          📢 <strong className="text-blue-700">Official Directive:</strong> {weather.actionable_advice}
        </div>

        {/* 4 Core Meters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Wave Height */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Wave Height</span>
              <Waves className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">
              {weather.significant_wave_height_m} <span className="text-xs text-slate-400">m</span>
            </div>
            <div className="text-[11px] text-slate-600">Swell Period: {weather.swell_period_seconds}s</div>
          </div>

          {/* Wind Speed & Beaufort */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Wind Speed</span>
              <Wind className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">
              {weather.wind_speed_knots} <span className="text-xs text-slate-400">kts</span>
            </div>
            <div className="text-[11px] text-slate-600">Beaufort #{weather.beaufort_scale} ({weather.wind_speed_kmph} km/h)</div>
          </div>

          {/* Sea State */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Sea State</span>
              <Compass className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xs font-bold text-slate-900 truncate">
              {weather.sea_state}
            </div>
            <div className="text-[11px] text-slate-600">Direction: {weather.wind_direction_degrees}°</div>
          </div>

          {/* Lightning Risk */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Lightning Risk</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">
              {weather.lightning_probability_percent}%
            </div>
            <div className="text-[11px] text-slate-600">Visibility: {weather.visibility_km} km</div>
          </div>
        </div>
      </div>

      {/* Active Cyclone Radar Card */}
      {weather.cyclone_influence.active_cyclone && (
        <div className="p-5 rounded-3xl border border-red-200 bg-red-50 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-2.5 text-xs font-black text-red-700">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              <span>Severe Cyclone Early Alert · {weather.cyclone_influence.active_cyclone}</span>
            </span>
            <span className="text-[11px] font-black px-2.5 py-1 rounded-md bg-red-600 text-white shadow-xs">
              {weather.cyclone_influence.intensity}
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Active cyclonic storm located approximately <strong>{weather.cyclone_influence.distance_km} km</strong> from reference port. Sustained gale force gusts reaching 65-80 knots in open ocean. Total fishing suspension active in danger perimeter.
          </p>
        </div>
      )}
    </div>
  );
};
