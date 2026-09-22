import { describe, it, expect } from 'vitest';
import {
  generateWarnings,
  checkLeaveTimeInconsistent,
  checkTivoliSelected,
  checkAttractionsClosedOnDate,
  checkVisitOutsideHours,
} from '../src/lib/warnings';
import { DEFAULT_TRIP_CONFIG } from '../src/data/tripDefaults';
import { ATTRACTIONS } from '../src/data/attractions';
import { CORE_PLAN } from '../src/data/itinerary.core';
import { PASS_RULES_DATA } from '../src/data/passRules';
import type { ItineraryBlock, ItineraryDay, ItineraryPlan, TripConfig } from '../src/types';

function buildSingleBlockPlan(
  date: string,
  weekday: string,
  attractionId: string,
  startTime = '13:45',
  endTime = '14:45',
): ItineraryPlan {
  const block: ItineraryBlock = {
    id: 'test-block',
    kind: 'attraction',
    startTime,
    endTime,
    timeIsEstimate: false,
    title: 'Test block',
    attractionId,
    passCovered: true,
    isOptional: false,
    fallbackBlockIds: [],
    sources: [],
  };
  const day: ItineraryDay = {
    dayNumber: 1,
    date,
    weekday,
    title: 'Test day',
    theme: 'test',
    geographicReasoning: 'test',
    blocks: [block],
    fallbacks: [],
    dayWarnings: [],
  };
  return { variant: 'core', label: 'test', description: 'test', isAmbitious: false, days: [day] };
}

describe('expiry-before-airport', () => {
  it('fires for a 72h card with the default target airport arrival, not for 96h', () => {
    const config72: TripConfig = { ...DEFAULT_TRIP_CONFIG, cardDurationHours: 72 };
    const warnings72 = generateWarnings({ config: config72, attractions: ATTRACTIONS, plan: CORE_PLAN, passRules: PASS_RULES_DATA });
    expect(warnings72.some((w) => w.id === 'expiry-before-airport')).toBe(true);

    const warnings96 = generateWarnings({ config: DEFAULT_TRIP_CONFIG, attractions: ATTRACTIONS, plan: CORE_PLAN, passRules: PASS_RULES_DATA });
    expect(warnings96.some((w) => w.id === 'expiry-before-airport')).toBe(false);
  });
});

describe('leave-time-inconsistent', () => {
  it('fires critical when leave time + transfer minutes exceeds the target airport arrival', () => {
    const config: TripConfig = {
      ...DEFAULT_TRIP_CONFIG,
      leaveCityForAirport: '2026-09-28T18:45:00+02:00',
      airportTransferMinutes: 35,
      targetAirportArrival: '2026-09-28T19:00:00+02:00',
    };
    const warning = checkLeaveTimeInconsistent(config);
    expect(warning).not.toBeNull();
    expect(warning?.severity).toBe('critical');
    expect(warning?.id).toBe('leave-time-inconsistent');
  });

  it('does not fire for the (consistent) defaults', () => {
    const warning = checkLeaveTimeInconsistent(DEFAULT_TRIP_CONFIG);
    expect(warning).toBeNull();
  });
});

describe('attraction-closed-on-date', () => {
  it('Amalienborg on Monday 2026-09-28 is critical; on Sunday 2026-09-27 it is clear', () => {
    const mondayPlan = buildSingleBlockPlan('2026-09-28', 'Monday', 'amalienborg-museum');
    const mondayWarnings = checkAttractionsClosedOnDate(ATTRACTIONS, mondayPlan);
    expect(mondayWarnings.some((w) => w.id.startsWith('attraction-closed-on-date') && w.severity === 'critical')).toBe(true);

    const sundayPlan = buildSingleBlockPlan('2026-09-27', 'Sunday', 'amalienborg-museum');
    const sundayWarnings = checkAttractionsClosedOnDate(ATTRACTIONS, sundayPlan);
    expect(sundayWarnings.some((w) => w.id.startsWith('attraction-closed-on-date'))).toBe(false);
  });
});

describe('tivoli-selected guard', () => {
  it('fires critical whenever Tivoli is selected, on any trip date', () => {
    const config: TripConfig = { ...DEFAULT_TRIP_CONFIG, selectedAttractionIds: ['tivoli-gardens'] };
    const warning = checkTivoliSelected(config, CORE_PLAN);
    expect(warning).not.toBeNull();
    expect(warning?.severity).toBe('critical');
    expect(warning?.id).toBe('tivoli-selected');
  });
});

describe('regression guard: Copenhagen Zoo on Monday', () => {
  it('Zoo on Monday 28 Sept 09:45-13:00 produces no closed/hours warnings', () => {
    const plan = buildSingleBlockPlan('2026-09-28', 'Monday', 'copenhagen-zoo', '09:45', '13:00');
    expect(checkAttractionsClosedOnDate(ATTRACTIONS, plan)).toHaveLength(0);
    expect(checkVisitOutsideHours(ATTRACTIONS, plan)).toHaveLength(0);
  });
});
