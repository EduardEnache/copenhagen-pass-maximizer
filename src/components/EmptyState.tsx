import type { ReactNode } from 'react';
import { CompassIcon } from './icons';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon ?? <CompassIcon size={28} />}
      <h3>{title}</h3>
      {description && <p className="text-muted">{description}</p>}
      {action}
    </div>
  );
}
