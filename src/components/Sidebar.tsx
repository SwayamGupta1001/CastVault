import React from 'react';
import type { ViewTab, UserProfile, ScaleOption } from '../types';
import { Home, Shield, Gauge, User, Plus, Layers, Settings, HardDrive } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface SidebarProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  profile: UserProfile;
  totalItems: number;
  selectedScaleFilter: string;
  onSelectScaleFilter: (scale: string) => void;
  onOpenAddModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  totalItems,
  selectedScaleFilter,
  onSelectScaleFilter,
  onOpenAddModal
}) => {
  const scales: ScaleOption[] = ['1:64', '1:43', '1:24', '1:18', '1:12'];

  const navItems = [
    { id: 'garage' as ViewTab, label: 'Vault Inventory', icon: Home },
    { id: 'brands' as ViewTab, label: 'Brand Hub', icon: Shield },
    { id: 'stats' as ViewTab, label: 'Analytics & P&L', icon: Gauge },
    { id: 'settings' as ViewTab, label: 'Vault Settings', icon: Settings },
    { id: 'about' as ViewTab, label: 'About Creators', icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-slate-800/80 p-4 h-[calc(100vh-65px)] sticky top-[65px]">
      <button
        onClick={() => {
          triggerHaptic('medium');
          onOpenAddModal();
        }}
        className="w-full mb-6 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold text-sm shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 border border-red-500/40 transition-all active:scale-95"
      >
        <Plus className="w-5 h-5 stroke-[2.5]" />
        <span>Vault New Model</span>
      </button>

      <div className="space-y-1 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                triggerHaptic('light');
                onTabChange(item.id);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between px-3 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>Filter Scale</span>
          </p>
          {selectedScaleFilter && (
            <button
              onClick={() => onSelectScaleFilter('')}
              className="text-[10px] text-red-400 hover:underline"
            >
              Reset
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 px-2">
          <button
            onClick={() => onSelectScaleFilter('')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
              selectedScaleFilter === ''
                ? 'bg-slate-700 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            All
          </button>
          {scales.map((sc) => (
            <button
              key={sc}
              onClick={() => onSelectScaleFilter(selectedScaleFilter === sc ? '' : sc)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                selectedScaleFilter === sc
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-xs font-bold text-slate-200">Device Vault</p>
              <p className="text-[10px] text-emerald-400 font-mono font-semibold">{totalItems} Models Vaulted</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
