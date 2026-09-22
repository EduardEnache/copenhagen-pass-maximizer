import { describe, it, expect } from 'vitest';
import { calculatePassValue } from '../src/lib/passCalculator';
import { DEFAULT_TRIP_CONFIG } from '../src/data/tripDefaults';
import { ATTRACTIONS } from '../src/data/attractions';
import { CORE_PLAN } from '../src/data/itinerary.core';
import { PASS_RULES_DATA } from '../src/data/passRules';
import type { TripConfig } from '../src/types';

describe('calculatePassValue — 72 vs 96 delta', () => {
  it('extraCostTotal is 720 DKK for 4 adults, verdict is CHOOSE_96_FOR_COVERAGE', () => {
    const result = calculatePassValue(DEFAULT_TRIP_CONFIG, ATTRACTIONS, CORE_PLAN, PASS_RULES_DATA);
    expect(result.delta.extraCostTotalDkk).toBe(720);
    expect(result.delta.verdict).toBe('CHOOSE_96_FOR_COVERAGE');
    expect(result.delta.feasible72).toBe(false);
    expect(result.delta.feasible96).toBe(true);
  });
});

describe('calculatePassValue — canClaimExactSavings', () => {
  it('is false whenever any selected attraction is unpriced', () => {
    const config: TripConfig = {
      ...DEFAULT_TRIP_CONFIG,
      selectedAttractionIds: ['national-museum-denmark', 'copenhagen-zoo'], // zoo has no standalone price
    };
    const result = calculatePassValue(config, ATTRACTIONS, CORE_PLAN, PASS_RULES_DATA);
    expect(result.unpricedAttractionCount).toBeGreaterThan(0);
    expect(result.canClaimExactSavings).toBe(false);
  });

  it('is true when every selected attraction has a verified standalone price', () => {
    const config: TripConfig = {
      ...DEFAULT_TRIP_CONFIG,
      selectedAttractionIds: ['national-museum-denmark', 'round-tower', 'designmuseum-danmark', 'workers-museum'],
    };
    const result = calculatePassValue(config, ATTRACTIONS, CORE_PLAN, PASS_RULES_DATA);
    expect(result.unpricedAttractionCount).toBe(0);
    expect(result.canClaimExactSavings).toBe(true);
  });
});

describe('calculatePassValue — party defaults', () => {
  it('adults 4 / juniors 0 / children 0; cardCost is 4876 DKK for 96h DISCOVER', () => {
    expect(DEFAULT_TRIP_CONFIG.adults).toBe(4);
    expect(DEFAULT_TRIP_CONFIG.juniors).toBe(0);
    expect(DEFAULT_TRIP_CONFIG.children).toBe(0);
    expect(DEFAULT_TRIP_CONFIG.cardType).toBe('DISCOVER');
    expect(DEFAULT_TRIP_CONFIG.cardDurationHours).toBe(96);

    const result = calculatePassValue(DEFAULT_TRIP_CONFIG, ATTRACTIONS, CORE_PLAN, PASS_RULES_DATA);
    expect(result.partySize).toBe(4);
    expect(result.cardCostDkk).toBe(4876);
  });
});
