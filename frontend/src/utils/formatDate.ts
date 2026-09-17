import type { DateFormatPreference } from '../types';

export function formatDate(dateString: string, format: DateFormatPreference = 'DD_MMM_YYYY'): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const parts = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).formatToParts(date);
  
  const day = parts.find(p => p.type === 'day')?.value || '';
  const monthStr = parts.find(p => p.type === 'month')?.value || '';
  const monthNum = String(date.getMonth() + 1).padStart(2, '0');
  const year = parts.find(p => p.type === 'year')?.value || '';

  switch (format) {
    case 'DD_MM_YYYY':
      return `${day}/${monthNum}/${year}`;
    case 'MM_DD_YYYY':
      return `${monthNum}/${day}/${year}`;
    case 'YYYY_MM_DD':
      return `${year}-${monthNum}-${day}`;
    case 'DD_MMM_YYYY':
    default:
      return `${day} ${monthStr}, ${year}`;
  }
}

export function formatDateTime(dateString: string, format: DateFormatPreference = 'DD_MMM_YYYY'): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const dateFormatted = formatDate(dateString, format);
  
  const timeFormatted = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);

  return `${dateFormatted} at ${timeFormatted}`;
}
