import type { PlanVariant } from '@/types';
import { useTripConfig } from '@/AppContext';
import { selectPlanVariant } from '@/lib';
import { AlertTriangleIcon } from './icons';

const VARIANTS: { value: PlanVariant; label: string }[] = [
  { value: 'core', label: 'Core' },
  { value: 'fast-paced', label: 'Fast-paced' },
  { value: 'rainy-day', label: 'Rainy day' },
  { value: 'low-energy', label: 'Low energy' },
  { value: 'late-arrival', label: 'Late arrival' },
];

/** Lets the visitor switch which of the five itinerary plans is active,
 * with an "ambitious" banner for fast-paced and a tier explanation for
 * late-arrival (auto-resolved from the outbound arrival time). */
export function VariantSwitcher() {
  const { config, setVariant, plan } = useTripConfig();

  const lateArrivalSelection = selectPlanVariant({ arrivalDateTime: config.outboundFlight.arrivesLocal });

  return (
    <div className="variant-switcher">
      <div className="variant-switcher__options" role="group" aria-label="Itinerary plan variant">
        {VARIANTS.map((v) => (
          <button
            key={v.value}
            type="button"
            className="variant-pill"
            aria-pressed={config.selectedVariant === v.value}
            onClick={() => setVariant(v.value)}
          >
            {v.label}
          </button>
        ))}
      </div>

      {plan.isAmbitious && (
        <div className="variant-banner">
          <AlertTriangleIcon size={18} />
          <span>
            <strong>Ambitious plan.</strong> {plan.description}
          </span>
        </div>
      )}

      {config.selectedVariant === 'late-arrival' && (
        <p className="field__hint">
          Showing <strong>{plan.label}</strong>. {lateArrivalSelection.reason}
        </p>
      )}
    </div>
  );
}
