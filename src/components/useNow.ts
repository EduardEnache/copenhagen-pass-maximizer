import { useEffect, useState } from 'react';

/** Returns the current instant (ms), ticking on an interval so countdowns
 * and validity meters stay live without re-rendering every frame. */
export function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
