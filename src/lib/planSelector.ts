// Given the confirmed/estimated arrival time and a couple of situational
// toggles, recommends which PlanVariant to show. Implements the Day-1
// late-arrival rebalancing rule: arrival after 15:00 -> late-arrival tier 1,
// arrival after 19:00 -> late-arrival tier 2 (tier 2 takes priority, since a
// >19:00 arrival is also >15:00).

import type { ISODateTime, PlanVariant } from '@/types';
import { timeInCph } from './datetime';

export interface PlanSelectionInput {
  /** Confirmed or estimated arrival instant. Null if completely unknown. */
  arrivalDateTime: ISODateTime | null;
  rainy?: boolean;
  lowEnergy?: boolean;
  fastPaced?: boolean;
}

export interface PlanSelectionResult {
  variant: PlanVariant;
  /** Only set when variant === 'late-arrival'. */
  lateArrivalTier?: 1 | 2;
  reason: string;
}

const TIER2_THRESHOLD = '19:00';
const TIER1_THRESHOLD = '15:00';

export function selectPlanVariant(input: PlanSelectionInput): PlanSelectionResult {
  if (input.arrivalDateTime) {
    const wallTime = timeInCph(input.arrivalDateTime);
    if (wallTime > TIER2_THRESHOLD) {
      return {
        variant: 'late-arrival',
        lateArrivalTier: 2,
        reason: `Arrival at ${wallTime} is after 19:00 — using the late-arrival tier 2 plan (no attraction attempted on Day 1).`,
      };
    }
    if (wallTime > TIER1_THRESHOLD) {
      return {
        variant: 'late-arrival',
        lateArrivalTier: 1,
        reason: `Arrival at ${wallTime} is after 15:00 — using the late-arrival tier 1 plan (Round Tower only on Day 1).`,
      };
    }
  }

  if (input.rainy) {
    return { variant: 'rainy-day', reason: 'Rainy weather selected — using the rainy-day plan.' };
  }
  if (input.lowEnergy) {
    return { variant: 'low-energy', reason: 'Low-energy mode selected — using the low-energy plan.' };
  }
  if (input.fastPaced) {
    return { variant: 'fast-paced', reason: 'Fast-paced mode selected — using the maximizer plan.' };
  }

  return { variant: 'core', reason: 'Default recommendation: the core, unhurried plan.' };
}
