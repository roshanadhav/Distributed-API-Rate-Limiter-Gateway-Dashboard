import { fmtTime, uid } from "../lib/utils.js";

export const SERVICE_SEED = [
  { id: "user-service-1", group: "User Service", zone: "us-east-1a", version: "v2.4.1", cpu: 34, mem: 52, rps: 145, latency: 38, weight: 50 },
  { id: "user-service-2", group: "User Service", zone: "us-east-1b", version: "v2.4.1", cpu: 41, mem: 58, rps: 132, latency: 42, weight: 30 },
  { id: "user-service-3", group: "User Service", zone: "us-east-1c", version: "v2.4.0", cpu: 29, mem: 47, rps: 118, latency: 35, weight: 20 },
  { id: "auth-service-1", group: "Auth Service", zone: "us-east-1a", version: "v1.9.3", cpu: 22, mem: 39, rps: 89, latency: 28, weight: 60 },
  { id: "auth-service-2", group: "Auth Service", zone: "us-east-1b", version: "v1.9.3", cpu: 26, mem: 41, rps: 94, latency: 31, weight: 40 },
  { id: "admin-service-1", group: "Admin Service", zone: "us-east-1a", version: "v1.2.0", cpu: 48, mem: 61, rps: 12, latency: 65, weight: 100 },
].map((s) => ({ ...s, status: "healthy", lastCheck: new Date(), checks: 0, failures: 0 }));

export function seedMetrics() {
  const now = Date.now();
  return Array.from({ length: 24 }, (_, i) => ({
    t: now - (23 - i) * 2000,
    time: fmtTime(new Date(now - (23 - i) * 2000)),
    rps: Math.floor(Math.random() * 500) + 2400,
    latency: Math.floor(Math.random() * 20) + 38,
    errors: Math.floor(Math.random() * 8),
    limited: Math.floor(Math.random() * 50) + 10,
  }));
}

export function seedLogs() {
  const base = Date.now();
  const items = [
    ["INFO", "Gateway routed request to user-service-2", "user-service-2"],
    ["SUCCESS", "Health check passed for auth-service-1 (24ms)", "auth-service-1"],
    ["INFO", "Rate limiter allowed request from client 182.44.9.201", "gateway"],
    ["WARNING", "admin-service-1 latency exceeded threshold (81ms)", "admin-service-1"],
    ["INFO", "Load balancer dispatched request via round robin", "gateway"],
    ["ERROR", "user-service-3 health check failed", "user-service-3"],
    ["SUCCESS", "user-service-3 recovered and rejoined the pool", "user-service-3"],
    ["INFO", "New deployment detected for user-service-1 (v2.4.1)", "user-service-1"],
  ];
  return items.map((it, i) => ({
    id: uid(),
    time: fmtTime(new Date(base - (items.length - i) * 9000)),
    level: it[0],
    message: it[1],
    service: it[2],
  }));
}

export function seedHealthEvents() {
  const base = Date.now();
  const items = [
    ["user-service-2", "Failed", "user-service-2 failed health check"],
    ["user-service-2", "Removed", "user-service-2 removed from load balancer"],
    ["user-service-2", "Recovered", "user-service-2 recovered, back in rotation"],
    ["admin-service-1", "Degraded", "admin-service-1 response time degraded, marked WARNING"],
  ];
  return items.map((it, i) => ({
    id: uid(),
    time: fmtTime(new Date(base - (items.length - i) * 60000)),
    service: it[0],
    event: it[1],
    message: it[2],
  }));
}

export function seedNotifications() {
  const base = Date.now();
  return [
    { id: uid(), severity: "warning", title: "admin-service-1 latency elevated", message: "p95 latency crossed 80ms for 3 consecutive checks.", time: fmtTime(new Date(base - 240000)), read: true },
    { id: uid(), severity: "info", title: "Deployment completed", message: "user-service-1 updated to v2.4.1 across all zones.", time: fmtTime(new Date(base - 600000)), read: true },
    { id: uid(), severity: "critical", title: "user-service-2 was down for 42s", message: "Traffic automatically shifted. Email sent to architecture-team@example.com.", time: fmtTime(new Date(base - 900000)), read: true },
  ];
}

export function seedIncidents() {
  const base = Date.now();
  return [
    { id: uid(), time: new Date(base - 3600_000), service: "user-service-2", title: "user-service-2 became unhealthy", status: "resolved" },
    { id: uid(), time: new Date(base - 9000_000), service: "admin-service-1", title: "admin-service-1 latency spike", status: "resolved" },
  ];
}

export const USER_SEED = [
  { name: "Roshan Adhav", email: "roshanadhav02@gmail.com", role: "Platform Admin", status: "active", lastActive: "Active now" },
  { name: "Priya Nandan", email: "priya.nandan@apexgw.io", role: "SRE", status: "active", lastActive: "12 min ago" },
  { name: "Marcus Webb", email: "marcus.webb@apexgw.io", role: "SRE", status: "active", lastActive: "1 hr ago" },
  { name: "Elena Cho", email: "elena.cho@apexgw.io", role: "Read Only", status: "active", lastActive: "3 hr ago" },
  { name: "Diego Fuentes", email: "diego.fuentes@apexgw.io", role: "Read Only", status: "suspended", lastActive: "6 days ago" },
];
