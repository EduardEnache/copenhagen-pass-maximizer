// RFC 5545 (iCalendar) export for an ItineraryPlan. Builds a VCALENDAR with
// an embedded VTIMEZONE for Europe/Copenhagen and one VEVENT per non-transit
// block (transit legs are considered too granular/ estimate-heavy to be
// worth a calendar entry on their own). CRLF line endings and 75-octet line
// folding per the RFC. Returns a Blob (text/calendar).

import type { ItineraryBlock, ItineraryPlan } from '@/types';

const CRLF = '\r\n';

const VTIMEZONE_EUROPE_COPENHAGEN = [
  'BEGIN:VTIMEZONE',
  'TZID:Europe/Copenhagen',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0200',
  'TZNAME:CEST',
  'DTSTART:19700329T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:+0200',
  'TZOFFSETTO:+0100',
  'TZNAME:CET',
  'DTSTART:19701025T030000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
];

/** Folds a single unfolded content line to RFC 5545's 75-octet limit (UTF-8 byte-aware). */
export function foldLine(line: string): string {
  const encoder = new TextEncoder();
  const maxOctets = 75;
  const chars = Array.from(line);
  const lines: string[] = [];
  let current = '';
  let currentBytes = 0;
  for (const ch of chars) {
    const chBytes = encoder.encode(ch).length;
    const nextBytes = currentBytes + chBytes;
    if (nextBytes > maxOctets) {
      lines.push(current);
      current = ' ' + ch;
      currentBytes = 1 + chBytes;
    } else {
      current += ch;
      currentBytes = nextBytes;
    }
  }
  lines.push(current);
  return lines.join(CRLF);
}

/** Escapes text per RFC 5545 §3.3.11 (TEXT value type). */
export function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\n|\r/g, '\\n');
}

function toIcsDateTime(date: string, time: string): string {
  const datePart = date.replace(/-/g, '');
  const timePart = time.replace(':', '') + '00';
  return `${datePart}T${timePart}`;
}

function buildEvent(dayDate: string, block: ItineraryBlock, planVariant: string): string[] {
  const descriptionParts: string[] = [];
  if (block.description) descriptionParts.push(block.description);
  if (block.bookingWarning) descriptionParts.push(`WARNING: ${block.bookingWarning}`);
  for (const source of block.sources) {
    descriptionParts.push(`Source: ${source.name} (${source.status}) — ${source.url}`);
  }

  const lines: string[] = [];
  lines.push('BEGIN:VEVENT');
  lines.push(`UID:${planVariant}-${dayDate}-${block.id}@copenhagen-pass-maximizer`);
  lines.push(`DTSTART;TZID=Europe/Copenhagen:${toIcsDateTime(dayDate, block.startTime)}`);
  lines.push(`DTEND;TZID=Europe/Copenhagen:${toIcsDateTime(dayDate, block.endTime)}`);
  lines.push(`SUMMARY:${escapeIcsText(block.title)}`);
  if (descriptionParts.length > 0) {
    lines.push(`DESCRIPTION:${escapeIcsText(descriptionParts.join('\n'))}`);
  }
  if (block.timeIsEstimate) {
    lines.push('X-CPM-TIME-IS-ESTIMATE:TRUE');
  }
  lines.push('END:VEVENT');
  return lines;
}

/** Builds the full VCALENDAR text for an ItineraryPlan. */
export function buildIcsText(plan: ItineraryPlan): string {
  const lines: string[] = [];
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//Copenhagen Pass Maximizer//EN');
  lines.push('CALSCALE:GREGORIAN');
  lines.push('METHOD:PUBLISH');
  lines.push(...VTIMEZONE_EUROPE_COPENHAGEN);

  for (const day of plan.days) {
    for (const block of day.blocks) {
      if (block.kind === 'transit') continue;
      lines.push(...buildEvent(day.date, block, plan.variant));
    }
  }

  lines.push('END:VCALENDAR');

  return lines.map(foldLine).join(CRLF) + CRLF;
}

/** Builds a downloadable .ics Blob for an ItineraryPlan. */
export function buildIcsBlob(plan: ItineraryPlan): Blob {
  return new Blob([buildIcsText(plan)], { type: 'text/calendar;charset=utf-8' });
}
