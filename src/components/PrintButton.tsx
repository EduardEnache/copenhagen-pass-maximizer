import { PrintIcon } from './icons';

export interface PrintButtonProps {
  label?: string;
}

/** Triggers the browser print dialog for the current page. */
export function PrintButton({ label = 'Print this page' }: PrintButtonProps) {
  return (
    <button type="button" className="btn btn--secondary print-button" onClick={() => window.print()}>
      <PrintIcon size={16} />
      {label}
    </button>
  );
}
