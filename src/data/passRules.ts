import type { CardPrice, PassRule, PassRules } from '@/types';
import { COPENHAGEN_CARD_PRICES_SOURCE, COPENHAGEN_CARD_FAQ_SOURCE } from './sources';

// DISCOVER card price matrix — source: Copenhagen Card official prices page, verified.
export const DISCOVER_PRICES: CardPrice[] = [
  {
    cardType: 'DISCOVER',
    durationHours: 24,
    priceDkk: { adult: 589, junior: 399, kids: 100 },
    source: COPENHAGEN_CARD_PRICES_SOURCE,
  },
  {
    cardType: 'DISCOVER',
    durationHours: 48,
    priceDkk: { adult: 859, junior: 509, kids: 140 },
    source: COPENHAGEN_CARD_PRICES_SOURCE,
  },
  {
    cardType: 'DISCOVER',
    durationHours: 72,
    priceDkk: { adult: 1039, junior: 589, kids: 180 },
    source: COPENHAGEN_CARD_PRICES_SOURCE,
  },
  {
    cardType: 'DISCOVER',
    durationHours: 96,
    priceDkk: { adult: 1219, junior: 699, kids: 220 },
    source: COPENHAGEN_CARD_PRICES_SOURCE,
  },
  {
    cardType: 'DISCOVER',
    durationHours: 120,
    priceDkk: { adult: 1419, junior: 789, kids: 260 },
    source: COPENHAGEN_CARD_PRICES_SOURCE,
  },
];

// HOP card comparison data — NOT recommended, no 96h/120h duration exists,
// excludes airport transport. Only adult pricing was published; junior/kids
// were never published for HOP so those bands are `null` (see the
// DEVIATION note on CardPrice.priceDkk in src/types/core.ts).
export const HOP_PRICES: CardPrice[] = [
  {
    cardType: 'HOP',
    durationHours: 24,
    priceDkk: { adult: 600, junior: null, kids: null },
    source: COPENHAGEN_CARD_PRICES_SOURCE,
  },
  {
    cardType: 'HOP',
    durationHours: 48,
    priceDkk: { adult: 875, junior: null, kids: null },
    source: COPENHAGEN_CARD_PRICES_SOURCE,
  },
  {
    cardType: 'HOP',
    durationHours: 72,
    priceDkk: { adult: 1050, junior: null, kids: null },
    source: COPENHAGEN_CARD_PRICES_SOURCE,
  },
];

export const ALL_CARD_PRICES: CardPrice[] = [...DISCOVER_PRICES, ...HOP_PRICES];

export const PASS_RULES: PassRule[] = [
  {
    id: 'activation-irreversible',
    text: 'Once activated, the Copenhagen Card cannot be paused or un-activated. It runs continuously to expiry.',
    source: COPENHAGEN_CARD_FAQ_SOURCE,
  },
  {
    id: 'expiry-exclusive',
    text: 'Expiry = activation time + N hours, EXCLUSIVE. A 24h card activated at 10:00 expires at 09:59 the next day (10:00:00 itself is already invalid).',
    source: COPENHAGEN_CARD_FAQ_SOURCE,
  },
  {
    id: 'transport-zones',
    text: 'Covers public transport zones 1-99, including regional trains to Roskilde, Hillerød, and Helsingør.',
    source: COPENHAGEN_CARD_FAQ_SOURCE,
  },
  {
    id: 'airport-transport-included',
    text: 'Airport transport (Metro/train to and from Copenhagen Airport) is included while the card is active — DISCOVER cards only, not HOP.',
    source: COPENHAGEN_CARD_FAQ_SOURCE,
  },
  {
    id: 'full-journey-validity',
    text: 'The card must be valid for the entire journey, whether travelling by bus, train, harbor bus, or metro. If it expires mid-journey, that journey is not covered.',
    source: COPENHAGEN_CARD_FAQ_SOURCE,
  },
  {
    id: 'one-visit-per-attraction',
    text: 'Each attraction may be visited once per card; no re-entry on the same card.',
    source: COPENHAGEN_CARD_FAQ_SOURCE,
  },
  {
    id: 'age-bands',
    text: 'Age bands: 0-2 free (no card needed), 3-11 kids (max 2 kids per adult card), 12-15 junior, 16+ adult.',
    source: COPENHAGEN_CARD_FAQ_SOURCE,
  },
  {
    id: 'refund-exchange-validity',
    text: 'Full refund within 6 months of purchase if unused; one exchange allowed within 1 year of purchase; card expires 2 years from purchase if never activated.',
    source: COPENHAGEN_CARD_FAQ_SOURCE,
  },
];

export const PASS_RULES_DATA: PassRules = {
  prices: ALL_CARD_PRICES,
  rules: PASS_RULES,
  expiryIsExclusive: true,
  transportZones: 'Zones 1-99, incl. regional trains to Roskilde, Hillerød, and Helsingør',
  airportTransportIncluded: true,
  oneVisitPerAttraction: true,
};
