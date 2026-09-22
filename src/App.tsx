import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppHeader } from './components/AppHeader';
import { SidePanel } from './components/SidePanel';
import { BottomNav } from './components/BottomNav';
import { DashboardPage } from './pages/DashboardPage';
import { ItineraryPage } from './pages/ItineraryPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { MapPage } from './pages/MapPage';
import { ChecklistPage } from './pages/ChecklistPage';
import { NotesPage } from './pages/NotesPage';
import { PrintPage } from './pages/PrintPage';
import { NotFoundPage } from './pages/NotFoundPage';

/** Route table and persistent layout shell. The app is itinerary-first
 * (the root path redirects straight into it, not into a dashboard), and the
 * print view renders with no navigation chrome at all so it prints cleanly. */
export default function App() {
  const location = useLocation();
  const isPrintRoute = location.pathname === '/print';

  if (isPrintRoute) {
    return (
      <Routes>
        <Route path="/print" element={<PrintPage />} />
      </Routes>
    );
  }

  return (
    <div className="app-shell">
      <AppHeader />
      <div className="app-body">
        <main className="app-main" id="main-content">
          {/* Keying on the pathname (not the full location, so the itinerary's
              ?day= query param doesn't retrigger it) replays the route-fade
              entrance animation on every page change. */}
          <div className="route-fade" key={location.pathname}>
            <Routes>
              <Route path="/" element={<Navigate to="/itinerary" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/itinerary" element={<ItineraryPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/checklist" element={<ChecklistPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </main>
        <SidePanel />
      </div>
      <BottomNav />
    </div>
  );
}
