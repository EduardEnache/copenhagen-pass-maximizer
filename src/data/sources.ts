// Every SourceRef used anywhere in src/data is defined exactly once here and
// imported elsewhere, so a given citation is never duplicated/forked across
// files. checkedOn is '2026-09-22' for every source (the research date).
import type { SourceRef } from '@/types';

const CHECKED_ON = '2026-09-22';

export const COPENHAGEN_CARD_PRICES_SOURCE: SourceRef = {
  name: 'Copenhagen Card — official prices page',
  url: 'https://copenhagencard.com/view/prices',
  checkedOn: CHECKED_ON,
  status: 'verified',
  isOfficial: true,
};

export const COPENHAGEN_CARD_FAQ_SOURCE: SourceRef = {
  name: 'Copenhagen Card — FAQ',
  url: 'https://copenhagencard.com/view/faq?lang=EN',
  checkedOn: CHECKED_ON,
  status: 'verified',
  isOfficial: true,
};

export const COPENHAGEN_CARD_ATTRACTIONS_LIST_SOURCE: SourceRef = {
  name: 'Copenhagen Card — attractions list',
  url: 'https://copenhagencard.com/attractions',
  checkedOn: CHECKED_ON,
  status: 'verified',
  isOfficial: true,
  note: 'Used to confirm an attraction is included with the Copenhagen Card DISCOVER pass.',
};

export const COPENHAGEN_CARD_ATTRACTIONS_LIST_SOURCE_UNVERIFIED: SourceRef = {
  name: 'Copenhagen Card — attractions list (inclusion not re-confirmed today)',
  url: 'https://copenhagencard.com/attractions',
  checkedOn: CHECKED_ON,
  status: 'unverified',
  isOfficial: true,
  note: 'Best-effort assumption that this attraction is included with the card; not individually re-confirmed during today\'s research pass.',
};

export const TIVOLI_SEASONS_SOURCE: SourceRef = {
  name: 'Tivoli Gardens — opening hours and seasons',
  url: 'https://www.tivoli.dk/en/opening-hours-and-seasons',
  checkedOn: CHECKED_ON,
  status: 'verified',
  isOfficial: true,
  note: 'Confirms Halloween season starts 2 Oct 2026, i.e. Tivoli is not open in any published autumn season during 25-28 Sept 2026.',
};

export const TIVOLI_HALLOWEEN_SOURCE: SourceRef = {
  name: 'Tivoli Gardens — Halloween in Tivoli',
  url: 'https://www.tivoli.dk/en/opening-hours-and-seasons/halloween-in-tivoli',
  checkedOn: CHECKED_ON,
  status: 'verified',
  isOfficial: true,
};

export const TIVOLI_SUMMER_SEASON_SECONDARY_SOURCE: SourceRef = {
  name: 'ARP-Hansen — Tivoli summer season (secondary/corroborating)',
  url: 'https://www.arp-hansen.com/experience-copenhagen/tivoli-summer-season',
  checkedOn: CHECKED_ON,
  status: 'partially-verified',
  isOfficial: false,
  note: 'Reports summer season 27 Mar – 20 Sept 2026; secondary source, corroborates but does not replace tivoli.dk.',
};

export const COPENHAGEN_ZOO_SOURCE: SourceRef = {
  name: 'Copenhagen Zoo — opening hours',
  url: 'https://www.zoo.dk/en/opening-hours',
  checkedOn: CHECKED_ON,
  status: 'verified',
  isOfficial: true,
};

export const CITYHUB_FAQ_SOURCE: SourceRef = {
  name: 'CityHub Copenhagen — FAQ (before-check-in luggage)',
  url: 'https://cityhub.com/copenhagen/faq/',
  checkedOn: CHECKED_ON,
  status: 'verified',
  isOfficial: true,
  note: 'Free luggage lockers before check-in, confirmed.',
};

export const CITYHUB_FAQ_AFTER_CHECKOUT_SOURCE: SourceRef = {
  name: 'CityHub Copenhagen — FAQ (after-checkout storage, not verbatim-confirmed)',
  url: 'https://cityhub.com/copenhagen/faq/',
  checkedOn: CHECKED_ON,
  status: 'partially-verified',
  isOfficial: true,
  note: 'Same free-locker policy is widely reported to extend to after checkout, but this was not confirmed verbatim on the page fetched today. Confirm with the hotel directly.',
};

