import React from 'react';
import type { CurrencyOption } from '../types';
import { CURRENCIES, saveStoredCurrency } from '../utils/currency';
import { triggerHaptic } from '../utils/haptics';
import { Settings, DollarSign, Smartphone, Trash2, HardDrive } from 'lucide-react';

interface SettingsViewProps {
  currency: CurrencyOption;
  onCurrencyChange: (newCurrency: CurrencyOption) => void;
  onOpenAppDownload: () => void;
  onOpenClearModal: () => void;
  totalItems: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currency,
  onCurrencyChange,
  onOpenAppDownload,
  onOpenClearModal,
  totalItems
}) => {
  const handleCurrencySelect = (code: CurrencyOption) => {
    triggerHaptic('medium');
    saveStoredCurrency(code);
    onCurrencyChange(code);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12 animate-in fade-in duration-300">
      
      {/* Settings Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-xl shadow-red-950/50 border border-red-500/30">
          <Settings className="w-6 h-6 animate-spin-slow" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 font-sans tracking-tight">
            Vault Settings & Configuration
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage your currency preferences, offline storage, mobile app downloads, and vault options.
          </p>
        </div>
      </div>

      {/* 1. Valuation & Currency Settings */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
          <DollarSign className="w-5 h-5" />
          <span>Valuation Currency Preference</span>
        </div>
        <p className="text-xs text-slate-400">
          Select your default currency. All model valuations, portfolio totals, and collection metrics are automatically saved and displayed in this currency.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {CURRENCIES.map((c) => {
            const isSelected = currency === c.code;
            return (
              <button
                key={c.code}
                onClick={() => handleCurrencySelect(c.code)}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between text-left ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/40'
                    : 'bg-slate-900/80 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{c.flag}</span>
                  <span className="font-mono text-xs font-bold opacity-80">{c.symbol}</span>
                </div>
                <div className="mt-3">
                  <p className="font-mono font-extrabold text-sm text-slate-100">{c.code}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{c.label}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Mobile App Downloads */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
          <Smartphone className="w-5 h-5" />
          <span>Mobile Application & Installation</span>
        </div>
        <p className="text-xs text-slate-400">
          Install CastVault directly onto your Android device or iPhone (iOS) home screen for full offline access and native app functionality.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200 text-sm">Download CastVault App</p>
              <p className="text-xs text-slate-400">Available for Android (.APK / PWA) & Apple iOS Safari</p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('medium');
              onOpenAppDownload();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-950/40 transition-all active:scale-95"
          >
            Get App Options 📲
          </button>
        </div>
      </div>

      {/* 3. Vault Reset & Clear Data */}
      <div className="glass-panel p-6 rounded-3xl border border-rose-900/40 space-y-4">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
          <Trash2 className="w-5 h-5" />
          <span>Vault Data Reset</span>
        </div>
        <p className="text-xs text-slate-400">
          Want to start fresh or remove default mock data? You can clear all cached items from this device anytime.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-900/40 border border-rose-700/50 flex items-center justify-center text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200 text-sm">Clear Mock Data / Clear Vault</p>
              <p className="text-xs text-slate-400">Removes all stored items from device local storage</p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('warning');
              onOpenClearModal();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-950/50 transition-all active:scale-95"
          >
            Clear Vault Data 🧹
          </button>
        </div>
      </div>

      {/* 4. System Info */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div className="flex items-center gap-3">
          <HardDrive className="w-5 h-5 text-slate-500" />
          <div>
            <p className="text-slate-200 font-semibold">Local Storage Engine</p>
            <p className="font-mono text-[11px] text-slate-500 mt-0.5">{totalItems} Diecast Models Encrypted & Stored Offline</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-300 font-mono">CastVault v2.4.0 (Offline)</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Sole Creator: <span className="text-red-400 font-semibold">Swayam Gupta</span></p>
        </div>
      </div>

    </div>
  );
};
