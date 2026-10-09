import React, { useState, useEffect, useCallback } from 'react';
import { SignatureAnimation } from './SignatureAnimation';
import { Sparkles } from 'lucide-react';
import { CastVaultLogo } from './CastVaultLogo';

interface StartupLoaderProps {
  onFinish?: () => void;
}

export const StartupLoader: React.FC<StartupLoaderProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const [isCompleted, setIsCompleted] = useState(false);

  const handleSignatureComplete = useCallback(() => {
    setIsCompleted(true);
    // Keep loader on screen until whole signature loop is completed, hold for 1.2s to admire finished signature
    setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsVisible(false);
        if (onFinish) onFinish();
      }, 700);
    }, 1200);
  }, [onFinish]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, 400);
  };

  useEffect(() => {
    // Safety fallback only if signature fails to complete after 12 seconds
    const fallbackTimer = setTimeout(() => {
      handleSignatureComplete();
    }, 12000);

    return () => clearTimeout(fallbackTimer);
  }, [handleSignatureComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#060911] text-slate-100 flex flex-col items-center justify-center p-4 transition-opacity duration-600 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute w-[320px] h-[320px] bg-red-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute w-[260px] h-[260px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm mx-auto">
        
        {/* Brand Icon Header */}
        <div className="flex items-center gap-3 mb-2">
          <CastVaultLogo className="w-12 h-12 rounded-2xl shadow-xl shadow-red-950/60" />
          <h1 className="font-extrabold text-2xl tracking-wider text-slate-100 uppercase font-mono">
            Cast<span className="text-red-500">Vault</span>
          </h1>
        </div>

        {/* Real-time Writing Animated Signature */}
        <div className="p-4 rounded-3xl glass-panel border border-slate-800/80 shadow-2xl relative w-full flex flex-col items-center">
          <SignatureAnimation className="w-72 h-36" autoPlay={true} loop={false} onComplete={handleSignatureComplete} />
          
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>Crafted by <strong className="text-slate-200">Swayam Gupta</strong></span>
          </div>
        </div>

        {/* Loading Bar Indicator */}
        <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800/60">
          <div className={`h-full bg-gradient-to-r from-amber-500 via-red-500 to-pink-500 rounded-full transition-all duration-[3800ms] ease-out ${
            isCompleted ? 'w-full' : 'w-full animate-pulse'
          }`} />
        </div>

        <button
          onClick={handleSkip}
          className="text-[11px] font-mono text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest pt-2"
        >
          Skip Intro →
        </button>
      </div>
    </div>
  );
};
