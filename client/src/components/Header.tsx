import React from 'react';
import { 
  Compass, 
  Radio, 
  Languages, 
  AlertTriangle, 
  Map, 
  Cpu, 
  FileText, 
  ShieldAlert, 
  Satellite,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'map' | 'agent-lab' | 'safety' | 'bulletin';
  setActiveTab: (tab: 'map' | 'agent-lab' | 'safety' | 'bulletin') => void;
  currentLang: string;
  setCurrentLang: (lang: string) => void;
  onSOSClick: () => void;
}

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentLang,
  setCurrentLang,
  onSOSClick
}) => {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-cyan-400/30 px-4 lg:px-8 py-3 flex items-center justify-between shadow-2xl backdrop-blur-xl">
      {/* Brand & ISRO Identity */}
      <div className="flex items-center space-x-3.5">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400/30 via-blue-600/40 to-indigo-900/60 border border-cyan-300/60 shadow-[0_0_20px_rgba(6,182,212,0.4)] group cursor-pointer">
          <Compass className="w-6 h-6 text-cyan-300 animate-spin-slow group-hover:rotate-45 transition-transform duration-500" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-90"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent drop-shadow-md">
              ORCA
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-400/60 uppercase tracking-wider shadow-sm">
              ISRO · SIH 26176
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium hidden sm:block">
            Marine Ecosystem Reasoning with Collaborative Agents
          </p>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <nav className="hidden md:flex items-center space-x-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-700/60 shadow-inner">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'map'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_18px_rgba(6,182,212,0.5)] border border-cyan-300'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>GIS Command</span>
        </button>

        <button
          onClick={() => setActiveTab('agent-lab')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'agent-lab'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_18px_rgba(6,182,212,0.5)] border border-cyan-300'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Agent Reasoning DAG</span>
        </button>

        <button
          onClick={() => setActiveTab('safety')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'safety'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_18px_rgba(6,182,212,0.5)] border border-cyan-300'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Safety & Disaster</span>
        </button>

        <button
          onClick={() => setActiveTab('bulletin')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bulletin'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_18px_rgba(6,182,212,0.5)] border border-cyan-300'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Advisory Bulletin</span>
        </button>
      </nav>

      {/* Right Controls: Telemetry + Language + SOS */}
      <div className="flex items-center space-x-3">
        {/* Live Satellite Feed Pill */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-xs font-semibold text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
          <Satellite className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span>Oceansat-3 L3</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>

        {/* Regional Language Switcher */}
        <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-sm hover:border-cyan-400/50 transition-all">
          <Languages className="w-4 h-4 text-cyan-400 mr-2" />
          <select
            value={currentLang}
            onChange={(e) => setCurrentLang(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-100 focus:outline-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-slate-900 text-white font-medium">
                {lang.native} ({lang.name})
              </option>
            ))}
          </select>
        </div>

        {/* Emergency SOS Button */}
        <button
          onClick={onSOSClick}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-black text-xs shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-300/50 active:scale-95 transition-all animate-pulse"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>SOS 1554</span>
        </button>
      </div>
    </header>
  );
};
