import { useEffect, useState } from 'react';
import type { VerifyItem, VerifySeverity } from '@/data';
import { VERIFY_BEFORE_YOU_GO, RESEARCH_TIMESTAMP } from '@/data';
import { getAllVerified, setVerified } from '@/lib';
import { Badge, type BadgeVariant } from './Badge';
import { SourceLink } from './SourceLink';
import { CheckCircleIcon } from './icons';

const SEVERITY_BADGE: Record<VerifySeverity, BadgeVariant> = {
  critical: 'critical',
  high: 'warning',
  info: 'info',
};

const SEVERITY_LABEL: Record<VerifySeverity, string> = {
  critical: 'Critical',
  high: 'High priority',
  info: 'Good to know',
};

function VerifyRow({ item, checked, onToggle }: { item: VerifyItem; checked: boolean; onToggle: () => void }) {
  return (
    <div className="verify-item">
      <div className="verify-item__head">
        <Badge variant={SEVERITY_BADGE[item.severity]}>{SEVERITY_LABEL[item.severity]}</Badge>
        {checked && <Badge variant="ok">Re-checked</Badge>}
      </div>
      <p className="verify-item__message">{item.message}</p>
      {item.source && <SourceLink source={item.source} />}
      <label className="verify-item__toggle">
        <input type="checkbox" checked={checked} onChange={onToggle} />
        Mark as re-checked before departure
      </label>
    </div>
  );
}

/** The reconfirmation register: everything not fully "verified" in the data
 * layer, with a research date, source links, and a local re-check toggle. */
export function VerifyBeforeYouGoPanel() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setChecked(getAllVerified());
  }, []);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = !prev[id];
      setVerified(id, next);
      return { ...prev, [id]: next };
    });
  };

  const doneCount = VERIFY_BEFORE_YOU_GO.filter((item) => checked[item.id]).length;

  return (
    <div className="stack">
      <p className="field__hint">
        Research checked on <strong>{RESEARCH_TIMESTAMP}</strong>. Everything below is not fully confirmed and should
        be re-checked close to departure. {doneCount}/{VERIFY_BEFORE_YOU_GO.length} re-checked so far.
      </p>
      {doneCount === VERIFY_BEFORE_YOU_GO.length && (
        <div className="callout callout--ok">
          <span className="callout__icon">
            <CheckCircleIcon />
          </span>
          <div className="callout__body">
            <strong>Everything has been re-checked.</strong>
          </div>
        </div>
      )}
      <div className="stack">
        {VERIFY_BEFORE_YOU_GO.map((item) => (
          <VerifyRow key={item.id} item={item} checked={Boolean(checked[item.id])} onToggle={() => toggle(item.id)} />
        ))}
      </div>
    </div>
  );
}
