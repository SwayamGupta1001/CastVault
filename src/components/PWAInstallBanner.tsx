import React from 'react';
import { Smartphone, Share, PlusSquare, Check, X } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface PWAInstallBannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-500/40 flex items-center justify-center text-red-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base font-mono uppercase">
                Install Mobile PWA / APK
              </h3>
              <p className="text-xs text-slate-400">Native Performance & Offline Sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <p className="font-bold text-slate-200 flex items-center gap-1.5 text-sm">
              <span>🍏 iOS (iPhone & iPad Safari)</span>
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-400">
              <li className="flex items-center gap-1.5">
                <span>Tap the</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold flex items-center gap-1">
                  <Share className="w-3 h-3 text-blue-400" /> Share
                </span>
                <span>button in Safari toolbar.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>Scroll down and select</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold flex items-center gap-1">
                  <PlusSquare className="w-3 h-3 text-emerald-400" /> Add to Home Screen
                </span>
              </li>
              <li>Launch Diecast Garage as a full-screen PWA!</li>
            </ol>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <p className="font-bold text-slate-200 flex items-center gap-1.5 text-sm">
              <span>🤖 Android (Chrome & Capacitor APK)</span>
            </p>
            <p className="text-slate-400">
              Tap the 3 dots in Chrome header and select <strong>"Install App"</strong> or build standalone APK container using Capacitor.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Includes 100% offline IndexedDB model caching & haptic feedback.</span>
          </div>
        </div>

        <button
          onClick={() => {
            triggerHaptic('light');
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider"
        >
          Got It, Thanks!
        </button>
      </div>
    </div>
  );
};
