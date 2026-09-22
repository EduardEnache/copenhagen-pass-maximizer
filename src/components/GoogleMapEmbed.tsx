import type { GeoPoint } from '@/types';

export interface GoogleMapEmbedProps {
  geo: GeoPoint;
  zoom?: number;
  title: string;
  caption?: string;
}

/** A keyless Google Maps iframe embed (no API key, no billing account,
 * the same public `output=embed` URL format Google's own "share > embed"
 * panel offers for a single location/area view). It cannot plot multiple
 * custom pins without a paid Maps JavaScript API key, so this shows the
 * general area only — every individual attraction/hotel/airport point
 * still links out to its own exact pin via `googleMapsMarker()` elsewhere
 * on the page. Loading a Google-hosted iframe means Google may set cookies
 * within that iframe's own context; nothing from it is readable by, or
 * shared with, this site. See the Notes page for the full privacy note. */
export function GoogleMapEmbed({ geo, zoom = 13, title, caption }: GoogleMapEmbedProps) {
  const src = `https://www.google.com/maps?q=${geo.lat},${geo.lon}&z=${zoom}&output=embed`;

  return (
    <figure className="map-embed">
      <div className="map-embed__frame">
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      {caption && <figcaption className="map-embed__caption">{caption}</figcaption>}
    </figure>
  );
}
