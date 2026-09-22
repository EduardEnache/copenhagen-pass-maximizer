import type { TripConfig } from '@/types';

// Outbound: Bucharest (OTP) -> Copenhagen (CPH). Flight number not supplied;
// arrival time is unknown/unconfirmed and must be treated as an estimate
// throughout the app (arrivalIsEstimate: true).
export const OUTBOUND_FLIGHT: TripConfig['outboundFlight'] = {
  number: null,
  departsLocal: '2026-09-25T09:00:00+03:00', // OTP local time (EEST)
  arrivesLocal: null,
  arrivalIsEstimate: true,
};

// Return: Copenhagen (CPH) -> Bucharest (OTP).
export const RETURN_FLIGHT: TripConfig['returnFlight'] = {
  number: null,
  departsLocal: '2026-09-28T21:00:00+02:00', // CPH local time (CEST)
};
