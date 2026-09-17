import type { CurrencyPreference } from '../types';

export function formatCurrency(amount: number | string, currency: CurrencyPreference = 'INR'): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) {
    return formatForCurrency(0, currency);
  }
  return formatForCurrency(numericAmount, currency);
}

function formatForCurrency(amount: number, currency: CurrencyPreference): string {
  const currencyConfigs: Record<CurrencyPreference, { locale: string, currency: string }> = {
    'INR': { locale: 'en-IN', currency: 'INR' },
    'USD': { locale: 'en-US', currency: 'USD' },
    'EUR': { locale: 'en-IE', currency: 'EUR' },
    'GBP': { locale: 'en-GB', currency: 'GBP' }
  };

  const config = currencyConfigs[currency] || currencyConfigs['INR'];

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
