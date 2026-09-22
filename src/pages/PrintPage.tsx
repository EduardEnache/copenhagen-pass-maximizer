import type { GeoPoint } from '@/types';
import { ATTRACTIONS_BY_ID, CITYHUB_COPENHAGEN, CORE_PLAN, RESEARCH_TIMESTAMP } from '@/data';
import { TimelineBlock } from '@/components/TimelineBlock';
import { PrintButton } from '@/components/PrintButton';

const CPH_AIRPORT_GEO: GeoPoint = { lat: 55.618, lon: 12.6476 };

function geoForBlock(block: { attractionId?: string; kind: string }): GeoPoint | undefined {
  if (block.attractionId) return ATTRACTIONS_BY_ID[block.attractionId]?.geo;
  if (block.kind === 'flight') return CPH_AIRPORT_GEO;
  if (block.kind === 'checkin' || block.kind === 'checkout' || block.kind === 'luggage') return CITYHUB_COPENHAGEN.geo;
  return undefined;
}

/** A chrome-free, linear print view of all four days of the Core plan,
 * expanded end to end, meant to be read on paper. */
export function PrintPage() {
  return (
    <div className="print-page stack" style={{ padding: 'var(--space-7)', maxWidth: '52rem', margin: '0 auto', gap: 'var(--space-8)' }}>
      <div className="no-print cluster">
        <PrintButton label="Print this itinerary" />
        <p className="print-page__hint">Core plan, all four days. Research checked {RESEARCH_TIMESTAMP}.</p>
      </div>

      <header>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)' }}>
          Copenhagen Pass Maximizer &middot; Core plan
        </h1>
        <p className="text-muted">25-28 September 2026. Research checked {RESEARCH_TIMESTAMP}. All times are Europe/Copenhagen and, where noted, planning estimates.</p>
      </header>

      {CORE_PLAN.days.map((day) => {
        let runningGeo: GeoPoint | undefined;
        return (
          <section className="print-day stack" key={day.dayNumber} style={{ gap: 'var(--space-4)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)' }}>
              Day {day.dayNumber} &middot; {day.weekday} &middot; {day.date} &middot; {day.title}
            </h2>
            <p className="text-muted">{day.theme}</p>
            {day.dayWarnings.map((w, i) => (
              <p key={i} className="field__hint">
                {w}
              </p>
            ))}
            <div className="stack print-block-list">
              {day.blocks.map((block) => {
                const originGeo = runningGeo;
                const thisGeo = geoForBlock(block);
                if (thisGeo) runningGeo = thisGeo;
                return (
                  <div className="print-block" key={block.id}>
                    <TimelineBlock block={block} date={day.date} originGeo={originGeo} />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
