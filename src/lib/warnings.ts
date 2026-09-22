// The warning engine: pure functions that inspect a TripConfig + Attraction[]
// + ItineraryPlan + PassRules and emit Warning objects. No I/O.

import type { Attraction, ItineraryPlan, PassRules, TripConfig, Warning } from '@/types';
import { combineDateAndTimeCph, dayOfWeekInCph, dateInCph } from './datetime';
import { computeExpiry, computeFeasibility, isValidAt } from './passMath';

export interface WarningContext {
  config: TripConfig;
  attractions: Attraction[];
  plan: ItineraryPlan;
  passRules: PassRules;
}

function findAttraction(attractions: Attraction[], id: string): Attraction | undefined {
  return attractions.find((a) => a.id === id);
}

/** Whether an attraction has at least one opening window matching a given date's weekday + date range. */
function hasMatchingWindow(attraction: Attraction, date: string): boolean {
  if (attraction.closedOnDates?.includes(date)) return false;
  const dow = dayOfWeekInCph(`${date}T12:00:00+02:00`);
  return attraction.openingWindows.some((w) => {
    if (!w.days.includes(dow)) return false;
    if (w.appliesFrom && date < w.appliesFrom) return false;
    if (w.appliesTo && date > w.appliesTo) return false;
    return true;
  });
}

function findMatchingWindow(attraction: Attraction, date: string) {
  const dow = dayOfWeekInCph(`${date}T12:00:00+02:00`);
  return attraction.openingWindows.find((w) => {
    if (!w.days.includes(dow)) return false;
    if (w.appliesFrom && date < w.appliesFrom) return false;
    if (w.appliesTo && date > w.appliesTo) return false;
    return true;
  });
}

export function checkTivoliSelected(config: TripConfig, plan: ItineraryPlan): Warning | null {
  const TIVOLI_ID = 'tivoli-gardens';
  const inSelection = config.selectedAttractionIds.includes(TIVOLI_ID);
  const inPlan = plan.days.some((d) => d.blocks.some((b) => b.attractionId === TIVOLI_ID));
  if (!inSelection && !inPlan) return null;
  return {
    id: 'tivoli-selected',
    severity: 'critical',
    message:
      'Tivoli Gardens is selected/scheduled, but it is closed for this entire trip (see the excluded attraction record) — remove it immediately.',
    relatedBlockIds: [],
  };
}

export function checkExpiryBeforeAirport(config: TripConfig): Warning | null {
  const { expiryInstantMs } = computeExpiry(config.activationDateTime, config.cardDurationHours);
  const targetMs = new Date(config.targetAirportArrival).getTime();
  if (isValidAt(expiryInstantMs, targetMs)) return null;
  return {
    id: 'expiry-before-airport',
    severity: 'critical',
    message: `The ${config.cardDurationHours}h card expires before the target airport arrival (${config.targetAirportArrival}) — the return airport transfer will NOT be covered.`,
    relatedBlockIds: [],
  };
}

export function checkInboundTransferUncovered(config: TripConfig): Warning | null {
  const { expiryInstantMs } = computeExpiry(config.activationDateTime, config.cardDurationHours);
  const feasibility = computeFeasibility(config, config.cardDurationHours);
  const firstMs = new Date(feasibility.firstJourneyStart).getTime();
  if (isValidAt(expiryInstantMs, firstMs)) return null;
  return {
    id: 'inbound-transfer-uncovered',
    severity: 'critical',
    message: 'The card expires before the estimated inbound airport transfer — the arrival Metro ride will NOT be covered.',
    relatedBlockIds: [],
  };
}

export function checkDurationTooShort(config: TripConfig): Warning | null {
  const feasibility = computeFeasibility(config, config.cardDurationHours);
  if (feasibility.isFeasible) return null;
  return {
    id: 'duration-too-short',
    severity: 'critical',
    message: `A ${config.cardDurationHours}h card cannot cover the required ${feasibility.requiredSpanHours.toFixed(1)}h span between arrival and the target airport arrival. Choose a longer duration.`,
    relatedBlockIds: [],
  };
}

export function checkTightSlack(config: TripConfig): Warning | null {
  const feasibility = computeFeasibility(config, config.cardDurationHours);
  if (!(feasibility.slackHours >= 0 && feasibility.slackHours < 4)) return null;
  return {
    id: 'tight-slack',
    severity: 'warning',
    message: `Only ${feasibility.slackHours.toFixed(1)}h of slack between the card's coverage and the required span — little room for delays.`,
    relatedBlockIds: [],
  };
}

