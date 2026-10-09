import React, { useState } from 'react';
import type { DiecastItem } from '../types';
import { formatCurrency } from '../utils/currency';
import { X, Tag, Hash, FileText, Edit3, Trash2, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface QuickPeekDrawerProps {
  item: DiecastItem | null;
  manufacturerName?: string;
  onClose: () => void;
  onEdit: (item: DiecastItem) => void;
  onDelete: (id: string) => void;
  isSanitizedView?: boolean;
  currencyCode?: string;
}

export const QuickPeekDrawer: React.FC<QuickPeekDrawerProps> = ({
  item,
  manufacturerName,
  onClose,
  onEdit,
  onDelete,
  isSanitizedView = false,
  currencyCode = 'USD'
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(item?.isPrimaryPhotoIndex || 0);

  if (!item) return null;
  const hasPhotos = Boolean(item.photos && item.photos.length > 0);
  const photos = hasPhotos ? item.photos : [];

  const brandName = item.customManufacturer || manufacturerName || 'Diecast Maker';
  const estimatedVal = item.estimatedValue || item.purchasePrice || 0;
  const purchaseVal = item.purchasePrice || 0;
  const delta = estimatedVal - purchaseVal;
  const roi = purchaseVal > 0 ? Math.round((delta / purchaseVal) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-opacity animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      {/* Floating Window Container */}
      <div className="relative w-full max-w-lg bg-slate-950/95 border border-slate-800 rounded-3xl shadow-2xl max-h-[90vh] flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-200 my-auto z-10">
        
        {/* Header with X close button on top right */}
        <div className="sticky top-0 z-10 glass-panel border-b border-slate-800/80 px-5 py-4 flex items-center justify-between bg-slate-950/90 backdrop-blur-xl">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2.5 py-1 rounded-xl bg-red-950/80 text-red-400 font-mono text-xs font-bold border border-red-500/40 shrink-0">
              {item.scale}
            </span>
            <span className="text-xs text-slate-300 font-bold truncate">
              {brandName}
            </span>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-red-600/20 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/40 transition-all shrink-0"
            title="Close Window (X)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Model Full Info Content */}
        <div className="p-5 space-y-6 flex-1 overflow-y-auto">
          
          {/* Main Photo Gallery */}
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg">
            {hasPhotos ? (
              <>
                <img
                  src={photos[activePhotoIndex]}
                  alt={item.vehicleModel}
                  className="w-full h-full object-cover"
                />
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur-md"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActivePhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur-md"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-3 shadow-lg">
                  <Camera className="w-8 h-8 text-red-500/80" />
                </div>
                <span className="text-sm font-extrabold text-slate-200 uppercase tracking-wide">
                  Add the Snap
                </span>
                <p className="text-xs text-slate-500 mt-1 max-w-xs font-medium">
                  No picture has been attached to this diecast model yet.
                </p>
              </div>
            )}
          </div>

          {hasPhotos && photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {photos.map((ph, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activePhotoIndex === idx ? 'border-red-500 scale-105' : 'border-slate-800 opacity-60'
                  }`}
                >
                  <img src={ph} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title & Brand Meta */}
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 font-sans tracking-tight">
              {item.vehicleMake} {item.vehicleModel}
            </h2>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
              <span>{brandName}</span>
              <span>•</span>
              <span className="text-amber-400 font-mono font-medium">{item.scale} Scale</span>
              {item.releaseYear && (
                <>
                  <span>•</span>
                  <span className="font-mono text-slate-500">{item.releaseYear}</span>
                </>
              )}
            </p>
          </div>

          {/* Condition Tag */}
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Condition:</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
              {item.condition}
            </span>
          </div>

          {/* Serial Number */}
          {item.serialNumber && !isSanitizedView && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-400 font-medium">Serial / Chassis Code:</span>
              </div>
              <span className="font-mono text-sm font-bold text-amber-300">{item.serialNumber}</span>
            </div>
          )}

          {/* Valuation Overview */}
          {!isSanitizedView && (
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Purchase Price</p>
                <p className="text-lg font-mono font-bold text-slate-200 mt-1">
                  {formatCurrency(purchaseVal, currencyCode)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Est. Current Value</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <p className="text-xl font-mono font-extrabold text-emerald-400">
                    {formatCurrency(estimatedVal, currencyCode)}
                  </p>
                  {roi !== 0 && (
                    <span className={`text-[10px] font-bold font-mono px-1 rounded ${roi > 0 ? 'text-emerald-400 bg-emerald-950' : 'text-rose-400 bg-rose-950'}`}>
                      {roi > 0 ? `+${roi}%` : `${roi}%`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Collector Notes */}
          {item.notes && !isSanitizedView && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Collector Notes & Provenance</span>
              </p>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {item.notes}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!isSanitizedView && (
          <div className="sticky bottom-0 glass-panel border-t border-slate-800/80 p-4 flex items-center justify-between gap-3 bg-slate-950/90 backdrop-blur-xl">
            <button
              onClick={() => {
                triggerHaptic('medium');
                onEdit(item);
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-all"
            >
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>Edit Model</span>
            </button>
            <button
              onClick={() => {
                triggerHaptic('warning');
                onDelete(item.id);
                onClose();
              }}
              className="py-2.5 px-4 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-sm font-semibold border border-rose-800 flex items-center justify-center gap-2 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
