import React, { useState, useEffect } from 'react';
import { X, Smartphone, Download, Share, PlusSquare, CheckCircle2, ShieldCheck, Cpu, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({ isOpen, onClose }) => {
  const [activeOS, setActiveOS] = useState<'android' | 'ios'>(() => {
    if (typeof navigator !== 'undefined') {
      return (/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream) ? 'ios' : 'android';
    }
    return 'android';
  });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    triggerHaptic('medium');
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40 border border-emerald-500/30">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base font-mono uppercase tracking-wide">
                Get CastVault App
              </h3>
              <p className="text-xs text-emerald-400 font-medium">Install for Android & iPhone (iOS)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* OS Tab Selector */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold font-mono">
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveOS('android');
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeOS === 'android'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-4 h-4 fill-current text-emerald-400" viewBox="0 0 24 24">
              <path d="M17.523 15.3414C17.06 15.3414 16.691 14.9724 16.691 14.5094C16.691 14.0464 17.06 13.6774 17.523 13.6774C17.986 13.6774 18.355 14.0464 18.355 14.5094C18.355 14.9724 17.986 15.3414 17.523 15.3414ZM6.477 15.3414C6.014 15.3414 5.645 14.9724 5.645 14.5094C5.645 14.0464 6.014 13.6774 6.477 13.6774C6.94 13.6774 7.309 14.0464 7.309 14.5094C7.309 14.9724 6.94 15.3414 6.477 15.3414ZM17.848 10.7424L19.539 7.8134C19.664 7.5974 19.589 7.3204 19.373 7.1954C19.157 7.0704 18.88 7.1454 18.755 7.3614L17.031 10.3474C15.529 9.6614 13.824 9.2734 12 9.2734C10.176 9.2734 8.471 9.6614 6.969 10.3474L5.245 7.3614C5.12 7.1454 4.843 7.0704 4.627 7.1954C4.411 7.3204 4.336 7.5974 4.461 7.8134L6.152 10.7424C2.656 12.6514 0.254 16.1954 0 20.3544H24C23.746 16.1954 21.344 12.6514 17.848 10.7424Z" />
            </svg>
            <span>Android OS</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveOS('ios');
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeOS === 'ios'
                ? 'bg-sky-950 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-4 h-4 fill-current text-slate-100" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.09c.68-.83 1.14-1.99.1-3.09-1-.05-2.22.68-2.9 1.48-.6.7-1.12 1.86-.98 2.96 1.13.09 2.3-.52 2.78-1.35z" />
            </svg>
            <span>iPhone / iOS</span>
          </button>
        </div>

        {/* Tab Content: ANDROID */}
        {activeOS === 'android' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300 font-medium">Verified APK</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300 font-medium">Offline Garage Sync</span>
              </div>
            </div>

            {isInstalled ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-bold text-sm">CastVault is Installed!</p>
                <p className="text-xs text-emerald-300/80">Launch CastVault directly from your Android launcher.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {deferredPrompt && (
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4 stroke-[3]" />
                    <span>One-Click Install Native Android App</span>
                  </button>
                )}

                <a
                  href="/castvault.apk"
                  download="CastVault-Offline.apk"
                  onClick={() => triggerHaptic('success')}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 border border-emerald-500/40 transition-all active:scale-95 text-center"
                >
                  <Download className="w-4 h-4 stroke-[3]" />
                  <span>Download CastVault Offline APK 🤖</span>
                </a>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs text-slate-400">
              <p className="font-bold text-slate-200 font-mono">Android Setup Guide:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Open <strong className="text-white">CastVault</strong> in Chrome on Android.</li>
                <li>Tap <strong className="text-emerald-400">Menu (⋮) → "Install App"</strong>.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab Content: iOS */}
        {activeOS === 'ios' && (
          <div className="space-y-3 animate-in fade-in duration-200 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-sky-950 text-sky-400 font-mono font-bold flex items-center justify-center shrink-0 border border-sky-500/30">
                1
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-200">Open in Safari Browser</p>
                <p className="text-slate-400">View CastVault inside Apple Safari on iPhone.</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-sky-950 text-sky-400 font-mono font-bold flex items-center justify-center shrink-0 border border-sky-500/30">
                2
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-200">Tap Share Button</p>
                <p className="text-slate-400 flex items-center gap-1">
                  Tap <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-400 font-bold border border-slate-700 flex items-center gap-1"><Share className="w-3.5 h-3.5" /> Share</span> in Safari bottom bar.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-emerald-950 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0 border border-emerald-500/30">
                3
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-200">Select 'Add to Home Screen'</p>
                <p className="text-slate-400 flex items-center gap-1">
                  Scroll and select <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold border border-slate-700 flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen</span>.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-sky-950/40 border border-sky-500/30 text-sky-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Full-screen iOS PWA experience without Safari search bars!</span>
            </div>
          </div>
        )}

        {/* Footer Close */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs"
        >
          Close
        </button>
      </div>
    </div>
  );
};
