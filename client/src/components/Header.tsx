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
    <header className="sticky top-0 z-50 w-full bg-[#08090d]/95 backdrop-blur-xl border-b border-zinc-800/80 px-4 lg:px-8 py-3 flex items-center justify-between shadow-2xl text-white">
      {/* Brand & ISRO Identity */}
      <div 
        onClick={() => setActiveTab('home')}
        className="flex items-center space-x-3 cursor-pointer group"
      >
        {/* Folded Heart / Multi-Color Gradient Icon */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]">
            <path 
              d="M16 28C16 28 3 20.5 3 11.5C3 6.8 6.8 3 11.5 3C14.2 3 15.6 4.3 16 5.2C16.4 4.3 17.8 3 20.5 3C25.2 3 29 6.8 29 11.5C29 20.5 16 28 16 28Z" 
              fill="url(#lovable-grad-hdr)"
            />
            <defs>
              <linearGradient id="lovable-grad-hdr" x1="3" y1="3" x2="29" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FB923C" />
                <stop offset="35%" stopColor="#F43F5E" />
                <stop offset="70%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors">
              Lovable
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40 uppercase tracking-wider">
              Enterprise
            </span>
          </div>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <nav className="hidden md:flex items-center space-x-1.5 bg-zinc-900/80 p-1.5 rounded-full border border-zinc-800 shadow-inner">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
          <Languages className="w-3.5 h-3.5 text-zinc-400 mr-2" />
          <select
            value={currentLang}
            onChange={(e) => setCurrentLang(e.target.value)}
            className="bg-transparent text-xs font-medium text-zinc-200 focus:outline-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-zinc-900 text-white">
                {lang.native} ({lang.name})
              </option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setActiveTab('map')}
          className="px-4 py-1.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-xs transition-all cursor-pointer shadow-md"
        >
          Get started
        </button>
      </div>
    </header>
  );
};
