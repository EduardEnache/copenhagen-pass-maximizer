import type { ItineraryDay, ItineraryPlan, ItineraryBlock, TransitLeg } from '@/types';
import { ROUND_TOWER_SOURCE, NATIONAL_MUSEUM_SOURCE, COPENHAGEN_CARD_FAQ_SOURCE } from './sources';
import { CORE_DAY_2, CORE_DAY_3, CORE_DAY_4 } from './itinerary.core';

const RJP = 'https://www.rejseplanen.dk/webapp/';

function transit(partial: Omit<TransitLeg, 'isEstimate'>): TransitLeg {
  return { ...partial, isEstimate: true };
}

// ---------------------------------------------------------------------------
// Tier 1: arrival confirmed AFTER 15:00 (but not after 19:00)
// ---------------------------------------------------------------------------

const tier1Day1: ItineraryDay = {
  dayNumber: 1,
  date: '2026-09-25',
  weekday: 'Friday',
  title: 'Late arrival (after 15:00)',
  theme: 'Card activation, Round Tower only, National Museum rebalanced to a later day',
  geographicReasoning:
    'A late arrival leaves too little daylight for the full Indre By museum sweep. The card is still activated on landing regardless of the hour, and the single schedule-forgiving Round Tower slot is kept; the National Museum is explicitly rebalanced to Day 3 morning (see the alternative block in Day 3\'s fallbacks) or Day 4 (its primary new home in this tier\'s Day 4 plan).',
  dayWarnings: [
    'Late-arrival tier 1: arrival confirmed after 15:00.',
    'National Museum of Denmark does NOT run on Day 1 in this tier — it is rescheduled to Day 4 (open Mondays) in this plan, with a Day 3 morning alternative also modelled explicitly.',
  ],
  blocks: [
    {
      id: 'la1-d1-arrival',
      kind: 'flight',
      startTime: '15:15',
      endTime: '15:20',
      timeIsEstimate: true,
      title: 'Arrive CPH (after 15:00, estimate)',
      passCovered: 'n/a',
      isOptional: false,
      fallbackBlockIds: [],
      sources: [],
    },
    {
      id: 'la1-d1-activate-card',
      kind: 'card-activation',
      startTime: '15:30',
      endTime: '15:35',
      timeIsEstimate: true,
      title: 'Activate Copenhagen Card at the airport',
      description: 'Activated on landing regardless of the hour — irreversible.',
      passCovered: 'n/a',
      isOptional: false,
      fallbackBlockIds: [],
      sources: [COPENHAGEN_CARD_FAQ_SOURCE],
    },
    {
      id: 'la1-d1-metro-and-checkin',
      kind: 'transit',
      startTime: '15:35',
      endTime: '16:15',
      timeIsEstimate: true,
      title: 'Metro to Vesterbro, luggage drop / direct check-in',
      transit: transit({ mode: 'metro', line: 'M2 / M3', from: 'Lufthavnen', to: 'Enghave Plads', minutes: 35, coveredByCard: true, journeyPlannerUrl: RJP }),
      passCovered: true,
      isOptional: false,
      fallbackBlockIds: [],
      sources: [COPENHAGEN_CARD_FAQ_SOURCE],
    },
    {
      id: 'la1-d1-round-tower',
      kind: 'attraction',
      startTime: '17:30',
      endTime: '19:00',
      timeIsEstimate: true,
      title: 'The Round Tower (last entry ~19:30 on the summer band)',
      description: 'The one attraction this tier still attempts — schedule-forgiving and open into the evening.',
      attractionId: 'round-tower',
      passCovered: true,
      bookingWarning: 'Confirm the tower is still admitting — 20:00 close is the summer-band figure, switchover date unconfirmed.',
      isOptional: true,
      fallbackBlockIds: [],
      sources: [ROUND_TOWER_SOURCE],
    },
    {
      id: 'la1-d1-nyhavn-evening',
      kind: 'walk',
      startTime: '19:10',
      endTime: '20:00',
      timeIsEstimate: true,
      title: 'Evening walk: Nyhavn',
      passCovered: 'n/a',
      isOptional: true,
      fallbackBlockIds: [],
      sources: [],
    },
    {
      id: 'la1-d1-dinner',
      kind: 'meal',
      startTime: '20:00',
      endTime: '21:15',
      timeIsEstimate: true,
      title: 'Dinner',
      passCovered: 'n/a',
      isOptional: false,
      fallbackBlockIds: [],
      sources: [],
    },
  ],
  fallbacks: [],
};

