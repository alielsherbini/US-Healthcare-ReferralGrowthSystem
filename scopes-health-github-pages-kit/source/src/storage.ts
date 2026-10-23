// Preview data stays in this browser. Storage may be blocked or contain old JSON.
export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    // Roles were stored as plain strings in the original preview.
    const value = key === 'scopes_role' ? raw : JSON.parse(raw);
    if (value === null || typeof value !== typeof fallback) return fallback;
    if (Array.isArray(fallback) && !Array.isArray(value)) return fallback;
    return value as T;
  } catch {
    return fallback;
  }
}

export function writeStored(key: string, value: unknown): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, key === 'scopes_role' ? String(value) : JSON.stringify(value));
  } catch {
    console.warn('Preview changes could not be saved in this browser.');
  }
}
