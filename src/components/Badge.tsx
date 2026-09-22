import type { ReactNode } from 'react';
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon } from './icons';

export type BadgeVariant = 'neutral' | 'ok' | 'critical' | 'warning' | 'info';

const ICONS: Partial<Record<BadgeVariant, ReactNode>> = {
  ok: <CheckCircleIcon />,
  critical: <AlertTriangleIcon />,
  warning: <AlertTriangleIcon />,
  info: <InfoIcon />,
};

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  withIcon?: boolean;
}

/** A small status pill. Never colour-only: severity/status variants always
 * pair an icon with a text label. */
export function Badge({ variant = 'neutral', children, withIcon = true }: BadgeProps) {
  const icon = withIcon ? ICONS[variant] : null;
  return (
    <span className={`badge badge--${variant}`}>
      {icon}
      {children}
    </span>
  );
}
