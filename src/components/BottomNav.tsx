import React from 'react';
import type { ViewTab } from '../types';
import { Home, Shield, Plus, Gauge, User } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface BottomNavProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenAddModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  onOpenAddModal
}) => {
  const navItems = [
    { id: 'garage' as ViewTab, label: 'Garage', icon: Home },
    { id: 'brands' as ViewTab, label: 'Brands', icon: Shield },
    { id: 'add' as ViewTab, label: 'Add', icon: Plus, isFab: true },
    { id: 'stats' as ViewTab, label: 'Stats', icon: Gauge },
    { id: 'about' as ViewTab, label: 'About', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800/80 px-2 py-1.5 backdrop-blur-xl bg-slate-950/90 pb-safe">
      <div className="flex items-center justify-around relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          if (item.isFab) {
            return (
              <div key={item.id} className="relative -top-5">
                <button
                  onClick={() => {
                    triggerHaptic('heavy');
                    onOpenAddModal();
                  }}
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 via-red-500 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-red-600/50 border-2 border-slate-900 active:scale-90 transition-transform speedo-pulse"
                  aria-label="Quick Add Model"
                >
                  <Plus className="w-7 h-7 stroke-[2.5]" />
                </button>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                triggerHaptic('light');
                onTabChange(item.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-red-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
