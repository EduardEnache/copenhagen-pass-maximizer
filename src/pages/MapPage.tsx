import { useTripConfig } from '@/AppContext';
import { MapView } from '@/components/MapView';

export function MapPage() {
  const { plan } = useTripConfig();

  return (
    <div className="stack" style={{ gap: 'var(--space-7)' }}>
      <header className="page-header">
        <span className="page-eyebrow">Map</span>
        <h1>Every point, grouped by day</h1>
        <p>
          No embedded map or API key: each point links straight out to its own OpenStreetMap page. Markers are
          colour- and shape-coded by type, and every marker is paired with a text label.
        </p>
      </header>
      <MapView plan={plan} />
    </div>
  );
}
