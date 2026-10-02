import React, { useState, useMemo } from 'react';
import type { DiecastItem, UserProfile, ScaleOption } from '../types';
import { StatStrip } from '../components/StatStrip';
import { Card3D } from '../components/Card3D';
import { MANUFACTURERS } from '../data/manufacturers';
import { formatCurrency } from '../utils/currency';
import { triggerHaptic } from '../utils/haptics';
import { Grid, List, Car } from 'lucide-react';

interface GarageViewProps {
  items: DiecastItem[];
  profile: UserProfile;
  searchQuery: string;
  selectedScaleFilter: string;
  onSelectScaleFilter: (scale: string) => void;
  onPeekDetails: (item: DiecastItem) => void;
  onEditItem: (item: DiecastItem) => void;
  onDeleteItem: (id: string) => void;
  onOpenAddModal: () => void;
  selectedBrandFilter: string;
  onSelectBrandFilter: (brandId: string) => void;
}

export const GarageView: React.FC<GarageViewProps> = ({
  items,
  profile,
  searchQuery,
  selectedScaleFilter,
  onSelectScaleFilter,
  onPeekDetails,
  onEditItem,
  onDeleteItem,
  onOpenAddModal,
  selectedBrandFilter,
  onSelectBrandFilter
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'highest-val' | 'make-az' | 'scale'>('newest');

  const curr = profile.preferredCurrency || 'USD';

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const textToMatch = `${item.vehicleMake} ${item.vehicleModel} ${item.customManufacturer || ''} ${item.serialNumber || ''} ${item.notes || ''}`.toLowerCase();
        if (!textToMatch.includes(query)) return false;
      }

      if (selectedScaleFilter && item.scale !== selectedScaleFilter) {
        return false;
      }

      if (selectedBrandFilter) {
        if (item.manufacturerId !== selectedBrandFilter && item.customManufacturer !== selectedBrandFilter) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'highest-val') {
        const valA = a.estimatedValue || a.purchasePrice || 0;
        const valB = b.estimatedValue || b.purchasePrice || 0;
        return valB - valA;
      }
      if (sortBy === 'make-az') {
        return `${a.vehicleMake} ${a.vehicleModel}`.localeCompare(`${b.vehicleMake} ${b.vehicleModel}`);
      }
      if (sortBy === 'scale') {
        return a.scale.localeCompare(b.scale);
      }
      return 0;
    });
  }, [items, searchQuery, selectedScaleFilter, selectedBrandFilter, sortBy]);

  const scales: ScaleOption[] = ['1:64', '1:43', '1:24', '1:18', '1:12'];

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      <StatStrip items={items} profile={profile} />

      <div className="glass-panel p-3.5 sm:p-4 rounded-2xl border border-slate-800 space-y-3">
        {/* Top Control Row: Size Ratio Select & View Toggle */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <label htmlFor="scale-ratio-select" className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap shrink-0">
              Size Ratio:
            </label>
            <select
              id="scale-ratio-select"
              value={selectedScaleFilter}
              onChange={(e) => {
                triggerHaptic('light');
                onSelectScaleFilter(e.target.value);
              }}
              className="bg-slate-900 text-xs text-amber-300 font-mono font-bold px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500/50 cursor-pointer shadow-sm truncate max-w-[180px] xs:max-w-none"
            >
              <option value="">All Size Ratios ({items.length})</option>
              {scales.map((sc) => {
                const count = items.filter((i) => i.scale === sc).length;
                return (
                  <option key={sc} value={sc}>
                    {sc} Ratio ({count})
                  </option>
                );
              })}
              <option value="Other">
                Other Ratios ({items.filter((i) => i.scale === 'Other').length})
              </option>
            </select>
          </div>

          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => {
                triggerHaptic('light');
                setViewMode('grid');
              }}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                viewMode === 'grid' ? 'bg-slate-800 text-red-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                triggerHaptic('light');
                setViewMode('list');
              }}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                viewMode === 'list' ? 'bg-slate-800 text-red-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Compact List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Second Control Row: Brand Filter & Sort Dropdown Grid */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-end">
          <select
            value={selectedBrandFilter}
            onChange={(e) => onSelectBrandFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-900 text-xs text-slate-200 px-2.5 py-2 rounded-xl border border-slate-800 focus:outline-none truncate min-w-0"
          >
            <option value="">All Brands</option>
            {MANUFACTURERS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.countryFlag} {m.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full sm:w-auto bg-slate-900 text-xs text-slate-200 px-2.5 py-2 rounded-xl border border-slate-800 focus:outline-none truncate min-w-0"
          >
            <option value="newest">Sort: Newest</option>
            <option value="highest-val">Sort: Highest Value</option>
            <option value="make-az">Sort: Make (A-Z)</option>
            <option value="scale">Sort: Scale</option>
          </select>
        </div>
      </div>

      {filteredItems.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => {
              const brand = MANUFACTURERS.find((m) => m.id === item.manufacturerId);
              return (
                <Card3D
                  key={item.id}
                  item={item}
                  manufacturerName={brand?.name}
                  onPeekDetails={onPeekDetails}
                  onEditItem={onEditItem}
                  onDeleteItem={onDeleteItem}
                  currencyCode={curr}
                />
              );
            })}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="py-3 px-4">Cover</th>
                  <th className="py-3 px-4">Make & Model</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Scale</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4 text-right">Est. Value</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredItems.map((item) => {
                  const brand = MANUFACTURERS.find((m) => m.id === item.manufacturerId);
                  const itemVal = item.estimatedValue || item.purchasePrice || 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-2.5 px-4">
                        <img
                          src={item.photos[0]}
                          alt=""
                          className="w-12 h-9 rounded-lg object-cover border border-slate-800"
                        />
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-100">
                        {item.vehicleMake} {item.vehicleModel}
                        {item.serialNumber && (
                          <span className="block text-[10px] font-mono text-amber-400">
                            {item.serialNumber}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-slate-400">
                        {item.customManufacturer || brand?.name || '-'}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-900 font-mono text-amber-300 font-bold border border-slate-800">
                          {item.scale}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">
                          {item.condition}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-400">
                        {formatCurrency(itemVal, curr)}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onPeekDetails(item)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                            title="View Details"
                          >
                            View
                          </button>
                          <button
                            onClick={() => onEditItem(item)}
                            className="p-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-800/60 text-xs font-medium"
                            title="Edit Model Info"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 text-xs font-medium"
                            title="Delete Model"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-200">No Models Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              {searchQuery || selectedScaleFilter || selectedBrandFilter
                ? 'Try clearing your search filters to view your vault.'
                : 'Your vault is currently empty. Start cataloging your first piece!'}
            </p>
          </div>
          <button
            onClick={() => {
              onSelectScaleFilter('');
              onSelectBrandFilter('');
              onOpenAddModal();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/50"
          >
            Park First Model 🏎️
          </button>
        </div>
      )}
    </div>
  );
};
