import React from 'react';
import { 
  Compass, 
  Languages, 
  AlertTriangle 
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'chat' | 'map' | 'agent-lab' | 'safety' | 'bulletin';
  setActiveTab: (tab: 'home' | 'chat' | 'map' | 'agent-lab' | 'safety' | 'bulletin') => void;
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
    <header className="absolute top-0 left-0 right-0 z-50 w-full bg-transparent px-6 sm:px-10 py-5 flex items-center justify-between text-white font-['Outfit',sans-serif] pointer-events-auto">
      {/* Brand Logo */}
      <div 
        onClick={() => setActiveTab('home')}
        className="flex items-center space-x-3 cursor-pointer group shrink-0"
      >
        {/* 3D Oceanic Compass Emblem */}
        <div className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-1.5 shadow-[0_0_20px_rgba(6,182,212,0.6)] group-hover:scale-105 transition-transform">
          <Compass className="w-full h-full text-white animate-spin-slow" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-90"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black tracking-wider text-white group-hover:text-cyan-200 transition-colors">
            ORCA
          </span>
        </div>
      </div>

      {/* Center Navigation: Pure Clean Clickable Texts (Zero Lines) */}
      <nav className="hidden md:flex items-center space-x-7 lg:space-x-9 text-sm font-medium">
        <button
          onClick={() => setActiveTab('home')}
          className={`transition-colors cursor-pointer bg-transparent border-none p-0 whitespace-nowrap ${
            activeTab === 'home'
              ? 'text-white font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Home
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`transition-colors cursor-pointer bg-transparent border-none p-0 whitespace-nowrap ${
            activeTab === 'chat'
              ? 'text-white font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          AI Chatbot
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`transition-colors cursor-pointer bg-transparent border-none p-0 whitespace-nowrap ${
            activeTab === 'map'
              ? 'text-white font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          GIS Command
        </button>

        <button
          onClick={() => setActiveTab('agent-lab')}
          className={`transition-colors cursor-pointer bg-transparent border-none p-0 whitespace-nowrap ${
            activeTab === 'agent-lab'
              ? 'text-white font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Agent DAG
        </button>

        <button
          onClick={() => setActiveTab('safety')}
          className={`transition-colors cursor-pointer bg-transparent border-none p-0 whitespace-nowrap ${
            activeTab === 'safety'
              ? 'text-white font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Safety Barometer
        </button>

        <button
          onClick={() => setActiveTab('bulletin')}
          className={`transition-colors cursor-pointer bg-transparent border-none p-0 whitespace-nowrap ${
            activeTab === 'bulletin'
              ? 'text-white font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Advisory Bulletin
        </button>
      </nav>

      {/* Right Action Group */}
      <div className="flex items-center space-x-3 shrink-0">
        {/* Regional Language Switcher */}
        <div className="relative flex items-center bg-zinc-900/60 border border-zinc-700/60 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
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

        {/* SOS Button */}
        <button
          onClick={onSOSClick}
          className="px-3.5 py-1.5 rounded-full text-xs font-black text-white bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400/40 active:scale-95 transition-all cursor-pointer animate-pulse whitespace-nowrap"
        >
          <AlertTriangle className="w-3.5 h-3.5 inline-block mr-1" />
          <span>SOS 1554</span>
        </button>
      </div>
    </header>
  );
};
