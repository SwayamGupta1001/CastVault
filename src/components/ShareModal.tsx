import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { regenerateShareToken, saveStoredUserProfile } from '../utils/storage';
import { triggerHaptic } from '../utils/haptics';
import { X, Lock, Share2, Copy, Check, RefreshCw, ShieldCheck } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile
}) => {
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/#/share?token=${profile.shareToken}`;

  const handleCopy = () => {
    triggerHaptic('success');
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleVisibility = (visibility: 'private' | 'unlisted') => {
    triggerHaptic('medium');
    const updated = { ...profile, garageVisibility: visibility };
    saveStoredUserProfile(updated);
    onUpdateProfile(updated);
  };

  const handleRegenerate = () => {
    triggerHaptic('warning');
    setIsRegenerating(true);
    setTimeout(() => {
      const updated = regenerateShareToken();
      onUpdateProfile(updated);
      setIsRegenerating(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base font-mono uppercase">
                Showroom Privacy & Flex
              </h3>
              <p className="text-xs text-slate-400">Unlisted Shareable URL Settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
          <button
            onClick={() => handleToggleVisibility('private')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              profile.garageVisibility === 'private'
                ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4 text-slate-400" />
            <span>Private Only 🔒</span>
          </button>

          <button
            onClick={() => handleToggleVisibility('unlisted')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              profile.garageVisibility === 'unlisted'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Unlisted Link 🔗</span>
          </button>
        </div>

        {profile.garageVisibility === 'unlisted' ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Your Tokenized Showcase URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-slate-900 text-xs text-slate-300 font-mono p-3 rounded-xl border border-slate-800 focus:outline-none select-all truncate"
                />
                <button
                  onClick={handleCopy}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/50 transition-all active:scale-95"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Sanitized Public Projection Security</span>
              </p>
              <ul className="text-[11px] text-slate-400 space-y-1 pl-5 list-disc">
                <li>Purchase prices & acquisition costs are <strong>masked</strong>.</li>
                <li>Chassis serial numbers & VINs are <strong>hidden</strong>.</li>
                <li>Private storage notes & home address stay <strong>private</strong>.</li>
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 flex items-center justify-center gap-2 transition-all hover:text-amber-400"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-amber-400' : ''}`} />
                <span>Revoke & Regenerate Share Token</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center space-y-2">
            <Lock className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">Collection is currently Private</p>
            <p className="text-xs text-slate-500">
              Public crawlers and external visitors will receive a 404 Not Found response.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
