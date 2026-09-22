import type { Hotel } from '@/data';
import { googleMapsMarker } from '@/lib';
import { Badge } from './Badge';
import { SourceLink } from './SourceLink';
import { BedIcon, LuggageIcon } from './icons';

export interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <div className="bezel">
      <div className="bezel__inner">
        <div className="travel-card__head">
          <div className="cluster">
            <BedIcon size={20} aria-hidden="true" />
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 600 }}>
                {hotel.name}
              </h3>
              <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
                {hotel.address}
              </p>
            </div>
          </div>
        </div>

        <dl className="travel-card__meta">
          <div className="travel-card__field">
            <dt>Check-in</dt>
            <dd>{hotel.checkIn}</dd>
          </div>
          <div className="travel-card__field">
            <dt>Check-out</dt>
            <dd>{hotel.checkOut}</dd>
          </div>
        </dl>

        <div className="stack">
          <div className="cluster">
            <LuggageIcon size={16} aria-hidden="true" />
            <span style={{ fontSize: 'var(--text-sm)' }}>Luggage before check-in</span>
            <Badge variant={hotel.luggageBeforeCheckIn.freeBeforeCheckIn ? 'ok' : 'neutral'}>
              {hotel.luggageBeforeCheckIn.freeBeforeCheckIn ? 'Free, verified' : 'Not confirmed'}
            </Badge>
          </div>
          <p className="field__hint">{hotel.luggageBeforeCheckIn.note}</p>

          <div className="cluster">
            <LuggageIcon size={16} aria-hidden="true" />
            <span style={{ fontSize: 'var(--text-sm)' }}>Luggage after checkout</span>
            <Badge variant={hotel.luggageAfterCheckOut.freeAfterCheckOutClaim ? 'warning' : 'neutral'}>
              {hotel.luggageAfterCheckOut.freeAfterCheckOutClaim ? 'Reported, unconfirmed' : 'Not confirmed'}
            </Badge>
          </div>
          <p className="field__hint">{hotel.luggageAfterCheckOut.note}</p>
        </div>

        <div className="cluster">
          <SourceLink source={hotel.luggageAfterCheckOut.source} label="Hotel FAQ" />
          <a className="source-link" href={googleMapsMarker(hotel.geo, hotel.name)} target="_blank" rel="noopener noreferrer">
            View on Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
