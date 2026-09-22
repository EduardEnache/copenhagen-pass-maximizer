import { NavLink } from 'react-router-dom';
import { useTripConfig } from '@/AppContext';
import { useNow } from './useNow';
import { CardValidityMeter } from './CardValidityMeter';
import { WarningList } from './WarningList';
import {
  CalculatorIcon,
  CalendarIcon,
  ChecklistIcon,
  MapIcon,
  NotesIcon,
  OverviewIcon,
  PrintIcon,
} from './icons';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Overview', Icon: OverviewIcon },
  { to: '/itinerary', label: 'Itinerary', Icon: CalendarIcon },
  { to: '/calculator', label: 'Calculator', Icon: CalculatorIcon },
  { to: '/map', label: 'Map', Icon: MapIcon },
  { to: '/checklist', label: 'Checklist', Icon: ChecklistIcon },
  { to: '/notes', label: 'Notes', Icon: NotesIcon },
  { to: '/print', label: 'Print view', Icon: PrintIcon },
];

/** Desktop-only companion panel: primary navigation plus a live pass-status
 * snapshot and the top warnings, always in view while working the plan. */
export function SidePanel() {
  const { passResult, config } = useTripConfig();
  const now = useNow();

  return (
    <aside className="side-panel" aria-label="Trip status">
      <nav className="side-panel__nav" aria-label="Sections">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <section className="side-panel__section">
        <h2>Pass status</h2>
        <CardValidityMeter
          activationInstantMs={passResult.activationInstantMs}
          expiryInstantMs={passResult.expiryInstantMs}
          now={now}
          airportJourneyMs={new Date(config.targetAirportArrival).getTime()}
        />
      </section>

      <section className="side-panel__section">
        <h2>Top warnings ({passResult.warnings.length})</h2>
        <WarningList warnings={passResult.warnings} limit={4} ungrouped />
      </section>
    </aside>
  );
}
