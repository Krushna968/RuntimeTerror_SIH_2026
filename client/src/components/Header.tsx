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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/90 px-4 lg:px-8 py-3 flex items-center justify-between shadow-sm">
      {/* Brand & ISRO Identity */}
      <div className="flex items-center space-x-3.5">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-md shadow-blue-500/20 group cursor-pointer">
          <Compass className="w-6 h-6 animate-spin-slow group-hover:rotate-45 transition-transform duration-500 text-white" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-90"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-black tracking-wider text-slate-900">
              ORCA
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-orange-100 text-orange-700 border border-orange-200 uppercase tracking-wider">
              ISRO · SIH 26176
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium hidden sm:block">
            Marine Ecosystem Reasoning with Collaborative Agents
          </p>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <nav className="hidden md:flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'map'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>GIS Command</span>
        </button>

        <button
          onClick={() => setActiveTab('agent-lab')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'agent-lab'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Agent Reasoning DAG</span>
        </button>

        <button
          onClick={() => setActiveTab('safety')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'safety'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Safety & Disaster</span>
        </button>

        <button
          onClick={() => setActiveTab('bulletin')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'bulletin'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Advisory Bulletin</span>
        </button>
      </nav>

      {/* Right Controls: Telemetry + Language + SOS */}
      <div className="flex items-center space-x-3">
        {/* Live Satellite Feed Pill */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-bold text-cyan-800 shadow-sm">
          <Satellite className="w-4 h-4 text-cyan-600 animate-pulse" />
          <span>Oceansat-3 L3</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        </div>

        {/* Regional Language Switcher */}
        <div className="relative flex items-center bg-white border border-slate-300 px-3 py-1.5 rounded-xl shadow-sm hover:border-blue-500 transition-all">
          <Languages className="w-4 h-4 text-blue-600 mr-2" />
          <select
            value={currentLang}
            onChange={(e) => setCurrentLang(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-white text-slate-900 font-medium">
                {lang.native} ({lang.name})
              </option>
            ))}
          </select>
        </div>

        {/* Emergency SOS Button */}
        <button
          onClick={onSOSClick}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-500/30 border border-red-500 active:scale-95 transition-all cursor-pointer"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>SOS 1554</span>
        </button>
      </div>
    </header>
  );
};
