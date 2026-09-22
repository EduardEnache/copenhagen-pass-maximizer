import type { BlockKind, GeoPoint, ISODate, ItineraryBlock } from '@/types';
import { ATTRACTIONS_BY_ID, FALLBACK_BLOCKS_BY_ID } from '@/data';
import { dayOfWeekInCph, formatDkk, formatDurationMinutes, osmDirections, osmMarker } from '@/lib';
import { Badge } from './Badge';
import { Callout } from './Callout';
import { SourceLink } from './SourceLink';
import { TransitLeg } from './TransitLeg';
import { FallbackDisclosure } from './FallbackDisclosure';
import { VerificationBadge } from './VerificationBadge';
import {
  BedIcon,
  BuildingIcon,
  ClockIcon,
  CompassIcon,
  ExternalLinkIcon,
  MealIcon,
  PlaneIcon,
  TicketIcon,
  TrainIcon,
  WalkIcon,
} from './icons';

const KIND_META: Record<BlockKind, { label: string; Icon: typeof PlaneIcon; shape: 'circle' | 'square' | 'diamond' | 'ring' }> = {
  flight: { label: 'Flight', Icon: PlaneIcon, shape: 'circle' },
  transit: { label: 'Transit', Icon: TrainIcon, shape: 'ring' },
  attraction: { label: 'Attraction', Icon: CompassIcon, shape: 'circle' },
  meal: { label: 'Meal', Icon: MealIcon, shape: 'square' },
  rest: { label: 'Rest', Icon: BedIcon, shape: 'ring' },
  luggage: { label: 'Luggage', Icon: BedIcon, shape: 'square' },
  checkin: { label: 'Check-in', Icon: BuildingIcon, shape: 'diamond' },
  checkout: { label: 'Check-out', Icon: BuildingIcon, shape: 'diamond' },
  'card-activation': { label: 'Card activation', Icon: TicketIcon, shape: 'diamond' },
  walk: { label: 'Walk', Icon: WalkIcon, shape: 'ring' },
  buffer: { label: 'Buffer', Icon: ClockIcon, shape: 'ring' },
};

function minutesBetween(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let diff = eh * 60 + em - (sh * 60 + sm);
  if (diff < 0) diff += 24 * 60; // crosses midnight
  return diff;
}

export interface TimelineBlockProps {
  block: ItineraryBlock;
  date: ISODate;
  /** The previous block's location, if known, used to build an OSM
   * directions link instead of a bare marker link. */
  originGeo?: GeoPoint;
}

/** The core visual unit of the itinerary: a transit-ticket-styled card
 * showing time, duration, pass coverage, opening hours, value, booking
 * warnings, directions and citations for one block of the day. */
export function TimelineBlock({ block, date, originGeo }: TimelineBlockProps) {
  const meta = KIND_META[block.kind];
  const attraction = block.attractionId ? ATTRACTIONS_BY_ID[block.attractionId] : undefined;
  const duration = minutesBetween(block.startTime, block.endTime);

  const openingWindow = attraction
    ? attraction.openingWindows.find((w) => {
        const dow = dayOfWeekInCph(`${date}T12:00:00+02:00`);
        if (!w.days.includes(dow)) return false;
        if (w.appliesFrom && date < w.appliesFrom) return false;
        if (w.appliesTo && date > w.appliesTo) return false;
        return true;
      })
    : undefined;

  const outsideHours = Boolean(
    openingWindow && (block.startTime < openingWindow.opens || block.endTime > openingWindow.closes),
  );

  const fallbackBlocks = block.fallbackBlockIds
    .map((id) => FALLBACK_BLOCKS_BY_ID[id])
    .filter((b): b is ItineraryBlock => Boolean(b));

  const directionsUrl = attraction
    ? originGeo
      ? osmDirections(originGeo, attraction.geo)
      : osmMarker(attraction.geo)
    : undefined;

  return (
    <article className={`timeline-block${block.isOptional ? ' timeline-block--optional' : ''}`}>
      <span className={`station station--${meta.shape}`} aria-hidden="true" />
      <div className="timeline-block__time">
        <span className="timeline-block__start">{block.startTime}</span>
        <span className="timeline-block__end">{block.endTime}</span>
        <span className="timeline-block__duration">{formatDurationMinutes(duration)}</span>
      </div>

      <div className="timeline-block__content">
        <div className="timeline-block__head">
          <h3 className="timeline-block__title">{block.title}</h3>
          <div className="timeline-block__badges">
            <Badge variant="neutral" withIcon={false}>
              <meta.Icon size={13} />
              {meta.label}
            </Badge>
            {block.timeIsEstimate && <Badge variant="warning">Time is an estimate</Badge>}
            {block.isOptional && <Badge variant="neutral">Optional</Badge>}
            {block.passCovered !== 'n/a' && (
              <Badge variant={block.passCovered ? 'ok' : 'critical'}>
                {block.passCovered ? 'Card covers this' : 'Card does not cover this'}
              </Badge>
            )}
          </div>
        </div>

        {block.description && <p className="timeline-block__description">{block.description}</p>}

        {block.transit && <TransitLeg transit={block.transit} />}

        {openingWindow && (
          <p className="field__hint">
            Opening hours: {openingWindow.opens}-{openingWindow.closes}
            {outsideHours && (
              <>
                {' '}
                <Badge variant="warning">Visit falls partly outside these hours</Badge>
              </>
            )}
            {openingWindow.note && <>. {openingWindow.note}</>}
          </p>
        )}

        {block.bookingWarning && <Callout tone="warning">{block.bookingWarning}</Callout>}

        {(block.estimatedStandaloneValueDkk != null || attraction?.reservationRequired) && (
          <dl className="timeline-block__facts">
            {block.estimatedStandaloneValueDkk != null && (
              <div className="timeline-block__fact">
                <dt>Estimated standalone value</dt>
                <dd>{formatDkk(block.estimatedStandaloneValueDkk)}</dd>
              </div>
            )}
            {block.valueStatus && (
              <div className="timeline-block__fact">
                <dt>Value status</dt>
                <dd>
                  <VerificationBadge status={block.valueStatus} />
                </dd>
              </div>
            )}
            {attraction?.reservationRequired && (
              <div className="timeline-block__fact">
                <dt>Reservation</dt>
                <dd>
                  <Badge variant="warning">Required{attraction.reservationNote ? `: ${attraction.reservationNote}` : ''}</Badge>
                </dd>
              </div>
            )}
          </dl>
        )}

        {(directionsUrl || block.sources.length > 0) && (
          <div className="timeline-block__links">
            {directionsUrl && (
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="source-link">
                {originGeo ? 'Directions (OpenStreetMap)' : 'View location (OpenStreetMap)'}
                <ExternalLinkIcon />
              </a>
            )}
            {block.sources.map((source, i) => (
              <SourceLink key={`${source.url}-${i}`} source={source} />
            ))}
          </div>
        )}

        <FallbackDisclosure blocks={fallbackBlocks} />
      </div>
    </article>
  );
}
