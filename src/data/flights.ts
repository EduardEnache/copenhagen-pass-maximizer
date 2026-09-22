import type { TripConfig } from '@/types';

// Outbound: Bucharest (OTP) -> Copenhagen (CPH).
// CONFIRMED by the traveller 2026-09-22 — no longer an estimate.
export const OUTBOUND_FLIGHT: TripConfig['outboundFlight'] = {
  number: 'W43123',
  departsLocal: '2026-09-25T06:40:00+03:00', // OTP local time (EEST)
  arrivesLocal: '2026-09-25T08:25:00+02:00', // CPH local time (CEST) — confirmed
  arrivalIsEstimate: false,
};

// Return: Copenhagen (CPH) -> Bucharest (OTP).
// CONFIRMED by the traveller 2026-09-22. Departs from CPH Terminal 2;
// arrives OTP just after midnight (next calendar day, local Romanian time).
export const RETURN_FLIGHT: TripConfig['returnFlight'] = {
  number: 'W43114',
  departsLocal: '2026-09-28T21:00:00+02:00', // CPH local time (CEST)
  departureTerminal: 'Terminal 2',
  arrivesLocal: '2026-09-29T00:35:00+03:00', // OTP local time (EEST), next day
};
