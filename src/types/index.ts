export type ScaleOption = '1:64' | '1:43' | '1:24' | '1:18' | '1:12' | 'Other';

export type ConditionOption = 
  | 'Mint in Box' 
  | 'Mint in Window Box'
  | 'Acrylic Display Case (Sealed)'
  | 'Styrofoam Clamshell / Boxed'
  | 'Blister Pack / Carded' 
  | 'Uncarded / Out of Blister (Good)'
  | 'Loose / Mint' 
  | 'Loose / Minor Wear'
  | 'Loose / Display Only (Dust-Free)'
  | 'Outer Box Wear / Car Mint'
  | 'Customized / Code 3'
  | 'Restored / Repainted'
  | 'Missing Accessories / Parts'
  | 'Damaged / For Parts';

export type TierOption = 
  | 'Budget Peg' 
  | 'Mid Collector' 
  | 'Premium Resin' 
  | 'Ultra-Detailed Diecast';

export type CurrencyOption = 'USD' | 'INR' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'AED';

export interface DiecastItem {
  id: string;
  vehicleMake: string;
  vehicleModel: string;
  manufacturerId?: string;
  customManufacturer?: string;
  series?: string;
  scale: ScaleOption;
  releaseYear?: number;
  condition: ConditionOption;
  purchasePrice?: number;
  estimatedValue?: number;
  currency: string;
  serialNumber?: string;
  notes?: string;
  photos: string[];
  isPrimaryPhotoIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface Manufacturer {
  id: string;
  name: string;
  slug: string;
  country: string;
  countryFlag: string;
  tier: TierOption;
  primaryScales: ScaleOption[];
  foundingYear: number;
  description: string;
  websiteUrl: string;
}

export interface UserProfile {
  id: string;
  email: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  preferredCurrency: CurrencyOption;
  garageVisibility: 'private' | 'unlisted';
  shareToken: string;
  createdAt: string;
}

export type ViewTab = 'garage' | 'brands' | 'stats' | 'about' | 'settings';

export interface CompressionResult {
  file: File;
  dataUrl: string;
  originalSizeKB: number;
  compressedSizeKB: number;
  ratioSavedPercent: number;
}
