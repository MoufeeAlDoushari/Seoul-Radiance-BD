/**
 * Date formatting for stored timestamps.
 *
 * sqlite's datetime('now') returns "YYYY-MM-DD HH:MM:SS" in UTC with no zone
 * marker, which Date would otherwise read as local time and shift. Normalising
 * to ISO with an explicit Z keeps the displayed date correct.
 */
function toDate(stored: string): Date {
  return new Date(stored.includes('T') ? stored : `${stored.replace(' ', 'T')}Z`);
}

export function formatDate(stored: string): string {
  return toDate(stored).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateLong(stored: string): string {
  return toDate(stored).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(stored: string): string {
  return toDate(stored).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
