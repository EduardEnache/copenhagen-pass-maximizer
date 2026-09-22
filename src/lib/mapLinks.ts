// Pure link builders. No paid mapping API, ever — OpenStreetMap and
// Rejseplanen (the official Danish national journey planner) only.

import type { GeoPoint } from '@/types';

/** OSM marker link for a single point, at a sensible street-level zoom. */
export function osmMarker(geo: GeoPoint, zoom = 17): string {
  return `https://www.openstreetmap.org/?mlat=${geo.lat}&mlon=${geo.lon}#map=${zoom}/${geo.lat}/${geo.lon}`;
}

/** OSM directions link between two points (walking by default). */
export function osmDirections(
  from: GeoPoint,
  to: GeoPoint,
  mode: 'foot' | 'bicycle' | 'car' = 'foot',
): string {
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_${mode}&route=${from.lat}%2C${from.lon}%3B${to.lat}%2C${to.lon}`;
}

/** A reasonable Rejseplanen (rejseplanen.dk) search-style link between two named stops/places. */
export function rejseplanenUrl(from: string, to: string): string {
  const params = new URLSearchParams({ originName: from, destName: to });
  return `https://www.rejseplanen.dk/webapp/index.html?${params.toString()}`;
}
