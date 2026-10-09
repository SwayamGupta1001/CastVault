import React, { useState, useRef } from 'react';
import type { DiecastItem } from '../types';
import { formatCurrency } from '../utils/currency';
import { Edit2, Trash2, ShieldCheck, Eye, Camera } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface Card3DProps {
  item: DiecastItem;
  manufacturerName?: string;
  onPeekDetails: (item: DiecastItem) => void;
  onEditItem: (item: DiecastItem) => void;
  onDeleteItem: (id: string) => void;
  isSanitizedView?: boolean;
  currencyCode?: string;
}

export const Card3D: React.FC<Card3DProps> = ({
  item,
  manufacturerName,
  onPeekDetails,
  onEditItem,
  onDeleteItem,
  isSanitizedView = false,
  currencyCode = 'USD'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -8;
    const rotY = ((x - centerX) / centerX) * 8;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setIsHovered(true);
    }
  };

  const hasPhoto = Boolean(item.photos && item.photos.length > 0);
  const primaryPhoto = hasPhoto ? item.photos[item.isPrimaryPhotoIndex || 0] || item.photos[0] : null;
  const brandName = item.customManufacturer || manufacturerName || 'Diecast Maker';

  const scaleColorMap: Record<string, string> = {
    '1:64': 'bg-slate-800 text-slate-200 border-slate-700',
    '1:43': 'bg-blue-950/80 text-blue-300 border-blue-600/40',
    '1:24': 'bg-purple-950/80 text-purple-300 border-purple-600/40',
    '1:18': 'bg-amber-950/90 text-amber-300 border-amber-500/50',
    '1:12': 'bg-red-950/90 text-red-300 border-red-500/50',
    'Other': 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40'
  };

  const conditionColorMap: Record<string, string> = {
    'Mint in Box': 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40',
    'Mint in Window Box': 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40',
    'Acrylic Display Case (Sealed)': 'text-cyan-400 bg-cyan-950/60 border-cyan-800/40',
    'Styrofoam Clamshell / Boxed': 'text-teal-400 bg-teal-950/60 border-teal-800/40',
    'Blister Pack / Carded': 'text-amber-400 bg-amber-950/60 border-amber-800/40',
    'Uncarded / Out of Blister (Good)': 'text-teal-300 bg-teal-950/60 border-teal-700/40',
    'Loose / Mint': 'text-blue-400 bg-blue-950/60 border-blue-800/40',
    'Loose / Minor Wear': 'text-slate-300 bg-slate-800/80 border-slate-700/40',
    'Loose / Display Only (Dust-Free)': 'text-sky-300 bg-sky-950/60 border-sky-700/40',
    'Outer Box Wear / Car Mint': 'text-yellow-300 bg-yellow-950/60 border-yellow-800/40',
    'Customized / Code 3': 'text-purple-400 bg-purple-950/60 border-purple-800/40',
    'Restored / Repainted': 'text-indigo-400 bg-indigo-950/60 border-indigo-800/40',
    'Missing Accessories / Parts': 'text-orange-400 bg-orange-950/60 border-orange-800/40',
    'Damaged / For Parts': 'text-rose-400 bg-rose-950/60 border-rose-800/40'
  };

  const itemVal = item.estimatedValue || item.purchasePrice || 0;

  return (
    <div
      ref={cardRef}
      onClick={() => {
        triggerHaptic('light');
        onPeekDetails(item);
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: (!isTouchDevice && isHovered)
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
          : 'none',
        transition: (!isTouchDevice && isHovered) ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out'
      }}
      className="group relative glass-panel rounded-2xl border border-slate-800/90 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-red-950/30 hover:border-slate-700 flex flex-col justify-between cursor-pointer active:scale-[0.97] transition-all duration-200 ease-out select-none"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        {hasPhoto && primaryPhoto ? (
          <>
            <img
              src={primaryPhoto}
              alt={`${item.releaseYear || ''} ${item.vehicleMake} ${item.vehicleModel}`}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center p-4 text-center border-b border-slate-800/80">
            <div className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-red-400 group-hover:border-red-500/40 group-hover:scale-110 transition-all duration-300 shadow-inner mb-2">
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-xs font-extrabold text-slate-200 tracking-wider uppercase group-hover:text-white transition-colors">
              Add the Snap
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 font-medium">No photo uploaded</span>
          </div>
        )}

        <div className="absolute top-3 right-3 z-10">
          <span
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border backdrop-blur-md shadow-md ${
              scaleColorMap[item.scale] || 'bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            {item.scale}
          </span>
        </div>

        {hasPhoto && item.photos.length > 1 && (
          <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-[10px] font-medium text-slate-300 border border-slate-800">
            {item.photos.length} Photos
          </div>
        )}

        {/* Hover hint button for Desktop */}
        <div className="hidden sm:flex absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center gap-3 p-4 z-10">
          <div className="px-4 py-2 rounded-full bg-slate-900/90 text-slate-100 border border-slate-700 shadow-xl font-bold text-xs flex items-center gap-2">
            <Eye className="w-4 h-4 text-red-400" />
            <span>Click to View Full Info</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300 truncate">{brandName}</span>
            {item.releaseYear && <span className="font-mono text-slate-500">{item.releaseYear}</span>}
          </div>

          <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-red-400 transition-colors line-clamp-2">
            {item.vehicleMake} {item.vehicleModel}
          </h3>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/70 flex items-center justify-between gap-2">
          <span
            className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border truncate max-w-[110px] sm:max-w-[150px] ${
              conditionColorMap[item.condition] || 'text-slate-400 bg-slate-900 border-slate-800'
            }`}
          >
            {item.condition}
          </span>

          {!isSanitizedView ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-200 font-mono">
                {formatCurrency(itemVal, currencyCode)}
              </span>
              <div className="flex items-center gap-1 ml-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic('medium');
                    onEditItem(item);
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700/80 transition-all active:scale-95"
                  title="Edit Model Info"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic('warning');
                    onDeleteItem(item.id);
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-rose-400 border border-rose-900/40 transition-all active:scale-95"
                  title="Delete Model"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
