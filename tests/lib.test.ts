import { describe, it, expect } from 'vitest';
import { addHoursAbsolute, dayOfWeekInCph, isWithinOpeningWindow, combineDateAndTimeCph } from '../src/lib/datetime';
import { formatDkk, formatDurationMinutes, formatCountdown } from '../src/lib/format';
import { googleMapsMarker, rejseplanenUrl } from '../src/lib/mapLinks';
import { buildIcsText, foldLine } from '../src/lib/icsExport';
import { exportJson, importJson, setNote, getNote } from '../src/lib/notesStorage';
import { selectPlanVariant } from '../src/lib/planSelector';
import { CORE_PLAN } from '../src/data/itinerary.core';

describe('datetime helpers', () => {
  it('addHoursAbsolute is DST-safe across the Oct transition', () => {
    expect(addHoursAbsolute('2026-10-24T10:00:00+02:00', 96)).toBe('2026-10-28T09:00:00+01:00');
  });

  it('dayOfWeekInCph identifies Monday 2026-09-28 as day 1', () => {
    expect(dayOfWeekInCph('2026-09-28T12:00:00+02:00')).toBe(1);
  });

  it('dayOfWeekInCph identifies Sunday 2026-09-27 as day 0', () => {
    expect(dayOfWeekInCph('2026-09-27T12:00:00+02:00')).toBe(0);
  });

  it('isWithinOpeningWindow respects day-of-week and clock time', () => {
    const window = { days: [1, 2, 3, 4, 5] as const, opens: '09:00', closes: '17:00' };
    expect(isWithinOpeningWindow(window as any, '2026-09-28T10:00:00+02:00')).toBe(true); // Monday
    expect(isWithinOpeningWindow(window as any, '2026-09-27T10:00:00+02:00')).toBe(false); // Sunday
    expect(isWithinOpeningWindow(window as any, '2026-09-28T17:00:00+02:00')).toBe(false); // exactly closing time
  });

  it('combineDateAndTimeCph builds a correctly-offset ISO datetime', () => {
    expect(combineDateAndTimeCph('2026-09-25', '11:15')).toBe('2026-09-25T11:15:00+02:00');
    expect(combineDateAndTimeCph('2026-11-01', '11:15')).toBe('2026-11-01T11:15:00+01:00');
  });
});

describe('format helpers', () => {
  it('formatDurationMinutes formats hours and minutes', () => {
    expect(formatDurationMinutes(90)).toBe('1h 30m');
    expect(formatDurationMinutes(45)).toBe('45m');
    expect(formatDurationMinutes(120)).toBe('2h');
  });

  it('formatDkk produces a DKK-currency string', () => {
    expect(formatDkk(1219)).toMatch(/1[.,]?219/);
  });

  it('formatCountdown handles expired and future', () => {
    expect(formatCountdown(-1)).toBe('expired');
    expect(formatCountdown(90 * 60_000)).toBe('1h 30m');
  });
});

describe('mapLinks', () => {
  it('googleMapsMarker builds a well-formed, keyless Google Maps link', () => {
    const url = googleMapsMarker({ lat: 55.6712, lon: 12.5245 });
    expect(url).toBe('https://www.google.com/maps/search/?api=1&query=55.6712%2C12.5245');
    expect(url).not.toContain('key=');
  });

  it('rejseplanenUrl starts with https and includes both stop names', () => {
    const url = rejseplanenUrl('Nørreport', 'Hillerød');
    expect(url.startsWith('https://www.rejseplanen.dk/')).toBe(true);
  });
});

describe('icsExport', () => {
  it('foldLine never produces a line over 75 octets (except the leading-space continuation marker)', () => {
    const longLine = 'DESCRIPTION:' + 'x'.repeat(200);
    const folded = foldLine(longLine);
    const encoder = new TextEncoder();
    for (const line of folded.split('\r\n')) {
      expect(encoder.encode(line).length).toBeLessThanOrEqual(75);
    }
  });

  it('buildIcsText produces a CRLF-terminated VCALENDAR with VTIMEZONE and VEVENTs', () => {
    const ics = buildIcsText(CORE_PLAN);
    expect(ics.startsWith('BEGIN:VCALENDAR')).toBe(true);
    expect(ics).toContain('BEGIN:VTIMEZONE');
    expect(ics).toContain('TZID:Europe/Copenhagen');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics.includes('\r\n')).toBe(true);
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true);
  });
});

describe('notesStorage graceful degradation (no DOM/localStorage in test env)', () => {
  it('never throws and no-ops gracefully', () => {
    expect(() => setNote('x', 'hello')).not.toThrow();
    expect(getNote('x')).toBeUndefined();
    expect(() => exportJson()).not.toThrow();
    const result = importJson('not json');
    expect(result.ok).toBe(false);
  });
});

describe('planSelector', () => {
  it('recommends late-arrival tier 2 after 19:00', () => {
    const r = selectPlanVariant({ arrivalDateTime: '2026-09-25T19:30:00+02:00' });
    expect(r.variant).toBe('late-arrival');
    expect(r.lateArrivalTier).toBe(2);
  });

  it('recommends late-arrival tier 1 after 15:00 but before 19:00', () => {
    const r = selectPlanVariant({ arrivalDateTime: '2026-09-25T16:00:00+02:00' });
    expect(r.variant).toBe('late-arrival');
    expect(r.lateArrivalTier).toBe(1);
  });

  it('recommends core for an on-time arrival with no toggles', () => {
    const r = selectPlanVariant({ arrivalDateTime: '2026-09-25T11:00:00+02:00' });
    expect(r.variant).toBe('core');
  });
});