export const NATIONAL_MUSEUM_SOURCE: SourceRef = {
  name: 'National Museum of Denmark — visitor information',
  url: 'https://nationalmuseet.dk/en/information',
  checkedOn: CHECKED_ON,
  status: 'verified',
  isOfficial: true,
};

export const ROUND_TOWER_SOURCE: SourceRef = {
  name: 'The Round Tower — practical information',
  url: 'https://www.rundetaarn.dk/en/practical-information/',
  checkedOn: CHECKED_ON,
  status: 'partially-verified',
  isOfficial: true,
  note: 'Summer band (Apr-Sep, daily 10:00-20:00) is published; the exact Sept→Oct switchover date to the autumn schedule is not published.',
};

export const FREDERIKSBORG_SOURCE: SourceRef = {
  name: 'Frederiksborg Castle / Museum of National History',
  url: 'https://frederiksborg.dk/en/',
  checkedOn: CHECKED_ON,
  status: 'verified',
  isOfficial: true,
  note: 'Open every day 10:00-17:00, verified. Admission price conflicts across sources (120 vs 125 DKK) — treated separately as conflicting, not used in totals.',
};

export const SMK_SOURCE: SourceRef = {
  name: 'SMK — National Gallery of Denmark (via Copenhagen Card)',
  url: 'https://copenhagencard.com/attractions/the-national-gallery-of-denmark',
  checkedOn: CHECKED_ON,
  status: 'verified',
  isOfficial: false,
  note: 'Dated band 2026-06-01 to 2026-10-11: Mon closed, Tue-Fri 10:00-18:00 (Wed to 20:00), Sat-Sun 10:00-18:00.',
};

export const ROSENBORG_SOURCE: SourceRef = {
  name: 'Rosenborg Castle — plan your visit',
  url: 'https://denkongeligesamling.dk/en/rosenborg-castle/plan-your-visit/',
  checkedOn: CHECKED_ON,
  status: 'conflicting',
  isOfficial: true,
  note: 'One published window says daily 10:00-16:00 for 1 Sep-13 Oct 2026; another says 10:00-17:00 for 18-30 Sept. Plan to the conservative 10:00-16:00 window.',
};

export const AMALIENBORG_SOURCE: SourceRef = {
  name: 'Amalienborg Museum — opening hours',
  url: 'https://denkongeligesamling.dk/en/amalienborg-museum/plan-your-visit/opening-hours/',
  checkedOn: CHECKED_ON,
  status: 'verified',
  isOfficial: true,
  note: 'Tue-Sun 10:00-16:00, closed Mondays.',
};

export const DESIGNMUSEUM_SOURCE: SourceRef = {
  name: 'Designmuseum Danmark — opening hours & admission',
  url: 'https://designmuseum.dk/en/besog-os/opening-hours-admission/',
  checkedOn: CHECKED_ON,
  status: 'verified',
  isOfficial: true,
  note: 'Tue-Sun 10:00-18:00 (Thu to 20:00), closed Mondays. Ticket sales close 1h before closing.',
};

export const CANAL_TOURS_SOURCE: SourceRef = {
  name: 'Canal Tours Copenhagen (Strömma), via Copenhagen Card',
  url: 'https://copenhagencard.com/attractions/canal-tours-copenhagen',
  checkedOn: CHECKED_ON,
  status: 'verified',
  isOfficial: false,
  note: 'September operating window 10:00-17:30 verified; this is NOT a departure schedule. Exact last departure time is not published — verify before relying on an evening sailing. Must board at the Ved Stranden 26 ticket office; boarding elsewhere incurs a surcharge.',
};

export const CISTERNERNE_SOURCE: SourceRef = {
  name: 'Cisternerne (via Copenhagen Card, corroborating)',
  url: 'https://copenhagencard.com/attractions/cisternerne',
  checkedOn: CHECKED_ON,
  status: 'partially-verified',
  isOfficial: false,
  note: 'Official frederiksbergmuseerne.dk page was unreachable during research; hours corroborated via Copenhagen Card only. Tue-Sun 11:00-18:00 (Thu to 21:00), closed Mondays outside Jun-Aug. Standalone price conflicts (110-120 DKK).',
};

