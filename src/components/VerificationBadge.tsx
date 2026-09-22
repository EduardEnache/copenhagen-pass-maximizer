import type { ISODate, SourceRef, VerificationStatus } from '@/types';
import { AlertTriangleIcon, CheckCircleIcon, ClockIcon, HelpCircleIcon } from './icons';
import { SourceLink } from './SourceLink';

const LABEL: Record<VerificationStatus, string> = {
  verified: 'Verified',
  'partially-verified': 'Partially verified',
  unverified: 'Unverified',
  'not-yet-published': 'Not yet published',
  conflicting: 'Conflicting sources',
};

const ICON: Record<VerificationStatus, React.ReactNode> = {
  verified: <CheckCircleIcon />,
  'partially-verified': <AlertTriangleIcon />,
  unverified: <HelpCircleIcon />,
  'not-yet-published': <ClockIcon />,
  conflicting: <AlertTriangleIcon />,
};

export interface VerificationBadgeProps {
  status: VerificationStatus;
  checkedOn?: ISODate;
  source?: SourceRef;
  note?: string;
}

/** Renders a VerificationStatus with an icon AND a text label (never colour
 * alone), plus the date it was checked and a link to the source. */
export function VerificationBadge({ status, checkedOn, source, note }: VerificationBadgeProps) {
  return (
    <span className={`verification-badge verification-badge--${status}`}>
      <span className="verification-badge__icon">{ICON[status]}</span>
      <span>
        {LABEL[status]}
        {(checkedOn || source || note) && (
          <span className="verification-badge__meta">
            {checkedOn && <>Checked {checkedOn}</>}
            {source && (
              <>
                {checkedOn && ' · '}
                <SourceLink source={source} />
              </>
            )}
            {note && <>. {note}</>}
          </span>
        )}
      </span>
    </span>
  );
}
