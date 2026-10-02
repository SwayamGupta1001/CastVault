import type { DiecastItem, UserProfile } from '../types';
import { SAMPLE_GARAGE_ITEMS, INITIAL_USER_PROFILE } from '../data/sampleGarage';

const STORAGE_KEYS = {
  GARAGE_ITEMS: 'castvault_items_v1',
  USER_PROFILE: 'castvault_profile_v1',
};

export function getStoredItems(): DiecastItem[] {
  if (typeof window === 'undefined') return SAMPLE_GARAGE_ITEMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GARAGE_ITEMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.GARAGE_ITEMS, JSON.stringify(SAMPLE_GARAGE_ITEMS));
      return SAMPLE_GARAGE_ITEMS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading garage items from localStorage', e);
    return SAMPLE_GARAGE_ITEMS;
  }
}

export function saveStoredItem(item: DiecastItem): DiecastItem[] {
  const current = getStoredItems();
  const index = current.findIndex((i) => i.id === item.id);
  
  let updated: DiecastItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...item, updatedAt: new Date().toISOString() };
  } else {
    updated = [{ ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...current];
  }

  try {
    localStorage.setItem(STORAGE_KEYS.GARAGE_ITEMS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving item to localStorage', e);
  }
  return updated;
}

export function deleteStoredItem(id: string): DiecastItem[] {
  const current = getStoredItems();
  const updated = current.filter((i) => i.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.GARAGE_ITEMS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting item from localStorage', e);
  }
  return updated;
}

/**
 * Clears all mock/sample data and resets vault to an empty collection.
 */
export function clearAllGarageItems(): DiecastItem[] {
  try {
    localStorage.setItem(STORAGE_KEYS.GARAGE_ITEMS, JSON.stringify([]));
  } catch (e) {
    console.error('Error clearing garage items', e);
  }
  return [];
}

export function getStoredUserProfile(): UserProfile {
  if (typeof window === 'undefined') return INITIAL_USER_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
      return INITIAL_USER_PROFILE;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.preferredCurrency) {
      parsed.preferredCurrency = 'USD';
    }
    return parsed;
  } catch (e) {
    console.error('Error reading user profile', e);
    return INITIAL_USER_PROFILE;
  }
}

export function saveStoredUserProfile(profile: UserProfile): UserProfile {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving user profile', e);
  }
  return profile;
}

export function regenerateShareToken(): UserProfile {
  const profile = getStoredUserProfile();
  const newToken = 'cv_live_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  const updatedProfile: UserProfile = {
    ...profile,
    shareToken: newToken
  };
  return saveStoredUserProfile(updatedProfile);
}

export function getSanitizedPublicItems(items: DiecastItem[]): Partial<DiecastItem>[] {
  return items.map((item) => ({
    id: item.id,
    vehicleMake: item.vehicleMake,
    vehicleModel: item.vehicleModel,
    manufacturerId: item.manufacturerId,
    customManufacturer: item.customManufacturer,
    scale: item.scale,
    releaseYear: item.releaseYear,
    condition: item.condition,
    currency: item.currency,
    photos: item.photos,
    isPrimaryPhotoIndex: item.isPrimaryPhotoIndex,
    createdAt: item.createdAt
  }));
}
