import type { SourceRef } from '@/types';
import { ExternalLinkIcon } from './icons';

export interface SourceLinkProps {
  source: SourceRef;
  label?: string;
}

/** A citation link. Always opens in a new tab with noopener/noreferrer. */
export function SourceLink({ source, label }: SourceLinkProps) {
  return (
    <a
      className="source-link print-show-url"
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label ?? source.name}
      <ExternalLinkIcon />
      <span className="sr-only"> (opens in a new tab, checked {source.checkedOn})</span>
    </a>
  );
}
