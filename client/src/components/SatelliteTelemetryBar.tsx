import React from 'react';
import { Satellite, Activity, Radio, CheckCircle, ShieldCheck, Zap } from 'lucide-react';
import { SatelliteTelemetry } from '../types';

interface SatelliteTelemetryBarProps {
  satellites: SatelliteTelemetry[];
}

export const SatelliteTelemetryBar: React.FC<SatelliteTelemetryBarProps> = ({
  satellites
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
      {satellites.map((sat) => (
        <div 
          key={sat.id}
          className="glass-card-bright p-4 rounded-2xl border border-cyan-400/30 hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all space-y-2.5 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <Satellite className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white tracking-wide">{sat.name}</h4>
                <p className="text-[11px] text-cyan-200/80 font-mono">{sat.orbit}</p>
              </div>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              {sat.health_score}% Health
            </span>
          </div>

          <div className="text-xs text-slate-200 space-y-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-1.5">
              <span className="text-cyan-400 font-semibold">Sensors:</span>
              <span className="text-slate-100 font-medium">{sat.sensors.join(", ")}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-cyan-400 font-semibold">Latency:</span>
              <span className="text-slate-100 font-mono">{sat.data_latency}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
            <span className="font-mono text-cyan-200">Last Pass: {sat.last_pass.split("T")[1]?.substring(0, 5) || "Continuous"}</span>
            <span className="flex items-center space-x-1.5 font-bold text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>NRSC Ground Synced</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
