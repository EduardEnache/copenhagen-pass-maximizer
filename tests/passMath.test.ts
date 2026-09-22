import { describe, it, expect } from 'vitest';
import { computeExpiry, computeFeasibility, isValidAt } from '../src/lib/passMath';
import { DEFAULT_TRIP_CONFIG } from '../src/data/tripDefaults';

describe('computeExpiry', () => {
  it('96h from 2026-09-25T11:15+02:00 -> 2026-09-29T11:15+02:00', () => {
    const { expiryDateTime } = computeExpiry('2026-09-25T11:15:00+02:00', 96);
    expect(expiryDateTime).toBe('2026-09-29T11:15:00+02:00');
  });

  it('72h from 2026-09-25T11:15+02:00 -> 2026-09-28T11:15+02:00', () => {
    const { expiryDateTime } = computeExpiry('2026-09-25T11:15:00+02:00', 72);
    expect(expiryDateTime).toBe('2026-09-28T11:15:00+02:00');
  });

  it('exclusivity: 24h from 10:00 valid at 09:59:59 next day, invalid at 10:00:00', () => {
    const { expiryInstantMs } = computeExpiry('2026-09-25T10:00:00+02:00', 24);
    const justBefore = new Date('2026-09-26T09:59:59+02:00').getTime();
    const exact = new Date('2026-09-26T10:00:00+02:00').getTime();
    expect(isValidAt(expiryInstantMs, justBefore)).toBe(true);
    expect(isValidAt(expiryInstantMs, exact)).toBe(false);
  });

  it('DST correctness: 96h from 2026-10-24T10:00+02:00 crosses the Oct DST transition -> wall clock 09:00+01:00', () => {
    const { expiryDateTime } = computeExpiry('2026-10-24T10:00:00+02:00', 96);
    expect(expiryDateTime).toBe('2026-10-28T09:00:00+01:00');
  });
});

describe('computeFeasibility', () => {
  // Confirmed outbound flight W43123 lands 08:25 (vs. the old ~11:00
  // estimate), so the required coverage span to the 19:00 Mon target
  // airport arrival is longer than it was pre-confirmation: 82h35m.
  it('defaults: requiredSpan ~82.58h (confirmed 08:25 arrival), 72h infeasible, 96h feasible with slack ~13.42', () => {
    const f72 = computeFeasibility(DEFAULT_TRIP_CONFIG, 72);
    const f96 = computeFeasibility(DEFAULT_TRIP_CONFIG, 96);

    expect(f72.requiredSpanHours).toBeCloseTo(82.58333, 4);
    expect(f96.requiredSpanHours).toBeCloseTo(82.58333, 4);

    expect(f72.isFeasible).toBe(false);
    expect(f96.isFeasible).toBe(true);
    expect(f96.slackHours).toBeCloseTo(13.41667, 4);
  });
});
