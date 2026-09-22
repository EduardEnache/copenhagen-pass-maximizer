import { Link } from 'react-router-dom';
import { useTripConfig } from '@/AppContext';
import { formatCountdown } from '@/lib';
import { useNow } from './useNow';
import { withViewTransition } from './viewTransition';
import { CompassIcon, MoonIcon, OverviewIcon, SunIcon } from './icons';

/** Always-visible header: brand mark (links to the trip overview), a live
 * departure/card-validity countdown, and the manual light/dark toggle. */
export function AppHeader() {
  const { config, passResult, resolvedTheme, setTheme } = useTripConfig();
  const now = useNow();

  const departsMs = new Date(config.outboundFlight.departsLocal).getTime();
  const expiryMs = passResult.expiryInstantMs;

  let countdownLabel = '';
  let countdownValue = '';
  if (now < departsMs) {
    countdownLabel = 'Departs in';
    countdownValue = formatCountdown(departsMs - now);
  } else if (now < expiryMs) {
    countdownLabel = 'Card valid for';
    countdownValue = formatCountdown(expiryMs - now);
  } else {
    countdownLabel = 'Trip';
    countdownValue = 'complete';
  }

  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

  return (
    <header className="app-header">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="app-header__bar">
        <Link to="/dashboard" className="app-header__brand">
          <span className="app-header__mark">
            <CompassIcon size={20} />
          </span>
          <span className="app-header__wordmark">
            <strong>Copenhagen Pass Maximizer</strong>
            <span>25-28 Sept 2026</span>
          </span>
        </Link>

        <div className="app-header__actions">
          <div className="app-header__countdown" aria-live="off">
            <span>{countdownLabel}</span>
            <strong>{countdownValue}</strong>
          </div>
          <Link to="/dashboard" className="icon-button" aria-label="Trip overview">
            <OverviewIcon size={18} />
          </Link>
          <button
            type="button"
            className="icon-button"
            onClick={() => withViewTransition(() => setTheme(nextTheme))}
            aria-label={`Switch to ${nextTheme} mode (currently ${resolvedTheme} mode)`}
          >
            {resolvedTheme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
