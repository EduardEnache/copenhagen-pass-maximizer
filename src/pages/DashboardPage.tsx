import { useTripConfig } from '@/AppContext';
import { AIRPORT_READINESS_CHECKLIST, CITYHUB_COPENHAGEN } from '@/data';
import { CountdownCard } from '@/components/CountdownCard';
import { CardValidityMeter } from '@/components/CardValidityMeter';
import { FlightCard } from '@/components/FlightCard';
import { HotelCard } from '@/components/HotelCard';
import { ChecklistPanel } from '@/components/ChecklistPanel';
import { WarningList } from '@/components/WarningList';
import { useNow } from '@/components/useNow';

export function DashboardPage() {
  const { config, passResult } = useTripConfig();
  const now = useNow();

  return (
    <div className="stack" style={{ gap: 'var(--space-9)' }}>
      <header className="page-header">
        <span className="page-eyebrow">Trip overview</span>
        <h1>Copenhagen, 25-28 September 2026</h1>
        <p>Departure countdown, card validity, flights, hotel, and everything flagged for attention right now.</p>
      </header>

      <CountdownCard
        departsLocal={config.outboundFlight.departsLocal}
        activationInstantMs={passResult.activationInstantMs}
        expiryInstantMs={passResult.expiryInstantMs}
      />

      <section className="card stack">
        <h2 className="section-heading">Copenhagen Card validity</h2>
        <CardValidityMeter
          activationInstantMs={passResult.activationInstantMs}
          expiryInstantMs={passResult.expiryInstantMs}
          now={now}
          airportJourneyMs={new Date(config.targetAirportArrival).getTime()}
        />
      </section>

      <section className="stack">
        <h2 className="section-heading">Flights</h2>
        <div className="grid-2">
          <FlightCard direction="outbound" />
          <FlightCard direction="return" />
        </div>
      </section>

      <section className="stack">
        <h2 className="section-heading">Hotel</h2>
        <HotelCard hotel={CITYHUB_COPENHAGEN} />
      </section>

      <section className="card stack">
        <ChecklistPanel checklist={AIRPORT_READINESS_CHECKLIST} />
      </section>

      <section className="stack">
        <h2 className="section-heading">
          Top warnings <span className="count">({passResult.warnings.length} total)</span>
        </h2>
        <WarningList warnings={passResult.warnings} limit={6} />
      </section>
    </div>
  );
}
