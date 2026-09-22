import { NotesPanel } from '@/components/NotesPanel';
import { InfoIcon } from '@/components/icons';

export function NotesPage() {
  return (
    <div className="stack" style={{ gap: 'var(--space-7)' }}>
      <header className="page-header">
        <span className="page-eyebrow">Notes</span>
        <h1>Your own notes, kept private</h1>
        <p>General notes plus one field per day. Nothing here is shared with anyone.</p>
      </header>

      <div className="privacy-note">
        <InfoIcon size={18} aria-hidden="true" />
        <p>
          These notes stay only in this browser&rsquo;s local storage. They are never sent to any server, and they
          are lost if this browser&rsquo;s site data is cleared. Export a backup regularly if you want to keep a copy.
        </p>
      </div>

      <NotesPanel />
    </div>
  );
}
