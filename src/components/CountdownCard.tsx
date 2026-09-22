import { formatCountdown, timeInCph, dateInCph } from '@/lib';
import { useNow } from './useNow';
import { PlaneIcon, TicketIcon } from './icons';

export interface CountdownCardProps {
  departsLocal: string;
  activationInstantMs: number;
  expiryInstantMs: number;
}

/** Two countdowns side by side: time to departure, and time to card
 * activation/expiry, whichever is most relevant to where the visitor is in
 * the trip right now. */
export function CountdownCard({ departsLocal, activationInstantMs, expiryInstantMs }: CountdownCardProps) {
  const now = useNow(15_000);
  const departsMs = new Date(departsLocal).getTime();

  return (
    <div className="bezel">
      <div className="bezel__inner">
        <div className="grid-2">
          <div className="countdown">
            <span className="countdown__label">
              <PlaneIcon size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} aria-hidden="true" />
              Departure (Bucharest)
            </span>
            <span className="countdown__value">
              {now < departsMs ? formatCountdown(departsMs - now) : 'Departed'}
            </span>
            <span className="countdown__sub">
              {dateInCph(departsLocal)} at {timeInCph(departsLocal)} local
            </span>
          </div>
          <div className="countdown">
            <span className="countdown__label">
              <TicketIcon size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} aria-hidden="true" />
              {now < activationInstantMs ? 'Card activates' : 'Card expires'}
            </span>
            <span className="countdown__value">
              {now < activationInstantMs
                ? formatCountdown(activationInstantMs - now)
                : now < expiryInstantMs
                  ? formatCountdown(expiryInstantMs - now)
                  : 'Expired'}
            </span>
            <span className="countdown__sub">
              {dateInCph(new Date(expiryInstantMs).toISOString())} at {timeInCph(new Date(expiryInstantMs).toISOString())}{' '}
              (exclusive)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
