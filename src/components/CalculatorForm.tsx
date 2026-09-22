import { useId } from 'react';
import type { CardDurationHours, CardType } from '@/types';
import { useTripConfig } from '@/AppContext';
import { ATTRACTIONS } from '@/data';
import { combineDateAndTimeCph } from '@/lib';
import { Callout } from './Callout';
import { Badge } from './Badge';

const DURATIONS: CardDurationHours[] = [24, 48, 72, 96, 120];

function toLocalInputValue(iso: string): string {
  return iso.slice(0, 16);
}

function fromLocalInputValue(value: string): string {
  const [date, time] = value.split('T');
  return combineDateAndTimeCph(date, time);
}

/** The full TripConfig input form. Every field updates context state
 * immediately, so CalculatorResults recomputes live as the visitor types. */
export function CalculatorForm() {
  const { config, updateConfig, toggleAttraction } = useTripConfig();
  const adultsId = useId();
  const juniorsId = useId();
  const childrenId = useId();
  const cardTypeId = useId();
  const durationId = useId();
  const activationId = useId();
  const targetArrivalId = useId();
  const leaveCityId = useId();
  const transferMinutesId = useId();
  const arrivesId = useId();
  const estimateId = useId();
  const transportEstimateId = useId();

  return (
    <form className="stack" onSubmit={(e) => e.preventDefault()}>
      <fieldset className="fieldset">
        <legend>Party size</legend>
        <div className="form-grid form-grid--3">
          <div className="field">
            <label htmlFor={adultsId}>Adults (16+)</label>
            <input
              id={adultsId}
              type="number"
              inputMode="numeric"
              min={0}
              max={20}
              value={config.adults}
              onChange={(e) => updateConfig({ adults: Math.max(0, Number(e.target.value) || 0) })}
            />
          </div>
          <div className="field">
            <label htmlFor={juniorsId}>Juniors (12-15)</label>
            <input
              id={juniorsId}
              type="number"
              inputMode="numeric"
              min={0}
              max={20}
              value={config.juniors}
              onChange={(e) => updateConfig({ juniors: Math.max(0, Number(e.target.value) || 0) })}
            />
          </div>
          <div className="field">
            <label htmlFor={childrenId}>Kids (3-11)</label>
            <input
              id={childrenId}
              type="number"
              inputMode="numeric"
              min={0}
              max={20}
              value={config.children}
              onChange={(e) => updateConfig({ children: Math.max(0, Number(e.target.value) || 0) })}
            />
          </div>
        </div>
        <p className="field__hint">Ages 0-2 travel free and need no card. Max 2 kids per adult card.</p>
      </fieldset>

      <fieldset className="fieldset">
        <legend>Copenhagen Card</legend>
        <div className="form-grid form-grid--2">
          <div className="field">
            <label htmlFor={cardTypeId}>Card type</label>
            <select
              id={cardTypeId}
              value={config.cardType}
              onChange={(e) => {
                const cardType = e.target.value as CardType;
                const cardDurationHours =
                  cardType === 'HOP' && config.cardDurationHours > 72 ? 72 : config.cardDurationHours;
                updateConfig({ cardType, cardDurationHours });
              }}
            >
              <option value="DISCOVER">DISCOVER (recommended, includes airport transport)</option>
              <option value="HOP">HOP (no airport transport, max 72h)</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor={durationId}>Duration</label>
            <select
              id={durationId}
              value={config.cardDurationHours}
              onChange={(e) => updateConfig({ cardDurationHours: Number(e.target.value) as CardDurationHours })}
            >
              {DURATIONS.map((d) => (
                <option key={d} value={d} disabled={config.cardType === 'HOP' && d > 72}>
                  {d}h
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor={activationId}>Activation date &amp; time</label>
          <input
            id={activationId}
            type="datetime-local"
            value={toLocalInputValue(config.activationDateTime)}
            onChange={(e) => e.target.value && updateConfig({ activationDateTime: fromLocalInputValue(e.target.value) })}
          />
          <p className="field__hint">Activation is irreversible. This should match the moment the card is actually tapped/activated at the airport.</p>
        </div>
      </fieldset>

      <fieldset className="fieldset">
        <legend>Flights &amp; transfers</legend>

        {config.outboundFlight.arrivalIsEstimate && (
          <Callout tone="warning" title="Arrival time to confirm">
            The outbound arrival below is a planning estimate. Confirm the real flight time before travel, then update
            it and the activation time above.
          </Callout>
        )}

        <div className="form-grid form-grid--2">
          <div className="field">
            <label htmlFor={arrivesId}>Outbound arrival at CPH (confirmed/estimated)</label>
            <input
              id={arrivesId}
              type="datetime-local"
              value={config.outboundFlight.arrivesLocal ? toLocalInputValue(config.outboundFlight.arrivesLocal) : ''}
              onChange={(e) =>
                e.target.value &&
                updateConfig({ outboundFlight: { ...config.outboundFlight, arrivesLocal: fromLocalInputValue(e.target.value) } })
              }
            />
            <div className="field--checkbox field">
              <input
                id={estimateId}
                type="checkbox"
                checked={config.outboundFlight.arrivalIsEstimate}
                onChange={(e) =>
                  updateConfig({ outboundFlight: { ...config.outboundFlight, arrivalIsEstimate: e.target.checked } })
                }
              />
              <label htmlFor={estimateId}>Still an estimate</label>
            </div>
          </div>

          <div className="field">
            <label htmlFor={targetArrivalId}>Target airport arrival (return)</label>
            <input
              id={targetArrivalId}
              type="datetime-local"
              value={toLocalInputValue(config.targetAirportArrival)}
              onChange={(e) => e.target.value && updateConfig({ targetAirportArrival: fromLocalInputValue(e.target.value) })}
            />
          </div>

          <div className="field">
            <label htmlFor={leaveCityId}>Leave the city for the airport</label>
            <input
              id={leaveCityId}
              type="datetime-local"
              value={toLocalInputValue(config.leaveCityForAirport)}
              onChange={(e) => e.target.value && updateConfig({ leaveCityForAirport: fromLocalInputValue(e.target.value) })}
            />
          </div>

          <div className="field">
            <label htmlFor={transferMinutesId}>Airport transfer time (minutes)</label>
            <input
              id={transferMinutesId}
              type="number"
              inputMode="numeric"
              min={0}
              max={180}
              value={config.airportTransferMinutes}
              onChange={(e) => updateConfig({ airportTransferMinutes: Math.max(0, Number(e.target.value) || 0) })}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor={transportEstimateId}>Estimated standalone transport value per person, DKK (optional)</label>
          <input
            id={transportEstimateId}
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="e.g. 150"
            value={config.standaloneTransportEstimateDkk ?? ''}
            onChange={(e) =>
              updateConfig({ standaloneTransportEstimateDkk: e.target.value ? Number(e.target.value) : null })
            }
          />
          <p className="field__hint">Used only in the savings estimate below; leave blank to exclude transport value entirely.</p>
        </div>
      </fieldset>

      <fieldset className="fieldset">
        <legend>Attractions to include in the value calculation</legend>
        <div className="attraction-picker" role="group" aria-label="Selected attractions">
          {ATTRACTIONS.map((a) => (
            <label className="attraction-option" key={a.id}>
              <input
                type="checkbox"
                checked={config.selectedAttractionIds.includes(a.id)}
                onChange={() => toggleAttraction(a.id)}
              />
              <span className="attraction-option__body">
                <span className="attraction-option__name">{a.shortName ?? a.name}</span>
                <span className="attraction-option__meta">
                  {a.standaloneAdultPrice ? `${a.standaloneAdultPrice.amountDkk} DKK` : 'No published price'}
                </span>
                {a.excluded && <Badge variant="critical">Closed this trip</Badge>}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </form>
  );
}
