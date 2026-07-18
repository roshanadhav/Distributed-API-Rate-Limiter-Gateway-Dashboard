// ============================================================================
// CENTRAL APP CONFIG
// Change API_BASE_URL here (only place it needs to change) to point the
// entire app at a different gateway host/port.
//
// Optional runtime override (handy for demos without a rebuild): append
// ?apiBase=http://some-host:3000 to the page URL, or set it once via
// localStorage.setItem("apexgw:apiBase", "http://some-host:3000").
// ============================================================================

const DEFAULT_API_BASE_URL = "http://localhost:3000";

function resolveApiBase() {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("apiBase");
    if (fromQuery) return fromQuery.replace(/\/$/, "");

    const fromStorage = window.localStorage?.getItem("apexgw:apiBase");
    if (fromStorage) return fromStorage.replace(/\/$/, "");
  }
  return DEFAULT_API_BASE_URL;
}

export const API_BASE_URL = resolveApiBase();

// How often the dashboard re-polls the gateway for fresh data.
export const POLL_INTERVAL_MS = 5000;

// How many polled snapshots to keep in memory for the trend charts
// (since the gateway only exposes current-value metrics, not history).
export const HISTORY_LENGTH = 40;
