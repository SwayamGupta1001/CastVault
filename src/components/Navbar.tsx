import React, { useState } from 'react';
import type { ViewTab } from '../types';
import { Car, Search, Settings } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface NavbarProps {
  totalItems: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  currentTab,
  onTabChange
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full max-w-full overflow-x-hidden glass-panel border-b border-slate-800/80 px-3 sm:px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        
        {/* Left: Brand Identity */}
        <div 
          onClick={() => onTabChange('garage')}
          className="flex items-center gap-2 shrink-0 cursor-pointer group"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-lg shadow-red-950/40 border border-red-500/30 group-hover:scale-105 transition-transform">
            <Car className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h1 className="font-extrabold text-base sm:text-xl tracking-wider text-slate-100 uppercase font-mono">
                Cast<span className="text-red-500">Vault</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className={`flex-1 min-w-0 transition-all duration-300 ${isSearchExpanded ? 'w-full' : 'max-w-[160px] xs:max-w-[220px] sm:max-w-md'}`}>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search models..."
              onFocus={() => setIsSearchExpanded(true)}
              onBlur={() => setIsSearchExpanded(false)}
              className="w-full bg-slate-900/90 text-xs text-slate-100 placeholder-slate-500 pl-8 pr-2.5 py-2 rounded-xl border border-slate-800 focus:border-red-500/60 focus:outline-none transition-all truncate"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 hover:text-slate-300 font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right: Quick Settings Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              triggerHaptic('medium');
              onTabChange('settings');
            }}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold active:scale-95 shrink-0 ${
              currentTab === 'settings'
                ? 'bg-red-600/20 text-red-400 border-red-500/40 shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="Open Vault Settings"
          >
            <Settings className={`w-4 h-4 ${currentTab === 'settings' ? 'text-red-400 animate-spin-slow' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>

      </div>
    </header>
  );
};
