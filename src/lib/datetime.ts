// Europe/Copenhagen datetime helpers built on native Date + Intl. No external
// date library, per the project brief. All arithmetic is done on absolute
// instants (epoch milliseconds), so it is automatically DST-safe; formatting
// back to a wall-clock ISO string re-derives the correct UTC offset for the
// resulting instant using Intl.DateTimeFormat against Europe/Copenhagen.

import type { DayOfWeek, ISODate, ISODateTime, ISOTime, OpeningWindow } from '@/types';

const TIME_ZONE = 'Europe/Copenhagen';

const WEEKDAY_ORDER = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Returns the Europe/Copenhagen UTC offset, e.g. "+02:00" or "+01:00", for a given instant. */
export function cphOffsetString(date: Date): string {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    timeZoneName: 'shortOffset',
  });
  const parts = dtf.formatToParts(date);
  const raw = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+1';
  const match = raw.match(/GMT([+-]\d+)(?::(\d+))?/);
  if (!match) return '+01:00';
  const h = parseInt(match[1], 10);
  const sign = h < 0 ? '-' : '+';
  const hh = pad2(Math.abs(h));
  const mm = pad2(match[2] ? parseInt(match[2], 10) : 0);
  return `${sign}${hh}:${mm}`;
}

/** Formats an absolute instant as an ISO 8601 datetime string in Europe/Copenhagen wall-clock time. */
export function formatInCph(date: Date): ISODateTime {
  const dtf = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = dtf.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';
  const year = get('year');
  const month = get('month');
  const day = get('day');
  let hour = get('hour');
  if (hour === '24') hour = '00';
  const minute = get('minute');
  const second = get('second');
  const offset = cphOffsetString(date);
  return `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`;
}

/** Adds `hours` (may be fractional) to an ISO datetime as an absolute-instant operation, returning the new wall-clock ISO string in Europe/Copenhagen time. DST-safe. */
export function addHoursAbsolute(iso: ISODateTime, hours: number): ISODateTime {
  const instant = new Date(iso).getTime() + hours * 3_600_000;
  return formatInCph(new Date(instant));
}

/** Difference in hours between two ISO datetimes, (b - a). */
export function diffHours(a: ISODateTime, b: ISODateTime): number {
  return (new Date(b).getTime() - new Date(a).getTime()) / 3_600_000;
}

/** Returns the day of week (0 = Sunday) of an ISO datetime, as observed in Europe/Copenhagen. */
export function dayOfWeekInCph(iso: ISODateTime): DayOfWeek {
  const dtf = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, weekday: 'short' });
  const weekday = dtf.format(new Date(iso));
  const idx = WEEKDAY_ORDER.indexOf(weekday);
  return (idx === -1 ? 0 : idx) as DayOfWeek;
}

/** Returns the ISODate ("YYYY-MM-DD") portion of an ISO datetime, in Europe/Copenhagen wall-clock time. */
export function dateInCph(iso: ISODateTime): ISODate {
  const dtf = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return dtf.format(new Date(iso));
}

/** Returns the "HH:MM" wall-clock time portion of an ISO datetime, in Europe/Copenhagen time. */
export function timeInCph(iso: ISODateTime): string {
  const dtf = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return dtf.format(new Date(iso));
}

/**
 * Whether the given ISO datetime falls within an OpeningWindow: matches the
 * window's day-of-week, is within [opens, closes) wall-clock time, and (if
 * appliesFrom/appliesTo are set) within that date range.
 */
export function isWithinOpeningWindow(window: OpeningWindow, dateTime: ISODateTime): boolean {
  const dow = dayOfWeekInCph(dateTime);
  if (!window.days.includes(dow)) return false;

  const date = dateInCph(dateTime);
  if (window.appliesFrom && date < window.appliesFrom) return false;
  if (window.appliesTo && date > window.appliesTo) return false;

  const time = timeInCph(dateTime);
  return time >= window.opens && time < window.closes;
}

/** Whether `dateTime` falls within any of the given attraction's opening windows for its own date. */
export function isOpenAt(windows: OpeningWindow[], dateTime: ISODateTime): boolean {
  return windows.some((w) => isWithinOpeningWindow(w, dateTime));
}

/**
 * Combines an ISODate and "HH:MM" wall-clock time into a correctly-offset
 * Europe/Copenhagen ISO datetime string. Two-pass: guesses +02:00 (CEST),
 * checks what the actual offset at that instant really is, and re-builds
 * once if it turns out to be +01:00 (CET). This converges correctly except
 * exactly inside the one-hour DST transition window itself, which none of
 * this app's trip dates fall within.
 */
export function combineDateAndTimeCph(date: ISODate, time: ISOTime): ISODateTime {
  const guess = `${date}T${time}:00+02:00`;
  const guessInstant = new Date(guess).getTime();
  const actualOffset = cphOffsetString(new Date(guessInstant));
  if (actualOffset === '+02:00') return guess;
  return `${date}T${time}:00${actualOffset}`;
}