export const WORKERS_MUSEUM_SOURCE: SourceRef = {
  name: 'The Workers Museum (Arbejdermuseet) — opening hours and admission',
  url: 'https://www.arbejdermuseet.dk/en/visit/openinghours-and-admissions/',
  checkedOn: CHECKED_ON,
  status: 'verified',
  isOfficial: true,
  note: 'Daily 10:00-17:00 (Thu to 20:00), open Mondays — one of very few Monday-open central attractions.',
};

export const DAVID_COLLECTION_SOURCE: SourceRef = {
  name: 'The David Collection (via kbhmuseer.dk)',
  url: 'https://www.kbhmuseer.dk/en/museum/the-david-collection/',
  checkedOn: CHECKED_ON,
  status: 'unverified',
  isOfficial: false,
  note: 'Hours (Tue-Sun, Mon closed) not confirmed from an official page today. Optional filler only — verify before relying on it.',
};

export const CHRISTIANSBORG_HOURS_SOURCE: SourceRef = {
  name: 'Christiansborg Palace — plan your visit (hours not obtained)',
  url: 'https://denkongeligesamling.dk/en/christiansborg-palace/plan-your-visit/',
  checkedOn: CHECKED_ON,
  status: 'unverified',
  isOfficial: true,
  note: 'Opening hours were not obtained/published on the page fetched today. Verify before travel.',
};

export const CHRISTIANSBORG_PRICE_SOURCE: SourceRef = {
  name: 'Christiansborg Palace — plan your visit (ticket prices)',
  url: 'https://denkongeligesamling.dk/en/christiansborg-palace/plan-your-visit/',
  checkedOn: CHECKED_ON,
  status: 'verified',
  isOfficial: true,
  note: 'Palace Ticket 225 DKK door / 215 DKK online. Stables/Kitchen/Ruins 85/75 DKK each (separate optional add-ons, not modelled as their own Attraction records). No large bags or suitcases admitted.',
};

export const KRONBORG_SOURCE: SourceRef = {
  name: 'Kronborg Castle — plan your visit',
  url: 'https://kronborg.dk/en/plan-your-visit',
  checkedOn: CHECKED_ON,
  status: 'partially-verified',
  isOfficial: true,
  note: 'Daily 10:00-17:00, late Mar-end Oct; secondary-sourced. Admission price conflicts (145-150 DKK). Only used in the fast-paced maximizer plan.',
};

export const LOUISIANA_SOURCE: SourceRef = {
  name: 'Louisiana Museum of Modern Art (hours not verified today)',
  url: 'https://louisiana.dk/en/',
  checkedOn: CHECKED_ON,
  status: 'unverified',
  isOfficial: true,
  note: 'Hours not verified today — treat as optional/deferred, do not schedule without checking first.',
};

export const ARKEN_SOURCE: SourceRef = {
  name: 'ARKEN Museum of Modern Art (hours not verified today)',
  url: 'https://arken.dk/en/',
  checkedOn: CHECKED_ON,
  status: 'unverified',
  isOfficial: true,
  note: 'Hours not verified today — treat as optional/deferred, do not schedule without checking first.',
};

export const BOTANICAL_GARDEN_SOURCE: SourceRef = {
  name: 'University of Copenhagen Botanical Garden (Palm House) (hours not verified today)',
  url: 'https://botanik.snm.ku.dk/english/',
  checkedOn: CHECKED_ON,
  status: 'unverified',
  isOfficial: true,
  note: 'Free outdoor garden; hours not verified today. Treat as always-available bonus filler, never load-bearing in a plan.',
};

export const REJSEPLANEN_INFO_SOURCE: SourceRef = {
  name: 'Copenhagen Card — FAQ (full-journey validity rule)',
  url: 'https://copenhagencard.com/view/faq?lang=EN',
  checkedOn: CHECKED_ON,
  status: 'verified',
  isOfficial: true,
  note: 'Card must be valid for the entire journey, whether travelling by bus, train, harbor bus, or metro.',
};