export function checkActivationTiming(config: TripConfig): Warning[] {
  const out: Warning[] = [];
  const feasibility = computeFeasibility(config, config.cardDurationHours);
  const activationMs = new Date(config.activationDateTime).getTime();
  const firstMs = new Date(feasibility.firstJourneyStart).getTime();
  if (activationMs < firstMs) {
    out.push({
      id: 'activation-too-early',
      severity: 'warning',
      message: 'Configured activation time is before the estimated arrival — the card cannot actually be activated before landing.',
      relatedBlockIds: [],
    });
  } else if (activationMs - firstMs > 2 * 3_600_000) {
    out.push({
      id: 'activation-too-late',
      severity: 'warning',
      message: 'Configured activation time is more than 2h after the estimated arrival, needlessly burning validity hours — consider activating sooner.',
      relatedBlockIds: [],
    });
  }
  return out;
}

export function checkAllJourneysCovered(config: TripConfig, plan: ItineraryPlan): Warning[] {
  const { expiryInstantMs } = computeExpiry(config.activationDateTime, config.cardDurationHours);
  const out: Warning[] = [];
  for (const day of plan.days) {
    for (const block of day.blocks) {
      if (block.kind !== 'transit') continue;
      const endMs = new Date(combineDateAndTimeCph(day.date, block.endTime)).getTime();
      if (!isValidAt(expiryInstantMs, endMs)) {
        out.push({
          id: `journey-ends-after-expiry:${block.id}`,
          severity: 'critical',
          message: `Transit leg "${block.title}" ends after the card expires — this journey will not be covered.`,
          relatedBlockIds: [block.id],
        });
      }
    }
  }
  return out;
}

export function checkAttractionsWithinExpiry(config: TripConfig, plan: ItineraryPlan): Warning[] {
  const { expiryInstantMs } = computeExpiry(config.activationDateTime, config.cardDurationHours);
  const out: Warning[] = [];
  for (const day of plan.days) {
    for (const block of day.blocks) {
      if (block.kind !== 'attraction') continue;
      const endMs = new Date(combineDateAndTimeCph(day.date, block.endTime)).getTime();
      if (!isValidAt(expiryInstantMs, endMs)) {
        out.push({
          id: `attraction-after-expiry:${block.id}`,
          severity: 'warning',
          message: `"${block.title}" ends after the card expires — admission for this visit will not be covered.`,
          relatedBlockIds: [block.id],
        });
      }
    }
  }
  return out;
}

export function checkArrivalTimeUnknown(config: TripConfig): Warning | null {
  if (!config.outboundFlight.arrivalIsEstimate) return null;
  return {
    id: 'arrival-time-unknown',
    severity: 'warning',
    message: 'Outbound flight arrival time is an estimate — confirm it and update the activation time before travel.',
    relatedBlockIds: [],
  };
}

export function checkAirportBufferShort(config: TripConfig): Warning | null {
  const leaveMs = new Date(config.leaveCityForAirport).getTime();
  const arriveAtAirportMs = leaveMs + config.airportTransferMinutes * 60_000;
  const departMs = new Date(config.returnFlight.departsLocal).getTime();
  const bufferMinutes = (departMs - arriveAtAirportMs) / 60_000;
  if (bufferMinutes >= 120) return null;
  return {
    id: 'airport-buffer-short',
    severity: 'warning',
    message: `Only ~${Math.round(bufferMinutes)} minutes of buffer between arriving at the airport and the return flight departure — under the recommended 2h.`,
    relatedBlockIds: [],
  };
}

export function checkLeaveTimeInconsistent(config: TripConfig): Warning | null {
  const leaveMs = new Date(config.leaveCityForAirport).getTime();
  const arriveAtAirportMs = leaveMs + config.airportTransferMinutes * 60_000;
  const targetMs = new Date(config.targetAirportArrival).getTime();
  if (arriveAtAirportMs <= targetMs) return null;
  return {
    id: 'leave-time-inconsistent',
    severity: 'critical',
    message:
      'Leaving the city this late, plus the airport transfer time, arrives at the airport AFTER the target airport arrival time. Move the leave-city time earlier or push the target arrival later.',
    relatedBlockIds: [],
  };
}

