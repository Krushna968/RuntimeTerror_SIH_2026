import React, { useState, useEffect } from 'react';
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
  Radio,
  Anchor,
  Navigation
} from 'lucide-react';
import { WeatherObservation } from '../types';

interface SeaSafetyBarometerProps {
  weather: WeatherObservation | null;
  portName?: string;
  onPortSelect?: (lat: number, lon: number, name: string) => void;
}

export interface HarbourTelemetry {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  weather: WeatherObservation;
}

export const INDIAN_HARBOURS_DATA: HarbourTelemetry[] = [
  {
    id: 'kochi',
    name: "Kochi Fishing Harbour",
    state: "Kerala",
    lat: 9.9416,
    lon: 76.2575,
    weather: {
      latitude: 9.9416,
      longitude: 76.2575,
      safety_status: 'SAFE_FOR_VENTURE',
      safety_index: 86.5,
      safety_badge_color: 'emerald',
      actionable_advice: "Optimal coastal conditions. Moderate swells under 1.2m. Mechanized and motorized crafts cleared for offshore venture within 25 NM.",
      significant_wave_height_m: 1.15,
      swell_period_seconds: 7.2,
      wind_speed_knots: 11.4,
      wind_speed_kmph: 21.1,
      wind_direction_degrees: 245,
      beaufort_scale: 3,
      sea_state: "Slight / Smooth",
      lightning_probability_percent: 8,
      visibility_km: 14.5,
      cyclone_influence: {
        active_cyclone: null,
        distance_km: null,
        intensity: null
      },
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'mumbai',
    name: "Sassoon Dock, Mumbai",
    state: "Maharashtra",
    lat: 18.9167,
    lon: 72.8250,
    weather: {
      latitude: 18.9167,
      longitude: 72.8250,
      safety_status: 'EXERCISE_CAUTION',
      safety_index: 68.2,
      safety_badge_color: 'amber',
      actionable_advice: "Moderate chop and gusty cross-currents beyond 15 NM. Non-motorized traditional crafts advised to remain within 8 NM of Mumbai harbour.",
      significant_wave_height_m: 1.85,
      swell_period_seconds: 8.5,
      wind_speed_knots: 16.8,
      wind_speed_kmph: 31.1,
      wind_direction_degrees: 290,
      beaufort_scale: 4,
      sea_state: "Moderate Choppy",
      lightning_probability_percent: 15,
      visibility_km: 11.2,
      cyclone_influence: {
        active_cyclone: null,
        distance_km: null,
        intensity: null
      },
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'chennai',
    name: "Kasimedu Fishing Harbour, Chennai",
    state: "Tamil Nadu",
    lat: 13.1250,
    lon: 80.3000,
    weather: {
      latitude: 13.1250,
      longitude: 80.3000,
      safety_status: 'EXERCISE_CAUTION',
      safety_index: 54.0,
      safety_badge_color: 'amber',
      actionable_advice: "High breaker swells along Coromandel coastline. Small motorized boats advised to suspend venture. Mechanized deep-sea trawlers exercise high vigilance.",
      significant_wave_height_m: 2.40,
      swell_period_seconds: 9.1,
      wind_speed_knots: 22.5,
      wind_speed_kmph: 41.6,
      wind_direction_degrees: 110,
      beaufort_scale: 6,
      sea_state: "Rough / High Breaker",
      lightning_probability_percent: 35,
      visibility_km: 8.5,
      cyclone_influence: {
        active_cyclone: "Bay of Bengal Low Pressure",
        distance_km: 420,
        intensity: "Developing Depression"
      },
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'vizag',
    name: "Visakhapatnam Fishing Harbour",
    state: "Andhra Pradesh",
    lat: 17.6868,
    lon: 83.2185,
    weather: {
      latitude: 17.6868,
      longitude: 83.2185,
      safety_status: 'SAFE_FOR_VENTURE',
      safety_index: 82.5,
      safety_badge_color: 'emerald',
      actionable_advice: "Favorable sea state across Northern Circars basin. Tuna longliners and motorized gillnetters cleared for 35 NM deep-sea operations.",
      significant_wave_height_m: 1.30,
      swell_period_seconds: 6.8,
      wind_speed_knots: 12.0,
      wind_speed_kmph: 22.2,
      wind_direction_degrees: 180,
      beaufort_scale: 3,
      sea_state: "Smooth / Gentle",
      lightning_probability_percent: 12,
      visibility_km: 15.0,
      cyclone_influence: {
        active_cyclone: null,
        distance_km: null,
        intensity: null
      },
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'veraval',
    name: "Veraval Fisheries Port",
    state: "Gujarat",
    lat: 20.9000,
    lon: 70.3667,
    weather: {
      latitude: 20.9000,
      longitude: 70.3667,
      safety_status: 'SAFE_FOR_VENTURE',
      safety_index: 79.0,
      safety_badge_color: 'emerald',
      actionable_advice: "Favorable gillnetting and trawling conditions in Saurashtra basin. Maintain strict GPS vigil near Sir Creek Pakistan boundary.",
      significant_wave_height_m: 1.45,
      swell_period_seconds: 7.5,
      wind_speed_knots: 13.8,
      wind_speed_kmph: 25.5,
      wind_direction_degrees: 315,
      beaufort_scale: 4,
      sea_state: "Slight",
      lightning_probability_percent: 5,
      visibility_km: 16.0,
      cyclone_influence: {
        active_cyclone: null,
        distance_km: null,
        intensity: null
      },
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'tuticorin',
    name: "Tuticorin Fishing Port",
    state: "Tamil Nadu",
    lat: 8.7642,
    lon: 78.1348,
    weather: {
      latitude: 8.7642,
      longitude: 78.1348,
      safety_status: 'SAFE_FOR_VENTURE',
      safety_index: 72.0,
      safety_badge_color: 'emerald',
      actionable_advice: "Moderate channel currents in Gulf of Mannar. Sea venture cleared with mandatory 10 NM safe buffer from Sri Lanka IMBL boundary line.",
      significant_wave_height_m: 1.60,
      swell_period_seconds: 8.0,
      wind_speed_knots: 15.2,
      wind_speed_kmph: 28.1,
      wind_direction_degrees: 140,
      beaufort_scale: 4,
      sea_state: "Moderate",
      lightning_probability_percent: 18,
      visibility_km: 12.0,
      cyclone_influence: {
        active_cyclone: null,
        distance_km: null,
        intensity: null
      },
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'paradip',
    name: "Paradip Fishing Harbour",
    state: "Odisha",
    lat: 20.2667,
    lon: 86.6667,
    weather: {
      latitude: 20.2667,
      longitude: 86.6667,
      safety_status: 'HAZARDOUS_NO_VENTURE',
      safety_index: 28.0,
      safety_badge_color: 'red',
      actionable_advice: "🚨 SEVERE WEATHER DIRECTIVE: Intense gale squalls associated with Northern Bay of Bengal cyclonic depression. Complete fishing suspension in effect. Do not venture into the sea.",
      significant_wave_height_m: 3.20,
      swell_period_seconds: 11.4,
      wind_speed_knots: 31.5,
      wind_speed_kmph: 58.3,
      wind_direction_degrees: 95,
      beaufort_scale: 7,
      sea_state: "Very Rough / High Gale",
      lightning_probability_percent: 65,
      visibility_km: 4.5,
      cyclone_influence: {
        active_cyclone: "Cyclonic Storm 'MIDHILI'",
        distance_km: 210,
        intensity: "Severe Cyclonic Storm (Gale 65 kts)"
      },
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'mangalore',
    name: "Mangalore Old Port",
    state: "Karnataka",
    lat: 12.8550,
    lon: 74.8350,
    weather: {
      latitude: 12.8550,
      longitude: 74.8350,
      safety_status: 'SAFE_FOR_VENTURE',
      safety_index: 91.0,
      safety_badge_color: 'emerald',
      actionable_advice: "Excellent calm sea conditions along Kanara coastline. All artisanal, motorized, and mechanized vessels cleared for round-the-clock venture.",
      significant_wave_height_m: 0.90,
      swell_period_seconds: 6.5,
      wind_speed_knots: 9.2,
      wind_speed_kmph: 17.0,
      wind_direction_degrees: 260,
      beaufort_scale: 2,
      sea_state: "Calm / Rippled",
      lightning_probability_percent: 6,
      visibility_km: 18.0,
      cyclone_influence: {
        active_cyclone: null,
        distance_km: null,
        intensity: null
      },
      timestamp: new Date().toISOString()
    }
  }
];

export const SeaSafetyBarometer: React.FC<SeaSafetyBarometerProps> = ({
  weather: parentWeather,
  portName = "Kochi Fishing Harbour",
  onPortSelect
}) => {
  const [selectedHarbourId, setSelectedHarbourId] = useState<string>('kochi');
  const [activeWeather, setActiveWeather] = useState<WeatherObservation>(
    INDIAN_HARBOURS_DATA[0].weather
  );
  const [activePortName, setActivePortName] = useState<string>(
    INDIAN_HARBOURS_DATA[0].name
  );

  // If parent passes a live weather update for a selected coord
  useEffect(() => {
    if (parentWeather) {
      setActiveWeather(parentWeather);
      if (portName) setActivePortName(portName);
    }
  }, [parentWeather, portName]);

  const handlePortClick = (harbour: HarbourTelemetry) => {
    setSelectedHarbourId(harbour.id);
    setActiveWeather(harbour.weather);
    setActivePortName(harbour.name);

    if (onPortSelect) {
      onPortSelect(harbour.lat, harbour.lon, harbour.name);
    }
  };

  const isSafe = activeWeather.safety_status === 'SAFE_FOR_VENTURE';
  const isCaution = activeWeather.safety_status === 'EXERCISE_CAUTION';
  const isHazardous = activeWeather.safety_status === 'HAZARDOUS_NO_VENTURE';

  return (
    <div className="space-y-5 font-['Outfit',sans-serif]">
      {/* Port Selector Header Bar */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-black text-slate-800 uppercase tracking-wider">
            <Anchor className="w-4 h-4 text-blue-600" />
            <span>Select Coastal Fishing Harbour / Zone</span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            ISRO Oceansat-3 Marine Telemetry
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          {INDIAN_HARBOURS_DATA.map((h) => {
            const isSelected = selectedHarbourId === h.id;
            const portSafe = h.weather.safety_status === 'SAFE_FOR_VENTURE';
            const portCaution = h.weather.safety_status === 'EXERCISE_CAUTION';

            return (
              <button
                key={h.id}
                onClick={() => handlePortClick(h)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  isSelected 
                    ? 'bg-white' 
                    : (portSafe ? 'bg-emerald-500' : (portCaution ? 'bg-amber-500' : 'bg-red-500 animate-ping'))
                }`} />
                <span>{h.name.split(',')[0]}</span>
                <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>({h.state})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Main Verdict Card */}
      <div className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 ${
        isSafe 
          ? 'border-emerald-300 bg-emerald-50/70 shadow-sm' 
          : (isCaution 
              ? 'border-amber-300 bg-amber-50/70 shadow-sm' 
              : 'border-red-300 bg-red-50/90 shadow-lg shadow-red-900/10')
      } space-y-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              isSafe ? 'bg-emerald-600 text-white' : (isCaution ? 'bg-amber-500 text-white' : 'bg-red-600 text-white animate-bounce')
            } shadow-md`}>
              {isSafe ? <ShieldCheck className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>
            <div>
              <div className="text-xs text-slate-600 uppercase tracking-widest font-extrabold flex items-center space-x-1.5">
                <span>Sea-Venture Clearance</span>
                <span className="text-slate-400">·</span>
                <span className="text-blue-700 font-bold">{activePortName}</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-black ${
                isSafe ? 'text-emerald-900' : (isCaution ? 'text-amber-900' : 'text-red-900')
              }`}>
                {activeWeather.safety_status.replace(/_/g, ' ')}
              </h2>
            </div>
          </div>

          {/* 0-100 Score Badge */}
          <div className="flex items-center space-x-3 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl shadow-xs shrink-0">
            <div className="text-right">
              <div className="text-[11px] text-slate-500 font-semibold">Safety Score</div>
              <div className={`text-2xl font-black font-mono ${
                isSafe ? 'text-emerald-700' : (isCaution ? 'text-amber-700' : 'text-red-700')
              }`}>
                {activeWeather.safety_index}<span className="text-xs text-slate-400">/100</span>
              </div>
            </div>
            <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 font-black text-sm ${
              activeWeather.safety_index >= 70 
                ? 'border-emerald-500 text-emerald-700 bg-emerald-50' 
                : (activeWeather.safety_index >= 40 ? 'border-amber-500 text-amber-700 bg-amber-50' : 'border-red-500 text-red-700 bg-red-50 animate-pulse')
            }`}>
              {activeWeather.safety_index >= 70 ? '✓' : '!'}
            </div>
          </div>
        </div>

        {/* Actionable Directive */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed font-semibold shadow-xs">
          📢 <strong className="text-blue-700">Official Marine Advisory:</strong> {activeWeather.actionable_advice}
        </div>

        {/* 4 Core Meteorological Meters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Wave Height */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Wave Height</span>
              <Waves className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">
              {activeWeather.significant_wave_height_m} <span className="text-xs text-slate-400">m</span>
            </div>
            <div className="text-[11px] text-slate-600">Swell Period: {activeWeather.swell_period_seconds}s</div>
          </div>

          {/* Wind Speed & Beaufort */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Wind Speed</span>
              <Wind className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">
              {activeWeather.wind_speed_knots} <span className="text-xs text-slate-400">kts</span>
            </div>
            <div className="text-[11px] text-slate-600">Beaufort #{activeWeather.beaufort_scale} ({activeWeather.wind_speed_kmph} km/h)</div>
          </div>

          {/* Sea State */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Sea State</span>
              <Compass className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xs font-bold text-slate-900 truncate">
              {activeWeather.sea_state}
            </div>
            <div className="text-[11px] text-slate-600">Direction: {activeWeather.wind_direction_degrees}°</div>
          </div>

          {/* Lightning Risk */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Lightning Risk</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">
              {activeWeather.lightning_probability_percent}%
            </div>
            <div className="text-[11px] text-slate-600">Visibility: {activeWeather.visibility_km} km</div>
          </div>
        </div>
      </div>

      {/* Active Cyclone Radar Card */}
      {activeWeather.cyclone_influence && activeWeather.cyclone_influence.active_cyclone ? (
        <div className="p-5 rounded-3xl border border-red-300 bg-red-50/95 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-2.5 text-xs font-black text-red-700">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              <span>Severe Cyclone Alert · {activeWeather.cyclone_influence.active_cyclone}</span>
            </span>
            <span className="text-[11px] font-black px-2.5 py-1 rounded-md bg-red-600 text-white shadow-xs">
              {activeWeather.cyclone_influence.intensity}
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Active cyclonic storm located approximately <strong>{activeWeather.cyclone_influence.distance_km} km</strong> from {activePortName}. Sustained gale force gusts reaching open ocean. Strict fishing suspension active in danger perimeter.
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">No active cyclonic storm or severe ocean depression in operational sector for {activePortName}.</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 font-bold">Cyclone Radar Normal</span>
        </div>
      )}
    </div>
  );
};
