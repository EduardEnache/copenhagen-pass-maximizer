import type { GeoPoint, ISOTime, SourceRef } from '@/types';
import { CITYHUB_FAQ_SOURCE, CITYHUB_FAQ_AFTER_CHECKOUT_SOURCE } from './sources';

export interface LuggagePolicy {
  freeBeforeCheckIn: boolean;
  freeAfterCheckOutClaim: boolean; // the widely-reported claim, not independently confirmed
  source: SourceRef;
  note: string;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  geo: GeoPoint;
  checkIn: ISOTime;
  checkOut: ISOTime;
  luggageBeforeCheckIn: LuggagePolicy;
  luggageAfterCheckOut: LuggagePolicy;
  officialUrl: string;
}

export const CITYHUB_COPENHAGEN: Hotel = {
  id: 'hotel-cityhub-copenhagen',
  name: 'CityHub Copenhagen',
  address: 'Vesterbrogade 97B, 1620 Copenhagen V',
  geo: { lat: 55.6699, lon: 12.5501 },
  // Brief-supplied, editable.
  checkIn: '15:00',
  checkOut: '12:00',
  luggageBeforeCheckIn: {
    freeBeforeCheckIn: true,
    freeAfterCheckOutClaim: false,
    source: CITYHUB_FAQ_SOURCE,
    note: 'Free luggage lockers before check-in — confirmed on the official FAQ page.',
  },
  luggageAfterCheckOut: {
    freeBeforeCheckIn: false,
    freeAfterCheckOutClaim: true,
    source: CITYHUB_FAQ_AFTER_CHECKOUT_SOURCE,
    note: 'Same free-locker policy is widely reported to extend to after checkout, but this was not confirmed verbatim on the page fetched today. Confirm with the hotel directly; fallback is paid left-luggage at København H.',
  },
  officialUrl: 'https://cityhub.com/copenhagen/faq/',
};
