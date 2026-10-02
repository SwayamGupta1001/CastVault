import type { CurrencyOption } from '../types';

export const CURRENCIES: { code: CurrencyOption; symbol: string; label: string; flag: string }[] = [
  { code: 'USD', symbol: '$', label: 'USD ($)', flag: '🇺🇸' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)', flag: '🇮🇳' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)', flag: '🇬🇧' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)', flag: '🇯🇵' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD (CA$)', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)', flag: '🇦🇺' },
  { code: 'AED', symbol: 'AED ', label: 'AED (AED)', flag: '🇦🇪' },
];

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'A$',
  AED: 'AED '
};

const CURRENCY_STORAGE_KEY = 'castvault_preferred_currency_v1';

/**
 * Get device's stored preferred currency
 */
export function getStoredCurrency(): CurrencyOption {
  try {
    const raw = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (raw && CURRENCY_SYMBOLS[raw]) {
      return raw as CurrencyOption;
    }
  } catch (err) {
    console.error('Failed to load stored currency', err);
  }
  return 'USD';
}

/**
 * Save device's preferred currency to localStorage so it persists permanently
 */
export function saveStoredCurrency(code: CurrencyOption): void {
  try {
    localStorage.setItem(CURRENCY_STORAGE_KEY, code);
  } catch (err) {
    console.error('Failed to save preferred currency', err);
  }
}

export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currencyCode] || '$';
  const decimals = currencyCode === 'JPY' ? 0 : 2;
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}
