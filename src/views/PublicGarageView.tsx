import React, { useState } from 'react';
import type { DiecastItem, UserProfile, ScaleOption } from '../types';
import { Card3D } from '../components/Card3D';
import { MANUFACTURERS } from '../data/manufacturers';
import { triggerHaptic } from '../utils/haptics';
import { ShieldCheck, Share2, Search, Award, Check, Lock } from 'lucide-react';

interface PublicGarageViewProps {
  items: DiecastItem[];
  profile: UserProfile;
  onPeekDetails: (item: DiecastItem) => void;
  onOpenCompareModal: () => void;
}

export const PublicGarageView: React.FC<PublicGarageViewProps> = ({
  items,
  profile,
  onPeekDetails,
  onOpenCompareModal
}) => {
  const [selectedScale, setSelectedScale] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  if (profile.garageVisibility === 'private') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center max-w-md space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-200">404 - Garage Not Found</h2>
          <p className="text-xs text-slate-400">
            This collection is private or the unlisted share token has been revoked by the collector.
          </p>
        </div>
      </div>
    );
  }

  const filteredItems = items.filter((item) => {
    if (selectedScale && item.scale !== selectedScale) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = `${item.vehicleMake} ${item.vehicleModel} ${item.customManufacturer || ''}`.toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  const handleCopyLink = () => {
    triggerHaptic('success');
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scales: ScaleOption[] = ['1:64', '1:43', '1:24', '1:18', '1:12'];

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-xl"
            />
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-extrabold text-slate-100 font-mono">
                  @{profile.handle}'s Garage
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Unlisted Flex
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-lg">{profile.bio}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic('medium');
                onOpenCompareModal();
              }}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/50 flex items-center gap-2 transition-all active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>Compare With My Garage</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all text-xs"
              title="Share Showroom URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Curated Models</span>
            <p className="text-xl font-extrabold text-slate-100 font-mono">{items.length} Pieces</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Primary Focus</span>
            <p className="text-xl font-extrabold text-amber-400 font-mono">1:64 & 1:18</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Financial Protection</span>
            <p className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Prices & Serials Masked
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search make or model..."
            className="w-full bg-slate-900 text-xs text-slate-100 placeholder-slate-500 pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setSelectedScale('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              selectedScale === ''
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            All
          </button>
          {scales.map((sc) => (
            <button
              key={sc}
              onClick={() => setSelectedScale(selectedScale === sc ? '' : sc)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedScale === sc
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const brand = MANUFACTURERS.find((m) => m.id === item.manufacturerId);
          return (
            <Card3D
              key={item.id}
              item={item}
              manufacturerName={brand?.name}
              onPeekDetails={onPeekDetails}
              onEditItem={() => {}}
              onDeleteItem={() => {}}
              isSanitizedView={true}
            />
          );
        })}
      </div>
    </div>
  );
};