// Data-level alternative: National Museum in Day 3's morning slot instead of
// Day 4 — a real, addressable block, not just a prose mention.
const tier1NationalMuseumDay3Alt: ItineraryBlock = {
  id: 'la1-d3-national-museum-alt',
  kind: 'attraction',
  startTime: '09:15',
  endTime: '10:45',
  timeIsEstimate: true,
  title: 'National Museum of Denmark (alternative: Day 3 morning instead of Day 4)',
  description: 'Alternative rebalancing target for the National Museum, ahead of the 10:00 Rosenborg slot being pushed later. Use this OR the Day 4 placement, not both.',
  attractionId: 'national-museum-denmark',
  passCovered: true,
  isOptional: true,
  fallbackBlockIds: [],
  sources: [NATIONAL_MUSEUM_SOURCE],
};

const tier1Day3: ItineraryDay = {
  ...CORE_DAY_3,
  dayWarnings: [
    ...CORE_DAY_3.dayWarnings,
    'Late-arrival tier 1: the National Museum can alternatively run here (09:15-10:45) instead of Day 4 — see fallbacks for the explicit alternative block; this pushes Rosenborg\'s slot later if chosen.',
  ],
  fallbacks: [...CORE_DAY_3.fallbacks, tier1NationalMuseumDay3Alt],
};

const tier1Day4: ItineraryDay = {
  ...CORE_DAY_4,
  title: `${CORE_DAY_4.title} + National Museum (rebalanced from Day 1)`,
  dayWarnings: [
    ...CORE_DAY_4.dayWarnings,
    'National Museum of Denmark rebalanced here from Day 1 (primary placement for tier 1). The optional Workers Museum block is dropped to make room.',
  ],
  blocks: CORE_DAY_4.blocks
    .filter((b) => b.id !== 'core-d4-workers-museum')
    .map((b) =>
      b.id === 'core-d4-lunch'
        ? { ...b, startTime: '13:00', endTime: '13:45' }
        : b.id === 'core-d4-collect-luggage'
          ? { ...b, startTime: '15:45', endTime: '16:15' }
          : b,
    )
    .concat([
      {
        id: 'la1-d4-national-museum',
        kind: 'attraction',
        startTime: '13:45',
        endTime: '15:30',
        timeIsEstimate: true,
        title: 'National Museum of Denmark (rebalanced from Day 1)',
        attractionId: 'national-museum-denmark',
        passCovered: true,
        isOptional: false,
        fallbackBlockIds: [],
        sources: [NATIONAL_MUSEUM_SOURCE],
      },
    ])
    .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  fallbacks: CORE_DAY_4.fallbacks,
};

export const LATE_ARRIVAL_TIER1_PLAN: ItineraryPlan = {
  variant: 'late-arrival',
  label: 'Late arrival — tier 1 (after 15:00)',
  description:
    'For a confirmed arrival after 15:00. Card is still activated on landing; only the Round Tower is attempted on Day 1. The National Museum of Denmark is explicitly rebalanced to Day 4 (primary, since it is open Mondays) with a Day 3-morning alternative also modelled.',
  isAmbitious: false,
  days: [tier1Day1, CORE_DAY_2, tier1Day3, tier1Day4],
};

// ---------------------------------------------------------------------------
// Tier 2: arrival confirmed AFTER 19:00
// ---------------------------------------------------------------------------

