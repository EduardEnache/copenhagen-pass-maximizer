// Shared pure math for pass expiry/feasibility. Kept separate from
// passCalculator.ts and warnings.ts so both can depend on it without a
// circular import (passCalculator.ts calls into warnings.ts).

import type { CardDurationHours, ISODateTime, TripConfig } from '@/types';
import { addHoursAbsolute, diffHours } from './datetime';

/** `isValidAt(t) = t < expiry`, EXCLUSIVE, per the official Copenhagen Card FAQ. */
export function isValidAt(expiryInstantMs: number, tMs: number): boolean {
  return tMs < expiryInstantMs;
}

export interface ExpiryResult {
  activationInstantMs: number;
  expiryInstantMs: number;
  expiryDateTime: ISODateTime;
}

export function computeExpiry(activationDateTime: ISODateTime, durationHours: CardDurationHours): ExpiryResult {
  const activationInstantMs = new Date(activationDateTime).getTime();
  const expiryInstantMs = activationInstantMs + durationHours * 3_600_000;
  const expiryDateTime = addHoursAbsolute(activationDateTime, durationHours);
  return { activationInstantMs, expiryInstantMs, expiryDateTime };
}

/**
 * The flight-arrival instant used as the conservative anchor for coverage
 * math. Uses the confirmed/estimated arrival if the flight record has one;
 * otherwise falls back to 15 minutes before the configured card-activation
 * time, matching the itinerary data's assumed ~11:00 landing / ~11:15
 * activation gap (an explicit, documented modelling choice — the outbound
 * flight's arrival time was never published/confirmed).
 */
export function estimateFirstJourneyStart(config: TripConfig): ISODateTime {
  if (config.outboundFlight.arrivesLocal) return config.outboundFlight.arrivesLocal;
  return addHoursAbsolute(config.activationDateTime, -0.25);
}

export interface FeasibilityResult {
  firstJourneyStart: ISODateTime;
  lastJourneyEnd: ISODateTime;
  requiredSpanHours: number;
  earliestRequiredActivation: ISODateTime;
  latestUsefulActivation: ISODateTime;
  slackHours: number;
  isFeasible: boolean;
}

export function computeFeasibility(config: TripConfig, durationHours: CardDurationHours): FeasibilityResult {
  const firstJourneyStart = estimateFirstJourneyStart(config);
  const lastJourneyEnd = config.targetAirportArrival;
  const requiredSpanHours = diffHours(firstJourneyStart, lastJourneyEnd);
  const earliestRequiredActivationRaw = addHoursAbsolute(lastJourneyEnd, -durationHours);
  // Clamp: never recommend activating before the plane has actually landed.
  const earliestRequiredActivation =
    new Date(earliestRequiredActivationRaw).getTime() < new Date(firstJourneyStart).getTime()
      ? firstJourneyStart
      : earliestRequiredActivationRaw;
  const latestUsefulActivation = firstJourneyStart;
  const slackHours = durationHours - requiredSpanHours;
  const isFeasible = durationHours >= requiredSpanHours;
  return {
    firstJourneyStart,
    lastJourneyEnd,
    requiredSpanHours,
    earliestRequiredActivation,
    latestUsefulActivation,
    slackHours,
    isFeasible,
  };
}
