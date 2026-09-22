import type { TransitLeg as TransitLegType } from '@/types';
import { formatDurationMinutes } from '@/lib';
import { Badge } from './Badge';
import { BoatIcon, BusIcon, TrainIcon, WalkIcon } from './icons';

const MODE_ICON: Record<TransitLegType['mode'], typeof TrainIcon> = {
  metro: TrainIcon,
  's-train': TrainIcon,
  'regional-train': TrainIcon,
  bus: BusIcon,
  walk: WalkIcon,
  'harbour-bus': BoatIcon,
};

const MODE_LABEL: Record<TransitLegType['mode'], string> = {
  metro: 'Metro',
  's-train': 'S-train',
  'regional-train': 'Regional train',
  bus: 'Bus',
  walk: 'Walk',
  'harbour-bus': 'Harbour bus',
};

export interface TransitLegProps {
  transit: TransitLegType;
}

export function TransitLeg({ transit }: TransitLegProps) {
  const Icon = MODE_ICON[transit.mode];
  return (
    <div className="transit-leg">
      <span className="transit-leg__mode">
        <Icon size={18} />
      </span>
      <div className="transit-leg__body">
        <span className="transit-leg__route">
          {MODE_LABEL[transit.mode]}
          {transit.line ? ` ${transit.line}` : ''}: {transit.from} &rarr; {transit.to}
        </span>
        <span className="transit-leg__meta">
          ~{formatDurationMinutes(transit.minutes)} (estimate) &middot;{' '}
          <a href={transit.journeyPlannerUrl} target="_blank" rel="noopener noreferrer" className="source-link">
            check Rejseplanen
          </a>
        </span>
      </div>
      <Badge variant={transit.coveredByCard ? 'ok' : 'critical'}>
        {transit.coveredByCard ? 'Card covers this' : 'Not covered'}
      </Badge>
    </div>
  );
}