export function checkAttractionsClosedOnDate(attractions: Attraction[], plan: ItineraryPlan): Warning[] {
  const out: Warning[] = [];
  for (const day of plan.days) {
    for (const block of day.blocks) {
      if (block.kind !== 'attraction' || !block.attractionId) continue;
      const attraction = findAttraction(attractions, block.attractionId);
      if (!attraction) continue;
      // Can't prove closure without any published windows — skip rather
      // than spam a critical warning on genuinely unverified attractions.
      if (attraction.openingWindows.length === 0) continue;
      if (!hasMatchingWindow(attraction, day.date)) {
        out.push({
          id: `attraction-closed-on-date:${block.id}`,
          severity: 'critical',
          message: `${attraction.name} has no published opening window covering ${day.date} (${day.weekday}) — it is likely closed that day.`,
          relatedBlockIds: [block.id],
        });
      }
    }
  }
  return out;
}

export function checkVisitOutsideHours(attractions: Attraction[], plan: ItineraryPlan): Warning[] {
  const out: Warning[] = [];
  for (const day of plan.days) {
    for (const block of day.blocks) {
      if (block.kind !== 'attraction' || !block.attractionId) continue;
      const attraction = findAttraction(attractions, block.attractionId);
      if (!attraction || attraction.openingWindows.length === 0) continue;
      const window = findMatchingWindow(attraction, day.date);
      if (!window) continue; // already covered by attraction-closed-on-date
      if (block.startTime < window.opens || block.endTime > window.closes) {
        out.push({
          id: `visit-outside-hours:${block.id}`,
          severity: 'warning',
          message: `"${block.title}" (${block.startTime}-${block.endTime}) falls partly outside ${attraction.name}'s published hours (${window.opens}-${window.closes}) on ${day.date}.`,
          relatedBlockIds: [block.id],
        });
      }
    }
  }
  return out;
}

export function checkReservationRequired(config: TripConfig, attractions: Attraction[]): Warning[] {
  const out: Warning[] = [];
  for (const id of config.selectedAttractionIds) {
    const attraction = findAttraction(attractions, id);
    if (attraction?.reservationRequired) {
      out.push({
        id: `reservation-required:${attraction.id}`,
        severity: 'warning',
        message: `${attraction.name} requires a reservation${attraction.reservationNote ? `: ${attraction.reservationNote}` : '.'}`,
        relatedBlockIds: [],
      });
    }
  }
  return out;
}

export function checkUnverifiedPriceInTotal(config: TripConfig, attractions: Attraction[]): Warning | null {
  const unpricedCount = config.selectedAttractionIds.filter((id) => {
    const a = findAttraction(attractions, id);
    return a && !a.standaloneAdultPrice;
  }).length;
  if (unpricedCount === 0) return null;
  return {
    id: 'unverified-price-in-total',
    severity: 'info',
    message: `${unpricedCount} selected attraction(s) have no verified standalone price and are excluded from the savings total — treat the savings figure as a floor, not an exact number.`,
    relatedBlockIds: [],
  };
}

/** Runs every warning check and returns the combined, flattened list. */
export function generateWarnings(ctx: WarningContext): Warning[] {
  const { config, attractions, plan } = ctx;
  const warnings: Warning[] = [];

  const pushIf = (w: Warning | null) => {
    if (w) warnings.push(w);
  };

  pushIf(checkTivoliSelected(config, plan));
  pushIf(checkExpiryBeforeAirport(config));
  pushIf(checkInboundTransferUncovered(config));
  pushIf(checkDurationTooShort(config));
  warnings.push(...checkActivationTiming(config));
  pushIf(checkTightSlack(config));
  warnings.push(...checkAllJourneysCovered(config, plan));
  warnings.push(...checkAttractionsWithinExpiry(config, plan));
  pushIf(checkArrivalTimeUnknown(config));
  pushIf(checkAirportBufferShort(config));
  pushIf(checkLeaveTimeInconsistent(config));
  warnings.push(...checkAttractionsClosedOnDate(attractions, plan));
  warnings.push(...checkVisitOutsideHours(attractions, plan));
  warnings.push(...checkReservationRequired(config, attractions));
  pushIf(checkUnverifiedPriceInTotal(config, attractions));

  return warnings;
}
