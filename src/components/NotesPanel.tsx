import { useCallback, useEffect, useRef, useState } from 'react';
import { deleteNote, exportJson, getNote, importJson, setNote } from '@/lib';
import { DownloadIcon, TrashIcon, UploadIcon } from './icons';

const NOTE_KEYS = [
  { key: 'notes-global', label: 'General notes' },
  { key: 'notes-day-1', label: 'Day 1, Friday 25 Sept' },
  { key: 'notes-day-2', label: 'Day 2, Saturday 26 Sept' },
  { key: 'notes-day-3', label: 'Day 3, Sunday 27 Sept' },
  { key: 'notes-day-4', label: 'Day 4, Monday 28 Sept' },
];

function NoteField({ noteKey, label }: { noteKey: string; label: string }) {
  const [value, setValue] = useState('');
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setValue(getNote(noteKey) ?? '');
  }, [noteKey]);

  const flush = useCallback(
    (text: string) => {
      if (timer.current) window.clearTimeout(timer.current);
      if (text.trim()) {
        setNote(noteKey, text);
      } else {
        deleteNote(noteKey);
      }
    },
    [noteKey],
  );

  const handleChange = useCallback(
    (text: string) => {
      setValue(text);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => flush(text), 350);
    },
    [flush],
  );

  const id = `note-${noteKey}`;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={(e) => flush(e.target.value)}
        placeholder="Jot down a reservation reference, a change of plan, anything worth remembering…"
      />
    </div>
  );
}

/** Per-day plus general free-text notes, autosaved to localStorage, with
 * JSON export/import for backups. */
export function NotesPanel() {
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `copenhagen-pass-maximizer-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (file: File) => {
    const text = await file.text();
    const result = importJson(text);
    if (result.ok) {
      setImportMessage('Import succeeded. Reload this page to see the restored notes.');
    } else {
      setImportMessage(`Import failed: ${result.error}`);
    }
  };

  return (
    <div className="notes-panel">
      <div className="stack">
        {NOTE_KEYS.map(({ key, label }) => (
          <NoteField key={key} noteKey={key} label={label} />
        ))}
      </div>

      <div className="notes-actions">
        <button type="button" className="btn btn--secondary" onClick={handleExport}>
          <DownloadIcon size={16} />
          Export notes as JSON
        </button>
        <button type="button" className="btn btn--secondary" onClick={() => fileInputRef.current?.click()}>
          <UploadIcon size={16} />
          Import from JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImportFile(file);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          className="btn btn--danger"
          onClick={() => {
            if (window.confirm('Clear all notes on all days? This cannot be undone.')) {
              NOTE_KEYS.forEach(({ key }) => deleteNote(key));
              window.location.reload();
            }
          }}
        >
          <TrashIcon size={16} />
          Clear all notes
        </button>
      </div>
      {importMessage && <p className="field__hint" role="status">{importMessage}</p>}
    </div>
  );
}
