import { Link } from 'react-router-dom';
import { CompassIcon } from '@/components/icons';

export function NotFoundPage() {
  return (
    <div className="not-found">
      <CompassIcon size={40} />
      <span className="not-found__code">404</span>
      <h1>This page does not exist</h1>
      <p className="text-muted">The link may be out of date, or the page may have moved.</p>
      <Link to="/itinerary" className="btn btn--primary">
        Back to the itinerary
      </Link>
    </div>
  );
}
