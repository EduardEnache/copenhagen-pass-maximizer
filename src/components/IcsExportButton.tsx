import { useCallback } from 'react';
import type { ItineraryPlan } from '@/types';
import { buildIcsBlob } from '@/lib';
import { DownloadIcon } from './icons';

export interface IcsExportButtonProps {
  plan: ItineraryPlan;
}

/** Downloads the current plan as a .ics calendar file. */
export function IcsExportButton({ plan }: IcsExportButtonProps) {
  const handleClick = useCallback(() => {
    const blob = buildIcsBlob(plan);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `copenhagen-${plan.variant}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [plan]);

  return (
    <button type="button" className="btn btn--secondary ics-export-button" onClick={handleClick}>
      <DownloadIcon size={16} />
      Add to calendar (.ics)
    </button>
  );
}
