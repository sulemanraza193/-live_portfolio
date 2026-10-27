// Minimal in-memory TTL cache. GitHub's REST API caps unauthenticated
// requests at 60/hour, so every route that hits GitHub goes through this
// to avoid burning through that budget on repeat page loads.
const store = new Map();

export function getCached(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function setCached(key, value, ttlMs) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}
