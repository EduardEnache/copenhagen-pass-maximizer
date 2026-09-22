import { useId } from 'react';
import { useTripConfig } from '@/AppContext';
import { dateInCph, dayOfWeekInCph, timeInCph, combineDateAndTimeCph } from '@/lib';
import { Callout } from './Callout';
import { PlaneIcon } from './icons';

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toLocalInputValue(iso: string): string {
  return iso.slice(0, 16);
}

function fromLocalInputValue(value: string): string {
  const [date, time] = value.split('T');
  return combineDateAndTimeCph(date, time);
}

export interface FlightCardProps {
  direction: 'outbound' | 'return';
}

/** Displays a flight leg with route, times, and (for the outbound leg,
 * whose arrival was never confirmed) an editable arrival time plus a
 * prominent "to confirm" notice. */
export function FlightCard({ direction }: FlightCardProps) {
  const { config, updateConfig } = useTripConfig();
  const arriveId = useId();
  const estimateId = useId();
  const numberId = useId();
  const departId = useId();

  const isOutbound = direction === 'outbound';
  const flight = isOutbound ? config.outboundFlight : config.returnFlight;
  const from = isOutbound ? 'OTP Bucharest' : 'CPH Copenhagen';
  const to = isOutbound ? 'CPH Copenhagen' : 'OTP Bucharest';

  const departsLocal = flight.departsLocal;
  const arrivesLocal = isOutbound ? config.outboundFlight.arrivesLocal : null;
  const arrivalIsEstimate = isOutbound ? config.outboundFlight.arrivalIsEstimate : false;

  return (
    <div className="bezel">
      <div className="bezel__inner">
        <div className="travel-card__head">
          <div className="travel-card__route">
            <span className="travel-card__code">{from.split(' ')[0]}</span>
            <PlaneIcon size={18} className="travel-card__arrow" aria-hidden="true" />
            <span className="travel-card__code">{to.split(' ')[0]}</span>
          </div>
          <span className="badge badge--neutral">{isOutbound ? 'Outbound &middot; Day 1' : 'Return &middot; Day 4'}</span>
        </div>

        {isOutbound && arrivalIsEstimate && (
          <Callout tone="warning" title="Arrival time to confirm">
            The outbound arrival time is a planning estimate, not a confirmed flight time. Update it below as soon as
            it is known, and re-check the itinerary and Copenhagen Card activation time afterwards.
          </Callout>
        )}

        <dl className="travel-card__meta">
          <div className="travel-card__field">
            <dt>Departs</dt>
            <dd>
              {dateInCph(departsLocal)} ({WEEKDAY[dayOfWeekInCph(departsLocal)]}) {timeInCph(departsLocal)}
            </dd>
          </div>
          <div className="travel-card__field">
            <dt>From &rarr; to</dt>
            <dd style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}>
              {from} &rarr; {to}
            </dd>
          </div>
          {isOutbound ? (
            <div className="travel-card__field">
              <dt>{arrivalIsEstimate ? 'Arrives (estimate)' : 'Arrives'}</dt>
              <dd>{arrivesLocal ? `${dateInCph(arrivesLocal)} ${timeInCph(arrivesLocal)}` : 'Unknown'}</dd>
            </div>
          ) : (
            <>
              {config.returnFlight.departureTerminal && (
                <div className="travel-card__field">
                  <dt>Departure terminal</dt>
                  <dd>{config.returnFlight.departureTerminal}</dd>
                </div>
              )}
              {config.returnFlight.arrivesLocal && (
                <div className="travel-card__field">
                  <dt>Arrives OTP</dt>
                  <dd>
                    {dateInCph(config.returnFlight.arrivesLocal)} ({WEEKDAY[dayOfWeekInCph(config.returnFlight.arrivesLocal)]}){' '}
                    {timeInCph(config.returnFlight.arrivesLocal)} &middot; next day, Romania local time
                  </dd>
                </div>
              )}
            </>
          )}
        </dl>

        <div className="form-grid form-grid--2">
          <div className="field">
            <label htmlFor={numberId}>Flight number</label>
            <input
              id={numberId}
              type="text"
              inputMode="text"
              spellCheck={false}
              autoComplete="off"
              placeholder="Not yet booked"
              value={flight.number ?? ''}
              onChange={(e) => {
                const value = e.target.value || null;
                if (isOutbound) {
                  updateConfig({ outboundFlight: { ...config.outboundFlight, number: value } });
                } else {
                  updateConfig({ returnFlight: { ...config.returnFlight, number: value } });
                }
              }}
            />
          </div>

          {isOutbound ? (
            <div className="field">
              <label htmlFor={arriveId}>Confirmed/estimated arrival at CPH</label>
              <input
                id={arriveId}
                type="datetime-local"
                value={arrivesLocal ? toLocalInputValue(arrivesLocal) : ''}
                onChange={(e) => {
                  if (!e.target.value) return;
                  updateConfig({
                    outboundFlight: { ...config.outboundFlight, arrivesLocal: fromLocalInputValue(e.target.value) },
                  });
                }}
              />
              <div className="field--checkbox field">
                <input
                  id={estimateId}
                  type="checkbox"
                  checked={arrivalIsEstimate}
                  onChange={(e) =>
                    updateConfig({ outboundFlight: { ...config.outboundFlight, arrivalIsEstimate: e.target.checked } })
                  }
                />
                <label htmlFor={estimateId}>This time is still an estimate</label>
              </div>
            </div>
          ) : (
            <div className="field">
              <label htmlFor={departId}>Departure from CPH</label>
              <input
                id={departId}
                type="datetime-local"
                value={toLocalInputValue(departsLocal)}
                onChange={(e) => {
                  if (!e.target.value) return;
                  updateConfig({ returnFlight: { ...config.returnFlight, departsLocal: fromLocalInputValue(e.target.value) } });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
