# Copenhagen Pass Maximizer — development & data guide

A real, deployable trip-planning site for a 4-day Copenhagen trip (25–28 Sept
2026, 4 adults), built around getting the most out of a 96h Copenhagen Card
DISCOVER pass. No backend, no accounts, no analytics — a static site that
reads its itinerary/pricing data from a set of typed TypeScript modules
committed to the repo.

## Architecture

- **Build**: Vite + React + TypeScript, output to `dist/`, served by nginx in
  a single-stage-runtime Docker image (multi-stage build).
- **No backend.** All trip data (attractions, prices, opening hours,
  itineraries, pass rules) lives in `src/data/*.ts` as typed constants — there
  is no database and no API calls at runtime except to Google Maps/Rejseplanen
  links (all keyless, no billing account) that open in the visitor's own
  browser, plus one keyless Google Maps embed on the Map page — see
  [Security notes](#security-notes).
- **PWA**: `vite-plugin-pwa` registers a service worker (`autoUpdate`) so the
  site is usable offline after a first visit — useful mid-trip with patchy
  data.
- **Domain types**: `src/types/core.ts` defines every shape used across the
  app (attractions, itinerary blocks/days/plans, pass rules, trip config, the
  pass-value calculation result). Everything in `src/data` and `src/lib`
  conforms to these types.
- **Pass logic**: `src/lib/passMath.ts` (expiry/feasibility math),
  `src/lib/warnings.ts` (the warning engine), and `src/lib/passCalculator.ts`
  (ties them together into `calculatePassValue()`) are pure, dependency-free
  functions — no I/O, fully unit-tested.
- **UI** (`src/components`, `src/pages`, `src/App.tsx`, `src/main.tsx`,
  `index.html`) is a separate layer built on top of this data/logic
  layer.

## Local development

```bash
npm install
npm run dev
```

Runs the Vite dev server (default port 5173).

## Testing & typechecking

```bash
npm run typecheck   # tsc --noEmit
npm test            # vitest run — tests/**/*.test.ts
```

The test suite covers pass expiry/exclusivity/DST math, feasibility
calculations, the 72h-vs-96h delta, the full warning engine, and a data
integrity suite that checks every source citation, price/opening-hours
consistency rule, and fallback-block reference in `src/data`.

## Build & deploy

```bash
npm run build                        # -> dist/
docker compose build
docker compose up -d
```

The container listens on `127.0.0.1:8496` (host-only) per
`docker-compose.yml`; nothing is exposed externally by Docker itself.

### Going live over Tailscale Funnel

The intended public URL is:

```
https://<your-machine>.<your-tailnet>.ts.net:10000
```

This requires a **manual** Tailscale Funnel command on the host once the
container is up, e.g. (adjust the local port to `8496` to match
`docker-compose.yml`):

```bash
tailscale funnel --bg 8496
```

Funnel configuration is intentionally not automated by this repo — it's a
host-level networking decision made by whoever operates the homelab gateway,
not something this app's Docker Compose file should assume or manage.

### Changing the domain

If you move off Tailscale Funnel (e.g. onto a real domain behind a reverse
proxy):

1. Point a reverse-proxy host (nginx/Caddy/Traefik) at
   `127.0.0.1:8496` (or bind the container directly to a different
   host/port in `docker-compose.yml`).
2. No app code needs to change — the app has no hardcoded domain; it is a
   fully static, relative-path SPA (`base: '/'` in `vite.config.ts`).
3. Update any bookmarks/QR codes pointing at the old Funnel URL.

## Updating itinerary / pricing data

All trip content lives in `src/data/*.ts`:

- `attractions.ts` — one `Attraction` record per venue (hours, prices,
  reservation requirements, warnings, sources).
- `passRules.ts` — the Copenhagen Card DISCOVER/HOP price matrix and rules.
- `hotel.ts`, `flights.ts`, `tripDefaults.ts` — hotel, flight, and default
  `TripConfig` records.
- `itinerary.core.ts` / `.fastPaced.ts` / `.rainyDay.ts` / `.lowEnergy.ts` /
  `.lateArrival.ts` — the five day-by-day plan variants.
- `fallbacks.ts` — shared fallback blocks referenced by `fallbackBlockIds`.
- `checklists.ts`, `verifyBeforeYouGo.ts` — packing/booking checklists and
  the re-verification register.
- `sources.ts` — every citation (`SourceRef`) used anywhere, defined once and
  imported elsewhere, so a fact is never cited two different ways.

To change anything: edit the relevant file, then:

```bash
npm run typecheck
npm test
npm run build
docker compose build && docker compose up -d
```

`npm test` includes a data-integrity suite (`tests/dataIntegrity.test.ts`)
that will fail loudly if you introduce a broken fallback reference, an
unverified price left in a total, a non-`https://` source URL, or if Tivoli
Gardens ever ends up referenced in a plan block (it is structurally excluded
— see below).

## Security notes

- No analytics or tracking added by this site, and no API key/account of ours
  is involved anywhere.
- **One third-party embed:** the Map page embeds a single Google Maps iframe
  (`src/components/GoogleMapEmbed.tsx`) using Google's public, keyless
  `google.com/maps?...&output=embed` URL — no API key, no billing account, no
  script tag. It's the one place this site loads third-party content in an
  iframe; Google may set cookies inside that iframe's own context (normal
  behaviour for any embedded map), but nothing from it is readable by, or
  shared with, this site itself, and no request is made to Google until you
  open the Map page. All per-attraction directions/pin links (Google Maps,
  Rejseplanen) are plain outbound links, not embeds, and load nothing until
  clicked.
