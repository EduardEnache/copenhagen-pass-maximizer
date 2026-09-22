import type { TripConfig } from '@/types';
import { OUTBOUND_FLIGHT, RETURN_FLIGHT } from './flights';

export const DEFAULT_TRIP_CONFIG: TripConfig = {
  adults: 4,
  juniors: 0,
  children: 0,
  cardType: 'DISCOVER',
  cardDurationHours: 96,
  // ESTIMATE: outbound arrival time is unknown; 11:15 assumes ~11:00 landing
  // plus ~15 minutes to clear the jet bridge/passport control to reach the
  // Copenhagen Card activation point. Edit as soon as the real arrival time
  // is known.
  activationDateTime: '2026-09-25T11:15:00+02:00',
  outboundFlight: OUTBOUND_FLIGHT,
  returnFlight: RETURN_FLIGHT,
  targetAirportArrival: '2026-09-28T19:00:00+02:00',
  leaveCityForAirport: '2026-09-28T17:15:00+02:00',
  airportTransferMinutes: 35,
  selectedAttractionIds: [],
  standaloneTransportEstimateDkk: null,
  selectedVariant: 'core',
};
