import React from 'react';
import type { DiecastItem, UserProfile } from '../types';
import { X, Award } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicProfile: UserProfile;
  publicItems: DiecastItem[];
  myItems: DiecastItem[];
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  publicProfile,
  publicItems,
  myItems
}) => {
  if (!isOpen) return null;

  const publicTotal = publicItems.length;
  const myTotal = myItems.length;

  const public164 = publicItems.filter((i) => i.scale === '1:64').length;
  const my164 = myItems.filter((i) => i.scale === '1:64').length;

  const public118 = publicItems.filter((i) => i.scale === '1:18').length;
  const my118 = myItems.filter((i) => i.scale === '1:18').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base font-mono uppercase">
                Collector vs Collector Flex
              </h3>
              <p className="text-xs text-slate-400">Garage Scale & Count Comparison</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs">
            <div className="font-bold text-slate-400">Metric</div>
            <div className="font-bold text-red-400">@{publicProfile.handle}</div>
            <div className="font-bold text-emerald-400">My Garage</div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 items-center text-center">
              <span className="font-semibold text-slate-300">Total Models</span>
              <span className="font-mono font-bold text-slate-100">{publicTotal}</span>
              <span className="font-mono font-bold text-slate-100">{myTotal}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 items-center text-center">
              <span className="font-semibold text-slate-300">1:64 Mainline</span>
              <span className="font-mono font-bold text-amber-400">{public164}</span>
              <span className="font-mono font-bold text-amber-400">{my164}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 items-center text-center">
              <span className="font-semibold text-slate-300">1:18 High-End</span>
              <span className="font-mono font-bold text-purple-400">{public118}</span>
              <span className="font-mono font-bold text-purple-400">{my118}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            triggerHaptic('light');
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider"
        >
          Close Comparison
        </button>
      </div>
    </div>
  );
};
