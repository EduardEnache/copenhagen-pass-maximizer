import type { ItineraryBlock } from '@/types';
import { ChevronRightIcon } from './icons';
import { Badge } from './Badge';

export interface FallbackDisclosureProps {
  blocks: ItineraryBlock[];
  summary?: string;
}

/** A collapsible <details> panel listing fallback/alternative blocks, kept
 * closed by default so the primary plan stays the visual focus. */
export function FallbackDisclosure({ blocks, summary = 'If this changes: alternatives' }: FallbackDisclosureProps) {
  if (blocks.length === 0) return null;

  return (
    <details className="fallback-disclosure">
      <summary>
        <ChevronRightIcon size={16} />
        {summary} ({blocks.length})
      </summary>
      <div className="fallback-disclosure__list">
        {blocks.map((block) => (
          <div className="fallback-item" key={block.id}>
            <span className="fallback-item__time">
              {block.startTime}-{block.endTime}
            </span>
            <strong>{block.title}</strong>
            {block.description && <span className="text-muted">{block.description}</span>}
            <div className="cluster">
              {block.passCovered !== 'n/a' && (
                <Badge variant={block.passCovered ? 'ok' : 'critical'}>
                  {block.passCovered ? 'Card covers this' : 'Not covered'}
                </Badge>
              )}
              {block.bookingWarning && <Badge variant="warning">{block.bookingWarning}</Badge>}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
