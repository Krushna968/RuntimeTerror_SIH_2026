import React from 'react';
import { 
  Compass, 
  AlertTriangle 
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
  onSOSClick
}) => {
  const isMap = activeTab === 'map';
  const isChat = activeTab === 'chat';

  // Smooth vertical fade gradient on Map page (darker at top, fading out towards bottom)
  const headerBgClass = isMap 
    ? 'bg-gradient-to-b from-black/85 via-black/40 to-transparent pb-8 pt-5 text-white border-none shadow-none' 
    : isChat
      ? 'bg-transparent text-zinc-900 py-4'
      : 'bg-transparent text-white py-4';

  const getNavLinkClass = (tabKey: HeaderProps['activeTab']) => {
    const isActive = activeTab === tabKey;
    if (isMap) {
      return isActive 
        ? 'text-cyan-300 font-black drop-shadow-sm' 
        : 'text-zinc-100 hover:text-white font-semibold drop-shadow-sm';
    }
    if (isChat) {
      return isActive 
        ? 'text-zinc-950 font-black' 
        : 'text-zinc-500 hover:text-zinc-950 font-semibold';
    }
    return isActive 
      ? 'text-white font-black' 
      : 'text-zinc-400 hover:text-white font-semibold';
  };

  return (
    <header className={`absolute top-0 left-0 right-0 z-50 w-full px-6 sm:px-12 lg:px-20 flex items-center justify-between font-['Outfit',sans-serif] pointer-events-auto transition-all ${headerBgClass}`}>
      {/* Brand Logo */}
      <div 
        onClick={() => setActiveTab('home')}
        className="flex items-center space-x-3 cursor-pointer group shrink-0"
      >
        {/* 3D Oceanic Compass Emblem */}
        <div className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-1.5 shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:scale-105 transition-transform">
          <Compass className="w-full h-full text-white animate-spin-slow" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-90"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`text-2xl font-black tracking-wider transition-colors ${
            isChat ? 'text-zinc-950 group-hover:text-blue-600' : 'text-white group-hover:text-cyan-200'
          }`}>
            ORCA
          </span>
        </div>
      </div>

      {/* Center Navigation: Pure Clean Clickable Texts */}
      <nav className="hidden md:flex items-center space-x-8 lg:space-x-10 text-sm">
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
      </nav>

      {/* Right Action Group */}
      <div className="flex items-center space-x-3 shrink-0">
        {/* SOS Button */}
        <button
          onClick={onSOSClick}
          className="px-4 py-1.5 rounded-full text-xs font-black text-white bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-400/40 active:scale-95 transition-all cursor-pointer animate-pulse whitespace-nowrap"
        >
          <AlertTriangle className="w-3.5 h-3.5 inline-block mr-1.5" />
          <span>SOS 1554</span>
        </button>
      </div>
    </header>
  );
};
