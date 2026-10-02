import React from 'react';
import type { DiecastItem, UserProfile } from '../types';
import { MANUFACTURERS } from '../data/manufacturers';
import { formatCurrency } from '../utils/currency';
import { Gauge, Layers, Tag, Award } from 'lucide-react';

interface StatsViewProps {
  items: DiecastItem[];
  profile: UserProfile;
}

export const StatsView: React.FC<StatsViewProps> = ({ items, profile }) => {
  const curr = profile.preferredCurrency || 'USD';
  const totalCount = items.length;
  const totalSpent = items.reduce((sum, item) => sum + (item.purchasePrice || 0), 0);
  const totalValue = items.reduce((sum, item) => sum + (item.estimatedValue || item.purchasePrice || 0), 0);
  const valueDelta = totalValue - totalSpent;
  const roiPercent = totalSpent > 0 ? Math.round((valueDelta / totalSpent) * 100) : 0;

  const scaleMap: Record<string, { count: number; totalVal: number }> = {};
  items.forEach((item) => {
    if (!scaleMap[item.scale]) {
      scaleMap[item.scale] = { count: 0, totalVal: 0 };
    }
    scaleMap[item.scale].count += 1;
    scaleMap[item.scale].totalVal += item.estimatedValue || item.purchasePrice || 0;
  });

  const conditionMap: Record<string, number> = {};
  items.forEach((item) => {
    conditionMap[item.condition] = (conditionMap[item.condition] || 0) + 1;
  });

  const brandRanking: Record<string, number> = {};
  items.forEach((item) => {
    const brand = MANUFACTURERS.find((m) => m.id === item.manufacturerId);
    const name = item.customManufacturer || brand?.name || 'Other Maker';
    brandRanking[name] = (brandRanking[name] || 0) + 1;
  });

  const sortedBrands = Object.entries(brandRanking).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 text-amber-400 text-xs font-bold font-mono border border-amber-500/30 mb-3">
          <Gauge className="w-3.5 h-3.5" />
          <span>Valuation & Analytics Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono uppercase tracking-tight">
          Portfolio Valuation & P&L ({curr})
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Detailed financial performance, ROI deltas, and scale distribution breakdown across your vault.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Acquisition Cost</p>
          <p className="text-2xl font-extrabold text-slate-100 font-mono tabular-nums">
            {formatCurrency(totalSpent, curr)}
          </p>
          <p className="text-[11px] text-slate-500">Sum of purchase prices</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Est. Current Value</p>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono tabular-nums">
            {formatCurrency(totalValue, curr)}
          </p>
          <p className="text-[11px] text-slate-500">Based on market estimates</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">P&L Unrealized Delta</p>
          <div className="flex items-baseline gap-2">
            <p className={`text-2xl font-extrabold font-mono tabular-nums ${valueDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {valueDelta >= 0 ? `+${formatCurrency(valueDelta, curr)}` : `-${formatCurrency(Math.abs(valueDelta), curr)}`}
            </p>
            <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${valueDelta >= 0 ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
              {roiPercent > 0 ? `+${roiPercent}% ROI` : `${roiPercent}% ROI`}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Valuation growth</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-200 font-mono uppercase flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Scale Distribution & Valuation Share</span>
        </h3>

        <div className="space-y-3">
          {Object.entries(scaleMap).map(([sc, data]) => {
            const pct = totalCount > 0 ? Math.round((data.count / totalCount) * 100) : 0;
            return (
              <div key={sc} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-slate-200">{sc} Scale ({data.count} models)</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(data.totalVal, curr)} ({pct}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-200 font-mono uppercase flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-400" />
            <span>Condition Distribution</span>
          </h3>
          <div className="space-y-2">
            {Object.entries(conditionMap).map(([cond, count]) => {
              const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
              return (
                <div key={cond} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">{cond}</span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {count} pieces ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-200 font-mono uppercase flex items-center gap-2">
            <Award className="w-4 h-4 text-red-400" />
            <span>Most Collected Manufacturers</span>
          </h3>
          <div className="space-y-2">
            {sortedBrands.slice(0, 5).map(([brandName, count], idx) => (
              <div key={brandName} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center justify-center border border-slate-700">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-200">{brandName}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {count} {count === 1 ? 'model' : 'models'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
