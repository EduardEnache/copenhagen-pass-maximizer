import { useTripConfig } from '@/AppContext';
import { CalculatorForm } from '@/components/CalculatorForm';
import { CalculatorResults } from '@/components/CalculatorResults';

export function CalculatorPage() {
  const { passResult } = useTripConfig();

  return (
    <div className="stack" style={{ gap: 'var(--space-8)' }}>
      <header className="page-header">
        <span className="page-eyebrow">Calculator</span>
        <h1>Is the Copenhagen Card worth it, for this exact trip</h1>
        <p>Every field below recomputes the result live. Change the party size, card duration, or attractions and watch the feasibility and value figures update.</p>
      </header>

      <CalculatorForm />

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-line-soft)' }} />

      <CalculatorResults result={passResult} />
    </div>
  );
}
