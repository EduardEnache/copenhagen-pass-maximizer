import { describe, it, expect } from 'vitest';
import { ATTRACTIONS, TIVOLI_GARDENS } from '../src/data/attractions';
import { PASS_RULES_DATA } from '../src/data/passRules';
import { VERIFY_BEFORE_YOU_GO } from '../src/data/verifyBeforeYouGo';
import { CITYHUB_COPENHAGEN } from '../src/data/hotel';
import { ALL_FALLBACK_BLOCKS } from '../src/data/fallbacks';
import { CORE_PLAN } from '../src/data/itinerary.core';
import { FAST_PACED_PLAN } from '../src/data/itinerary.fastPaced';
import { RAINY_DAY_PLAN } from '../src/data/itinerary.rainyDay';
import { LOW_ENERGY_PLAN } from '../src/data/itinerary.lowEnergy';
import { LATE_ARRIVAL_TIER1_PLAN, LATE_ARRIVAL_TIER2_PLAN } from '../src/data/itinerary.lateArrival';
import type { ItineraryPlan, SourceRef } from '../src/types';

const ALL_PLANS: ItineraryPlan[] = [
  CORE_PLAN,
  FAST_PACED_PLAN,
  RAINY_DAY_PLAN,
  LOW_ENERGY_PLAN,
  LATE_ARRIVAL_TIER1_PLAN,
  LATE_ARRIVAL_TIER2_PLAN,
];

const RESEARCH_DATE = '2026-09-22';

describe('every attraction has a source checked on 2026-09-22', () => {
  it.each(ATTRACTIONS.map((a) => [a.id, a] as const))('%s', (_id, attraction) => {
    expect(attraction.openingSource.checkedOn).toBe(RESEARCH_DATE);
    expect(attraction.includedSource.checkedOn).toBe(RESEARCH_DATE);
    if (attraction.standaloneAdultPrice) {
      expect(attraction.standaloneAdultPrice.source.checkedOn).toBe(RESEARCH_DATE);
    }
    if (attraction.excluded) {
      expect(attraction.excluded.source.checkedOn).toBe(RESEARCH_DATE);
    }
  });
});

describe('no attraction has a standalone price while priceStatus is unverified', () => {
  it.each(ATTRACTIONS.map((a) => [a.id, a] as const))('%s', (_id, attraction) => {
    if (attraction.priceStatus === 'unverified') {
      expect(attraction.standaloneAdultPrice).toBeUndefined();
    }
  });
});

describe('fallbackBlockIds resolve to real blocks', () => {
  it('every fallbackBlockIds entry across every plan resolves to a block id in fallbacks.ts or some plan', () => {
    const knownIds = new Set<string>();
    for (const block of ALL_FALLBACK_BLOCKS) knownIds.add(block.id);
    for (const plan of ALL_PLANS) {
      for (const day of plan.days) {
        for (const block of day.blocks) knownIds.add(block.id);
        for (const block of day.fallbacks) knownIds.add(block.id);
      }
    }

    const missing: string[] = [];
    for (const plan of ALL_PLANS) {
      for (const day of plan.days) {
        for (const block of day.blocks) {
          for (const fbId of block.fallbackBlockIds) {
            if (!knownIds.has(fbId)) missing.push(`${plan.variant}/${day.date}/${block.id} -> ${fbId}`);
          }
        }
      }
    }
    expect(missing).toEqual([]);
  });
});

describe('Tivoli is excluded and never scheduled', () => {
  it('has an `excluded` field set', () => {
    expect(TIVOLI_GARDENS.excluded).toBeDefined();
  });

  it('is absent from every block in every plan (including fallbacks)', () => {
    const offending: string[] = [];
    for (const plan of ALL_PLANS) {
      for (const day of plan.days) {
        for (const block of [...day.blocks, ...day.fallbacks]) {
          if (block.attractionId === 'tivoli-gardens') offending.push(`${plan.variant}/${day.date}/${block.id}`);
        }
      }
    }
    for (const block of ALL_FALLBACK_BLOCKS) {
      if (block.attractionId === 'tivoli-gardens') offending.push(`fallbacks.ts/${block.id}`);
    }
    expect(offending).toEqual([]);
  });
});

function collectAllSourceRefs(): SourceRef[] {
  const sources: SourceRef[] = [];
  for (const a of ATTRACTIONS) {
    sources.push(a.openingSource, a.includedSource);
    if (a.standaloneAdultPrice) sources.push(a.standaloneAdultPrice.source);
    if (a.excluded) sources.push(a.excluded.source);
  }
  for (const p of PASS_RULES_DATA.prices) sources.push(p.source);
  for (const r of PASS_RULES_DATA.rules) sources.push(r.source);
  for (const v of VERIFY_BEFORE_YOU_GO) if (v.source) sources.push(v.source);
  sources.push(CITYHUB_COPENHAGEN.luggageBeforeCheckIn.source, CITYHUB_COPENHAGEN.luggageAfterCheckOut.source);
  return sources;
}

describe('every URL is https', () => {
  it('every SourceRef.url starts with https://', () => {
    const bad = collectAllSourceRefs()
      .map((s) => s.url)
      .filter((url) => !url.startsWith('https://'));
    expect(bad).toEqual([]);
  });

  it('every Attraction.officialUrl starts with https://', () => {
    const bad = ATTRACTIONS.map((a) => a.officialUrl).filter((url) => !url.startsWith('https://'));
    expect(bad).toEqual([]);
  });

  it('CityHub officialUrl starts with https://', () => {
    expect(CITYHUB_COPENHAGEN.officialUrl.startsWith('https://')).toBe(true);
  });
});
