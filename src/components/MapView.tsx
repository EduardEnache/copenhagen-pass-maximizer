import type { ItineraryPlan } from '@/types';
import { ATTRACTIONS_BY_ID, CITYHUB_COPENHAGEN } from '@/data';
import { googleMapsMarker } from '@/lib';
import { BedIcon, CompassIcon, PlaneIcon } from './icons';
import { EmptyState } from './EmptyState';
import { GoogleMapEmbed } from './GoogleMapEmbed';

const CPH_AIRPORT_GEO = { lat: 55.618, lon: 12.6476 };
const CPH_AIRPORT_URL = googleMapsMarker(CPH_AIRPORT_GEO, 'Copenhagen Airport (CPH)');

export interface MapViewProps {
  plan: ItineraryPlan;
}

/** An embedded Google Maps overview (keyless iframe, no billing/API key)
 * plus a grouped, linkable list of every attraction, the hotel, and the
 * airport, colour- AND shape/icon-coded by point type. Every point links
 * out to its exact pin on Google Maps. */
export function MapView({ plan }: MapViewProps) {
  return (
    <div className="stack" style={{ gap: 'var(--space-8)' }}>
      <GoogleMapEmbed
        geo={CITYHUB_COPENHAGEN.geo}
        zoom={13}
        title="Copenhagen trip area overview"
        caption="Overview map centred on the hotel. This embed shows the general area only — tap any pin below to open that exact attraction, the hotel, or the airport in Google Maps."
      />

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
                    href={googleMapsMarker(CITYHUB_COPENHAGEN.geo, CITYHUB_COPENHAGEN.name)}
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
                      href={attraction.mapUrl}
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
