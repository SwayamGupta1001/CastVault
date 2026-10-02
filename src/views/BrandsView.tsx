import React, { useState } from 'react';
import type { Manufacturer, DiecastItem } from '../types';
import { MANUFACTURERS } from '../data/manufacturers';
import { triggerHaptic } from '../utils/haptics';
import { Shield, ExternalLink, Filter, Search, X, Globe } from 'lucide-react';

interface BrandsViewProps {
  items: DiecastItem[];
  onFilterByBrand: (brandId: string) => void;
}

export const BrandsView: React.FC<BrandsViewProps> = ({ items, onFilterByBrand }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [activeBrandModal, setActiveBrandModal] = useState<Manufacturer | null>(null);

  const filteredBrands = MANUFACTURERS.filter((brand) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = `${brand.name} ${brand.country} ${brand.description}`.toLowerCase();
      if (!match.includes(q)) return false;
    }
    if (selectedTier && brand.tier !== selectedTier) return false;
    return true;
  });

  const tierColorMap: Record<string, string> = {
    'Budget Peg': 'bg-slate-800 text-slate-300 border-slate-700',
    'Mid Collector': 'bg-blue-950 text-blue-300 border-blue-500/40',
    'Premium Resin': 'bg-purple-950 text-purple-300 border-purple-500/40',
    'Ultra-Detailed Diecast': 'bg-amber-950 text-amber-300 border-amber-500/40'
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 text-red-400 text-xs font-bold font-mono border border-red-500/30 mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Authoritative Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono uppercase tracking-tight">
            Top 25 Diecast Manufacturers
          </h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Browse heritage origins, founding histories, specialty scales, and casting tiers of the world's finest model makers.
          </p>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search manufacturer name or country..."
            className="w-full bg-slate-900 text-xs text-slate-100 placeholder-slate-500 pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:border-red-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setSelectedTier('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedTier === ''
                ? 'bg-red-600 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            All Tiers
          </button>
          {['Budget Peg', 'Mid Collector', 'Premium Resin', 'Ultra-Detailed Diecast'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(selectedTier === tier ? '' : tier)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedTier === tier
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrands.map((brand) => {
          const ownedCount = items.filter(
            (i) => i.manufacturerId === brand.id || i.customManufacturer?.toLowerCase() === brand.name.toLowerCase()
          ).length;

          return (
            <div
              key={brand.id}
              onClick={() => {
                triggerHaptic('light');
                setActiveBrandModal(brand);
              }}
              className="group glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                    <span className="text-base">{brand.countryFlag}</span>
                    <span className="truncate">{brand.country}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-500">Est. {brand.foundingYear}</span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-100 group-hover:text-red-400 transition-colors">
                  {brand.name}
                </h3>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {brand.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${tierColorMap[brand.tier]}`}>
                  {brand.tier}
                </span>

                {ownedCount > 0 ? (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 text-[11px] font-mono font-bold border border-emerald-500/40">
                    You Own {ownedCount}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 font-mono">0 Owned</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {activeBrandModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="absolute inset-0" onClick={() => setActiveBrandModal(null)} />

          <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeBrandModal.countryFlag}</span>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-100 font-mono">
                    {activeBrandModal.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {activeBrandModal.country} • Founded {activeBrandModal.foundingYear}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveBrandModal(null)}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${tierColorMap[activeBrandModal.tier]}`}>
                {activeBrandModal.tier}
              </span>
              {activeBrandModal.primaryScales.map((s) => (
                <span key={s} className="px-3 py-1 rounded-xl bg-slate-900 text-amber-300 font-mono text-xs font-bold border border-slate-800">
                  Primary Scale: {s}
                </span>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300 leading-relaxed space-y-2">
              <p>{activeBrandModal.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => {
                  triggerHaptic('medium');
                  onFilterByBrand(activeBrandModal.id);
                  setActiveBrandModal(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/50 flex items-center justify-center gap-2"
              >
                <Filter className="w-4 h-4" />
                <span>View All My {activeBrandModal.name} Models</span>
              </button>

              <a
                href={activeBrandModal.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 flex items-center justify-center gap-1.5"
              >
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Official Site</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
