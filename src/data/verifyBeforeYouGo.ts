import type { SourceRef } from '@/types';
import {
  ROSENBORG_SOURCE,
  CANAL_TOURS_SOURCE,
  CHRISTIANSBORG_HOURS_SOURCE,
  CITYHUB_FAQ_AFTER_CHECKOUT_SOURCE,
  TIVOLI_SEASONS_SOURCE,
  COPENHAGEN_CARD_FAQ_SOURCE,
  ROUND_TOWER_SOURCE,
} from './sources';

export type VerifySeverity = 'critical' | 'high' | 'info';

export interface VerifyItem {
  id: string;
  severity: VerifySeverity;
  message: string;
  source?: SourceRef;
}

// The reconfirmation register: every fact in this app that is not fully
// `verified` gets an entry here, so the app can render a "re-check before
// you go" list closer to departure.
export const VERIFY_BEFORE_YOU_GO: VerifyItem[] = [
  {
    id: 'verify-rosenborg-timed-entry',
    severity: 'critical',
    message: 'Rosenborg Castle uses timed entry (every 10 minutes) and slots sell out — confirm your booked slot is still valid.',
    source: ROSENBORG_SOURCE,
  },
  {
    id: 'verify-flight-arrival-confirmed',
    severity: 'info',
    message: 'RESOLVED 2026-09-22: outbound flight confirmed as W43123, OTP 06:40 → CPH 08:25. Day 1 and the default card-activation time are built around this. If the flight is later delayed or rebooked, update it in the Calculator page.',
  },
  {
    id: 'verify-full-journey-validity',
    severity: 'critical',
    message: 'Restated rule: the Copenhagen Card must be valid for the ENTIRE journey on every leg — if it expires mid-journey, that journey is not covered. Always check the card is valid at the END of a journey, not just the start.',
    source: COPENHAGEN_CARD_FAQ_SOURCE,
  },
  {
    id: 'verify-canal-tour-last-departure',
    severity: 'high',
    message: 'Canal Tours Copenhagen: only the September 10:00-17:30 operating window is published, not a departure timetable. Confirm the actual last departure before planning an evening sailing.',
    source: CANAL_TOURS_SOURCE,
  },
  {
    id: 'verify-rosenborg-closing-time',
    severity: 'high',
    message: 'Rosenborg Castle closing time conflicts across sources (16:00 vs 17:00 for late September). The plan assumes the conservative 16:00 close — confirm before relying on a later visit.',
    source: ROSENBORG_SOURCE,
  },
  {
    id: 'verify-christiansborg-hours',
    severity: 'high',
    message: 'Christiansborg Palace opening hours were not published on the page fetched during research. Confirm hours before including it in any plan.',
    source: CHRISTIANSBORG_HOURS_SOURCE,
  },
  {
    id: 'verify-cityhub-after-checkout',
    severity: 'high',
    message: 'CityHub\'s free-locker policy after checkout (Day 4) is widely reported but not confirmed verbatim on the official FAQ page fetched today. Confirm directly with the hotel; fallback is paid left-luggage at København H.',
    source: CITYHUB_FAQ_AFTER_CHECKOUT_SOURCE,
  },
  {
    id: 'verify-tivoli-recheck',
    severity: 'info',
    message: 'Tivoli Gardens is treated as closed for this entire trip based on today\'s published seasonal calendar. Re-check tivoli.dk close to departure in case the schedule changes.',
    source: TIVOLI_SEASONS_SOURCE,
  },
  {
    id: 'verify-one-visit-per-attraction',
    severity: 'info',
    message: 'Each attraction may only be visited once per Copenhagen Card — no re-entry on the same card.',
    source: COPENHAGEN_CARD_FAQ_SOURCE,
  },
  {
    id: 'verify-unpriced-attractions',
    severity: 'info',
    message: 'Several attractions in this plan do not publish a standalone adult price (or the published prices conflict) and are excluded from savings totals: Frederiksborg Castle, SMK, Amalienborg Museum, Canal Tours, Cisternerne, David Collection, Kronborg Castle, Copenhagen Zoo.',
  },
  {
    id: 'verify-round-tower-switchover',
    severity: 'info',
    message: 'The Round Tower\'s Sept→Oct switchover from its summer schedule (10:00-20:00) to the autumn schedule is not published. The plan is scheduled to a conservative 10:00-18:00 floor.',
    source: ROUND_TOWER_SOURCE,
  },
  {
    id: 'verify-transit-times-are-estimates',
    severity: 'info',
    message: 'All transit times in this app (Metro, S-train, bus) are planning estimates, not live schedule data. Cross-check with the official journey planner before departure for each leg.',
  },
];
