import type { ReactNode } from 'react';
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon } from './icons';

export type CalloutTone = 'critical' | 'warning' | 'info' | 'ok';

const ICON: Record<CalloutTone, ReactNode> = {
  critical: <AlertTriangleIcon />,
  warning: <AlertTriangleIcon />,
  info: <InfoIcon />,
  ok: <CheckCircleIcon />,
};

export interface CalloutProps {
  tone: CalloutTone;
  title?: string;
  children: ReactNode;
}

/** A boxed inline notice. Icon + text always together, never colour alone. */
export function Callout({ tone, title, children }: CalloutProps) {
  return (
    <div className={`callout callout--${tone}`} role={tone === 'critical' ? 'alert' : undefined}>
      <span className="callout__icon">{ICON[tone]}</span>
      <div className="callout__body">
        {title && <strong>{title}</strong>}
        <div>{children}</div>
      </div>
    </div>
  );
}
