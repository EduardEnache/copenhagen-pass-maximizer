// Pure pass-value calculator. No I/O. See src/types/core.ts §PassCalculationResult
// and the research brief §4 for the exact formulas implemented here.

import type {
  Attraction,
  CardPrice,
  Delta,
  ItineraryPlan,
  PassCalculationResult,
  PassRules,
  TripConfig,
} from '@/types';
import { combineDateAndTimeCph, diffHours } from './datetime';
import { computeExpiry, computeFeasibility, isValidAt } from './passMath';
import { generateWarnings } from './warnings';

const DISCLOSURE =
  'All figures are estimates. Prices and opening hours were checked on 22 September 2026 against official sources where available; several attractions do not publish a standalone adult price. Verify everything before you travel.';

function findPrice(passRules: PassRules, cardType: TripConfig['cardType'], durationHours: number): CardPrice | undefined {
  return passRules.prices.find((p) => p.cardType === cardType && p.durationHours === durationHours);
}

function findAttraction(attractions: Attraction[], id: string): Attraction | undefined {
  return attractions.find((a) => a.id === id);
}

function computeCardCost(config: TripConfig, price: CardPrice | undefined): number {
  if (!price) return 0;
  const adultPrice = price.priceDkk.adult ?? 0;
  const juniorPrice = price.priceDkk.junior ?? 0;
  const kidsPrice = price.priceDkk.kids ?? 0;
  return config.adults * adultPrice + config.juniors * juniorPrice + config.children * kidsPrice;
}

/**
 * Builds the 72h-vs-96h comparison (spec §4.6). Always compares DISCOVER
 * 72h against DISCOVER 96h regardless of the config's actually-selected
 * duration, since that is the specific headline comparison the app makes.
 */
export function calculateDelta(config: TripConfig, attractions: Attraction[], plan: ItineraryPlan, passRules: PassRules): Delta {
  const price72 = findPrice(passRules, 'DISCOVER', 72);
  const price96 = findPrice(passRules, 'DISCOVER', 96);

  const extraCostTotalDkk =
    config.adults * ((price96?.priceDkk.adult ?? 0) - (price72?.priceDkk.adult ?? 0)) +
    config.juniors * ((price96?.priceDkk.junior ?? 0) - (price72?.priceDkk.junior ?? 0)) +
    config.children * ((price96?.priceDkk.kids ?? 0) - (price72?.priceDkk.kids ?? 0));

  const feasibility = computeFeasibility(config, 96); // requiredSpanHours is independent of duration
  const feasible72 = 72 >= feasibility.requiredSpanHours;
  const feasible96 = 96 >= feasibility.requiredSpanHours;

  const { expiryInstantMs: expiry72Ms } = computeExpiry(config.activationDateTime, 72);

  const attractionsLostUnder72 = new Set<string>();
  const journeysLostUnder72: string[] = [];

  for (const day of plan.days) {
    for (const block of day.blocks) {
      const endMs = new Date(combineDateAndTimeCph(day.date, block.endTime)).getTime();
      if (isValidAt(expiry72Ms, endMs)) continue;
      if (block.kind === 'attraction' && block.attractionId) {
        attractionsLostUnder72.add(block.attractionId);
      } else if (block.kind === 'transit') {
        journeysLostUnder72.push(block.id);
      }
    }
  }

  let verdict: Delta['verdict'];
  if (feasible96 && !feasible72) verdict = 'CHOOSE_96_FOR_COVERAGE';
  else if (feasible72) verdict = 'COMPARE_ON_VALUE';
  else verdict = 'NEITHER_COVERS_PLAN';

  return {
    extraCostTotalDkk,
    feasible72,
    feasible96,
    attractionsLostUnder72: Array.from(attractionsLostUnder72),
    journeysLostUnder72,
    verdict,
  };
}

