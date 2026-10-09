import React from 'react';
import { triggerHaptic } from '../utils/haptics';
import { Sparkles, ExternalLink } from 'lucide-react';
import { SignatureAnimation } from '../components/SignatureAnimation';
import { CastVaultLogo } from '../components/CastVaultLogo';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-8 pb-24 md:pb-12 max-w-4xl mx-auto">
      {/* Platform Mission Hero Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 relative overflow-hidden text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 text-red-400 text-xs font-bold font-mono border border-red-500/30 mb-2">
          <CastVaultLogo className="w-5 h-5 rounded-lg" />
          <span>About CastVault</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-mono tracking-tight">
          The Ultimate Collector's Showroom & Vault
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          CastVault is an inventory management, financial valuation, and offline cataloging platform built specifically for scale model enthusiasts—from 1:64 pocket car collectors to 1:18 high-end resin connoisseurs.
        </p>
      </div>

      {/* Lead Creator Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-extrabold text-slate-100 font-mono uppercase tracking-tight">
            Meet the Creator
          </h2>
        </div>

        {/* Lead Creator Card: Swayam Gupta */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/90 space-y-6 hover:border-slate-700 transition-all max-w-3xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-amber-600 flex items-center justify-center text-white font-mono font-extrabold text-3xl shadow-xl shadow-red-950/50 border border-red-400/30 flex-shrink-0">
              SG
            </div>
            
            <div className="space-y-2 flex-1 min-w-0 w-full">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="px-3 py-1 rounded-full bg-red-950 text-red-400 text-xs font-bold font-mono border border-red-500/40 uppercase tracking-wider inline-block">
                    Founder & Sole Creator
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-100 font-mono mt-1.5">
                    Swayam Gupta
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Scale Model Collector & Lead Developer</p>
                </div>

                {/* Real-time Animated Signature next to Swayam Gupta's Name */}
                <div className="flex flex-col items-center sm:items-end shrink-0">
                  <SignatureAnimation className="w-60 h-28 sm:w-72 sm:h-36" autoPlay={true} loop={true} />
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            Passionate diecast collector of 1:64 TO 1:18 models. Mainly a HotWheels collector. HotWheels Cars make him fall in love with DieCast cars. Difficulty in storing the info about the cars made him to create a Virtual Garage for the DieCast collects which is known as The CastVault.
          </p>

          {/* Verified Social Anchors for Swayam */}
          <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-800/80">
            <a
              href="https://www.linkedin.com/in/swayam-gupta-417b86423?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic('light')}
              className="py-2.5 px-4 rounded-xl bg-blue-950/80 hover:bg-blue-900/80 text-blue-300 font-bold text-xs border border-blue-500/40 flex items-center gap-2 transition-all shadow-md"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
              </svg>
              <span>Connect on LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <a
              href="https://github.com/SwayamGupta1001"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic('light')}
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all shadow-md"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
              </svg>
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <a
              href="https://www.instagram.com/swayam__100108?dlrf=MTdlMHZqOHcydHk1dQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic('light')}
              className="py-2.5 px-4 rounded-xl bg-pink-950/80 hover:bg-pink-900/80 text-pink-300 font-bold text-xs border border-pink-500/40 flex items-center gap-2 transition-all shadow-md"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.8 3.8 0 0 0 3.8 7.8v8.4A3.8 3.8 0 0 0 7.6 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
              </svg>
              <span>Instagram</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
