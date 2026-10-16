/**
 * Date and Timestamp Utilities for Ultra-Advanced Record Sorting & Formatting
 * Enforces strict 'Newest on Top, Oldest at the Bottom' ordering across the application.
 */

export function parseRecordTimestamp(d: string | number | undefined | null): number {
  if (d === undefined || d === null) return 0;
  if (typeof d === 'number') return d;

  const str = String(d).trim();
  if (!str) return 0;

  // Numeric string timestamp check
  if (/^\d{10,13}$/.test(str)) {
    const num = Number(str);
    return num < 10000000000 ? num * 1000 : num;
  }

  // Relative 'Just now' or recent
  if (/just\s*now/i.test(str)) {
    return Date.now();
  }

  // Relative minutes: 'Today - 10 mins ago' or '10 minutes ago'
  const minsMatch = str.match(/(\d+)\s*(?:mins?|minutes?)\s*ago/i);
  if (minsMatch) {
    return Date.now() - parseInt(minsMatch[1], 10) * 60 * 1000;
  }

  // Relative hours: '2 hours ago'
  const hoursMatch = str.match(/(\d+)\s*(?:hours?|hrs?)\s*ago/i);
  if (hoursMatch) {
    return Date.now() - parseInt(hoursMatch[1], 10) * 3600 * 1000;
  }

  // Relative days: 'Yesterday' or '2 days ago'
  if (/yesterday/i.test(str)) {
    return Date.now() - 24 * 3600 * 1000;
  }
  const daysMatch = str.match(/(\d+)\s*days?\s*ago/i);
  if (daysMatch) {
    return Date.now() - parseInt(daysMatch[1], 10) * 24 * 3600 * 1000;
  }

  // Format: DD/MM/YYYY - hh:mm AM/PM or DD-MM-YYYY HH:mm:ss
  const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s*[-–]\s*|\s+)?(.*)$/);
  if (dmyMatch) {
    const [, dayStr, monthStr, yearStr, timePart] = dmyMatch;
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    const year = parseInt(yearStr, 10);

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (timePart && timePart.trim()) {
      const cleanTime = timePart.trim();
      const timeMatch = cleanTime.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?/i);
      if (timeMatch) {
        hours = parseInt(timeMatch[1], 10);
        minutes = parseInt(timeMatch[2], 10);
        seconds = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;
        const ampm = timeMatch[4] ? timeMatch[4].toLowerCase() : null;
        if (ampm === 'pm' && hours < 12) hours += 12;
        if (ampm === 'am' && hours === 12) hours = 0;
      }
    }

    const dObj = new Date(year, month, day, hours, minutes, seconds);
    if (!isNaN(dObj.getTime())) {
      return dObj.getTime();
    }
  }

  // Standard ISO or RFC strings (e.g. 2026-10-11 13:05:00 or 2026-10-11T13:05:00Z)
  const isoParsed = new Date(str.replace(' ', 'T')).getTime();
  if (!isNaN(isoParsed) && isoParsed > 0) {
    return isoParsed;
  }

  const directParsed = new Date(str).getTime();
  return isNaN(directParsed) ? 0 : directParsed;
}

/**
 * Strictly sorts records so NEWEST is on top and OLDEST is on bottom.
 */
export function sortRecordsNewestFirst<T>(records: T[]): T[] {
  return [...records].sort((a: any, b: any) => {
    const timeA = parseRecordTimestamp(a?.createdAt ?? a?.timestamp ?? a?.purchasedAt ?? a?.dateStr);
    const timeB = parseRecordTimestamp(b?.createdAt ?? b?.timestamp ?? b?.purchasedAt ?? b?.dateStr);

    if (timeB !== timeA) {
      return timeB - timeA; // Descending: newest timestamp first
    }
    // Tie-breaker: stable sort by ID
    return String(b?.id || '').localeCompare(String(a?.id || ''));
  });
}

/**
 * Returns human-readable formatted date time string: "11 Oct 2026, 01:05 PM"
 */
export function formatRecordDateTime(d: string | number | undefined | null): string {
  const ts = parseRecordTimestamp(d);
  if (!ts) return String(d || 'N/A');

  const date = new Date(ts);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Returns relative time badge: "Just now", "10m ago", "Today", "Yesterday", or "11 Oct"
 */
export function getRelativeTimeLabel(d: string | number | undefined | null): string {
  const ts = parseRecordTimestamp(d);
  if (!ts) return 'Recent';

  const diffMs = Date.now() - ts;
  if (diffMs < 0) return 'Just now';
  if (diffMs < 60 * 1000) return 'Just now';
  if (diffMs < 60 * 60 * 1000) return `${Math.floor(diffMs / 60000)}m ago`;
  if (diffMs < 24 * 3600 * 1000) {
    const hours = Math.floor(diffMs / 3600000);
    return `${hours}h ago`;
  }
  if (diffMs < 48 * 3600 * 1000) return 'Yesterday';

  const date = new Date(ts);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}