export function calculatePassValue(
  config: TripConfig,
  attractions: Attraction[],
  plan: ItineraryPlan,
  passRules: PassRules,
): PassCalculationResult {
  const { activationInstantMs, expiryInstantMs, expiryDateTime } = computeExpiry(
    config.activationDateTime,
    config.cardDurationHours,
  );

  const feasibility = computeFeasibility(config, config.cardDurationHours);

  const firstMs = new Date(feasibility.firstJourneyStart).getTime();
  const lastMs = new Date(feasibility.lastJourneyEnd).getTime();
  const inboundAirportTransferCovered = isValidAt(expiryInstantMs, firstMs);
  const outboundAirportTransferCovered = isValidAt(expiryInstantMs, lastMs);

  const uncoveredJourneyBlockIds: string[] = [];
  for (const day of plan.days) {
    for (const block of day.blocks) {
      if (block.kind !== 'transit') continue;
      const endMs = new Date(combineDateAndTimeCph(day.date, block.endTime)).getTime();
      if (!isValidAt(expiryInstantMs, endMs)) uncoveredJourneyBlockIds.push(block.id);
    }
  }
  const allPlannedJourneysCovered = uncoveredJourneyBlockIds.length === 0;

  // Best activation recommendation
  let recommendedActivation: string;
  let recommendationMessage: string;
  if (feasibility.isFeasible) {
    recommendedActivation = feasibility.latestUsefulActivation;
    recommendationMessage = `Activate on landing at CPH. Both airport transfers and all sightseeing fall inside validity, with ${feasibility.slackHours.toFixed(1)}h to spare.`;
  } else {
    const earliestMs = new Date(feasibility.earliestRequiredActivation).getTime();
    const firstJourneyMs = new Date(feasibility.firstJourneyStart).getTime();
    recommendedActivation = earliestMs < firstJourneyMs ? feasibility.firstJourneyStart : feasibility.earliestRequiredActivation;
    const hoursLost = Math.max(0, diffHours(feasibility.firstJourneyStart, recommendedActivation));
    recommendationMessage = `A ${config.cardDurationHours}h card cannot cover both airport transfers (${feasibility.requiredSpanHours.toFixed(1)}h needed). To protect the return transfer you must not activate before ${recommendedActivation} — forfeiting ${hoursLost.toFixed(1)}h of day one. Choose a longer card.`;
  }

  // Costs / value
  const partySize = config.adults + config.juniors + config.children;
  const price = findPrice(passRules, config.cardType, config.cardDurationHours);
  const cardCostDkk = computeCardCost(config, price);

  const selectedAttractions = config.selectedAttractionIds
    .map((id) => findAttraction(attractions, id))
    .filter((a): a is Attraction => Boolean(a));

  const verifiedAdmissionPerAdultDkk = selectedAttractions
    .filter((a) => a.priceStatus === 'verified' && a.standaloneAdultPrice)
    .reduce((sum, a) => sum + (a.standaloneAdultPrice?.amountDkk ?? 0), 0);

  const partialAdmissionPerAdultDkk = selectedAttractions
    .filter((a) => a.priceStatus === 'partially-verified' && a.standaloneAdultPrice)
    .reduce((sum, a) => sum + (a.standaloneAdultPrice?.amountDkk ?? 0), 0);

  const unpricedAttractionCount = selectedAttractions.filter((a) => !a.standaloneAdultPrice).length;

  // Junior/child admission defaults to 0 (explicit assumption: most Danish
  // museums are free for under-18s) — only adults are multiplied in.
  const verifiedAdmissionTotalDkk = verifiedAdmissionPerAdultDkk * config.adults;
  const partialAdmissionTotalDkk = partialAdmissionPerAdultDkk * config.adults;

  const transportValueTotalDkk = (config.standaloneTransportEstimateDkk ?? 0) * partySize;

  const grossValueFloorDkk = verifiedAdmissionTotalDkk + transportValueTotalDkk;
  const grossValueUpperDkk = grossValueFloorDkk + partialAdmissionTotalDkk;
  const netFloorDkk = grossValueFloorDkk - cardCostDkk;

  const canClaimExactSavings =
    unpricedAttractionCount === 0 && selectedAttractions.every((a) => a.priceStatus === 'verified');

  const delta = calculateDelta(config, attractions, plan, passRules);

  const warnings = generateWarnings({ config, attractions, plan, passRules });

  return {
    cardType: config.cardType,
    durationHours: config.cardDurationHours,
    activationDateTime: config.activationDateTime,
    activationInstantMs,
    expiryDateTime,
    expiryInstantMs,

    requiredSpanHours: feasibility.requiredSpanHours,
    earliestRequiredActivation: feasibility.earliestRequiredActivation,
    latestUsefulActivation: feasibility.latestUsefulActivation,
    slackHours: feasibility.slackHours,
    isFeasible: feasibility.isFeasible,

    inboundAirportTransferCovered,
    outboundAirportTransferCovered,
    allPlannedJourneysCovered,
    uncoveredJourneyBlockIds,

    recommendedActivation,
    recommendationMessage,

    partySize,
    cardCostDkk,
    verifiedAdmissionPerAdultDkk,
    partialAdmissionPerAdultDkk,
    verifiedAdmissionTotalDkk,
    partialAdmissionTotalDkk,
    unpricedAttractionCount,
    transportValueTotalDkk,
    grossValueFloorDkk,
    grossValueUpperDkk,
    netFloorDkk,
    canClaimExactSavings,

    delta,

    warnings,
    disclosure: DISCLOSURE,
  };
}
