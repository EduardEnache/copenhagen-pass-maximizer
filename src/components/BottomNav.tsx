import { NavLink } from 'react-router-dom';
import { CalculatorIcon, CalendarIcon, ChecklistIcon, MapIcon, NotesIcon } from './icons';

const ITEMS = [
  { to: '/itinerary', label: 'Itinerary', Icon: CalendarIcon },
  { to: '/calculator', label: 'Calculator', Icon: CalculatorIcon },
  { to: '/map', label: 'Map', Icon: MapIcon },
  { to: '/checklist', label: 'Checklist', Icon: ChecklistIcon },
  { to: '/notes', label: 'Notes', Icon: NotesIcon },
];

/** Sticky mobile navigation: exactly five destinations, matching the
 * brief's information architecture. */
export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {ITEMS.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to}>
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
