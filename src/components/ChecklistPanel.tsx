import { useEffect, useState } from 'react';
import type { Checklist } from '@/data';
import { getAllVerified, setVerified } from '@/lib';

export interface ChecklistPanelProps {
  checklist: Checklist;
}

/** One checklist (packing / booking / airport readiness) with per-item
 * checked state persisted to localStorage via setVerified/isVerified. */
export function ChecklistPanel({ checklist }: ChecklistPanelProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setChecked(getAllVerified());
  }, []);

  const doneCount = checklist.items.filter((item) => checked[item.id]).length;
  const total = checklist.items.length;

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = !prev[id];
      setVerified(id, next);
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="checklist">
      <h2 className="section-heading">
        {checklist.title} <span className="count">{doneCount}/{total}</span>
      </h2>
      <div className="checklist__progress">
        <div className="checklist__bar" role="progressbar" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={total} aria-label={`${checklist.title} progress`}>
          <div className="checklist__bar-fill" style={{ width: total ? `${(doneCount / total) * 100}%` : '0%' }} />
        </div>
      </div>
      <ul className="stack">
        {checklist.items.map((item) => {
          const isChecked = Boolean(checked[item.id]);
          return (
            <li key={item.id} className={`checklist-item${isChecked ? ' checklist-item--checked' : ''}`}>
              <input
                type="checkbox"
                id={`check-${item.id}`}
                checked={isChecked}
                onChange={() => toggle(item.id)}
              />
              <span className="checklist-item__body">
                <label htmlFor={`check-${item.id}`} className="checklist-item__label">
                  {item.label}
                </label>
                {item.detail && <span className="checklist-item__detail">{item.detail}</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
