// Pure link builders. No paid/keyed mapping API: Google Maps deep-links
// (search + directions) need no API key and no billing account — they are
// plain URLs that open the Google Maps app or site — plus Rejseplanen (the
// official Danish national journey planner) for transit.

import type { GeoPoint } from '@/types';

/** Google Maps marker/search link for a single point (no API key needed). */
export function googleMapsMarker(geo: GeoPoint, label?: string): string {
  const query = label ? `${label} @${geo.lat},${geo.lon}` : `${geo.lat},${geo.lon}`;
  const params = new URLSearchParams({ api: '1', query });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}

/** Google Maps directions link between two points (walking by default, no API key needed). */
export function googleMapsDirections(
  from: GeoPoint,
  to: GeoPoint,
  mode: 'walking' | 'bicycling' | 'driving' | 'transit' = 'walking',
): string {
  const params = new URLSearchParams({
    api: '1',
    origin: `${from.lat},${from.lon}`,
    destination: `${to.lat},${to.lon}`,
    travelmode: mode,
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/** A reasonable Rejseplanen (rejseplanen.dk) search-style link between two named stops/places. */
export function rejseplanenUrl(from: string, to: string): string {
  const params = new URLSearchParams({ originName: from, destName: to });
  return `https://www.rejseplanen.dk/webapp/index.html?${params.toString()}`;
}
