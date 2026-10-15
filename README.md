<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,55:1f2a44,100:3b82f6&height=200&section=header&text=Copenhagen%20Pass%20Maximizer&fontSize=44&fontColor=ffffff&fontAlignY=36&desc=A%20trip%20planner%20that%20squeezes%20every%20krone%20out%20of%20a%2096h%20city%20pass&descSize=16&descAlignY=58&animation=fadeIn" width="100%" alt="Copenhagen Pass Maximizer"/>

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-offline%20ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)
![Vitest](https://img.shields.io/badge/tested%20with-Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![Status](https://img.shields.io/badge/status-trip%20complete-0d1117?style=flat-square)

<sub><a href="#-the-problem">The problem</a> &nbsp;·&nbsp; <a href="#-features">Features</a> &nbsp;·&nbsp; <a href="#-how-it-works">How it works</a> &nbsp;·&nbsp; <a href="#-run-it">Run it</a> &nbsp;·&nbsp; <a href="docs/DEVELOPMENT.md">Dev guide</a></sub>

</div>

<br/>

> Four adults, four days in Copenhagen (25–28 Sept 2026), one 96-hour Copenhagen Card each.
> The card only pays off if the plan respects opening hours, one-visit-per-attraction rules,
> transit times and the exact minute the card expires. This app turns that into typed data and pure functions,
> then shows the plan, the savings and every risk on one screen, offline.

<br/>

<img src=".github/assets/overview.webp" alt="Trip overview with countdown, card validity meter and warnings" width="100%"/>

<table>
  <tr>
    <td width="68%"><img src=".github/assets/itinerary-dark.webp" alt="Itinerary in dark mode with plan variants and day tabs"/><br/><img src=".github/assets/calculator.webp" alt="Pass value calculator"/></td>
    <td width="32%" valign="top"><img src=".github/assets/mobile.webp" alt="Mobile itinerary view with bottom navigation"/></td>
  </tr>
</table>

## ◆ &nbsp;The problem

City passes are sold on "save up to X%". Whether they actually save money depends on details nobody checks:
does the museum close at 16:00 or 17:00 in late September, does the airport train count if the journey *ends* after expiry,
is Tivoli even open. Every one of those facts is captured here with a source link and a verification status,
and the plan is rebuilt around them.

## ◆ &nbsp;Features

<table>
  <tr>
    <td width="33%" valign="top">
      <h4>🗓️ Five itineraries</h4>
      <p>Core, fast-paced, rainy-day, low-energy and late-arrival plans, switchable per day, each a timeline of blocks with fallbacks.</p>
    </td>
    <td width="33%" valign="top">
      <h4>🧮 Live value calculator</h4>
      <p>Change party size, card type, duration or activation time and watch feasibility and savings recompute instantly.</p>
    </td>
    <td width="33%" valign="top">
      <h4>⚠️ Warning engine</h4>
      <p>Flags visits outside opening hours, expiry edge cases, DST shifts and unverified facts, ranked by severity.</p>
    </td>
  </tr>
  <tr>
    <td width="33%" valign="top">
      <h4>📶 Offline-first PWA</h4>
      <p>Installable, service-worker cached, usable mid-trip on patchy roaming data.</p>
    </td>
    <td width="33%" valign="top">
      <h4>🗺️ Map, checklist, notes</h4>
      <p>Keyless map embed, packing and booking checklists, private notes in local storage, calendar (.ics) export and a print view.</p>
    </td>
    <td width="33%" valign="top">
      <h4>🔒 No backend</h4>
      <p>No accounts, analytics or API keys. A static build behind nginx with strict security headers.</p>
    </td>
  </tr>
</table>

## ◆ &nbsp;How it works

```mermaid
flowchart LR
    D["src/data/*.ts<br/>attractions · prices · hours<br/>pass rules · itineraries · sources"] --> T{{"src/types/core.ts<br/>domain types"}}
    T --> L["src/lib<br/>passMath · warnings<br/>passCalculator (pure)"]
    L --> U["React UI<br/>overview · itinerary · calculator<br/>map · checklist · notes"]
    D --> V["tests/dataIntegrity<br/>every price and hour cited"]
    L --> W["tests/*<br/>expiry · DST · feasibility"]
```

- **Data as code.** Every attraction, price, opening hour and rule is a typed constant with a source citation, so the compiler and the tests guard the research.
- **Pure core.** Pass expiry, feasibility and the warning engine are dependency-free functions with no I/O, covered by Vitest (expiry, exclusivity, DST, 72h vs 96h, data integrity).
- **Thin UI.** React components read the computed results; nothing in the UI re-derives business rules.

## ◆ &nbsp;Run it

```sh
npm install
npm run dev          # Vite dev server on :5173
npm test             # Vitest suite
npm run typecheck    # tsc --noEmit
docker compose up -d --build   # production build behind nginx on 127.0.0.1:8496
```

Updating the data, security notes, deployment and the dated research-verification record are in the
**[development guide](docs/DEVELOPMENT.md)**.

## ◆ &nbsp;Tech

![React](https://img.shields.io/badge/React-20232a?style=flat-square&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React%20Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![nginx](https://img.shields.io/badge/nginx-009639?style=flat-square&logo=nginx&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

<br/>

<div align="center">
<sub>Built by <a href="https://github.com/LikeMyCoffe"><b>Eduard-Florentin Enache</b></a> &nbsp;·&nbsp; Data · BI · AI product builder</sub>
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:3b82f6,45:1f2a44,100:0d1117&height=90&section=footer" width="100%" alt=""/>
</div>
