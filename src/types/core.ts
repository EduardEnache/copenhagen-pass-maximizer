// Copenhagen Pass Maximizer — core domain types.
// All data in src/data/* must conform to these shapes. Nothing here performs
// I/O; this file is pure type/interface declarations.

export type ISODate = string; // "2026-09-25"
export type ISOTime = string; // "14:30" (Europe/Copenhagen wall time)
export type ISODateTime = string; // "2026-09-25T14:30:00+02:00"

export type VerificationStatus =
  | 'verified'
  | 'partially-verified'
  | 'unverified'
  | 'not-yet-published'
  | 'conflicting';

export interface SourceRef {
  name: string;
  url: string;
  checkedOn: ISODate;
  status: VerificationStatus;
  note?: string;
  isOfficial: boolean;
}

export interface Money {
  amountDkk: number;
  source: SourceRef;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

export interface OpeningWindow {
  days: DayOfWeek[];
  opens: ISOTime;
  closes: ISOTime;
  lastAdmissionBeforeCloseMin?: number;
  appliesFrom?: ISODate;
  appliesTo?: ISODate;
  note?: string;
}

export type Cluster =
  | 'indre-by'
  | 'frederiksstaden'
  | 'noerreport-parkmuseerne'
  | 'vesterbro'
  | 'frederiksberg'
  | 'harbour'
  | 'north-zealand'
  | 'airport';

export interface GeoPoint {
  lat: number;
  lon: number;
}

export interface Attraction {
  id: string;
  name: string;
  shortName?: string;
  address: string;
  cluster: Cluster;
  geo: GeoPoint;
  includedInDiscover: boolean;
  includedSource: SourceRef;
  openingWindows: OpeningWindow[];
  openingSource: SourceRef;
  closedOnDates?: ISODate[];
  standaloneAdultPrice?: Money;
  priceStatus: VerificationStatus;
  reservationRequired: boolean;
  reservationNote?: string;
  typicalVisitMinutes: number;
  indoor: boolean;
  lowMobilityFriendly: boolean;
  officialUrl: string;
  mapUrl: string; // Google Maps link (search/pin), no API key required
  warnings: string[];
  excluded?: { reason: string; source: SourceRef };
}

export type BlockKind =
  | 'flight'
  | 'transit'
  | 'attraction'
  | 'meal'
  | 'rest'
  | 'luggage'
  | 'checkin'
  | 'checkout'
  | 'card-activation'
  | 'walk'
  | 'buffer';

export interface TransitLeg {
  mode: 'metro' | 's-train' | 'regional-train' | 'bus' | 'walk' | 'harbour-bus';
  line?: string;
  from: string;
  to: string;
  minutes: number;
  isEstimate: true;
  coveredByCard: boolean;
  journeyPlannerUrl: string;
}

export interface ItineraryBlock {
  id: string;
  kind: BlockKind;
  startTime: ISOTime;
  endTime: ISOTime;
  timeIsEstimate: boolean;
  title: string;
  description?: string;
  attractionId?: string;
  transit?: TransitLeg;
  passCovered: boolean | 'n/a';
  estimatedStandaloneValueDkk?: number;
  valueStatus?: VerificationStatus;
  bookingWarning?: string;
  isOptional: boolean;
  fallbackBlockIds: string[];
  sources: SourceRef[];
}

export type PlanVariant = 'core' | 'fast-paced' | 'rainy-day' | 'low-energy' | 'late-arrival';

export interface ItineraryDay {
  dayNumber: 1 | 2 | 3 | 4;
  date: ISODate;
  weekday: string;
  title: string;
  theme: string;
  geographicReasoning: string;
  blocks: ItineraryBlock[];
  fallbacks: ItineraryBlock[];
  dayWarnings: string[];
}

export interface ItineraryPlan {
  variant: PlanVariant;
  label: string;
  description: string;
  isAmbitious: boolean;
  days: ItineraryDay[];
}

export type CardType = 'DISCOVER' | 'HOP';
export type CardDurationHours = 24 | 48 | 72 | 96 | 120;
export type AgeBand = 'adult' | 'junior' | 'kids';

export interface CardPrice {
  cardType: CardType;
  durationHours: CardDurationHours;
  // DEVIATION FROM SPEC: `number | null` instead of a bare `number`. The HOP
  // card's published comparison data (copenhagencard.com/view/prices) gives
  // only an adult price for 24h/48h/72h — no junior/kids figures were ever
  // published. Rather than invent junior/kids numbers (forbidden by the
  // brief), unpublished age bands are explicitly `null`. DISCOVER entries
  // always have all three bands populated.
  priceDkk: Record<AgeBand, number | null>;
  source: SourceRef;
}

export interface PassRule {
  id: string;
  text: string;
  source: SourceRef;
}

export interface PassRules {
  prices: CardPrice[];
  rules: PassRule[];
  expiryIsExclusive: true;
  transportZones: string;
  airportTransportIncluded: boolean;
  oneVisitPerAttraction: boolean;
}

export interface TripConfig {
  adults: number;
  juniors: number;
  children: number; // defaults 4/0/0
  cardType: CardType;
  cardDurationHours: CardDurationHours; // defaults DISCOVER/96
  activationDateTime: ISODateTime; // default '2026-09-25T11:15:00+02:00' (ESTIMATE)
  outboundFlight: {
    number: string | null;
    departsLocal: ISODateTime;
    arrivesLocal: ISODateTime | null;
    arrivalIsEstimate: boolean;
  };
  returnFlight: {
    number: string | null;
    departsLocal: ISODateTime;
    departureTerminal?: string;
    arrivesLocal?: ISODateTime;
  };
  targetAirportArrival: ISODateTime; // default '2026-09-28T19:00:00+02:00'
  leaveCityForAirport: ISODateTime; // default '2026-09-28T17:15:00+02:00'
  airportTransferMinutes: number; // default 35
  selectedAttractionIds: string[];
  standaloneTransportEstimateDkk: number | null;
  selectedVariant: PlanVariant;
}

// ---------------------------------------------------------------------------
// Warning engine

export interface Warning {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  relatedBlockIds: string[];
}

// ---------------------------------------------------------------------------
// 72h vs 96h comparison (spec §4.6)

export interface Delta {
  extraCostTotalDkk: number;
  feasible72: boolean;
  feasible96: boolean;
  attractionsLostUnder72: string[]; // attraction ids whose planned block falls after the 72h expiry
  journeysLostUnder72: string[]; // transit block ids whose end falls after the 72h expiry
  verdict: 'CHOOSE_96_FOR_COVERAGE' | 'COMPARE_ON_VALUE' | 'NEITHER_COVERS_PLAN';
}

// ---------------------------------------------------------------------------
// Pass value calculation result (spec §4.8)

export interface PassCalculationResult {
  cardType: CardType;
  durationHours: CardDurationHours;
  activationDateTime: ISODateTime;
  activationInstantMs: number;
  expiryDateTime: ISODateTime;
  expiryInstantMs: number;

  // Coverage feasibility
  requiredSpanHours: number;
  earliestRequiredActivation: ISODateTime;
  latestUsefulActivation: ISODateTime;
  slackHours: number;
  isFeasible: boolean;

  // Journey coverage
  inboundAirportTransferCovered: boolean;
  outboundAirportTransferCovered: boolean;
  allPlannedJourneysCovered: boolean;
  uncoveredJourneyBlockIds: string[];

  // Best activation recommendation
  recommendedActivation: ISODateTime;
  recommendationMessage: string;

  // Costs / value
  partySize: number;
  cardCostDkk: number;
  verifiedAdmissionPerAdultDkk: number;
  partialAdmissionPerAdultDkk: number;
  verifiedAdmissionTotalDkk: number;
  partialAdmissionTotalDkk: number;
  unpricedAttractionCount: number;
  transportValueTotalDkk: number;
  grossValueFloorDkk: number;
  grossValueUpperDkk: number;
  netFloorDkk: number;
  canClaimExactSavings: boolean;

  // 72h vs 96h comparison
  delta: Delta;

  warnings: Warning[];
  disclosure: string;
}