- No backend, no database, no user accounts, no cookies of our own beyond
  what the browser itself uses for PWA/service-worker caching.
- No secrets in this repo — there is nothing to leak; all data is public
  trip-planning information.
- Every external link (official attraction sites, Google Maps, Rejseplanen)
  is rendered with `rel="noopener noreferrer"` by the UI layer when
  opened in a new tab.
- Response headers set by `nginx.conf`: `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: no-referrer`, `X-Frame-Options: SAMEORIGIN`.
- `localStorage` (see `src/lib/notesStorage.ts`) is used only for the
  visitor's own notes/trip-config overrides/verification checkmarks, prefixed
  `cpm:`, never transmitted anywhere. Every storage call is wrapped in
  try/catch and no-ops gracefully if storage is unavailable (private
  browsing, etc).

## Research verification status (as of 2026-09-22)

The research behind this app was checked on **2026-09-22**. Everything below
is `unverified`, `partially-verified`, or `conflicting` and should be
re-checked before/soon after departure. (This list is also encoded as data in
`src/data/verifyBeforeYouGo.ts`, so the UI can render it directly.)

| Fact | Status | Source |
|---|---|---|
| Rosenborg Castle timed-entry slots sell out — confirm your booking | critical | https://denkongeligesamling.dk/en/rosenborg-castle/plan-your-visit/ |
| Outbound OTP→CPH flight arrival time is unknown | critical | — |
| Full-journey validity rule (card must be valid for the *entire* journey, checked at journey end, not start) | critical (restated) | https://copenhagencard.com/view/faq?lang=EN |
| Canal Tours Copenhagen: only the Sept 10:00–17:30 operating window is published, not a departure timetable — last departure unknown | high | https://copenhagencard.com/attractions/canal-tours-copenhagen |
| Rosenborg Castle closing time conflicts across sources (16:00 vs 17:00 for late Sept) — plan assumes the conservative 16:00 | high | https://denkongeligesamling.dk/en/rosenborg-castle/plan-your-visit/ |
| Christiansborg Palace opening hours were not published on the page fetched during research | high | https://denkongeligesamling.dk/en/christiansborg-palace/plan-your-visit/ |
| CityHub after-checkout free-locker policy (Day 4) not confirmed verbatim — confirm with the hotel | high | https://cityhub.com/copenhagen/faq/ |
| Tivoli Gardens re-check: treated as closed all 4 days based on today's published seasonal calendar | info | https://www.tivoli.dk/en/opening-hours-and-seasons |
| One-visit-per-attraction rule (no re-entry on the same card) | info | https://copenhagencard.com/view/faq?lang=EN |
| Several attractions publish no standalone adult price / conflicting prices (Frederiksborg, SMK, Amalienborg, Canal Tours, Cisternerne, David Collection, Kronborg, Zoo) — excluded from savings totals | info | — |
| The Round Tower's Sept→Oct switchover from the 10:00–20:00 summer schedule is unpublished — plan assumes a conservative 10:00–18:00 floor | info | https://www.rundetaarn.dk/en/practical-information/ |
| All transit times (Metro/S-train/bus) are planning estimates, not live schedule data | info | — |
