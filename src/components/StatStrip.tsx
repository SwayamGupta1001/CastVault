import React from 'react';
import type { DiecastItem, UserProfile } from '../types';
import { formatCurrency } from '../utils/currency';
import { Car, DollarSign, TrendingUp, Layers } from 'lucide-react';

interface StatStripProps {
  items: DiecastItem[];
  profile: UserProfile;
}

export const StatStrip: React.FC<StatStripProps> = ({
  items,
  profile
}) => {
  const totalCount = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.estimatedValue || item.purchasePrice || 0), 0);
  const totalSpent = items.reduce((sum, item) => sum + (item.purchasePrice || 0), 0);
  const valueDelta = totalValue - totalSpent;
  const roiPercent = totalSpent > 0 ? Math.round((valueDelta / totalSpent) * 100) : 0;

  const scaleCounts: Record<string, number> = {};
  items.forEach((item) => {
    scaleCounts[item.scale] = (scaleCounts[item.scale] || 0) + 1;
  });

  let topScale = '1:64';
  let topScaleCount = 0;
  Object.entries(scaleCounts).forEach(([scale, count]) => {
    if (count > topScaleCount) {
      topScaleCount = count;
      topScale = scale;
    }
  });

  const topScalePercent = totalCount > 0 ? Math.round((topScaleCount / totalCount) * 100) : 0;
  const curr = profile.preferredCurrency || 'USD';

  return (
    <div className="w-full mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        
        {/* Total Models */}
        <div className="glass-panel p-3.5 sm:p-4 rounded-2xl border border-slate-800 flex items-center gap-3 min-w-0 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-red-400 shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
              Total Models
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-100 font-mono tabular-nums truncate">
              {totalCount}
            </p>
          </div>
        </div>

        {/* Top Scale */}
        <div className="glass-panel p-3.5 sm:p-4 rounded-2xl border border-slate-800 flex items-center gap-3 min-w-0 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-amber-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
              Top Scale
            </p>
            <div className="flex items-baseline gap-1.5 truncate">
              <p className="text-lg sm:text-xl font-bold text-amber-300 font-mono truncate">
                {topScale}
              </p>
              <span className="text-xs text-slate-400 font-mono shrink-0">
                ({topScalePercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Est. Portfolio Value */}
        <div className="glass-panel p-3.5 sm:p-4 rounded-2xl border border-slate-800 flex items-center gap-3 col-span-2 sm:col-span-1 min-w-0 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-emerald-400 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
              Est. Portfolio Value
            </p>
            <div className="flex items-baseline gap-2 min-w-0 overflow-hidden">
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono tabular-nums truncate">
                {formatCurrency(totalValue, curr)}
              </p>
              {roiPercent > 0 && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center shrink-0">
                  <TrendingUp className="w-3 h-3 mr-0.5" />+{roiPercent}%
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
