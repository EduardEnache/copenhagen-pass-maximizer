import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { GeoPoint, ItineraryDay } from '@/types';
import { useTripConfig } from '@/AppContext';
import { ATTRACTIONS_BY_ID, CITYHUB_COPENHAGEN } from '@/data';
import { DayTabs } from '@/components/DayTabs';
import { VariantSwitcher } from '@/components/VariantSwitcher';
import { TimelineBlock } from '@/components/TimelineBlock';
import { IcsExportButton } from '@/components/IcsExportButton';
import { PrintButton } from '@/components/PrintButton';
import { Callout } from '@/components/Callout';
import { EmptyState } from '@/components/EmptyState';

const CPH_AIRPORT_GEO: GeoPoint = { lat: 55.618, lon: 12.6476 };

function geoForBlock(block: ItineraryDay['blocks'][number]): GeoPoint | undefined {
  if (block.attractionId) return ATTRACTIONS_BY_ID[block.attractionId]?.geo;
  if (block.kind === 'flight') return CPH_AIRPORT_GEO;
  if (block.kind === 'checkin' || block.kind === 'checkout' || block.kind === 'luggage') return CITYHUB_COPENHAGEN.geo;
  return undefined;
}

export function ItineraryPage() {
  const { plan } = useTripConfig();
  const [searchParams, setSearchParams] = useSearchParams();

  const dayFromUrl = Number(searchParams.get('day'));
  const activeDayNumber = ([1, 2, 3, 4] as const).includes(dayFromUrl as 1 | 2 | 3 | 4)
    ? (dayFromUrl as ItineraryDay['dayNumber'])
    : 1;

  const setActiveDayNumber = useCallback(
    (dayNumber: ItineraryDay['dayNumber']) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('day', String(dayNumber));
        return next;
      });
    },
    [setSearchParams],
  );

  const activeDay = useMemo(
    () => plan.days.find((d) => d.dayNumber === activeDayNumber) ?? plan.days[0],
    [plan, activeDayNumber],
  );

  let runningGeo: GeoPoint | undefined;

  return (
    <div className="stack" style={{ gap: 'var(--space-7)' }}>
      <header className="page-header">
        <span className="page-eyebrow">Itinerary</span>
        <h1>Four days, planned by neighbourhood</h1>
        <p>Switch plans for weather or energy, then walk through each day&rsquo;s timeline block by block.</p>
      </header>

      <VariantSwitcher />

      <DayTabs days={plan.days} activeDayNumber={activeDay.dayNumber} onSelect={setActiveDayNumber} />

      <div
        role="tabpanel"
        id={`day-panel-${activeDay.dayNumber}`}
        aria-labelledby={`day-tab-${activeDay.dayNumber}`}
        className="stack"
        style={{ gap: 'var(--space-6)' }}
      >
        <div className="stack" style={{ gap: 'var(--space-2)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)' }}>
            Day {activeDay.dayNumber} &middot; {activeDay.weekday} &middot; {activeDay.date}
          </h2>
          <p className="text-muted">{activeDay.theme}</p>
          <p className="field__hint">{activeDay.geographicReasoning}</p>
        </div>

        {activeDay.dayWarnings.length > 0 && (
          <div className="stack" style={{ gap: 'var(--space-3)' }}>
            {activeDay.dayWarnings.map((w, i) => (
              <Callout tone="warning" key={i}>
                {w}
              </Callout>
            ))}
          </div>
        )}

        {activeDay.blocks.length === 0 ? (
          <EmptyState title="No blocks planned for this day" />
        ) : (
          <ol className="day-timeline">
            {activeDay.blocks.map((block) => {
              const originGeo = runningGeo;
              const thisGeo = geoForBlock(block);
              if (thisGeo) runningGeo = thisGeo;
              return (
                <li key={block.id}>
                  <TimelineBlock block={block} date={activeDay.date} originGeo={originGeo} />
                </li>
              );
            })}
          </ol>
        )}

        <div className="cluster">
          <IcsExportButton plan={plan} />
          <PrintButton label="Print itinerary" />
        </div>
      </div>
    </div>
  );
}
