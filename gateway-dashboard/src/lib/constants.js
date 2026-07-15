import {
  LayoutDashboard, Network, Waypoints, Boxes, Scale, Gauge, HeartPulse,
  ScrollText, Bell, Users as UsersIcon, Settings as SettingsIcon,
  CheckCircle2, AlertTriangle, XCircle, PowerOff, Server, Lock, ShieldAlert,
} from "lucide-react";

export const STATUS_META = {
  healthy: { color: "var(--success)", badge: "healthy", label: "Healthy", Icon: CheckCircle2 },
  warning: { color: "var(--warn)", badge: "warning", label: "Warning", Icon: AlertTriangle },
  down: { color: "var(--danger)", badge: "down", label: "Down", Icon: XCircle },
  disabled: { color: "var(--text-faint)", badge: "neutral", label: "Disabled", Icon: PowerOff },
};

export const GROUP_ICON = {
  "User Service": Server,
  "Auth Service": Lock,
  "Admin Service": ShieldAlert,
};

export const NAV_ITEMS = [
  { id: "overview", label: "Overview", path: "/overview", Icon: LayoutDashboard },
  { id: "architecture", label: "Architecture", path: "/architecture", Icon: Network },
  { id: "gateway", label: "Gateway", path: "/gateway", Icon: Waypoints },
  { id: "services", label: "Services", path: "/services", Icon: Boxes },
  { id: "loadbalancer", label: "Load Balancer", path: "/loadbalancer", Icon: Scale },
  { id: "ratelimiter", label: "Rate Limiter", path: "/ratelimiter", Icon: Gauge },
  { id: "healthchecker", label: "Health Checker", path: "/healthchecker", Icon: HeartPulse },
  { id: "logs", label: "Logs", path: "/logs", Icon: ScrollText },
  { id: "notifications", label: "Notifications", path: "/notifications", Icon: Bell },
  { id: "users", label: "Users", path: "/users", Icon: UsersIcon },
  { id: "settings", label: "Settings", path: "/settings", Icon: SettingsIcon },
];

export const PAGE_META = {
  overview: { title: "Overview", sub: "Executive summary of gateway health, traffic, and incidents." },
  architecture: { title: "Architecture", sub: "Live topology of the distributed gateway. Double-click a node to inspect it." },
  gateway: { title: "Gateway", sub: "Edge routing performance for api.gateway.internal" },
  services: { title: "Services", sub: "Manage backend service groups and their instances." },
  loadbalancer: { title: "Load Balancer", sub: "Traffic distribution engine and algorithm configuration." },
  ratelimiter: { title: "Rate Limiter", sub: "Request throttling engine and algorithm configuration." },
  healthchecker: { title: "Health Checker", sub: "Continuous liveness and readiness probing." },
  logs: { title: "Logs", sub: "Real-time structured log stream from the gateway fleet." },
  notifications: { title: "Notifications", sub: "Incidents, warnings, and informational alerts." },
  users: { title: "Users", sub: "Administrators and access roles for this gateway." },
  settings: { title: "Settings", sub: "Admin controls and system configuration." },
};

export const LB_ALGORITHMS = [
  { id: "round-robin", name: "Round Robin", useCase: "Uniform workloads with identically sized instances.", advantages: ["Simple to implement", "Predictable, even rotation", "No state to track"], disadvantages: ["Ignores real instance load", "Poor fit for uneven capacity"], performance: "Good", visual: "cycle" },
  { id: "weighted-round-robin", name: "Weighted Round Robin", useCase: "Instances with different capacity tiers.", advantages: ["Respects capacity differences", "Still simple to reason about"], disadvantages: ["Weights need manual tuning", "Not adaptive to live load"], performance: "Good", visual: "weighted" },
  { id: "least-connection", name: "Least Connection", useCase: "Long-lived or variable-duration connections.", advantages: ["Adapts to real-time load", "Avoids overloading busy nodes"], disadvantages: ["More overhead to track state", "Can thrash under bursts"], performance: "Excellent", visual: "leastconn" },
  { id: "least-response-time", name: "Least Response Time", useCase: "Latency-sensitive APIs.", advantages: ["Optimizes for user experience", "Reacts to slow instances"], disadvantages: ["Requires continuous latency sampling", "Sensitive to noisy measurements"], performance: "Excellent", visual: "latency" },
  { id: "random", name: "Random Allocation", useCase: "Large, homogeneous fleets.", advantages: ["Near-zero coordination cost", "Statistically balances at scale"], disadvantages: ["No load awareness", "Can be uneven with small fleets"], performance: "Moderate", visual: "random" },
  { id: "ip-hash", name: "IP Hash", useCase: "Session affinity without a session store.", advantages: ["Client sticks to one instance", "Good cache locality"], disadvantages: ["Uneven if client IPs cluster", "Rebalancing on scale is disruptive"], performance: "Good", visual: "hash" },
  { id: "consistent-hashing", name: "Consistent Hashing", useCase: "Cache-backed services that scale frequently.", advantages: ["Minimal remapping on scale events", "Good cache hit locality"], disadvantages: ["Higher conceptual complexity", "Needs virtual nodes for even spread"], performance: "Excellent", visual: "ring" },
];

export const RL_ALGORITHMS = [
  { id: "token-bucket", name: "Token Bucket", desc: "Tokens refill at a steady rate into a fixed-capacity bucket; each request consumes one or more tokens.", pro: "Allows controlled bursts while enforcing an average rate.", con: "Needs tuning of both bucket size and refill rate." },
  { id: "sliding-window", name: "Sliding Window", desc: "Counts requests in a rolling time window that slides continuously rather than resetting abruptly.", pro: "Smooths out boundary spikes seen in fixed windows.", con: "More expensive to compute precisely at scale." },
  { id: "fixed-window", name: "Fixed Window", desc: "Counts requests in discrete, non-overlapping time windows (e.g. per minute).", pro: "Cheap to implement and reason about.", con: "Allows bursts at window edges (2x rate at boundary)." },
  { id: "leaky-bucket", name: "Leaky Bucket", desc: "Requests queue into a bucket that leaks out at a constant rate, smoothing traffic.", pro: "Produces a perfectly smooth outbound rate.", con: "Queuing adds latency; bucket overflow drops requests." },
];

export const ARCH_STATIC_NODES = [
  { id: "client", label: "Client", sub: "Public internet", type: "client", x: 500, y: 40 },
  { id: "gateway", label: "API Gateway", sub: "api.gateway.internal", type: "gateway", x: 500, y: 140 },
  { id: "healthchecker", label: "Health Checker", sub: "Liveness / readiness", type: "hub", x: 500, y: 240 },
  { id: "loadbalancer", label: "Load Balancer", sub: "Round robin", type: "hub", x: 500, y: 340 },
  { id: "ratelimiter", label: "Rate Limiter", sub: "Token bucket", type: "hub", x: 500, y: 440 },
];

export const ARCH_SERVICE_X = {
  "user-service-1": 130,
  "user-service-2": 270,
  "user-service-3": 410,
  "auth-service-1": 560,
  "auth-service-2": 700,
  "admin-service-1": 860,
};

export const NODE_PAGE_MAP = {
  gateway: "/gateway",
  healthchecker: "/healthchecker",
  loadbalancer: "/loadbalancer",
  ratelimiter: "/ratelimiter",
};
