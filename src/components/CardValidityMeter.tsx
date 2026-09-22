import { timeInCph, dateInCph } from '@/lib';
import { AlertTriangleIcon, CheckCircleIcon, ClockIcon, PlaneIcon } from './icons';

export interface CardValidityMeterProps {
  activationInstantMs: number;
  expiryInstantMs: number;
  now: number;
  /** The return-airport-transfer instant, shown as a marker on the strip. */
  airportJourneyMs?: number;
  airportJourneyLabel?: string;
}

function pct(value: number, start: number, end: number): number {
  if (end <= start) return 0;
  return Math.min(100, Math.max(0, ((value - start) / (end - start)) * 100));
}

/** A linear activation-to-expiry validity strip, styled like a punched
 * ticket. State is always stated in text, never colour alone. */
export function CardValidityMeter({
  activationInstantMs,
  expiryInstantMs,
  now,
  airportJourneyMs,
  airportJourneyLabel = 'Return airport transfer',
}: CardValidityMeterProps) {
  const nowPct = pct(now, activationInstantMs, expiryInstantMs);
  const hoursToExpiry = (expiryInstantMs - now) / 3_600_000;

  let stateLabel: string;
  let StateIcon = ClockIcon;
  if (now < activationInstantMs) {
    stateLabel = 'Not yet active';
    StateIcon = ClockIcon;
  } else if (now >= expiryInstantMs) {
    stateLabel = 'Expired';
    StateIcon = AlertTriangleIcon;
  } else if (hoursToExpiry <= 3) {
    stateLabel = `Expires soon (${hoursToExpiry.toFixed(1)}h left)`;
    StateIcon = AlertTriangleIcon;
  } else {
    stateLabel = 'Active';
    StateIcon = CheckCircleIcon;
  }

  const markerPct = airportJourneyMs != null ? pct(airportJourneyMs, activationInstantMs, expiryInstantMs) : null;
  const markerOutOfRange =
    airportJourneyMs != null && (airportJourneyMs < activationInstantMs || airportJourneyMs > expiryInstantMs);

  return (
    <div className="validity-meter">
      <div className="validity-meter__state">
        <StateIcon size={16} />
        <span>{stateLabel}</span>
      </div>
      <div className="validity-meter__track">
        <div className="validity-meter__fill" style={{ width: `${nowPct}%` }} />
        {now >= activationInstantMs && now < expiryInstantMs && (
          <div className="validity-meter__now" style={{ left: `${nowPct}%` }} />
        )}
        {markerPct != null && !markerOutOfRange && (
          <div className="validity-meter__marker" style={{ left: `${markerPct}%` }} aria-hidden="true" />
        )}
      </div>
      <div className="validity-meter__scale">
        <span>{timeInCph(new Date(activationInstantMs).toISOString())} activation</span>
        <span>
          {dateInCph(new Date(expiryInstantMs).toISOString())} {timeInCph(new Date(expiryInstantMs).toISOString())} expiry
        </span>
      </div>
      {airportJourneyMs != null && (
        <p className="field__hint">
          <PlaneIcon size={13} style={{ display: 'inline', verticalAlign: '-2px' }} aria-hidden="true" />{' '}
          {airportJourneyLabel}:{' '}
          {markerOutOfRange ? (
            <strong>outside the validity window — not covered</strong>
          ) : (
            <>
              {dateInCph(new Date(airportJourneyMs).toISOString())} {timeInCph(new Date(airportJourneyMs).toISOString())}{' '}
              (covered)
            </>
          )}
        </p>
      )}
    </div>
  );
}