const tier2Day1: ItineraryDay = {
  dayNumber: 1,
  date: '2026-09-25',
  weekday: 'Friday',
  title: 'Late arrival (after 19:00)',
  theme: 'Card activation only — no attraction attempted',
  geographicReasoning:
    'With arrival after 19:00 there is no viable daylight window left for any attraction. The card is still activated on landing (starting its clock), and both the National Museum and the Round Tower are explicitly rebalanced to later days.',
  dayWarnings: [
    'Late-arrival tier 2: arrival confirmed after 19:00.',
    'No attraction is attempted on Day 1 in this tier.',
    'National Museum of Denmark rebalanced to Day 4 (open Mondays).',
    'The Round Tower is rebalanced to Day 3 evening.',
  ],
  blocks: [
    {
      id: 'la2-d1-arrival',
      kind: 'flight',
      startTime: '19:15',
      endTime: '19:20',
      timeIsEstimate: true,
      title: 'Arrive CPH (after 19:00, estimate)',
      passCovered: 'n/a',
      isOptional: false,
      fallbackBlockIds: [],
      sources: [],
    },
    {
      id: 'la2-d1-activate-card',
      kind: 'card-activation',
      startTime: '19:30',
      endTime: '19:35',
      timeIsEstimate: true,
      title: 'Activate Copenhagen Card at the airport',
      description: 'Still activated on landing — the clock starts now regardless of how late it is.',
      passCovered: 'n/a',
      isOptional: false,
      fallbackBlockIds: [],
      sources: [COPENHAGEN_CARD_FAQ_SOURCE],
    },
    {
      id: 'la2-d1-metro-and-checkin',
      kind: 'transit',
      startTime: '19:35',
      endTime: '20:15',
      timeIsEstimate: true,
      title: 'Metro to Vesterbro, direct check-in',
      transit: transit({ mode: 'metro', line: 'M2 / M3', from: 'Lufthavnen', to: 'Enghave Plads', minutes: 35, coveredByCard: true, journeyPlannerUrl: RJP }),
      passCovered: true,
      isOptional: false,
      fallbackBlockIds: [],
      sources: [COPENHAGEN_CARD_FAQ_SOURCE],
    },
    {
      id: 'la2-d1-dinner',
      kind: 'meal',
      startTime: '20:30',
      endTime: '21:45',
      timeIsEstimate: true,
      title: 'Late dinner near the hotel',
      passCovered: 'n/a',
      isOptional: false,
      fallbackBlockIds: [],
      sources: [],
    },
  ],
  fallbacks: [],
};

const tier2Day3: ItineraryDay = {
  ...CORE_DAY_3,
  title: `${CORE_DAY_3.title} + Round Tower (rebalanced from Day 1)`,
  dayWarnings: [
    ...CORE_DAY_3.dayWarnings,
    'The Round Tower is rebalanced here from Day 1 (tier 2), scheduled in the evening after dinner — confirm it is still admitting; the conservative floor is 18:00 close, so this evening slot depends on the summer-band 20:00 close still being in effect.',
  ],
  blocks: [
    ...CORE_DAY_3.blocks,
    {
      id: 'la2-d3-round-tower',
      kind: 'attraction',
      startTime: '19:45',
      endTime: '20:30',
      timeIsEstimate: true,
      title: 'The Round Tower (rebalanced from Day 1, evening)',
      description: 'Depends on the summer-band 20:00 close still being in effect on this date — unconfirmed.',
      attractionId: 'round-tower',
      passCovered: true,
      bookingWarning: 'Depends on the unconfirmed Sept→Oct switchover date — verify before relying on this slot.',
      isOptional: true,
      fallbackBlockIds: [],
      sources: [ROUND_TOWER_SOURCE],
    },
  ],
};

const tier2Day4: ItineraryDay = {
  ...CORE_DAY_4,
  title: `${CORE_DAY_4.title} + National Museum (rebalanced from Day 1)`,
  dayWarnings: [
    ...CORE_DAY_4.dayWarnings,
    'National Museum of Denmark rebalanced here from Day 1 (tier 2). The optional Workers Museum block is dropped to make room.',
  ],
  blocks: CORE_DAY_4.blocks
    .filter((b) => b.id !== 'core-d4-workers-museum')
    .map((b) =>
      b.id === 'core-d4-lunch'
        ? { ...b, startTime: '13:00', endTime: '13:45' }
        : b.id === 'core-d4-collect-luggage'
          ? { ...b, startTime: '15:45', endTime: '16:15' }
          : b,
    )
    .concat([
      {
        id: 'la2-d4-national-museum',
        kind: 'attraction',
        startTime: '13:45',
        endTime: '15:30',
        timeIsEstimate: true,
        title: 'National Museum of Denmark (rebalanced from Day 1)',
        attractionId: 'national-museum-denmark',
        passCovered: true,
        isOptional: false,
        fallbackBlockIds: [],
        sources: [NATIONAL_MUSEUM_SOURCE],
      },
    ])
    .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  fallbacks: CORE_DAY_4.fallbacks,
};

export const LATE_ARRIVAL_TIER2_PLAN: ItineraryPlan = {
  variant: 'late-arrival',
  label: 'Late arrival — tier 2 (after 19:00)',
  description:
    'For a confirmed arrival after 19:00. No attraction is attempted on Day 1 — only card activation and check-in. National Museum of Denmark rebalances to Day 4 (open Mondays), the Round Tower rebalances to Day 3 evening.',
  isAmbitious: false,
  days: [tier2Day1, CORE_DAY_2, tier2Day3, tier2Day4],
};

export const LATE_ARRIVAL_PLANS = [LATE_ARRIVAL_TIER1_PLAN, LATE_ARRIVAL_TIER2_PLAN];
