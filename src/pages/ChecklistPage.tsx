import { ALL_CHECKLISTS } from '@/data';
import { ChecklistPanel } from '@/components/ChecklistPanel';
import { VerifyBeforeYouGoPanel } from '@/components/VerifyBeforeYouGoPanel';

export function ChecklistPage() {
  return (
    <div className="stack" style={{ gap: 'var(--space-8)' }}>
      <header className="page-header">
        <span className="page-eyebrow">Checklist</span>
        <h1>Packing, booking, and readiness</h1>
        <p>Checked state is saved to this browser only. Work through each list before the parts of the trip it covers.</p>
      </header>

      {ALL_CHECKLISTS.map((checklist) => (
        <section className="card" key={checklist.id}>
          <ChecklistPanel checklist={checklist} />
        </section>
      ))}

      <section className="stack">
        <h2 className="section-heading">Verify before you go</h2>
        <VerifyBeforeYouGoPanel />
      </section>
    </div>
  );
}
