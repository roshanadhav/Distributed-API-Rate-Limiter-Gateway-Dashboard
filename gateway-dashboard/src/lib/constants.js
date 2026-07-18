import {
  LayoutDashboard, Network, Waypoints, Boxes, Scale, Gauge, HeartPulse,
  ScrollText, Bell, Settings as SettingsIcon,
  CheckCircle2, AlertTriangle, XCircle, PowerOff, Server, Lock, ShieldAlert,
} from "lucide-react";

export const STATUS_META = {
  healthy: { color: "var(--success)", badge: "healthy", label: "Healthy", Icon: CheckCircle2 },
  warning: { color: "var(--warn)", badge: "warning", label: "Warning", Icon: AlertTriangle },
  down: { color: "var(--danger)", badge: "down", label: "Down", Icon: XCircle },
  disabled: { color: "var(--text-faint)", badge: "neutral", label: "Disabled", Icon: PowerOff },
};

// Maps a solid accent CSS-variable reference to its pre-defined soft/tinted
// background variant. Used instead of string-concatenating an alpha suffix
// onto a var() reference (e.g. `${tint}1F`), which produces an invalid CSS
// value like "var(--success)1F" that browsers silently ignore.
export const TINT_SOFT = {
  "var(--accent)": "var(--accent-soft)",
  "var(--accent-2)": "var(--accent-2-soft)",
  "var(--success)": "var(--success-soft)",
  "var(--warn)": "var(--warn-soft)",
  "var(--danger)": "var(--danger-soft)",
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
  { id: "settings", label: "Settings", path: "/settings", Icon: SettingsIcon },
];

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

// Static layout for the architecture diagram. `sub` is a fallback label —
// the Load Balancer / Rate Limiter nodes are re-labeled at render time with
// the *real* algorithm name once live data has loaded.
export const ARCH_STATIC_NODES = [
  { id: "client", label: "Client", sub: "Public internet", type: "client", x: 500, y: 40 },
  { id: "gateway", label: "API Gateway", sub: "MindEdix Gateway", type: "gateway", x: 500, y: 140 },
  { id: "healthchecker", label: "Health Checker", sub: "Liveness / readiness", type: "hub", x: 500, y: 240 },
  { id: "loadbalancer", label: "Load Balancer", sub: "…", type: "hub", x: 500, y: 340 },
  { id: "ratelimiter", label: "Rate Limiter", sub: "…", type: "hub", x: 500, y: 440 },
];

// x-position for each real service id in the topology diagram.
export const ARCH_SERVICE_X = {
  "user-service": 130,
  "user-service-2": 270,
  "user-service-3": 410,
  "auth-service": 610,
  "admin-1": 830,
};

export const NODE_PAGE_MAP = {
  gateway: "/gateway",
  healthchecker: "/healthchecker",
  loadbalancer: "/loadbalancer",
  ratelimiter: "/ratelimiter",
};
