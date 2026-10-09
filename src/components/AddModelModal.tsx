import React, { useState, useEffect, useRef } from 'react';
import type { DiecastItem, ScaleOption, ConditionOption, CompressionResult } from '../types';
import { MANUFACTURERS } from '../data/manufacturers';
import { compressImageToWebP } from '../utils/imageCompressor';
import { triggerHaptic } from '../utils/haptics';
import confetti from 'canvas-confetti';
import { X, Camera, Upload, Check, Layers, DollarSign, Tag, Hash } from 'lucide-react';

interface AddModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: DiecastItem) => void;
  initialItem?: DiecastItem | null;
  defaultBrandId?: string;
}

export const AddModelModal: React.FC<AddModelModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  defaultBrandId
}) => {
  const [make, setMake] = useState(initialItem?.vehicleMake || '');
  const [model, setModel] = useState(initialItem?.vehicleModel || '');
  const [scale, setScale] = useState<ScaleOption>(initialItem?.scale || '1:64');
  const [manufacturerId, setManufacturerId] = useState(initialItem?.manufacturerId || defaultBrandId || 'm-hotwheels');
  const [customManufacturer, setCustomManufacturer] = useState(initialItem?.customManufacturer || '');
  const [series, setSeries] = useState(initialItem?.series || 'Hot Wheels Silver Series');
  const [condition, setCondition] = useState<ConditionOption>(initialItem?.condition || 'Mint in Box');
  const [releaseYear, setReleaseYear] = useState<string>(() => initialItem?.releaseYear?.toString() || new Date().getFullYear().toString());
  const [purchasePrice, setPurchasePrice] = useState<string>(initialItem?.purchasePrice?.toString() || '');
  const [estimatedValue, setEstimatedValue] = useState<string>(initialItem?.estimatedValue?.toString() || '');
  const [serialNumber, setSerialNumber] = useState(initialItem?.serialNumber || '');
  const [notes, setNotes] = useState(initialItem?.notes || '');
  
  const [photos, setPhotos] = useState<string[]>(initialItem?.photos || []);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionFeedback, setCompressionFeedback] = useState<CompressionResult | null>(null);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const makeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialItem) {
        setMake(initialItem.vehicleMake || '');
        setModel(initialItem.vehicleModel || '');
        setScale(initialItem.scale || '1:64');
        setManufacturerId(initialItem.manufacturerId || defaultBrandId || 'm-hotwheels');
        setCustomManufacturer(initialItem.customManufacturer || '');
        setSeries(initialItem.series || 'Hot Wheels Silver Series');
        setCondition(initialItem.condition || 'Mint in Box');
        setReleaseYear(initialItem.releaseYear?.toString() || new Date().getFullYear().toString());
        setPurchasePrice(initialItem.purchasePrice?.toString() || '');
        setEstimatedValue(initialItem.estimatedValue?.toString() || '');
        setSerialNumber(initialItem.serialNumber || '');
        setNotes(initialItem.notes || '');
        setPhotos(initialItem.photos || []);
      } else {
        setMake('');
        setModel('');
        setScale('1:64');
        setManufacturerId(defaultBrandId || 'm-hotwheels');
        setCustomManufacturer('');
        setSeries('Hot Wheels Silver Series');
        setCondition('Mint in Box');
        setReleaseYear(new Date().getFullYear().toString());
        setPurchasePrice('');
        setEstimatedValue('');
        setSerialNumber('');
        setNotes('');
        setPhotos([]);
      }
      setCompressionFeedback(null);
      setErrors({});
    }
  }, [isOpen, initialItem, defaultBrandId]);

  const scales: ScaleOption[] = ['1:64', '1:43', '1:24', '1:18', '1:12', 'Other'];
  
  // Comprehensive Collector Condition Options
  const conditions: ConditionOption[] = [
    'Mint in Box',
    'Blister Pack / Carded',
    'Uncarded / Out of Blister (Good)',
    'Loose / Mint',
    'Loose / Minor Wear',
    'Customized / Code 3',
    'Restored / Repainted',
    'Damaged / For Parts'
  ];

  if (!isOpen) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    triggerHaptic('medium');

    try {
      const file = files[0];
      const compressed = await compressImageToWebP(file);
      setCompressionFeedback(compressed);
      setPhotos((prev) => [compressed.dataUrl, ...prev].slice(0, 5));
    } catch (err) {
      console.error('Image compression failed', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    triggerHaptic('light');
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!make.trim()) newErrors.make = 'Vehicle Make is required';
    if (!model.trim()) newErrors.model = 'Vehicle Model is required';
    if (!scale) newErrors.scale = 'Scale is required';
    if (!condition) newErrors.condition = 'Condition is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerHaptic('warning');
      if (newErrors.make && makeInputRef.current) {
        makeInputRef.current.focus();
      }
      return;
    }

    const selectedBrand = MANUFACTURERS.find((m) => m.id === manufacturerId);
    const itemToSave: DiecastItem = {
      id: initialItem?.id || 'item-' + Date.now(),
      vehicleMake: make.trim(),
      vehicleModel: model.trim(),
      scale,
      manufacturerId,
      customManufacturer: customManufacturer.trim() || selectedBrand?.name || 'Custom Maker',
      series: series.trim() || undefined,
      condition,
      releaseYear: releaseYear ? parseInt(releaseYear, 10) : undefined,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
      estimatedValue: estimatedValue ? parseFloat(estimatedValue) : (purchasePrice ? parseFloat(purchasePrice) * 1.2 : undefined),
      currency: 'USD',
      serialNumber: serialNumber.trim() || undefined,
      notes: notes.trim() || undefined,
      photos: photos,
      isPrimaryPhotoIndex: 0,
      createdAt: initialItem?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    triggerHaptic('success');
    
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 }
    });

    onSave(itemToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col justify-between animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 z-10 glass-panel border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wider font-mono">
              {initialItem ? 'Edit Model Details' : 'Park Model in CastVault'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-red-400" />
                <span>Step 1: Visual Snap (Up to 5 Photos)</span>
              </label>
              <span className="text-[11px] text-emerald-400 font-mono">Auto WebP Compression Active</span>
            </div>

            {compressionFeedback && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in">
                <span>
                  ✨ Compressed {compressionFeedback.originalSizeKB} KB down to <strong>{compressionFeedback.compressedSizeKB} KB WebP</strong>!
                </span>
                <span className="font-bold font-mono text-emerald-400">-{compressionFeedback.ratioSavedPercent}%</span>
              </div>
            )}

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-700 hover:border-red-500 bg-slate-900/60 hover:bg-slate-900 flex flex-col items-center justify-center text-slate-400 hover:text-slate-200 transition-all group"
              >
                {isCompressing ? (
                  <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 mb-1 text-red-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-center">Snap / Add</span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              {photos.map((photo, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 group">
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-red-600 text-[9px] font-bold text-white uppercase">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/80 text-slate-300 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Step 2: Core Identity</span>
            </label>

            <div>
              <span className="text-xs text-slate-400 block mb-2 font-medium">Scale *</span>
              <div className="grid grid-cols-6 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {scales.map((sc) => (
                  <button
                    type="button"
                    key={sc}
                    onClick={() => setScale(sc)}
                    className={`py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                      scale === sc
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sc}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">Vehicle Make *</label>
                <input
                  ref={makeInputRef}
                  type="text"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder="e.g. Nissan, Porsche, Ferrari"
                  className={`w-full bg-slate-900 text-sm text-slate-100 px-3.5 py-2.5 rounded-xl border ${
                    errors.make ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-red-500'
                  } focus:outline-none`}
                />
                {errors.make && <p className="text-[11px] text-red-400 mt-1">{errors.make}</p>}
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">Vehicle Model *</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Skyline GT-R R34, 911 GT3 RS"
                  className={`w-full bg-slate-900 text-sm text-slate-100 px-3.5 py-2.5 rounded-xl border ${
                    errors.model ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-red-500'
                  } focus:outline-none`}
                />
                {errors.model && <p className="text-[11px] text-red-400 mt-1">{errors.model}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">Manufacturer / Diecast Brand</label>
                <select
                  value={manufacturerId}
                  onChange={(e) => setManufacturerId(e.target.value)}
                  className="w-full bg-slate-900 text-sm text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-red-500 focus:outline-none"
                >
                  {MANUFACTURERS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.countryFlag} {m.name} ({m.tier})
                    </option>
                  ))}
                  <option value="custom">Other / Custom Brand</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">Casting Series / Line</label>
                <select
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                  className="w-full bg-slate-900 text-sm text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-red-500 focus:outline-none font-mono text-xs font-semibold"
                >
                  <option value="Hot Wheels Silver Series">Hot Wheels Silver Series</option>
                  <option value="Hot Wheels Premium Series">Hot Wheels Premium Series</option>
                  <option value="Hot Wheels Mainline">Hot Wheels Mainline</option>
                  <option value="Red Line Club (RLC)">Red Line Club (RLC)</option>
                  <option value="Matchbox Moving Parts / Collectors">Matchbox Moving Parts / Collectors</option>
                  <option value="Mini GT Standard / Chase">Mini GT Standard / Chase</option>
                  <option value="Standard / Mainline">Standard / Mainline</option>
                  <option value="Other / Special Series">Other / Special Series</option>
                </select>
              </div>

              {manufacturerId === 'custom' && (
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Custom Brand Name</label>
                  <input
                    type="text"
                    value={customManufacturer}
                    onChange={(e) => setCustomManufacturer(e.target.value)}
                    placeholder="Enter brand name"
                    className="w-full bg-slate-900 text-sm text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-red-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">Release / Casting Year</label>
                <input
                  type="number"
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(e.target.value)}
                  placeholder="e.g. 2023"
                  className="w-full bg-slate-900 text-sm text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-red-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>Step 3: Condition & Financial Provenance</span>
            </label>

            {/* Expanded Condition Options Grid */}
            <div>
              <span className="text-xs text-slate-400 block mb-2 font-medium">Condition *</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {conditions.map((cond) => (
                  <button
                    type="button"
                    key={cond}
                    onClick={() => setCondition(cond)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between ${
                      condition === cond
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500 font-bold shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{cond}</span>
                    {condition === cond && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">Purchase Price ($)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="number"
                    step="0.01"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-900 text-sm text-slate-100 pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:border-red-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">Estimated Value ($)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                  <input
                    type="number"
                    step="0.01"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-900 text-sm text-slate-100 pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none font-mono text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">Serial / Chassis #</label>
                <div className="relative">
                  <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="e.g. #042/500"
                    className="w-full bg-slate-900 text-sm text-slate-100 pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none font-mono text-amber-300"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">Internal Notes & Provenance</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Paint code, display box location, swap meet history..."
                className="w-full bg-slate-900 text-sm text-slate-100 p-3 rounded-xl border border-slate-800 focus:border-red-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-base shadow-xl shadow-red-950/60 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>{initialItem ? 'Save Changes 🏁' : 'Park in CastVault 🏁'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
