import type { PassCalculationResult } from '@/types';
import { ATTRACTIONS_BY_ID } from '@/data';
import { dateInCph, formatDkk, formatDurationHours, timeInCph } from '@/lib';
import { Badge } from './Badge';
import { Callout } from './Callout';
import { WarningList } from './WarningList';

export interface CalculatorResultsProps {
  result: PassCalculationResult;
}

export function CalculatorResults({ result }: CalculatorResultsProps) {
  const lostAttractionNames = result.delta.attractionsLostUnder72.map(
    (id) => ATTRACTIONS_BY_ID[id]?.shortName ?? ATTRACTIONS_BY_ID[id]?.name ?? id,
  );

  return (
    <div className="stack" style={{ gap: 'var(--space-7)' }}>
      <section className="stack">
        <h2 className="section-heading">Validity &amp; feasibility</h2>
        <div className="results-grid">
          <div className="stat-tile stat-tile--accent">
            <dt>Activation</dt>
            <dd>
              {dateInCph(result.activationDateTime)} <small>{timeInCph(result.activationDateTime)}</small>
            </dd>
          </div>
          <div className="stat-tile stat-tile--accent">
            <dt>Expiry (exclusive)</dt>
            <dd>
              {dateInCph(result.expiryDateTime)} <small>{timeInCph(result.expiryDateTime)}</small>
            </dd>
          </div>
          <div className="stat-tile">
            <dt>Required span</dt>
            <dd>{formatDurationHours(result.requiredSpanHours)}</dd>
          </div>
          <div className="stat-tile">
            <dt>Slack</dt>
            <dd>{formatDurationHours(result.slackHours)}</dd>
          </div>
        </div>

        <Callout tone={result.isFeasible ? 'ok' : 'critical'} title={result.isFeasible ? 'Feasible' : 'Not feasible'}>
          {result.recommendationMessage}
        </Callout>
      </section>

      <section className="stack">
        <h2 className="section-heading">Journey coverage</h2>
        <div className="cluster">
          <Badge variant={result.inboundAirportTransferCovered ? 'ok' : 'critical'}>
            Inbound transfer {result.inboundAirportTransferCovered ? 'covered' : 'NOT covered'}
          </Badge>
          <Badge variant={result.outboundAirportTransferCovered ? 'ok' : 'critical'}>
            Return transfer {result.outboundAirportTransferCovered ? 'covered' : 'NOT covered'}
          </Badge>
          <Badge variant={result.allPlannedJourneysCovered ? 'ok' : 'critical'}>
            {result.allPlannedJourneysCovered
              ? 'All planned journeys covered'
              : `${result.uncoveredJourneyBlockIds.length} journey(s) not covered`}
          </Badge>
        </div>
      </section>

      <section className="stack">
        <h2 className="section-heading">Cost &amp; value breakdown</h2>
        <div className="results-grid">
          <div className="stat-tile">
            <dt>Party size</dt>
            <dd>{result.partySize}</dd>
          </div>
          <div className="stat-tile">
            <dt>Card cost</dt>
            <dd>{formatDkk(result.cardCostDkk)}</dd>
          </div>
          <div className="stat-tile">
            <dt>Verified admission value</dt>
            <dd>{formatDkk(result.verifiedAdmissionTotalDkk)}</dd>
          </div>
          <div className="stat-tile">
            <dt>Partially-verified value</dt>
            <dd>{formatDkk(result.partialAdmissionTotalDkk)}</dd>
          </div>
          <div className="stat-tile">
            <dt>Transport value</dt>
            <dd>{formatDkk(result.transportValueTotalDkk)}</dd>
          </div>
          <div className="stat-tile">
            <dt>Unpriced attractions</dt>
            <dd>{result.unpricedAttractionCount}</dd>
          </div>
          <div className="stat-tile stat-tile--accent">
            <dt>Gross value floor</dt>
            <dd>{formatDkk(result.grossValueFloorDkk)}</dd>
          </div>
          <div className="stat-tile stat-tile--accent">
            <dt>Gross value upper</dt>
            <dd>{formatDkk(result.grossValueUpperDkk)}</dd>
          </div>
          <div className="stat-tile stat-tile--accent">
            <dt>Net floor (value minus card)</dt>
            <dd>{formatDkk(result.netFloorDkk)}</dd>
          </div>
        </div>
        <Badge variant={result.canClaimExactSavings ? 'ok' : 'info'}>
          {result.canClaimExactSavings
            ? 'Every selected attraction has a verified price: this is an exact savings figure'
            : 'Some selected attractions are unpriced or only partially verified: treat this as a floor, not an exact figure'}
        </Badge>
      </section>

      <section className="stack">
        <h2 className="section-heading">72h vs 96h DISCOVER comparison</h2>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Duration</th>
              <th>Covers this plan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>72h</td>
              <td>
                <Badge variant={result.delta.feasible72 ? 'ok' : 'critical'}>
                  {result.delta.feasible72 ? 'Feasible' : 'Not feasible'}
                </Badge>
              </td>
            </tr>
            <tr>
              <td>96h</td>
              <td>
                <Badge variant={result.delta.feasible96 ? 'ok' : 'critical'}>
                  {result.delta.feasible96 ? 'Feasible' : 'Not feasible'}
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="results-grid">
          <div className="stat-tile">
            <dt>Extra cost of 96h over 72h</dt>
            <dd>{formatDkk(result.delta.extraCostTotalDkk)}</dd>
          </div>
          <div className="stat-tile">
            <dt>Attractions lost under 72h</dt>
            <dd>{result.delta.attractionsLostUnder72.length}</dd>
          </div>
          <div className="stat-tile">
            <dt>Journeys lost under 72h</dt>
            <dd>{result.delta.journeysLostUnder72.length}</dd>
          </div>
        </div>
        {lostAttractionNames.length > 0 && (
          <p className="field__hint">Lost under 72h: {lostAttractionNames.join(', ')}.</p>
        )}
        <Callout
          tone={
            result.delta.verdict === 'CHOOSE_96_FOR_COVERAGE'
              ? 'warning'
              : result.delta.verdict === 'NEITHER_COVERS_PLAN'
                ? 'critical'
                : 'info'
          }
        >
          {result.delta.verdict === 'CHOOSE_96_FOR_COVERAGE' &&
            'The 96h card is required to cover this plan; the 72h card would leave parts of it uncovered.'}
          {result.delta.verdict === 'COMPARE_ON_VALUE' &&
            'Both durations cover this plan. Compare on price versus the extra slack the 96h card buys.'}
          {result.delta.verdict === 'NEITHER_COVERS_PLAN' &&
            'Neither 72h nor 96h fully covers this plan as configured. Consider the 120h card or trimming the plan.'}
        </Callout>
      </section>

      <section className="stack">
        <h2 className="section-heading">
          Warnings <span className="count">({result.warnings.length})</span>
        </h2>
        <WarningList warnings={result.warnings} />
      </section>

      <p className="disclosure-note">{result.disclosure}</p>
    </div>
  );
}
