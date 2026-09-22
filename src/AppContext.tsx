// Application-wide state: the live TripConfig (persisted to localStorage),
// the currently selected ItineraryPlan derived from it, a memoised
// PassCalculationResult, and the manual light/dark theme override.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ItineraryPlan, PassCalculationResult, PlanVariant, TripConfig } from '@/types';
import {
  ATTRACTIONS,
  ALL_PLANS,
  CORE_PLAN,
  DEFAULT_TRIP_CONFIG,
  LATE_ARRIVAL_TIER1_PLAN,
  LATE_ARRIVAL_TIER2_PLAN,
  PASS_RULES_DATA,
} from '@/data';
import { calculatePassValue, getStoredTripConfig, selectPlanVariant, setStoredTripConfig } from '@/lib';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'cpm:theme';

function readStoredTheme(): Theme | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(THEME_KEY);
    return raw === 'light' || raw === 'dark' ? raw : null;
  } catch {
    return null;
  }
}

function writeStoredTheme(theme: Theme | null): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    if (theme === null) {
      window.localStorage.removeItem(THEME_KEY);
    } else {
      window.localStorage.setItem(THEME_KEY, theme);
    }
  } catch {
    // Storage unavailable — theme falls back to prefers-color-scheme only.
  }
}

/**
 * Resolves the active ItineraryPlan for a config's selectedVariant.
 * 'late-arrival' has two data plans (tier 1 / tier 2) sharing one
 * PlanVariant value, so the tier is auto-resolved from the confirmed/
 * estimated outbound arrival via selectPlanVariant — the same helper the
 * research brief points to for this exact decision. Falls back to tier 1
 * when the arrival is still unknown (a conservative "assume the earlier,
 * more attraction-friendly tier" default that the calculator/warnings can
 * still correct once the real time is known).
 */
export function resolvePlan(config: TripConfig): ItineraryPlan {
  if (config.selectedVariant === 'late-arrival') {
    const selection = selectPlanVariant({ arrivalDateTime: config.outboundFlight.arrivesLocal });
    if (selection.variant === 'late-arrival' && selection.lateArrivalTier === 2) {
      return LATE_ARRIVAL_TIER2_PLAN;
    }
    return LATE_ARRIVAL_TIER1_PLAN;
  }
  return ALL_PLANS.find((p) => p.variant === config.selectedVariant) ?? CORE_PLAN;
}

interface AppContextValue {
  config: TripConfig;
  setConfig: (next: TripConfig) => void;
  updateConfig: (patch: Partial<TripConfig>) => void;
  setVariant: (variant: PlanVariant) => void;
  toggleAttraction: (attractionId: string) => void;
  plan: ItineraryPlan;
  passResult: PassCalculationResult;
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: Theme | null) => void;
  systemTheme: Theme;
}

const AppContext = createContext<AppContextValue | null>(null);

function getSystemTheme(): Theme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<TripConfig>(() => getStoredTripConfig() ?? DEFAULT_TRIP_CONFIG);
  const [storedTheme, setStoredThemeState] = useState<Theme | null>(() => readStoredTheme());
  const [systemTheme, setSystemTheme] = useState<Theme>(() => getSystemTheme());

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const resolvedTheme = storedTheme ?? systemTheme;

  useEffect(() => {
    const root = document.documentElement;
    if (storedTheme) {
      root.setAttribute('data-theme', storedTheme);
    } else {
      root.removeAttribute('data-theme');
    }
  }, [storedTheme]);

  // Keep the browser chrome (address bar / task switcher) colour in sync
  // with the resolved theme, since the static <meta name="theme-color">
  // tags only react to prefers-color-scheme, not the manual toggle.
  useEffect(() => {
    const color = resolvedTheme === 'dark' ? '#191b1e' : '#faf8f5';
    const tags = document.querySelectorAll('meta[name="theme-color"]');
    tags.forEach((tag) => tag.setAttribute('content', color));
  }, [resolvedTheme]);

  const setConfig = useCallback((next: TripConfig) => {
    setConfigState(next);
    setStoredTripConfig(next);
  }, []);

  const updateConfig = useCallback((patch: Partial<TripConfig>) => {
    setConfigState((prev) => {
      const next = { ...prev, ...patch };
      setStoredTripConfig(next);
      return next;
    });
  }, []);

  const setVariant = useCallback(
    (variant: PlanVariant) => {
      updateConfig({ selectedVariant: variant });
    },
    [updateConfig],
  );

  const toggleAttraction = useCallback((attractionId: string) => {
    setConfigState((prev) => {
      const selected = prev.selectedAttractionIds.includes(attractionId)
        ? prev.selectedAttractionIds.filter((id) => id !== attractionId)
        : [...prev.selectedAttractionIds, attractionId];
      const next = { ...prev, selectedAttractionIds: selected };
      setStoredTripConfig(next);
      return next;
    });
  }, []);

  const setTheme = useCallback((theme: Theme | null) => {
    setStoredThemeState(theme);
    writeStoredTheme(theme);
  }, []);

  const plan = useMemo(() => resolvePlan(config), [config]);

  const passResult = useMemo(
    () => calculatePassValue(config, ATTRACTIONS, plan, PASS_RULES_DATA),
    [config, plan],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      config,
      setConfig,
      updateConfig,
      setVariant,
      toggleAttraction,
      plan,
      passResult,
      theme: resolvedTheme,
      resolvedTheme,
      setTheme,
      systemTheme,
    }),
    [config, setConfig, updateConfig, setVariant, toggleAttraction, plan, passResult, resolvedTheme, setTheme, systemTheme],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useTripConfig(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useTripConfig must be used within AppContextProvider');
  return ctx;
}
