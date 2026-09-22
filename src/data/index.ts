export * from './sources';
export * from './passRules';
export * from './hotel';
export * from './flights';
export * from './tripDefaults';
export * from './attractions';
export * from './checklists';
export * from './verifyBeforeYouGo';
export * from './fallbacks';
export { CORE_PLAN, CORE_DAY_1, CORE_DAY_2, CORE_DAY_3, CORE_DAY_4 } from './itinerary.core';
export { FAST_PACED_PLAN } from './itinerary.fastPaced';
export { RAINY_DAY_PLAN } from './itinerary.rainyDay';
export { LOW_ENERGY_PLAN } from './itinerary.lowEnergy';
export {
  LATE_ARRIVAL_TIER1_PLAN,
  LATE_ARRIVAL_TIER2_PLAN,
  LATE_ARRIVAL_PLANS,
} from './itinerary.lateArrival';

export const RESEARCH_TIMESTAMP = '2026-09-22';

import type { ItineraryPlan } from '@/types';
import { CORE_PLAN } from './itinerary.core';
import { FAST_PACED_PLAN } from './itinerary.fastPaced';
import { RAINY_DAY_PLAN } from './itinerary.rainyDay';
import { LOW_ENERGY_PLAN } from './itinerary.lowEnergy';
import { LATE_ARRIVAL_TIER1_PLAN, LATE_ARRIVAL_TIER2_PLAN } from './itinerary.lateArrival';

export const ALL_PLANS: ItineraryPlan[] = [
  CORE_PLAN,
  FAST_PACED_PLAN,
  RAINY_DAY_PLAN,
  LOW_ENERGY_PLAN,
  LATE_ARRIVAL_TIER1_PLAN,
  LATE_ARRIVAL_TIER2_PLAN,
];
