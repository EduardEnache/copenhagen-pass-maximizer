// Thin wrapper around the View Transitions API, used to cross-fade the
// light/dark theme swap instead of an instant flash. Purely a rendering
// nicety — the DOM update inside `update` happens either way.

/** Runs `update` (a synchronous state change, e.g. flipping the theme)
 * inside `document.startViewTransition` when the browser supports it and
 * the visitor hasn't asked for reduced motion, so the resulting DOM/colour
 * change cross-fades smoothly. Falls back to calling `update` directly
 * everywhere else — same outcome, just without the animation. */
export function withViewTransition(update: () => void): void {
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (typeof document === 'undefined' || typeof document.startViewTransition !== 'function' || prefersReducedMotion) {
    update();
    return;
  }

  document.startViewTransition(update);
}
