// Formatting helpers: DKK currency, durations, and countdowns.

const DKK_FORMATTER = new Intl.NumberFormat('da-DK', {
  style: 'currency',
  currency: 'DKK',
  maximumFractionDigits: 0,
});

/** Formats a DKK amount using da-DK currency conventions, e.g. "1.219 kr." */
export function formatDkk(amountDkk: number): string {
  return DKK_FORMATTER.format(amountDkk);
}

/** Formats a duration given in minutes as "Xh Ym" / "Xh" / "Ym". */
export function formatDurationMinutes(totalMinutes: number): string {
  const sign = totalMinutes < 0 ? '-' : '';
  const abs = Math.round(Math.abs(totalMinutes));
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (h === 0) return `${sign}${m}m`;
  if (m === 0) return `${sign}${h}h`;
  return `${sign}${h}h ${m}m`;
}

/** Formats a duration given in hours (may be fractional) using formatDurationMinutes. */
export function formatDurationHours(totalHours: number): string {
  return formatDurationMinutes(totalHours * 60);
}

/** Formats a countdown to a future instant (ms remaining) as a human string, e.g. "2d 3h 15m" or "expired". */
export function formatCountdown(msRemaining: number): string {
  if (msRemaining <= 0) return 'expired';
  const totalMinutes = Math.floor(msRemaining / 60_000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(' ');
}
