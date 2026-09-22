import type { TripConfig } from '@/types';
import { OUTBOUND_FLIGHT, RETURN_FLIGHT } from './flights';

export const DEFAULT_TRIP_CONFIG: TripConfig = {
  adults: 4,
  juniors: 0,
  children: 0,
  cardType: 'DISCOVER',
  cardDurationHours: 96,
  // CONFIRMED: outbound flight W43123 lands at 08:25. 08:40 assumes ~15
  // minutes to walk from the gate to the Metro platform (no passport
  // control — both Romania and Denmark are in the Schengen area) before
  // activating the card. Edit if the real walk time differs.
  activationDateTime: '2026-09-25T08:40:00+02:00',
  outboundFlight: OUTBOUND_FLIGHT,
  returnFlight: RETURN_FLIGHT,
  targetAirportArrival: '2026-09-28T19:00:00+02:00',
  leaveCityForAirport: '2026-09-28T17:15:00+02:00',
  airportTransferMinutes: 35,
  selectedAttractionIds: [],
  standaloneTransportEstimateDkk: null,
  selectedVariant: 'core',
};
