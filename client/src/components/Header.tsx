import React, { useState } from 'react';
import { 
  Compass, 
  AlertTriangle,
  Languages,
  Menu,
  X,
  Sparkles,
  Map,
  Cpu,
  ShieldCheck,
  FileText,
  Home,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  activeTab: 'home' | 'chat' | 'map' | 'agent-lab' | 'safety' | 'bulletin' | 'devices';
  setActiveTab: (tab: 'home' | 'chat' | 'map' | 'agent-lab' | 'safety' | 'bulletin' | 'devices') => void;
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMap = activeTab === 'map';
  const isChat = activeTab === 'chat';
  const isHome = activeTab === 'home';
  const isAgentLab = activeTab === 'agent-lab';
  const isDevices = activeTab === 'devices';
  const isDark = activeTab === 'map';

  // Header background styling based on active view
  const headerBgClass = isMap 
    ? 'bg-gradient-to-b from-black/85 via-black/40 to-transparent pb-6 pt-3 sm:pt-5 text-white border-none shadow-none' 
    : (isHome || isChat || isAgentLab)
      ? 'bg-transparent text-zinc-900 py-3 sm:py-4 border-none shadow-none'
      : 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 text-zinc-900 py-2.5 sm:py-3.5 shadow-xs';

  const getNavLinkClass = (tabKey: HeaderProps['activeTab']) => {
    const isActive = activeTab === tabKey;
    if (isMap) {
      return isActive 
        ? 'text-cyan-300 font-black drop-shadow-sm' 
        : 'text-zinc-100 hover:text-white font-semibold drop-shadow-sm';
    }
    if (isHome || isChat || isAgentLab || isDevices) {
      return isActive 
        ? (tabKey === 'agent-lab' || tabKey === 'devices' ? 'text-blue-600 font-black' : 'text-zinc-950 font-black') 
        : 'text-zinc-500 hover:text-zinc-950 font-semibold';
    }
    return isActive 
      ? 'text-blue-600 font-black' 
      : 'text-zinc-600 hover:text-zinc-950 font-semibold';
  };

  const navItems = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'chat', label: 'AI Chatbot', icon: Sparkles },
    { key: 'map', label: 'GIS Command', icon: Map },
    { key: 'agent-lab', label: 'Agent DAG', icon: Cpu },
    { key: 'safety', label: 'Safety Barometer', icon: ShieldCheck },
    { key: 'devices', label: 'Fleet & Devices', icon: Radio },
    { key: 'bulletin', label: 'Advisory Bulletin', icon: FileText }
  ] as const;

  const handleMobileTabSelect = (tab: HeaderProps['activeTab']) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`absolute top-0 left-0 right-0 z-50 w-full px-4 sm:px-8 lg:px-20 flex items-center justify-between font-['Outfit',sans-serif] pointer-events-auto transition-all ${headerBgClass}`}>
        {/* Brand Logo & Mobile Toggle */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1.5 rounded-lg md:hidden flex items-center justify-center transition-colors cursor-pointer ${
              !isDark 
                ? 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-2 cursor-pointer group shrink-0"
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

            <div className="flex items-baseline space-x-1">
              <span className={`text-sm sm:text-base md:text-lg font-black tracking-wider transition-colors ${
                !isDark ? 'text-zinc-950' : 'text-white'
              }`}>
                BLUE ORBIT
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono font-bold tracking-wider text-cyan-400">
                ISRO
              </span>
            </div>
          </div>
        </div>

        {/* Center Navigation: Desktop Tabs */}
        <nav className="hidden md:flex items-center space-x-5 lg:space-x-8 text-sm">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`transition-colors cursor-pointer bg-transparent border-none p-0 whitespace-nowrap ${getNavLinkClass(item.key)}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Action Group: Language Switcher + SOS */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          {/* Regional Language Switcher */}
          {setCurrentLang && (
            <div className={`relative flex items-center backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm transition-all border ${
              !isDark 
                ? 'bg-white border-zinc-200 text-zinc-900 shadow-xs' 
                : 'bg-zinc-900/80 border-zinc-700/80 text-zinc-200'
            }`}>
              <Languages className={`w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 shrink-0 ${!isDark ? 'text-blue-600' : 'text-cyan-400'}`} />
              <select
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value)}
                className="bg-transparent text-[11px] sm:text-xs font-semibold focus:outline-none cursor-pointer pr-1 max-w-[80px] sm:max-w-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-zinc-900 text-white">
                    {lang.native}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* SOS Button */}
          <button
            onClick={onSOSClick}
            className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-black text-white bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-400/40 active:scale-95 transition-all cursor-pointer animate-pulse whitespace-nowrap"
          >
            <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline-block mr-1" />
            <span>SOS 1554</span>
          </button>
        </div>
      </header>

      {/* Mobile Slide-Down Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-50 md:hidden bg-white/98 backdrop-blur-2xl border-b border-zinc-200 shadow-2xl p-4 space-y-2 text-zinc-900 font-['Outfit',sans-serif]"
          >
            <div className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest px-3 py-1">
              Modules & Dashboards
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleMobileTabSelect(item.key)}
                    className={`flex items-center space-x-2.5 p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

