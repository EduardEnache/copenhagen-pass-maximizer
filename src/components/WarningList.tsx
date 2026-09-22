import type { Warning } from '@/types';
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon } from './icons';
import { EmptyState } from './EmptyState';

const SEVERITY_ORDER: Warning['severity'][] = ['critical', 'warning', 'info'];
const SEVERITY_LABEL: Record<Warning['severity'], string> = {
  critical: 'Critical',
  warning: 'Warning',
  info: 'Info',
};

function SeverityIcon({ severity }: { severity: Warning['severity'] }) {
  if (severity === 'info') return <InfoIcon size={16} />;
  return <AlertTriangleIcon size={16} />;
}

export interface WarningListProps {
  warnings: Warning[];
  /** Cap the total number shown (highest severity first), for compact placements like the side panel. */
  limit?: number;
  /** Skip the severity group headings, for the compact placements. */
  ungrouped?: boolean;
}

/** The aggregate warning list, grouped by severity. Icon + text always
 * together; colour alone never carries the meaning. */
export function WarningList({ warnings, limit, ungrouped = false }: WarningListProps) {
  if (warnings.length === 0) {
    return (
      <EmptyState
        icon={<CheckCircleIcon size={28} />}
        title="No warnings"
        description="Nothing to flag for the current configuration and plan."
      />
    );
  }

  const sorted = [...warnings].sort(
    (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity),
  );
  const shown = limit ? sorted.slice(0, limit) : sorted;

  if (ungrouped) {
    return (
      <ul className="stack">
        {shown.map((w) => (
          <li key={w.id} className={`warning-item warning-item--${w.severity}`}>
            <SeverityIcon severity={w.severity} />
            <span>{w.message}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="stack">
      {SEVERITY_ORDER.filter((sev) => shown.some((w) => w.severity === sev)).map((sev) => (
        <div className="warning-group" key={sev}>
          <h3>
            {SEVERITY_LABEL[sev]} ({shown.filter((w) => w.severity === sev).length})
          </h3>
          <ul className="stack">
            {shown
              .filter((w) => w.severity === sev)
              .map((w) => (
                <li key={w.id} className={`warning-item warning-item--${w.severity}`}>
                  <SeverityIcon severity={w.severity} />
                  <span>{w.message}</span>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
