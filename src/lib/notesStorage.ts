// localStorage-backed persistence for user notes, trip config overrides, and
// "verified before you go" checkmarks. Every call is wrapped in try/catch
// and degrades to a graceful no-op if storage is unavailable (private
// browsing, disabled storage, etc.) — this module never throws.

import type { TripConfig } from '@/types';

const KEY_PREFIX = 'cpm:';
const STATE_KEY = `${KEY_PREFIX}state`;
const SCHEMA_VERSION = 1;

export interface StoredState {
  schemaVersion: number;
  tripConfig: TripConfig | null;
  notes: Record<string, string>;
  verifiedChecks: Record<string, boolean>;
}

function emptyState(): StoredState {
  return { schemaVersion: SCHEMA_VERSION, tripConfig: null, notes: {}, verifiedChecks: {} };
}

function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = `${KEY_PREFIX}__probe__`;
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function readState(): StoredState {
  try {
    if (!isStorageAvailable()) return emptyState();
    const raw = window.localStorage.getItem(STATE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    if (!isValidState(parsed)) return emptyState();
    return parsed;
  } catch {
    return emptyState();
  }
}

function writeState(state: StoredState): boolean {
  try {
    if (!isStorageAvailable()) return false;
    window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

function isValidState(value: unknown): value is StoredState {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.schemaVersion === 'number' &&
    (v.tripConfig === null || typeof v.tripConfig === 'object') &&
    typeof v.notes === 'object' &&
    v.notes !== null &&
    typeof v.verifiedChecks === 'object' &&
    v.verifiedChecks !== null
  );
}

// --- Trip config -----------------------------------------------------------

export function getStoredTripConfig(): TripConfig | null {
  return readState().tripConfig;
}

export function setStoredTripConfig(config: TripConfig): boolean {
  const state = readState();
  state.tripConfig = config;
  return writeState(state);
}

// --- Notes -------------------------------------------------------------

export function getNote(id: string): string | undefined {
  return readState().notes[id];
}

export function getAllNotes(): Record<string, string> {
  return readState().notes;
}

export function setNote(id: string, text: string): boolean {
  const state = readState();
  state.notes[id] = text;
  return writeState(state);
}

export function deleteNote(id: string): boolean {
  const state = readState();
  delete state.notes[id];
  return writeState(state);
}

// --- Verified checkmarks -------------------------------------------------

export function isVerified(id: string): boolean {
  return Boolean(readState().verifiedChecks[id]);
}

export function getAllVerified(): Record<string, boolean> {
  return readState().verifiedChecks;
}

export function setVerified(id: string, value = true): boolean {
  const state = readState();
  state.verifiedChecks[id] = value;
  return writeState(state);
}

// --- Export / import -------------------------------------------------------

export function exportJson(): string {
  try {
    return JSON.stringify(readState(), null, 2);
  } catch {
    return JSON.stringify(emptyState(), null, 2);
  }
}

export interface ImportResult {
  ok: boolean;
  error?: string;
}

export function importJson(json: string): ImportResult {
  try {
    const parsed = JSON.parse(json);
    if (!isValidState(parsed)) {
      return { ok: false, error: 'Invalid state shape: missing schemaVersion/tripConfig/notes/verifiedChecks.' };
    }
    if (parsed.schemaVersion > SCHEMA_VERSION) {
      return { ok: false, error: `Unsupported schema version ${parsed.schemaVersion} (app supports up to ${SCHEMA_VERSION}).` };
    }
    const ok = writeState({ ...parsed, schemaVersion: SCHEMA_VERSION });
    return ok ? { ok: true } : { ok: false, error: 'Storage unavailable — could not persist imported data.' };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to parse JSON.' };
  }
}

export function clearAll(): boolean {
  try {
    if (!isStorageAvailable()) return false;
    window.localStorage.removeItem(STATE_KEY);
    return true;
  } catch {
    return false;
  }
}
