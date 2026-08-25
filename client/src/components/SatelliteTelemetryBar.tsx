import React from 'react';
import { Satellite, Activity, Radio, CheckCircle, ShieldCheck } from 'lucide-react';
import { SatelliteTelemetry } from '../types';

interface SatelliteTelemetryBarProps {
  satellites: SatelliteTelemetry[];
}

export const SatelliteTelemetryBar: React.FC<SatelliteTelemetryBarProps> = ({
  satellites
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {satellites.map((sat) => (
        <div 
          key={sat.id}
          className="glass-panel p-3.5 rounded-xl border border-slate-800 hover:border-ocean-cyan/40 transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-ocean-cyan/10 text-ocean-cyan">
                <Satellite className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{sat.name}</h4>
                <p className="text-[10px] text-slate-400 font-mono">{sat.orbit}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              {sat.health_score}% Health
            </span>
          </div>

          <div className="text-[11px] text-slate-300 space-y-0.5">
            <div><strong>Sensors:</strong> {sat.sensors.join(", ")}</div>
            <div><strong>Latency:</strong> {sat.data_latency}</div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
            <span>Last Pass: {sat.last_pass.split("T")[1]?.substring(0, 5) || "Active"}</span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <CheckCircle className="w-3 h-3" />
              <span>NRSC Synced</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
