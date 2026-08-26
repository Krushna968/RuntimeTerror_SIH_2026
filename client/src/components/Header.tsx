import React from 'react';
import { 
  Compass, 
  AlertTriangle,
  Languages 
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'chat' | 'map' | 'agent-lab' | 'safety' | 'bulletin';
  setActiveTab: (tab: 'home' | 'chat' | 'map' | 'agent-lab' | 'safety' | 'bulletin') => void;
  currentLang?: string;
  setCurrentLang?: (lang: string) => void;
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
  currentLang = 'en',
  setCurrentLang,
  onSOSClick
}) => {
  const isMap = activeTab === 'map';
  const isChat = activeTab === 'chat';
  const isHome = activeTab === 'home';
  const isAgentLab = activeTab === 'agent-lab';
  const isDark = activeTab === 'map' || activeTab === 'agent-lab';

  // Header background styling based on active view
  const headerBgClass = isMap 
    ? 'bg-gradient-to-b from-black/85 via-black/40 to-transparent pb-8 pt-5 text-white border-none shadow-none' 
    : isAgentLab
      ? 'bg-transparent text-white py-4 border-none shadow-none'
      : (isHome || isChat)
        ? 'bg-transparent text-zinc-900 py-4 border-none shadow-none'
        : 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 text-zinc-900 py-3.5 shadow-xs';

  const getNavLinkClass = (tabKey: HeaderProps['activeTab']) => {
    const isActive = activeTab === tabKey;
    if (isMap || isAgentLab) {
      return isActive 
        ? 'text-cyan-300 font-black drop-shadow-sm' 
        : 'text-zinc-300 hover:text-white font-semibold drop-shadow-sm';
    }
    if (isHome || isChat) {
      return isActive 
        ? 'text-zinc-950 font-black' 
        : 'text-zinc-500 hover:text-zinc-950 font-semibold';
    }
    return isActive 
      ? 'text-blue-600 font-black' 
      : 'text-zinc-600 hover:text-zinc-950 font-semibold';
  };

  return (
    <header className={`absolute top-0 left-0 right-0 z-50 w-full px-6 sm:px-12 lg:px-20 flex items-center justify-between font-['Outfit',sans-serif] pointer-events-auto transition-all ${headerBgClass}`}>
      {/* Brand Logo */}
      <div 
        onClick={() => setActiveTab('home')}
        className="flex items-center space-x-2.5 cursor-pointer group shrink-0"
      >
        {/* Minimalist Geometric Emblem */}
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${
          !isDark 
            ? 'bg-zinc-950 text-white shadow-xs' 
            : 'bg-white text-zinc-950 shadow-sm'
        }`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <path d="M3 13c4.5-6 11-8 18-2-4.5 6-11 8-18 2z" />
            <circle cx="15" cy="9.5" r="1.25" fill="currentColor" stroke="none" />
          </svg>
        </div>

        <div className="flex items-baseline space-x-1.5">
          <span className={`text-base sm:text-lg font-black tracking-widest transition-colors ${
            !isDark ? 'text-zinc-950' : 'text-white'
          }`}>
            ORCA
          </span>
          <span className="text-[9px] font-mono font-bold tracking-wider text-cyan-400">
            ISRO
          </span>
        </div>
      </div>

      {/* Center Navigation: All Module Tabs */}
      <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm">
        <button
          onClick={() => setActiveTab('home')}
          className={`transition-colors cursor-pointer bg-transparent border-none p-0 whitespace-nowrap ${getNavLinkClass('home')}`}
        >
          Home
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`transition-colors cursor-pointer bg-transparent border-none p-0 whitespace-nowrap ${getNavLinkClass('chat')}`}
        >
          AI Chatbot
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`transition-colors cursor-pointer bg-transparent border-none p-0 whitespace-nowrap ${getNavLinkClass('map')}`}
        >
          GIS Command
        </button>

        <button
          onClick={() => setActiveTab('agent-lab')}
          className={`transition-colors cursor-pointer bg-transparent border-none p-0 whitespace-nowrap ${getNavLinkClass('agent-lab')}`}
        >
          Agent DAG
        </button>

        <button
          onClick={() => setActiveTab('safety')}
          className={`transition-colors cursor-pointer bg-transparent border-none p-0 whitespace-nowrap ${getNavLinkClass('safety')}`}
        >
          Safety Barometer
        </button>

        <button
          onClick={() => setActiveTab('bulletin')}
          className={`transition-colors cursor-pointer bg-transparent border-none p-0 whitespace-nowrap ${getNavLinkClass('bulletin')}`}
        >
          Advisory Bulletin
        </button>
      </nav>

      {/* Right Action Group: Language Switcher + SOS */}
      <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
        {/* Regional Language Switcher */}
        {setCurrentLang && (
          <div className={`relative flex items-center backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm transition-all border ${
            !isDark 
              ? 'bg-white border-zinc-200 text-zinc-900 shadow-xs' 
              : 'bg-zinc-900/80 border-zinc-700/80 text-zinc-200'
          }`}>
            <Languages className={`w-3.5 h-3.5 mr-1.5 shrink-0 ${!isDark ? 'text-blue-600' : 'text-cyan-400'}`} />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-zinc-900 text-white">
                  {lang.native} ({lang.name})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* SOS Button */}
        <button
          onClick={onSOSClick}
          className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-black text-white bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-400/40 active:scale-95 transition-all cursor-pointer animate-pulse whitespace-nowrap"
        >
          <AlertTriangle className="w-3.5 h-3.5 inline-block mr-1" />
          <span>SOS 1554</span>
        </button>
      </div>
    </header>
  );
};
