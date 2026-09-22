import type { ItineraryPlan } from '@/types';
import { ATTRACTIONS_BY_ID, CITYHUB_COPENHAGEN } from '@/data';
import { osmMarker } from '@/lib';
import { BedIcon, CompassIcon, PlaneIcon } from './icons';
import { EmptyState } from './EmptyState';

const CPH_AIRPORT_GEO = { lat: 55.618, lon: 12.6476 };
const CPH_AIRPORT_URL = osmMarker(CPH_AIRPORT_GEO, 14);

export interface MapViewProps {
  plan: ItineraryPlan;
}

/** A grouped, linkable list of every attraction, the hotel, and the
 * airport, colour- AND shape/icon-coded by point type. No embedded
 * interactive map library or API key: every point links out to its own
 * OpenStreetMap page. */
export function MapView({ plan }: MapViewProps) {
  return (
    <div className="stack" style={{ gap: 'var(--space-8)' }}>
      <div className="map-legend" aria-hidden="true">
        <span className="map-legend__item">
          <span className="map-point__marker" style={{ background: 'var(--color-canal)', borderRadius: '50%' }}>
            <CompassIcon size={14} />
          </span>
          Attraction
        </span>
        <span className="map-legend__item">
          <span className="map-point__marker" style={{ background: 'var(--color-terracotta)', borderRadius: '6px' }}>
            <BedIcon size={14} />
          </span>
          Hotel
        </span>
        <span className="map-legend__item">
          <span
            className="map-point__marker"
            style={{ background: 'var(--color-sage)', borderRadius: '3px', transform: 'rotate(45deg)' }}
          >
            <PlaneIcon size={13} style={{ transform: 'rotate(-45deg)' }} />
          </span>
          Airport
        </span>
      </div>

      {plan.days.map((day) => {
        const attractionIds = Array.from(
          new Set(day.blocks.filter((b) => b.attractionId).map((b) => b.attractionId as string)),
        );
        const hasFlight = day.blocks.some((b) => b.kind === 'flight');
        const hasHotelTouch = day.blocks.some((b) => b.kind === 'checkin' || b.kind === 'checkout' || b.kind === 'luggage');

        return (
          <div className="map-day-group" key={day.dayNumber}>
            <h2 className="section-heading">
              Day {day.dayNumber} <span className="count">{day.date} &middot; {day.title}</span>
            </h2>
            {attractionIds.length === 0 && !hasFlight && !hasHotelTouch ? (
              <EmptyState title="No mapped points this day" />
            ) : (
              <div className="map-points">
                {hasFlight && (
                  <a className="map-point" href={CPH_AIRPORT_URL} target="_blank" rel="noopener noreferrer">
                    <span
                      className="map-point__marker"
                      style={{ background: 'var(--color-sage)', borderRadius: '3px', transform: 'rotate(45deg)' }}
                    >
                      <PlaneIcon size={13} style={{ transform: 'rotate(-45deg)' }} />
                    </span>
                    <span className="map-point__body">
                      <span className="map-point__name">Copenhagen Airport (CPH)</span>
                      <span className="map-point__cluster">airport</span>
                    </span>
                  </a>
                )}
                {hasHotelTouch && (
                  <a
                    className="map-point"
                    href={osmMarker(CITYHUB_COPENHAGEN.geo)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="map-point__marker" style={{ background: 'var(--color-terracotta)', borderRadius: '6px' }}>
                      <BedIcon size={14} />
                    </span>
                    <span className="map-point__body">
                      <span className="map-point__name">{CITYHUB_COPENHAGEN.name}</span>
                      <span className="map-point__cluster">hotel</span>
                    </span>
                  </a>
                )}
                {attractionIds.map((id) => {
                  const attraction = ATTRACTIONS_BY_ID[id];
                  if (!attraction) return null;
                  return (
                    <a
                      className="map-point"
                      key={id}
                      href={attraction.osmUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="map-point__marker" style={{ background: 'var(--color-canal)', borderRadius: '50%' }}>
                        <CompassIcon size={14} />
                      </span>
                      <span className="map-point__body">
                        <span className="map-point__name">{attraction.shortName ?? attraction.name}</span>
                        <span className="map-point__cluster">{attraction.cluster.replace(/-/g, ' ')}</span>
                      </span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
