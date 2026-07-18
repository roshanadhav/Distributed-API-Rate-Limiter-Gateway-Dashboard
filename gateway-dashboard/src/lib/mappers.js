// The /admin/services and /admin/load-balancer sample payloads return arrays
// of service objects *without* a name/id field. The only place names surface
// is the load-balancer `distribution` map and the /admin/services/:id path
// (e.g. "admin-1"). We reconstruct stable ids by pairing array position with
// the known distribution keys, falling back to a generic label if the
// backend ever returns more/fewer services than expected.
export const SERVICE_ID_FALLBACK_ORDER = ["user-service", "user-service-2", "user-service-3", "auth-service", "admin-1"];

const MAX_SAFE = Number.MAX_SAFE_INTEGER;

export function sanitizeMetric(v) {
  if (v === null || v === undefined) return null;
  if (v === MAX_SAFE) return null; // backend's "no data yet" sentinel
  return v;
}

export function groupFromId(id) {
  if (!id) return "Other";
  if (id.startsWith("user-service")) return "User Service";
  if (id.startsWith("auth-service")) return "Auth Service";
  if (id.startsWith("admin")) return "Admin Service";
  return "Other";
}

export function statusFromRaw(raw) {
  const s = (raw?.status || "").toUpperCase();
  if (s === "UP" || s === "HEALTHY" || s === "OK") return "healthy";
  if (s === "DEGRADED" || s === "WARNING" || s === "SLOW") return "warning";
  if (s === "DOWN" || s === "UNHEALTHY") return "down";
  return raw?.healthy ? "healthy" : "down";
}

/**
 * Turns one raw entry from GET /admin/services into the shape used across
 * the dashboard. `prevSnapshot`/`dtSeconds` (previous poll for the same
 * service + elapsed seconds) are used to derive a live requests/sec figure,
 * since the API only reports cumulative totalRequests, not a rate.
 */
export function mapService(raw, id, prevSnapshot, dtSeconds) {
  const totalRequests = raw.totalRequests ?? 0;
  let rps = 0;
  if (prevSnapshot && dtSeconds > 0) {
    rps = Math.max(0, (totalRequests - prevSnapshot.totalRequests) / dtSeconds);
  }
  return {
    id,
    group: groupFromId(id),
    status: statusFromRaw(raw),
    healthy: !!raw.healthy,
    cpu: raw.cpuUsage ?? 0,
    mem: raw.memoryUsage ?? 0,
    rps: Math.round(rps * 10) / 10,
    latency: sanitizeMetric(raw.averageLatency) ?? 0,
    responseTime: raw.responseTime ?? 0,
    totalRequests,
    successfulRequests: raw.successfulRequests ?? 0,
    failedRequests: raw.failedRequests ?? 0,
    activeConnections: raw.activeConnections ?? 0,
    selectedCount: raw.selectedCount ?? 0,
    heapUsed: raw.heapUsed ?? 0,
    heapTotal: raw.heapTotal ?? 0,
    threadCount: raw.threadCount ?? 0,
    bytesReceived: raw.bytesReceived ?? 0,
    bytesSent: raw.bytesSent ?? 0,
    uptime: raw.uptime ?? 0,
    lastHeartbeat: raw.lastHeartbeat ?? null,
    lastHealthCheck: raw.lastHealthCheck ?? null,
    lastSelected: raw.lastSelected ?? null,
    _raw: raw,
  };
}

/** Maps the full array from GET /admin/services, deriving stable ids. */
export function mapServicesList(rawList, prevById, dtSeconds) {
  return rawList.map((raw, i) => {
    const id = raw.id || raw.name || SERVICE_ID_FALLBACK_ORDER[i] || `service-${i + 1}`;
    const prev = prevById?.[id];
    return mapService(raw, id, prev, dtSeconds);
  });
}

export function formatDuration(ms) {
  if (!ms || ms <= 0) return "0s";
  const sec = Math.floor(ms / 1000);
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatEpoch(ms) {
  if (!ms) return "—";
  return new Date(ms).toLocaleTimeString("en-US", { hour12: false });
}

export function distributionToPercents(distribution = {}) {
  const entries = Object.entries(distribution);
  const total = entries.reduce((acc, [, v]) => acc + (v || 0), 0);
  if (total <= 0) return entries.map(([id]) => ({ id, count: 0, pct: 0 }));
  return entries.map(([id, count]) => ({ id, count, pct: Math.round((count / total) * 1000) / 10 }));
}
