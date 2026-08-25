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
  Sparkles,
  Home
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'map' | 'agent-lab' | 'safety' | 'bulletin';
  setActiveTab: (tab: 'home' | 'map' | 'agent-lab' | 'safety' | 'bulletin') => void;
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
    <header className="sticky top-0 z-50 w-full bg-[#07090e]/95 backdrop-blur-xl border-b border-zinc-800/80 px-4 lg:px-8 py-3 flex items-center justify-between shadow-2xl text-white">
      {/* Brand & ISRO Identity */}
      <div 
        onClick={() => setActiveTab('home')}
        className="flex items-center space-x-3 cursor-pointer group"
      >
        {/* 3D Oceanic Compass Emblem */}
        <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-1.5 shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-105 transition-transform">
          <Compass className="w-full h-full text-white animate-spin-slow" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-90"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-black tracking-wider text-white group-hover:text-cyan-200 transition-colors">
              ORCA
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-400/50 uppercase tracking-wider">
              ISRO · SIH 26176
            </span>
          </div>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <nav className="hidden md:flex items-center space-x-1.5 bg-zinc-900/90 p-1.5 rounded-full border border-zinc-800 shadow-inner">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'bg-white text-zinc-950 shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'map'
              ? 'bg-white text-zinc-950 shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>GIS Command</span>
        </button>

        <button
          onClick={() => setActiveTab('agent-lab')}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'agent-lab'
              ? 'bg-white text-zinc-950 shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Agent DAG</span>
        </button>

        <button
          onClick={() => setActiveTab('safety')}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'safety'
              ? 'bg-white text-zinc-950 shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Safety</span>
        </button>

        <button
          onClick={() => setActiveTab('bulletin')}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'bulletin'
              ? 'bg-white text-zinc-950 shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Advisory</span>
        </button>
      </nav>

      {/* Right Controls: Language + SOS */}
      <div className="flex items-center space-x-3">
        {/* Regional Language Switcher */}
        <div className="relative flex items-center bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full shadow-sm">
          <Languages className="w-3.5 h-3.5 text-cyan-400 mr-2" />
          <select
            value={currentLang}
            onChange={(e) => setCurrentLang(e.target.value)}
            className="bg-transparent text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-zinc-900 text-white">
                {lang.native} ({lang.name})
              </option>
            ))}
          </select>
        </div>

        {/* Emergency SOS Button */}
        <button
          onClick={onSOSClick}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400/40 active:scale-95 transition-all cursor-pointer animate-pulse"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>SOS 1554</span>
        </button>
      </div>
    </header>
  );
};
