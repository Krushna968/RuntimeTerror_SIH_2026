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
  Satellite
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
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-ocean-cyan/20 px-4 lg:px-6 py-2.5 flex items-center justify-between shadow-2xl">
      {/* Brand & ISRO Identity */}
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-ocean-cyan/20 to-blue-900/50 border border-ocean-cyan/40 shadow-inner group cursor-pointer">
          <Compass className="w-6 h-6 text-ocean-cyan animate-spin-slow group-hover:rotate-45 transition-transform duration-500" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ocean-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-ocean-cyan"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-cyan-200 to-ocean-cyan bg-clip-text text-transparent">
              ORCA
            </h1>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-ocean-isro/20 text-ocean-isro border border-ocean-isro/40 uppercase tracking-wide">
              ISRO · SIH 26176
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Marine Ecosystem Reasoning with Collaborative Agents
          </p>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <nav className="hidden md:flex items-center space-x-1 glass-pill p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'map'
              ? 'bg-gradient-to-r from-ocean-cyan/30 to-blue-600/30 text-ocean-cyan border border-ocean-cyan/40 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>GIS Command</span>
        </button>

        <button
          onClick={() => setActiveTab('agent-lab')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'agent-lab'
              ? 'bg-gradient-to-r from-ocean-cyan/30 to-blue-600/30 text-ocean-cyan border border-ocean-cyan/40 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Agent Reasoning DAG</span>
        </button>

        <button
          onClick={() => setActiveTab('safety')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'safety'
              ? 'bg-gradient-to-r from-ocean-cyan/30 to-blue-600/30 text-ocean-cyan border border-ocean-cyan/40 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Safety & Disaster</span>
        </button>

        <button
          onClick={() => setActiveTab('bulletin')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'bulletin'
              ? 'bg-gradient-to-r from-ocean-cyan/30 to-blue-600/30 text-ocean-cyan border border-ocean-cyan/40 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Advisory Bulletin</span>
        </button>
      </nav>

      {/* Right Controls: Telemetry + Language + SOS */}
      <div className="flex items-center space-x-3">
        {/* Live Satellite Feed Pill */}
        <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-[11px] text-slate-300">
          <Satellite className="w-3.5 h-3.5 text-ocean-cyan animate-pulse" />
          <span>Oceansat-3 L3</span>
          <span className="w-1.5 h-1.5 rounded-full bg-ocean-emerald animate-ping"></span>
        </div>

        {/* Regional Language Switcher */}
        <div className="relative flex items-center glass-pill px-2.5 py-1 rounded-lg">
          <Languages className="w-3.5 h-3.5 text-ocean-cyan mr-1.5" />
          <select
            value={currentLang}
            onChange={(e) => setCurrentLang(e.target.value)}
            className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-ocean-900 text-white">
                {lang.native} ({lang.name})
              </option>
            ))}
          </select>
        </div>

        {/* Emergency SOS Button */}
        <button
          onClick={onSOSClick}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-red-900/40 border border-red-400/40 active:scale-95 transition-all animate-pulse"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>SOS 1554</span>
        </button>
      </div>
    </header>
  );
};
