import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard, Network, Waypoints, Boxes, Scale, Gauge, HeartPulse,
  ScrollText, Bell, Users as UsersIcon, Settings as SettingsIcon, Search,
  ChevronLeft, ChevronRight, ChevronDown, CheckCircle2, AlertTriangle,
  XCircle, Activity, RefreshCw, Power, PowerOff, Zap, ArrowRight, X,
  Clock, Cpu, MoreVertical, Play, Filter, ZoomIn, ZoomOut, Maximize2,
  Server, ShieldAlert, Mail, TrendingUp, TrendingDown, Radio, Database,
  GitBranch, Layers, ArrowDownToLine, ArrowUpFromLine, CircleDot, Lock,
  RotateCcw, Wifi, MapPin, Hash, Timer, PauseCircle, ExternalLink,
} from "lucide-react";

/* ============================================================================
   GLOBAL STYLES — token system
   Palette: graphite / deep-navy engineering surface with a signal-teal
   accent (network / telemetry motif). IBM Plex pairing for an authentic
   engineering-tool feel (UI sans + data mono).
============================================================================ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

    .gw-root {
      --bg: #0A0D13;
      --bg-alt: #0D111A;
      --surface: #12161F;
      --surface-2: #161B26;
      --elevated: #1B212E;
      --border: #232A38;
      --border-soft: #1A2029;
      --text: #E7EAF1;
      --text-dim: #8B93A8;
      --text-faint: #565F73;
      --accent: #2FD8CA;
      --accent-strong: #14C4B4;
      --accent-soft: rgba(47,216,202,0.12);
      --accent-2: #7C8CF8;
      --accent-2-soft: rgba(124,140,248,0.12);
      --warn: #F2A93B;
      --warn-soft: rgba(242,169,59,0.13);
      --danger: #F1515B;
      --danger-soft: rgba(241,81,91,0.13);
      --success: #34D399;
      --success-soft: rgba(52,211,153,0.13);
      --font-ui: 'IBM Plex Sans', -apple-system, ui-sans-serif, system-ui, sans-serif;
      --font-mono: 'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace;
      --shadow-card: 0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.5);
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-ui);
      min-height: 100vh;
      width: 100%;
      position: relative;
    }
    .gw-root.light {
      --bg: #F3F4F7;
      --bg-alt: #ECEEF2;
      --surface: #FFFFFF;
      --surface-2: #FAFBFC;
      --elevated: #FFFFFF;
      --border: #E1E4EA;
      --border-soft: #EAEDF1;
      --text: #12151C;
      --text-dim: #5B6478;
      --text-faint: #9399AA;
      --accent: #0E9C90;
      --accent-strong: #0B8A80;
      --accent-soft: rgba(14,156,144,0.10);
      --accent-2: #5B63E0;
      --accent-2-soft: rgba(91,99,224,0.10);
      --warn: #B87309;
      --warn-soft: rgba(184,115,9,0.10);
      --danger: #D2333F;
      --danger-soft: rgba(210,51,63,0.10);
      --success: #159165;
      --success-soft: rgba(21,145,101,0.10);
      --shadow-card: 0 1px 2px rgba(20,25,35,0.06), 0 8px 20px -14px rgba(20,25,35,0.15);
    }
    .gw-root * { box-sizing: border-box; }
    .gw-root ::-webkit-scrollbar { width: 8px; height: 8px; }
    .gw-root ::-webkit-scrollbar-track { background: transparent; }
    .gw-root ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 8px; }
    .gw-root ::-webkit-scrollbar-thumb:hover { background: var(--text-faint); }
    .gw-mono { font-family: var(--font-mono); }
    .gw-shell { display: flex; min-height: 100vh; }

    /* ---------- Sidebar ---------- */
    .gw-sidebar {
      background: var(--bg-alt);
      border-right: 1px solid var(--border-soft);
      display: flex; flex-direction: column;
      flex-shrink: 0; height: 100vh; position: sticky; top: 0;
      transition: width 0.22s cubic-bezier(.4,0,.2,1);
      overflow: hidden;
      z-index: 40;
    }
    .gw-sidebar-logo {
      display: flex; align-items: center; gap: 10px;
      padding: 18px 16px; border-bottom: 1px solid var(--border-soft);
      min-height: 60px;
    }
    .gw-logo-mark {
      width: 30px; height: 30px; border-radius: 8px;
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; color: #061012; font-weight: 700; font-size: 13px;
      font-family: var(--font-mono);
    }
    .gw-logo-text { font-weight: 600; font-size: 14.5px; letter-spacing: 0.2px; white-space: nowrap; }
    .gw-logo-sub { font-size: 10.5px; color: var(--text-faint); white-space: nowrap; font-family: var(--font-mono); letter-spacing: 0.5px; }
    .gw-nav { flex: 1; padding: 10px 10px; overflow-y: auto; }
    .gw-nav-item {
      display: flex; align-items: center; gap: 11px;
      padding: 9px 11px; border-radius: 8px; cursor: pointer;
      color: var(--text-dim); font-size: 13.3px; font-weight: 500;
      margin-bottom: 2px; position: relative; white-space: nowrap;
      transition: background 0.15s, color 0.15s;
      border: 1px solid transparent;
    }
    .gw-nav-item:hover { background: var(--surface-2); color: var(--text); }
    .gw-nav-item.active {
      background: var(--accent-soft); color: var(--accent);
      border-color: rgba(47,216,202,0.18);
    }
    .gw-nav-item.active svg { color: var(--accent); }
    .gw-nav-item svg { flex-shrink: 0; }
    .gw-nav-label { opacity: 1; transition: opacity 0.15s; }
    .gw-sidebar.collapsed .gw-nav-label,
    .gw-sidebar.collapsed .gw-logo-text,
    .gw-sidebar.collapsed .gw-logo-sub { display: none; }
    .gw-sidebar.collapsed .gw-nav-item { justify-content: center; }
    .gw-sidebar-foot { padding: 10px; border-top: 1px solid var(--border-soft); }
    .gw-collapse-btn {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      width: 100%; padding: 8px; border-radius: 8px; cursor: pointer;
      color: var(--text-faint); background: transparent; border: 1px solid var(--border-soft);
      transition: all 0.15s; font-size: 12px;
    }
    .gw-collapse-btn:hover { background: var(--surface-2); color: var(--text-dim); }

    /* ---------- Topbar ---------- */
    .gw-topbar {
      height: 60px; border-bottom: 1px solid var(--border-soft);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 20px; background: var(--bg); position: sticky; top: 0; z-index: 30;
      gap: 16px; backdrop-filter: blur(6px);
    }
    .gw-topbar-left { display: flex; align-items: center; gap: 18px; min-width: 0; flex: 1; }
    .gw-topbar-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
    .gw-status-pill {
      display: flex; align-items: center; gap: 7px; padding: 6px 11px;
      border-radius: 20px; background: var(--success-soft); border: 1px solid rgba(52,211,153,0.25);
      font-size: 12px; font-weight: 600; color: var(--success); white-space: nowrap;
    }
    .gw-live-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; position: relative; }
    .gw-live-dot::after {
      content: ''; position: absolute; inset: -4px; border-radius: 50%;
      background: currentColor; opacity: 0.35; animation: gw-pulse 1.8s ease-out infinite;
    }
    @keyframes gw-pulse { 0% { transform: scale(0.6); opacity: 0.5; } 100% { transform: scale(2.4); opacity: 0; } }
    .gw-topbar-metric { display: flex; flex-direction: column; gap: 1px; white-space: nowrap; }
    .gw-topbar-metric .val { font-family: var(--font-mono); font-size: 13.5px; font-weight: 600; color: var(--text); }
    .gw-topbar-metric .lbl { font-size: 10.5px; color: var(--text-faint); letter-spacing: 0.3px; text-transform: uppercase; }
    .gw-search {
      display: flex; align-items: center; gap: 8px; background: var(--surface);
      border: 1px solid var(--border); border-radius: 8px; padding: 7px 11px;
      color: var(--text-faint); font-size: 12.5px; width: 220px; flex-shrink: 1; min-width: 0;
    }
    .gw-search input { background: transparent; border: none; outline: none; color: var(--text); font-size: 12.5px; width: 100%; font-family: var(--font-ui); }
    .gw-search input::placeholder { color: var(--text-faint); }
    .gw-icon-btn {
      width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
      background: var(--surface); border: 1px solid var(--border); color: var(--text-dim); cursor: pointer;
      position: relative; transition: all 0.15s; flex-shrink: 0;
    }
    .gw-icon-btn:hover { color: var(--text); border-color: var(--text-faint); }
    .gw-badge-dot {
      position: absolute; top: -3px; right: -3px; min-width: 15px; height: 15px; padding: 0 3px;
      border-radius: 8px; background: var(--danger); color: white; font-size: 9.5px; font-weight: 700;
      display: flex; align-items: center; justify-content: center; border: 2px solid var(--bg);
    }
    .gw-profile { display: flex; align-items: center; gap: 8px; padding: 5px 10px 5px 5px; border-radius: 20px; background: var(--surface); border: 1px solid var(--border); cursor: pointer; }
    .gw-avatar { width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-2), var(--accent)); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #06070d; }
    .gw-profile-name { font-size: 12.5px; font-weight: 600; }
    .gw-profile-role { font-size: 10px; color: var(--text-faint); }

    /* ---------- Page frame ---------- */
    .gw-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .gw-page { padding: 22px 26px 60px; }
    .gw-page-head { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 20px; gap: 16px; flex-wrap: wrap; }
    .gw-page-title { font-size: 20px; font-weight: 700; letter-spacing: -0.2px; }
    .gw-page-sub { font-size: 12.8px; color: var(--text-dim); margin-top: 4px; }
    .gw-eyebrow { font-size: 11px; letter-spacing: 1.2px; text-transform: uppercase; color: var(--accent); font-weight: 600; font-family: var(--font-mono); margin-bottom: 4px; }

    /* ---------- Generic building blocks ---------- */
    .gw-card {
      background: var(--surface); border: 1px solid var(--border-soft); border-radius: 12px;
      box-shadow: var(--shadow-card);
    }
    .gw-card-pad { padding: 16px 18px; }
    .gw-grid { display: grid; gap: 14px; }
    .gw-btn {
      display: inline-flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 600;
      padding: 8px 14px; border-radius: 8px; cursor: pointer; border: 1px solid var(--border);
      background: var(--surface-2); color: var(--text); transition: all 0.15s; white-space: nowrap;
    }
    .gw-btn:hover { border-color: var(--text-faint); }
    .gw-btn.primary { background: var(--accent); border-color: var(--accent); color: #052321; }
    .gw-btn.primary:hover { background: var(--accent-strong); }
    .gw-btn.danger { background: var(--danger-soft); border-color: rgba(241,81,91,0.3); color: var(--danger); }
    .gw-btn.warn { background: var(--warn-soft); border-color: rgba(242,169,59,0.3); color: var(--warn); }
    .gw-btn.ghost { background: transparent; border-color: var(--border); }
    .gw-btn.sm { padding: 5px 10px; font-size: 11.5px; }
    .gw-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    .gw-badge {
      display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600;
      padding: 3px 9px; border-radius: 20px; font-family: var(--font-mono); letter-spacing: 0.2px;
    }
    .gw-badge.healthy { background: var(--success-soft); color: var(--success); }
    .gw-badge.warning { background: var(--warn-soft); color: var(--warn); }
    .gw-badge.down { background: var(--danger-soft); color: var(--danger); }
    .gw-badge.info { background: var(--accent-2-soft); color: var(--accent-2); }
    .gw-badge.neutral { background: var(--surface-2); color: var(--text-dim); border: 1px solid var(--border); }

    .gw-statcard { padding: 16px 18px; display: flex; flex-direction: column; gap: 8px; }
    .gw-statcard .top { display: flex; align-items: center; justify-content: space-between; }
    .gw-statcard .icon-wrap { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .gw-statcard .label { font-size: 11.5px; color: var(--text-dim); font-weight: 500; }
    .gw-statcard .value { font-family: var(--font-mono); font-size: 24px; font-weight: 600; letter-spacing: -0.5px; }
    .gw-statcard .delta { font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 3px; font-family: var(--font-mono); }
    .gw-statcard .delta.up { color: var(--success); }
    .gw-statcard .delta.down { color: var(--danger); }

    .gw-divider { height: 1px; background: var(--border-soft); border: none; margin: 0; }
    .gw-scrollbox { overflow-y: auto; }
    .gw-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--border-soft); }
    .gw-tab {
      padding: 9px 15px; font-size: 12.8px; font-weight: 600; color: var(--text-dim); cursor: pointer;
      border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.15s; white-space: nowrap;
    }
    .gw-tab:hover { color: var(--text); }
    .gw-tab.active { color: var(--accent); border-color: var(--accent); }

    .gw-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
    .gw-table th { text-align: left; padding: 9px 12px; color: var(--text-faint); font-weight: 600; font-size: 10.8px; letter-spacing: 0.4px; text-transform: uppercase; border-bottom: 1px solid var(--border-soft); }
    .gw-table td { padding: 10px 12px; border-bottom: 1px solid var(--border-soft); color: var(--text); }
    .gw-table tr:last-child td { border-bottom: none; }
    .gw-table tr:hover td { background: var(--surface-2); }

    .gw-modal-overlay { position: fixed; inset: 0; background: rgba(4,6,10,0.65); backdrop-filter: blur(3px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .gw-modal { background: var(--elevated); border: 1px solid var(--border); border-radius: 14px; width: 100%; max-width: 480px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
    .gw-modal-lg { max-width: 820px; }
    .gw-modal-head { padding: 18px 20px; border-bottom: 1px solid var(--border-soft); display: flex; align-items: center; justify-content: space-between; }
    .gw-modal-body { padding: 20px; }
    .gw-modal-foot { padding: 14px 20px; border-top: 1px solid var(--border-soft); display: flex; justify-content: flex-end; gap: 8px; }

    .gw-progress-track { height: 7px; border-radius: 6px; background: var(--surface-2); border: 1px solid var(--border-soft); overflow: hidden; }
    .gw-progress-fill { height: 100%; border-radius: 6px; transition: width 0.5s cubic-bezier(.4,0,.2,1); }

    .gw-timeline-item { display: flex; gap: 12px; position: relative; padding-bottom: 18px; }
    .gw-timeline-item:last-child { padding-bottom: 0; }
    .gw-timeline-line { position: absolute; left: 5px; top: 16px; bottom: -2px; width: 1px; background: var(--border); }
    .gw-timeline-item:last-child .gw-timeline-line { display: none; }
    .gw-timeline-dot { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; margin-top: 3px; border: 2px solid var(--bg); box-shadow: 0 0 0 1px var(--border); z-index: 1; }

    .gw-log-row { display: grid; grid-template-columns: 92px 76px 120px 1fr; gap: 12px; padding: 5px 10px; font-family: var(--font-mono); font-size: 12px; border-radius: 4px; align-items: center; }
    .gw-log-row:hover { background: var(--surface-2); }
    .gw-log-level { font-weight: 700; letter-spacing: 0.4px; font-size: 10.5px; }

    .gw-node {
      cursor: pointer; user-select: none;
    }
    .gw-flow-dash {
      stroke-dasharray: 5 5;
      animation: gw-dash 1s linear infinite;
    }
    @keyframes gw-dash { to { stroke-dashoffset: -20; } }

    .gw-skeleton { background: linear-gradient(90deg, var(--surface-2) 25%, var(--elevated) 37%, var(--surface-2) 63%); background-size: 400% 100%; animation: gw-shimmer 1.4s ease infinite; border-radius: 6px; }
    @keyframes gw-shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }

    .gw-scrollbox::-webkit-scrollbar { width: 6px; }

    @media (max-width: 980px) {
      .gw-sidebar { position: fixed; left: 0; z-index: 200; }
    }
  `}</style>
);

/* ============================================================================
   UTILITIES
============================================================================ */
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const fmtNum = (n) => n.toLocaleString("en-US");
const fmtTime = (d) => d.toLocaleTimeString("en-US", { hour12: false });
const fmtCompact = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(Math.round(n));
};
const uid = () => Math.random().toString(36).slice(2, 10);

const STATUS_META = {
  healthy: { color: "var(--success)", badge: "healthy", label: "Healthy", Icon: CheckCircle2 },
  warning: { color: "var(--warn)", badge: "warning", label: "Warning", Icon: AlertTriangle },
  down: { color: "var(--danger)", badge: "down", label: "Down", Icon: XCircle },
  disabled: { color: "var(--text-faint)", badge: "neutral", label: "Disabled", Icon: PowerOff },
};


/* ============================================================================
   MOCK DATA ENGINE
============================================================================ */
const SERVICE_SEED = [
  { id: "user-service-1", group: "User Service", zone: "us-east-1a", version: "v2.4.1", cpu: 34, mem: 52, rps: 145, latency: 38, weight: 50 },
  { id: "user-service-2", group: "User Service", zone: "us-east-1b", version: "v2.4.1", cpu: 41, mem: 58, rps: 132, latency: 42, weight: 30 },
  { id: "user-service-3", group: "User Service", zone: "us-east-1c", version: "v2.4.0", cpu: 29, mem: 47, rps: 118, latency: 35, weight: 20 },
  { id: "auth-service-1", group: "Auth Service", zone: "us-east-1a", version: "v1.9.3", cpu: 22, mem: 39, rps: 89, latency: 28, weight: 60 },
  { id: "auth-service-2", group: "Auth Service", zone: "us-east-1b", version: "v1.9.3", cpu: 26, mem: 41, rps: 94, latency: 31, weight: 40 },
  { id: "admin-service-1", group: "Admin Service", zone: "us-east-1a", version: "v1.2.0", cpu: 48, mem: 61, rps: 12, latency: 65, weight: 100 },
].map((s) => ({ ...s, status: "healthy", lastCheck: new Date(), checks: 0, failures: 0 }));

const GROUP_ICON = { "User Service": Server, "Auth Service": Lock, "Admin Service": ShieldAlert };

const LB_ALGORITHMS = [
  { id: "round-robin", name: "Round Robin", useCase: "Uniform workloads with identically sized instances.", advantages: ["Simple to implement", "Predictable, even rotation", "No state to track"], disadvantages: ["Ignores real instance load", "Poor fit for uneven capacity"], performance: "Good", visual: "cycle" },
  { id: "weighted-round-robin", name: "Weighted Round Robin", useCase: "Instances with different capacity tiers.", advantages: ["Respects capacity differences", "Still simple to reason about"], disadvantages: ["Weights need manual tuning", "Not adaptive to live load"], performance: "Good", visual: "weighted" },
  { id: "least-connection", name: "Least Connection", useCase: "Long-lived or variable-duration connections.", advantages: ["Adapts to real-time load", "Avoids overloading busy nodes"], disadvantages: ["More overhead to track state", "Can thrash under bursts"], performance: "Excellent", visual: "leastconn" },
  { id: "least-response-time", name: "Least Response Time", useCase: "Latency-sensitive APIs.", advantages: ["Optimizes for user experience", "Reacts to slow instances"], disadvantages: ["Requires continuous latency sampling", "Sensitive to noisy measurements"], performance: "Excellent", visual: "latency" },
  { id: "random", name: "Random Allocation", useCase: "Large, homogeneous fleets.", advantages: ["Near-zero coordination cost", "Statistically balances at scale"], disadvantages: ["No load awareness", "Can be uneven with small fleets"], performance: "Moderate", visual: "random" },
  { id: "ip-hash", name: "IP Hash", useCase: "Session affinity without a session store.", advantages: ["Client sticks to one instance", "Good cache locality"], disadvantages: ["Uneven if client IPs cluster", "Rebalancing on scale is disruptive"], performance: "Good", visual: "hash" },
  { id: "consistent-hashing", name: "Consistent Hashing", useCase: "Cache-backed services that scale frequently.", advantages: ["Minimal remapping on scale events", "Good cache hit locality"], disadvantages: ["Higher conceptual complexity", "Needs virtual nodes for even spread"], performance: "Excellent", visual: "ring" },
];

const RL_ALGORITHMS = [
  { id: "token-bucket", name: "Token Bucket", desc: "Tokens refill at a steady rate into a fixed-capacity bucket; each request consumes one or more tokens.", pro: "Allows controlled bursts while enforcing an average rate.", con: "Needs tuning of both bucket size and refill rate." },
  { id: "sliding-window", name: "Sliding Window", desc: "Counts requests in a rolling time window that slides continuously rather than resetting abruptly.", pro: "Smooths out boundary spikes seen in fixed windows.", con: "More expensive to compute precisely at scale." },
  { id: "fixed-window", name: "Fixed Window", desc: "Counts requests in discrete, non-overlapping time windows (e.g. per minute).", pro: "Cheap to implement and reason about.", con: "Allows bursts at window edges (2x rate at boundary)." },
  { id: "leaky-bucket", name: "Leaky Bucket", desc: "Requests queue into a bucket that leaks out at a constant rate, smoothing traffic.", pro: "Produces a perfectly smooth outbound rate.", con: "Queuing adds latency; bucket overflow drops requests." },
];

function useMockEngine() {
  const [services, setServices] = useState(SERVICE_SEED);
  const [metrics, setMetrics] = useState(() => {
    const now = Date.now();
    return Array.from({ length: 24 }, (_, i) => ({
      t: now - (23 - i) * 2000,
      time: fmtTime(new Date(now - (23 - i) * 2000)),
      rps: randInt(2400, 2900),
      latency: randInt(38, 58),
      errors: randInt(0, 8),
      limited: randInt(10, 60),
    }));
  });
  const [logs, setLogs] = useState(() => seedLogs());
  const [notifications, setNotifications] = useState(() => seedNotifications());
  const [healthEvents, setHealthEvents] = useState(() => seedHealthEvents());
  const [lbAlgorithm, setLbAlgorithm] = useState("round-robin");
  const [rlAlgorithm, setRlAlgorithm] = useState("token-bucket");
  const [bucket, setBucket] = useState({ tokens: 72, capacity: 100, refillRate: 6, allowed: 48210, blocked: 892 });
  const [totals, setTotals] = useState({ totalRequests: 18_452_310, uptime: 99.982 });
  const [incidents, setIncidents] = useState(() => seedIncidents());
  const tickRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;
      const now = new Date();

      // metrics history
      setMetrics((prev) => {
        const last = prev[prev.length - 1];
        const anyDown = services.some((s) => s.status === "down");
        const point = {
          t: now.getTime(),
          time: fmtTime(now),
          rps: clamp(Math.round(last.rps + rand(-140, 160)), 1800, 3400),
          latency: clamp(Math.round(last.latency + rand(-4, anyDown ? 10 : 4)), 24, anyDown ? 180 : 75),
          errors: clamp(Math.round(last.errors + rand(-2, anyDown ? 8 : 2)), 0, anyDown ? 60 : 14),
          limited: clamp(Math.round(last.limited + rand(-10, 12)), 0, 140),
        };
        return [...prev.slice(1), point];
      });

      // total requests / uptime ticking
      setTotals((prev) => ({
        totalRequests: prev.totalRequests + randInt(1800, 2600),
        uptime: clamp(prev.uptime + rand(-0.001, 0.0006), 99.83, 99.995),
      }));

      // token bucket simulation
      setBucket((prev) => {
        const incoming = randInt(4, 14);
        let tokens = clamp(prev.tokens + prev.refillRate - incoming * rand(0.6, 1.1), 0, prev.capacity);
        const blocked = tokens <= 0.5 ? randInt(1, 5) : 0;
        const allowedNow = Math.max(0, incoming - blocked);
        return {
          ...prev,
          tokens,
          allowed: prev.allowed + allowedNow,
          blocked: prev.blocked + blocked,
        };
      });

      // occasionally mutate a service (jitter + rare incident)
      setServices((prev) => {
        let next = prev.map((s) => ({
          ...s,
          cpu: clamp(Math.round(s.cpu + rand(-4, 4)), 8, 96),
          mem: clamp(Math.round(s.mem + rand(-3, 3)), 15, 92),
          rps: clamp(Math.round(s.rps + rand(-14, 14)), 4, 240),
          latency: clamp(Math.round(s.latency + rand(-3, 3)), 18, 320),
        }));

        const roll = Math.random();
        if (roll < 0.045) {
          const healthyIdx = next.map((s, i) => (s.status === "healthy" ? i : -1)).filter((i) => i >= 0);
          if (healthyIdx.length) {
            const idx = healthyIdx[randInt(0, healthyIdx.length - 1)];
            const svc = next[idx];
            next[idx] = { ...svc, status: "warning", latency: svc.latency + 60 };
            pushLog(setLogs, "WARNING", `${svc.id} latency exceeded threshold (${svc.latency + 60}ms)`, svc.id);
            pushHealthEvent(setHealthEvents, svc.id, "Degraded", `${svc.id} response time degraded, marked WARNING`);
          }
        } else if (roll < 0.06) {
          const warnIdx = next.map((s, i) => (s.status === "warning" ? i : -1)).filter((i) => i >= 0);
          if (warnIdx.length) {
            const idx = warnIdx[randInt(0, warnIdx.length - 1)];
            const svc = next[idx];
            next[idx] = { ...svc, status: "down" };
            pushLog(setLogs, "ERROR", `${svc.id} health check failed — removed from load balancer`, svc.id);
            pushHealthEvent(setHealthEvents, svc.id, "Failed", `${svc.id} failed health check, removed from rotation`);
            pushNotification(setNotifications, "critical", `${svc.id} is down`, `Traffic automatically shifted to healthy instances in ${svc.group}.`);
            setIncidents((p) => [{ id: uid(), time: now, service: svc.id, title: `${svc.id} became unhealthy`, status: "investigating" }, ...p].slice(0, 8));
          }
        } else if (roll < 0.11) {
          const badIdx = next.map((s, i) => (s.status !== "healthy" ? i : -1)).filter((i) => i >= 0);
          if (badIdx.length) {
            const idx = badIdx[randInt(0, badIdx.length - 1)];
            const svc = next[idx];
            const wasDown = svc.status === "down";
            next[idx] = { ...svc, status: "healthy", latency: clamp(svc.latency - 50, 24, 60) };
            pushLog(setLogs, "SUCCESS", `${svc.id} recovered and rejoined the pool`, svc.id);
            pushHealthEvent(setHealthEvents, svc.id, "Recovered", `${svc.id} passed health check, back in rotation`);
            if (wasDown) {
              pushNotification(setNotifications, "info", `${svc.id} recovered`, `Service is healthy again and receiving traffic.`);
              setIncidents((p) => p.map((inc) => (inc.service === svc.id && inc.status !== "resolved" ? { ...inc, status: "resolved" } : inc)));
            }
          }
        }

        // routine info log
        if (Math.random() < 0.7) {
          const svc = next[randInt(0, next.length - 1)];
          const msgs = [
            `Gateway routed request to ${svc.id}`,
            `Health check passed for ${svc.id} (${randInt(8, 40)}ms)`,
            `Rate limiter allowed request from client ${randInt(100, 250)}.x.x.${randInt(2, 250)}`,
            `Load balancer dispatched request via ${lbAlgorithm.replace(/-/g, " ")}`,
          ];
          pushLog(setLogs, "INFO", msgs[randInt(0, msgs.length - 1)], svc.id);
        }
        return next;
      });
    }, 2200);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lbAlgorithm]);

  return {
    services, setServices,
    metrics, logs, setLogs,
    notifications, setNotifications,
    healthEvents,
    lbAlgorithm, setLbAlgorithm,
    rlAlgorithm, setRlAlgorithm,
    bucket, totals, incidents,
  };
}

function seedLogs() {
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
  return items.map((it, i) => ({ id: uid(), time: fmtTime(new Date(base - (items.length - i) * 9000)), level: it[0], message: it[1], service: it[2] }));
}
function pushLog(setLogs, level, message, service) {
  setLogs((prev) => [...prev.slice(-160), { id: uid(), time: fmtTime(new Date()), level, message, service }]);
}
function seedHealthEvents() {
  const base = Date.now();
  const items = [
    ["user-service-2", "Failed", "user-service-2 failed health check"],
    ["user-service-2", "Removed", "user-service-2 removed from load balancer"],
    ["user-service-2", "Recovered", "user-service-2 recovered, back in rotation"],
    ["admin-service-1", "Degraded", "admin-service-1 response time degraded, marked WARNING"],
  ];
  return items.map((it, i) => ({ id: uid(), time: fmtTime(new Date(base - (items.length - i) * 60000)), service: it[0], event: it[1], message: it[2] }));
}
function pushHealthEvent(setHealthEvents, service, event, message) {
  setHealthEvents((prev) => [{ id: uid(), time: fmtTime(new Date()), service, event, message }, ...prev].slice(0, 60));
}
function seedNotifications() {
  const base = Date.now();
  return [
    { id: uid(), severity: "warning", title: "admin-service-1 latency elevated", message: "p95 latency crossed 80ms for 3 consecutive checks.", time: fmtTime(new Date(base - 240000)), read: true },
    { id: uid(), severity: "info", title: "Deployment completed", message: "user-service-1 updated to v2.4.1 across all zones.", time: fmtTime(new Date(base - 600000)), read: true },
    { id: uid(), severity: "critical", title: "user-service-2 was down for 42s", message: "Traffic automatically shifted. Email sent to architecture-team@example.com.", time: fmtTime(new Date(base - 900000)), read: true },
  ];
}
function pushNotification(setNotifications, severity, title, message) {
  setNotifications((prev) => [{ id: uid(), severity, title, message, time: fmtTime(new Date()), read: false }, ...prev].slice(0, 40));
}
function seedIncidents() {
  const base = Date.now();
  return [
    { id: uid(), time: new Date(base - 3600_000), service: "user-service-2", title: "user-service-2 became unhealthy", status: "resolved" },
    { id: uid(), time: new Date(base - 9000_000), service: "admin-service-1", title: "admin-service-1 latency spike", status: "resolved" },
  ];
}

/* ============================================================================
   REUSABLE ATOMS
============================================================================ */
const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] || STATUS_META.healthy;
  const Icon = meta.Icon;
  return (
    <span className={`gw-badge ${meta.badge}`}>
      <Icon size={11} />
      {meta.label}
    </span>
  );
};

const LiveDot = ({ color = "var(--success)" }) => (
  <span className="gw-live-dot" style={{ color }} />
);

const ProgressBar = ({ value, max = 100, color = "var(--accent)" }) => (
  <div className="gw-progress-track">
    <div className="gw-progress-fill" style={{ width: `${clamp((value / max) * 100, 0, 100)}%`, background: color }} />
  </div>
);

const StatCard = ({ icon: Icon, label, value, unit, delta, deltaDir, tint = "var(--accent)" }) => (
  <motion.div
    className="gw-card gw-statcard"
    whileHover={{ y: -2, borderColor: "var(--text-faint)" }}
    transition={{ duration: 0.15 }}
  >
    <div className="top">
      <span className="label">{label}</span>
      <span className="icon-wrap" style={{ background: `${tint}1F`, color: tint }}>
        <Icon size={15} />
      </span>
    </div>
    <div className="value">
      {value}
      {unit && <span style={{ fontSize: 13, color: "var(--text-faint)", marginLeft: 4 }}>{unit}</span>}
    </div>
    {delta && (
      <span className={`delta ${deltaDir}`}>
        {deltaDir === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {delta}
      </span>
    )}
  </motion.div>
);

const SectionCard = ({ title, eyebrow, right, children, style }) => (
  <div className="gw-card gw-card-pad" style={style}>
    {(title || right) && (
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, gap: 10, flexWrap: "wrap" }}>
        <div>
          {eyebrow && <div className="gw-eyebrow">{eyebrow}</div>}
          {title && <div style={{ fontSize: 14, fontWeight: 700 }}>{title}</div>}
        </div>
        {right}
      </div>
    )}
    {children}
  </div>
);

const Modal = ({ open, onClose, title, children, footer, large }) => (
  <AnimatePresence>
    {open && (
      <motion.div className="gw-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div
          className={`gw-modal ${large ? "gw-modal-lg" : ""}`}
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 6 }}
          transition={{ duration: 0.16 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="gw-modal-head">
            <div style={{ fontSize: 14.5, fontWeight: 700 }}>{title}</div>
            <div className="gw-icon-btn" onClick={onClose}><X size={16} /></div>
          </div>
          <div className="gw-modal-body">{children}</div>
          {footer && <div className="gw-modal-foot">{footer}</div>}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const MiniSparkArea = ({ data, dataKey, color }) => (
  <ResponsiveContainer width="100%" height={44}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id={`spark-${dataKey}-${color.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.6} fill={`url(#spark-${dataKey}-${color.replace(/[^a-z0-9]/gi, "")})`} isAnimationActive={false} />
    </AreaChart>
  </ResponsiveContainer>
);

const ChartTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: "var(--elevated)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 11px", fontSize: 11.5, fontFamily: "var(--font-mono)" }}>
      <div style={{ color: "var(--text-faint)", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {fmtNum(p.value)}{unit || ""}
        </div>
      ))}
    </div>
  );
};

/* ============================================================================
   NAVIGATION CONFIG
============================================================================ */
const NAV_ITEMS = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "architecture", label: "Architecture", Icon: Network },
  { id: "gateway", label: "Gateway", Icon: Waypoints },
  { id: "services", label: "Services", Icon: Boxes },
  { id: "loadbalancer", label: "Load Balancer", Icon: Scale },
  { id: "ratelimiter", label: "Rate Limiter", Icon: Gauge },
  { id: "healthchecker", label: "Health Checker", Icon: HeartPulse },
  { id: "logs", label: "Logs", Icon: ScrollText },
  { id: "notifications", label: "Notifications", Icon: Bell },
  { id: "users", label: "Users", Icon: UsersIcon },
  { id: "settings", label: "Settings", Icon: SettingsIcon },
];

const PAGE_META = {
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

/* ============================================================================
   SIDEBAR + TOPBAR
============================================================================ */
const Sidebar = ({ page, setPage, collapsed, setCollapsed }) => (
  <div className={`gw-sidebar ${collapsed ? "collapsed" : ""}`} style={{ width: collapsed ? 68 : 224 }}>
    <div className="gw-sidebar-logo">
      <div className="gw-logo-mark">AG</div>
      <div>
        <div className="gw-logo-text">Apex Gateway</div>
        <div className="gw-logo-sub">CONTROL CENTER</div>
      </div>
    </div>
    <div className="gw-nav">
      {NAV_ITEMS.map((item) => (
        <div key={item.id} className={`gw-nav-item ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)} title={collapsed ? item.label : undefined}>
          <item.Icon size={16} />
          <span className="gw-nav-label">{item.label}</span>
        </div>
      ))}
    </div>
    <div className="gw-sidebar-foot">
      <div className="gw-collapse-btn" onClick={() => setCollapsed((c) => !c)}>
        {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /> Collapse</>}
      </div>
    </div>
  </div>
);

const Topbar = ({ rps, activeServices, unread, theme, setTheme, notifOpen, setNotifOpen, notifications, setPage, setNotifications }) => (
  <div className="gw-topbar">
    <div className="gw-topbar-left">
      <div className="gw-status-pill">
        <LiveDot color="var(--success)" />
        All systems operational
      </div>
      <div className="gw-topbar-metric">
        <span className="val">{fmtNum(rps)}</span>
        <span className="lbl">Req / sec</span>
      </div>
      <div className="gw-topbar-metric">
        <span className="val">{activeServices}</span>
        <span className="lbl">Active services</span>
      </div>
      <div className="gw-search">
        <Search size={13} />
        <input placeholder="Search services, logs, routes…" />
      </div>
    </div>
    <div className="gw-topbar-right">
      <div className="gw-icon-btn" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} title="Toggle theme">
        {theme === "dark" ? <Radio size={16} /> : <Radio size={16} />}
      </div>
      <div style={{ position: "relative" }}>
        <div className="gw-icon-btn" onClick={() => setNotifOpen((o) => !o)}>
          <Bell size={16} />
          {unread > 0 && <span className="gw-badge-dot">{unread > 9 ? "9+" : unread}</span>}
        </div>
        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.14 }}
              className="gw-card" style={{ position: "absolute", right: 0, top: 42, width: 320, zIndex: 60, overflow: "hidden" }}
            >
              <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-soft)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>Notifications</span>
                <span className="gw-mono" style={{ fontSize: 11, color: "var(--text-faint)" }}>{unread} unread</span>
              </div>
              <div className="gw-scrollbox" style={{ maxHeight: 320 }}>
                {notifications.slice(0, 6).map((n) => (
                  <div key={n.id} style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-soft)", display: "flex", gap: 9 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", marginTop: 5, flexShrink: 0, background: n.severity === "critical" ? "var(--danger)" : n.severity === "warning" ? "var(--warn)" : "var(--accent-2)" }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{n.title}</div>
                      <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{n.message}</div>
                      <div className="gw-mono" style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 3 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{ padding: "9px 14px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "var(--accent)", cursor: "pointer" }}
                onClick={() => { setPage("notifications"); setNotifOpen(false); setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))); }}
              >
                View all notifications
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="gw-profile" onClick={() => setPage("users")}>
        <div className="gw-avatar">SA</div>
        <div>
          <div className="gw-profile-name">Sam Ardley</div>
          <div className="gw-profile-role">Platform Admin</div>
        </div>
        <ChevronDown size={13} color="var(--text-faint)" />
      </div>
    </div>
  </div>
);

/* ============================================================================
   OVERVIEW PAGE
============================================================================ */
const OverviewPage = ({ engine, setPage, setSelectedService }) => {
  const { services, metrics, totals, incidents } = engine;
  const errorRate = (metrics[metrics.length - 1].errors / metrics[metrics.length - 1].rps * 100).toFixed(2);
  const avgLatency = metrics[metrics.length - 1].latency;
  const grouped = useMemo(() => {
    const g = {};
    services.forEach((s) => { (g[s.group] = g[s.group] || []).push(s); });
    return g;
  }, [services]);

  const groupStatus = (list) => (list.some((s) => s.status === "down") ? "down" : list.some((s) => s.status === "warning") ? "warning" : "healthy");

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Overview</div>
          <div className="gw-page-sub">Executive summary of gateway health, traffic, and incidents.</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="gw-btn ghost"><Filter size={13} />Last 1 hour</button>
          <button className="gw-btn primary"><RefreshCw size={13} />Refresh</button>
        </div>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "repeat(6, 1fr)", marginBottom: 16 }}>
        <StatCard icon={Activity} label="Uptime" value={totals.uptime.toFixed(3)} unit="%" tint="var(--success)" delta="0.004%" deltaDir="up" />
        <StatCard icon={Database} label="Total Requests" value={fmtCompact(totals.totalRequests)} tint="var(--accent-2)" delta="12.4%" deltaDir="up" />
        <StatCard icon={Zap} label="Requests / sec" value={fmtNum(metrics[metrics.length - 1].rps)} tint="var(--accent)" delta="3.1%" deltaDir="up" />
        <StatCard icon={Timer} label="Avg Latency" value={avgLatency} unit="ms" tint="var(--accent-2)" delta="2.2%" deltaDir="down" />
        <StatCard icon={AlertTriangle} label="Error Rate" value={errorRate} unit="%" tint="var(--danger)" delta="0.3%" deltaDir="down" />
        <StatCard icon={Boxes} label="Active Services" value={`${services.filter((s) => s.status !== "down").length}/${services.length}`} tint="var(--success)" />
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 16 }}>
        <SectionCard eyebrow="Traffic" title="Request Volume">
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={metrics}>
              <defs><linearGradient id="ov-rps" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity={0.4} /><stop offset="100%" stopColor="var(--accent)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke="var(--border-soft)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
              <YAxis stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} width={36} />
              <Tooltip content={<ChartTooltip unit=" rps" />} />
              <Area type="monotone" dataKey="rps" name="Requests" stroke="var(--accent)" strokeWidth={2} fill="url(#ov-rps)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
        <SectionCard eyebrow="Performance" title="Latency (p95)">
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={metrics}>
              <CartesianGrid stroke="var(--border-soft)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
              <YAxis stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} width={36} />
              <Tooltip content={<ChartTooltip unit="ms" />} />
              <Line type="monotone" dataKey="latency" name="Latency" stroke="var(--accent-2)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 16 }}>
        <SectionCard eyebrow="Reliability" title="Error Rate">
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={metrics}>
              <defs><linearGradient id="ov-err" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--danger)" stopOpacity={0.4} /><stop offset="100%" stopColor="var(--danger)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke="var(--border-soft)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
              <YAxis stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} width={30} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="errors" name="Errors" stroke="var(--danger)" strokeWidth={2} fill="url(#ov-err)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
        <SectionCard eyebrow="Throttling" title="Rate Limited Requests">
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={metrics}>
              <CartesianGrid stroke="var(--border-soft)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
              <YAxis stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} width={30} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="limited" name="Limited" fill="var(--warn)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div className="gw-eyebrow" style={{ marginBottom: 10 }}>Service Health</div>
        <div className="gw-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {Object.entries(grouped).map(([group, list]) => {
            const status = groupStatus(list);
            const meta = STATUS_META[status];
            const GIcon = GROUP_ICON[group] || Server;
            return (
              <motion.div key={group} className="gw-card gw-card-pad" whileHover={{ y: -2 }} style={{ cursor: "pointer" }} onClick={() => setPage("services")}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
                    <span style={{ width: 30, height: 30, borderRadius: 8, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-dim)" }}><GIcon size={15} /></span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13.5 }}>{group}</div>
                      <div className="gw-mono" style={{ fontSize: 10.5, color: "var(--text-faint)" }}>{list.length} instances</div>
                    </div>
                  </div>
                  <StatusBadge status={status} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {list.map((inst) => (
                    <div key={inst.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11.5 }}
                      onClick={(e) => { e.stopPropagation(); setSelectedService(inst.id); setPage("services"); }}>
                      <span className="gw-mono" style={{ color: "var(--text-dim)" }}>{inst.id}</span>
                      <span style={{ color: STATUS_META[inst.status].color, fontSize: 10 }}>●</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <SectionCard eyebrow="Incidents" title="Recent Incidents" right={<span className="gw-mono" style={{ fontSize: 11, color: "var(--text-faint)" }}>{incidents.length} total</span>}>
        {incidents.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: "var(--text-faint)", fontSize: 12.5 }}>No incidents recorded. The fleet is healthy.</div>
        ) : (
          <div>
            {incidents.slice(0, 5).map((inc) => (
              <div key={inc.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 2px", borderBottom: "1px solid var(--border-soft)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: inc.status === "resolved" ? "var(--success)" : "var(--danger)" }}>{inc.status === "resolved" ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}</span>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{inc.title}</div>
                    <div className="gw-mono" style={{ fontSize: 10.5, color: "var(--text-faint)" }}>{fmtTime(inc.time)}</div>
                  </div>
                </div>
                <span className={`gw-badge ${inc.status === "resolved" ? "healthy" : "down"}`}>{inc.status === "resolved" ? "Resolved" : "Investigating"}</span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

/* ============================================================================
   ARCHITECTURE PAGE
============================================================================ */
const ARCH_STATIC_NODES = [
  { id: "client", label: "Client", sub: "Public internet", type: "client", x: 500, y: 40 },
  { id: "gateway", label: "API Gateway", sub: "api.gateway.internal", type: "gateway", x: 500, y: 140 },
  { id: "healthchecker", label: "Health Checker", sub: "Liveness / readiness", type: "hub", x: 500, y: 240 },
  { id: "loadbalancer", label: "Load Balancer", sub: "Round robin", type: "hub", x: 500, y: 340 },
  { id: "ratelimiter", label: "Rate Limiter", sub: "Token bucket", type: "hub", x: 500, y: 440 },
];
const ARCH_SERVICE_X = { "user-service-1": 130, "user-service-2": 270, "user-service-3": 410, "auth-service-1": 560, "auth-service-2": 700, "admin-service-1": 860 };
const NODE_PAGE_MAP = { gateway: "gateway", healthchecker: "healthchecker", loadbalancer: "loadbalancer", ratelimiter: "ratelimiter" };
const NODE_ICON = { client: Wifi, gateway: Waypoints, hub: CircleDot, service: Server };

const ArchitecturePage = ({ engine, setPage, setSelectedService }) => {
  const { services } = engine;
  const svgRef = useRef(null);
  const [positions, setPositions] = useState(() => {
    const p = {};
    ARCH_STATIC_NODES.forEach((n) => (p[n.id] = { x: n.x, y: n.y }));
    services.forEach((s) => (p[s.id] = { x: ARCH_SERVICE_X[s.id] || 500, y: 560 }));
    return p;
  });
  const [dragId, setDragId] = useState(null);
  const dragMoved = useRef(false);
  const [selected, setSelected] = useState("gateway");
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 1000, h: 630 });

  const toSvgPoint = useCallback((clientX, clientY) => {
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: viewBox.x + ((clientX - rect.left) / rect.width) * viewBox.w,
      y: viewBox.y + ((clientY - rect.top) / rect.height) * viewBox.h,
    };
  }, [viewBox]);

  const onPointerDownNode = (id) => (e) => {
    e.stopPropagation();
    setDragId(id);
    dragMoved.current = false;
  };
  useEffect(() => {
    const onMove = (e) => {
      if (!dragId) return;
      dragMoved.current = true;
      const pt = toSvgPoint(e.clientX, e.clientY);
      setPositions((prev) => ({ ...prev, [dragId]: { x: clamp(pt.x, 40, 960), y: clamp(pt.y, 20, 610) } }));
    };
    const onUp = () => setDragId(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragId, toSvgPoint]);

  const handleNodeClick = (id) => () => { if (!dragMoved.current) setSelected(id); };
  const handleNodeDouble = (id) => () => { if (NODE_PAGE_MAP[id]) setPage(NODE_PAGE_MAP[id]); else if (services.some((s) => s.id === id)) { setSelectedService(id); setPage("services"); } };

  const zoom = (dir) => setViewBox((vb) => {
    const factor = dir === "in" ? 0.85 : 1.176;
    const w = clamp(vb.w * factor, 500, 1400);
    const h = clamp(vb.h * factor, 315, 882);
    return { x: vb.x - (w - vb.w) / 2, y: vb.y - (h - vb.h) / 2, w, h };
  });
  const resetView = () => setViewBox({ x: 0, y: 0, w: 1000, h: 630 });

  const edges = useMemo(() => {
    const chain = [["client", "gateway"], ["gateway", "healthchecker"], ["healthchecker", "loadbalancer"], ["loadbalancer", "ratelimiter"]];
    const toServices = services.map((s) => ["ratelimiter", s.id]);
    return [...chain, ...toServices];
  }, [services]);

  const selectedInfo = useMemo(() => {
    if (services.some((s) => s.id === selected)) return services.find((s) => s.id === selected);
    return ARCH_STATIC_NODES.find((n) => n.id === selected);
  }, [selected, services]);

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Architecture</div>
          <div className="gw-page-sub">Live topology of the distributed gateway. Drag nodes, scroll to zoom, double-click to open a page.</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div className="gw-icon-btn" onClick={() => zoom("in")}><ZoomIn size={15} /></div>
          <div className="gw-icon-btn" onClick={() => zoom("out")}><ZoomOut size={15} /></div>
          <div className="gw-icon-btn" onClick={resetView}><Maximize2 size={15} /></div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 14 }}>
        <div className="gw-card" style={{ overflow: "hidden", position: "relative", height: 640 }}>
          <svg
            ref={svgRef}
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
            width="100%" height="100%"
            onWheel={(e) => { e.preventDefault(); zoom(e.deltaY < 0 ? "in" : "out"); }}
            style={{ display: "block", cursor: dragId ? "grabbing" : "default" }}
          >
            <defs>
              <pattern id="arch-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="var(--border-soft)" strokeWidth="1" />
              </pattern>
              <marker id="arch-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="var(--text-faint)" />
              </marker>
            </defs>
            <rect x={-2000} y={-2000} width={6000} height={6000} fill="url(#arch-grid)" />

            {edges.map(([from, to], i) => {
              const a = positions[from], b = positions[to];
              if (!a || !b) return null;
              const path = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
              const dim = selected && selected !== from && selected !== to;
              return (
                <g key={i} opacity={dim ? 0.35 : 1}>
                  <path d={path} stroke="var(--border)" strokeWidth={1.4} fill="none" markerEnd="url(#arch-arrow)" />
                  <circle r="3.4" fill="var(--accent)">
                    <animateMotion dur={`${1.1 + (i % 4) * 0.35}s`} repeatCount="indefinite" path={path} />
                  </circle>
                </g>
              );
            })}

            {ARCH_STATIC_NODES.map((n) => {
              const pos = positions[n.id];
              const Icon = NODE_ICON[n.type];
              const isSel = selected === n.id;
              return (
                <g key={n.id} transform={`translate(${pos.x},${pos.y})`} className="gw-node"
                  onMouseDown={onPointerDownNode(n.id)} onClick={handleNodeClick(n.id)} onDoubleClick={handleNodeDouble(n.id)}>
                  <rect x={-64} y={-26} width={128} height={52} rx={12} fill="var(--surface)" stroke={isSel ? "var(--accent)" : "var(--border)"} strokeWidth={isSel ? 2 : 1.2} />
                  <foreignObject x={-64} y={-26} width={128} height={52}>
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 8, padding: "0 10px", fontFamily: "var(--font-ui)" }}>
                      <span style={{ width: 26, height: 26, borderRadius: 7, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={13} /></span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.label}</div>
                        <div style={{ fontSize: 9, color: "var(--text-faint)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.sub}</div>
                      </div>
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {services.map((s) => {
              const pos = positions[s.id];
              if (!pos) return null;
              const meta = STATUS_META[s.status];
              const isSel = selected === s.id;
              return (
                <g key={s.id} transform={`translate(${pos.x},${pos.y})`} className="gw-node"
                  onMouseDown={onPointerDownNode(s.id)} onClick={handleNodeClick(s.id)} onDoubleClick={handleNodeDouble(s.id)}>
                  <rect x={-58} y={-24} width={116} height={48} rx={11} fill="var(--surface)" stroke={isSel ? "var(--accent)" : "var(--border)"} strokeWidth={isSel ? 2 : 1.2} />
                  <circle cx={-44} cy={-12} r={4} fill={meta.color} />
                  <foreignObject x={-58} y={-24} width={116} height={48}>
                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 10px 0 16px" }}>
                      <div className="gw-mono" style={{ fontSize: 10, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.id}</div>
                      <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>{s.rps} rps · {s.latency}ms</div>
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
          <div style={{ position: "absolute", bottom: 12, left: 14, fontSize: 10.5, color: "var(--text-faint)", fontFamily: "var(--font-mono)", display: "flex", gap: 6, alignItems: "center" }}>
            <Move2Hint /> drag nodes · scroll to zoom · double-click to open
          </div>
        </div>

        <div className="gw-card gw-card-pad" style={{ height: "fit-content", position: "sticky", top: 76 }}>
          {selectedInfo && (
            <>
              <div className="gw-eyebrow">Selected node</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{selectedInfo.label || selectedInfo.id}</div>
              {selectedInfo.status && <div style={{ marginBottom: 10 }}><StatusBadge status={selectedInfo.status} /></div>}
              {selectedInfo.sub && <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>{selectedInfo.sub}</div>}
              {selectedInfo.group && (
                <div className="gw-mono" style={{ fontSize: 11.5, color: "var(--text-dim)", display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
                  <div>RPS · {selectedInfo.rps}</div>
                  <div>Latency · {selectedInfo.latency}ms</div>
                  <div>CPU · {selectedInfo.cpu}%</div>
                  <div>Zone · {selectedInfo.zone}</div>
                </div>
              )}
              <button className="gw-btn primary sm" style={{ width: "100%", justifyContent: "center" }}
                onClick={() => { if (NODE_PAGE_MAP[selectedInfo.id]) setPage(NODE_PAGE_MAP[selectedInfo.id]); else { setSelectedService(selectedInfo.id); setPage("services"); } }}>
                Open page <ArrowRight size={13} />
              </button>
            </>
          )}
          <hr className="gw-divider" style={{ margin: "14px 0" }} />
          <div className="gw-eyebrow" style={{ marginBottom: 8 }}>Legend</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 11.5, color: "var(--text-dim)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)" }} /> Healthy instance</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--warn)" }} /> Degraded instance</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--danger)" }} /> Instance down</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} /> In-flight request packet</div>
          </div>
        </div>
      </div>
    </div>
  );
};
const Move2Hint = () => <ArrowRight size={11} style={{ transform: "rotate(-45deg)" }} />;

/* ============================================================================
   GATEWAY PAGE
============================================================================ */
const FlowStage = ({ icon: Icon, label, sub, active }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 150 }}>
    <motion.div
      animate={{ boxShadow: active ? "0 0 0 6px var(--accent-soft)" : "0 0 0 0px transparent" }}
      transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
      style={{ width: 56, height: 56, borderRadius: 14, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}
    >
      <Icon size={22} />
    </motion.div>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 12.5, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>{sub}</div>
    </div>
  </div>
);

const FlowConnector = () => (
  <svg width="70" height="4" style={{ marginTop: -30, flexShrink: 0 }}>
    <line x1="0" y1="2" x2="70" y2="2" stroke="var(--border)" strokeWidth="1.4" />
    <circle cy="2" r="3" fill="var(--accent)">
      <animateMotion dur="1.3s" repeatCount="indefinite" path="M0,0 L70,0" />
    </circle>
  </svg>
);

const GatewayPage = ({ engine }) => {
  const { metrics, services, totals } = engine;
  const last = metrics[metrics.length - 1];
  const connections = services.reduce((acc, s) => acc + Math.round(s.rps / 8), 0);

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Gateway</div>
          <div className="gw-page-sub">Edge routing performance for <span className="gw-mono">api.gateway.internal</span></div>
        </div>
        <span className="gw-badge healthy"><LiveDot color="var(--success)" /> Routing normally</span>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)", marginBottom: 16 }}>
        <StatCard icon={Database} label="Total Requests" value={fmtCompact(totals.totalRequests)} tint="var(--accent-2)" />
        <StatCard icon={Radio} label="Active Connections" value={fmtNum(connections)} tint="var(--accent)" />
        <StatCard icon={Timer} label="Latency" value={last.latency} unit="ms" tint="var(--accent-2)" />
        <StatCard icon={ArrowUpFromLine} label="Throughput" value={(last.rps * 4.2 / 1000).toFixed(1)} unit="MB/s" tint="var(--success)" />
        <StatCard icon={AlertTriangle} label="Errors" value={last.errors} unit="/2s" tint="var(--danger)" />
      </div>

      <SectionCard eyebrow="Request Pipeline" title="Live Request Flow" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 10px", flexWrap: "wrap", gap: 0 }}>
          <FlowStage icon={ArrowDownToLine} label="Incoming" sub={`${fmtNum(last.rps)} rps`} active />
          <FlowConnector />
          <FlowStage icon={Waypoints} label="Routing" sub="Path + host match" active />
          <FlowConnector />
          <FlowStage icon={Gauge} label="Rate Limit" sub={`${last.limited} limited`} active />
          <FlowConnector />
          <FlowStage icon={Scale} label="Load Balancing" sub={`${services.length} instances`} active />
        </div>
      </SectionCard>

      <div className="gw-grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <SectionCard eyebrow="Traffic" title="Requests & Throughput">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={metrics}>
              <defs><linearGradient id="gw-rps2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--accent)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke="var(--border-soft)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
              <YAxis stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} width={36} />
              <Tooltip content={<ChartTooltip unit=" rps" />} />
              <Area type="monotone" dataKey="rps" name="Requests" stroke="var(--accent)" strokeWidth={2} fill="url(#gw-rps2)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
        <SectionCard eyebrow="Routes" title="Top Routes">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { path: "/api/v2/users/*", pct: 38 },
              { path: "/api/v2/auth/login", pct: 24 },
              { path: "/api/v2/auth/refresh", pct: 17 },
              { path: "/api/v1/admin/*", pct: 8 },
              { path: "/api/v2/users/:id/orders", pct: 13 },
            ].map((r) => (
              <div key={r.path}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 4 }}>
                  <span className="gw-mono" style={{ color: "var(--text-dim)" }}>{r.path}</span>
                  <span className="gw-mono">{r.pct}%</span>
                </div>
                <ProgressBar value={r.pct} color="var(--accent-2)" />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

/* ============================================================================
   LOAD BALANCER PAGE
============================================================================ */
function computeDistribution(algorithm, instances) {
  const n = instances.length;
  switch (algorithm) {
    case "weighted-round-robin": {
      const totalW = instances.reduce((a, s) => a + s.weight, 0);
      return instances.map((s) => ({ id: s.id, pct: Math.round((s.weight / totalW) * 100) }));
    }
    case "least-connection":
    case "least-response-time": {
      const inv = instances.map((s) => 1 / Math.max(1, algorithm === "least-connection" ? s.cpu : s.latency));
      const total = inv.reduce((a, b) => a + b, 0);
      return instances.map((s, i) => ({ id: s.id, pct: Math.round((inv[i] / total) * 100) }));
    }
    case "ip-hash":
    case "consistent-hashing": {
      let acc = [];
      let remaining = 100;
      instances.forEach((s, i) => {
        const v = i === instances.length - 1 ? remaining : Math.round(100 / n + rand(-6, 6));
        acc.push({ id: s.id, pct: v });
        remaining -= v;
      });
      return acc;
    }
    case "random": {
      let acc = [];
      let remaining = 100;
      instances.forEach((s, i) => {
        const v = i === instances.length - 1 ? remaining : Math.round(100 / n + rand(-10, 10));
        acc.push({ id: s.id, pct: v });
        remaining -= v;
      });
      return acc;
    }
    default: // round robin
      return instances.map((s) => ({ id: s.id, pct: Math.round(100 / n) }));
  }
}

const ALGO_VISUAL = {
  cycle: ({ nodes }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 11 }}>
      {nodes.map((n, i) => (
        <React.Fragment key={n}>
          <span style={{ padding: "3px 8px", borderRadius: 6, background: "var(--surface-2)", border: "1px solid var(--border)" }}>{n}</span>
          {i < nodes.length - 1 && <ArrowRight size={12} color="var(--text-faint)" />}
        </React.Fragment>
      ))}
    </div>
  ),
  weighted: ({ nodes }) => (
    <div style={{ display: "flex", gap: 6 }}>
      {nodes.map((n, i) => (
        <div key={n} style={{ flex: [3, 2, 1][i] || 1, height: 22, borderRadius: 5, background: "var(--accent-soft)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9.5, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{n}</div>
      ))}
    </div>
  ),
  leastconn: () => (
    <div style={{ fontSize: 11, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6 }}><ArrowRight size={13} color="var(--accent)" /> Traffic moves toward the least-busy instance</div>
  ),
  latency: () => (
    <div style={{ fontSize: 11, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6 }}><Timer size={13} color="var(--accent)" /> Traffic favors the fastest-responding instance</div>
  ),
  random: () => (
    <div style={{ fontSize: 11, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6 }}><Hash size={13} color="var(--accent)" /> Each request lands on a uniformly random instance</div>
  ),
  hash: () => (
    <div style={{ fontSize: 11, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6 }}><Lock size={13} color="var(--accent)" /> Same client IP always maps to the same instance</div>
  ),
  ring: () => (
    <div style={{ fontSize: 11, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6 }}><CircleDot size={13} color="var(--accent)" /> Instances placed on a hash ring; only neighbors remap on scale</div>
  ),
};

const LoadBalancerPage = ({ engine }) => {
  const { services, lbAlgorithm, setLbAlgorithm } = engine;
  const userInstances = services.filter((s) => s.group === "User Service");
  const [distribution, setDistribution] = useState(() => computeDistribution(lbAlgorithm, userInstances));
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    setDistribution(computeDistribution(lbAlgorithm, userInstances));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lbAlgorithm, services.length]);

  useEffect(() => {
    const iv = setInterval(() => setDistribution(computeDistribution(lbAlgorithm, userInstances)), 2500);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lbAlgorithm, services]);

  const changeAlgorithm = (id) => {
    if (id === lbAlgorithm) return;
    setSwitching(true);
    setTimeout(() => { setLbAlgorithm(id); setSwitching(false); }, 500);
  };

  const current = LB_ALGORITHMS.find((a) => a.id === lbAlgorithm);
  const totalReq = 48_213_902;
  const failedReq = 812;

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Load Balancer</div>
          <div className="gw-page-sub">Traffic distribution engine and algorithm configuration.</div>
        </div>
        <span className="gw-badge info"><Scale size={11} /> {current.name}</span>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)", marginBottom: 16 }}>
        <StatCard icon={Scale} label="Current Algorithm" value={current.name} tint="var(--accent)" />
        <StatCard icon={Database} label="Requests Distributed" value={fmtCompact(totalReq)} tint="var(--accent-2)" />
        <StatCard icon={Server} label="Active Instances" value={userInstances.filter((s) => s.status !== "down").length + "/" + userInstances.length} tint="var(--success)" />
        <StatCard icon={Timer} label="Avg Response Time" value={Math.round(userInstances.reduce((a, s) => a + s.latency, 0) / userInstances.length)} unit="ms" tint="var(--accent-2)" />
        <StatCard icon={XCircle} label="Failed Requests" value={fmtNum(failedReq)} tint="var(--danger)" />
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "1.1fr 1fr", marginBottom: 16 }}>
        <SectionCard eyebrow="Live Topology" title="Gateway → Load Balancer → Instances">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "6px 0 14px" }}>
            <div style={{ padding: "8px 16px", borderRadius: 9, background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: 12, fontWeight: 700 }}>Gateway</div>
            <svg width="2" height="26"><line x1="1" y1="0" x2="1" y2="26" stroke="var(--border)" /></svg>
            <motion.div animate={{ scale: switching ? [1, 1.06, 1] : 1 }} transition={{ duration: 0.5 }} style={{ padding: "8px 16px", borderRadius: 9, background: "var(--accent-soft)", border: "1px solid rgba(47,216,202,0.3)", fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>
              Load Balancer · {current.name}
            </motion.div>
            <svg width="2" height="26"><line x1="1" y1="0" x2="1" y2="26" stroke="var(--border)" /></svg>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            {distribution.map((d) => {
              const svc = userInstances.find((s) => s.id === d.id);
              return (
                <div key={d.id} style={{ textAlign: "center", width: 110 }}>
                  <div style={{ width: 44, height: 44, margin: "0 auto 6px", borderRadius: "50%", border: "3px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12, position: "relative" }}>
                    {d.pct}%
                    {svc && <span style={{ position: "absolute", top: -2, right: -2, width: 9, height: 9, borderRadius: "50%", background: STATUS_META[svc.status].color, border: "2px solid var(--surface)" }} />}
                  </div>
                  <div className="gw-mono" style={{ fontSize: 10.5, color: "var(--text-dim)" }}>{d.id}</div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard eyebrow="Configuration" title="Balancing Algorithm">
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 4 }}>
            {LB_ALGORITHMS.map((a) => (
              <div key={a.id} onClick={() => changeAlgorithm(a.id)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 11px", borderRadius: 8, cursor: "pointer", border: `1px solid ${a.id === lbAlgorithm ? "var(--accent)" : "var(--border-soft)"}`, background: a.id === lbAlgorithm ? "var(--accent-soft)" : "transparent" }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: a.id === lbAlgorithm ? "var(--accent)" : "var(--text)" }}>{a.name}</span>
                {a.id === lbAlgorithm && <CheckCircle2 size={15} color="var(--accent)" />}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div>
        <div className="gw-eyebrow" style={{ marginBottom: 10 }}>Algorithm Comparison</div>
        <div className="gw-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          {LB_ALGORITHMS.map((a) => (
            <div key={a.id} className="gw-card gw-card-pad" style={{ border: a.id === lbAlgorithm ? "1px solid var(--accent)" : undefined }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 13.5 }}>{a.name}</span>
                <span className="gw-badge info">{a.performance}</span>
              </div>
              <div style={{ marginBottom: 10 }}>{ALGO_VISUAL[a.visual]({ nodes: ["srv-1", "srv-2", "srv-3"] })}</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}><strong style={{ color: "var(--text)" }}>Best for: </strong>{a.useCase}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--success)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>Advantages</div>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: "var(--text-dim)" }}>{a.advantages.map((x) => <li key={x} style={{ marginBottom: 2 }}>{x}</li>)}</ul>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--danger)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>Disadvantages</div>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: "var(--text-dim)" }}>{a.disadvantages.map((x) => <li key={x} style={{ marginBottom: 2 }}>{x}</li>)}</ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   RATE LIMITER PAGE
============================================================================ */
const RateLimiterPage = ({ engine }) => {
  const { rlAlgorithm, setRlAlgorithm, bucket } = engine;
  const [rejects, setRejects] = useState([]);
  const prevTokens = useRef(bucket.tokens);

  useEffect(() => {
    if (bucket.tokens <= 1 && prevTokens.current > 1) {
      const id = uid();
      setRejects((r) => [...r.slice(-8), id]);
      setTimeout(() => setRejects((r) => r.filter((x) => x !== id)), 1200);
    }
    prevTokens.current = bucket.tokens;
  }, [bucket.tokens]);

  const current = RL_ALGORITHMS.find((a) => a.id === rlAlgorithm);
  const fillPct = (bucket.tokens / bucket.capacity) * 100;
  const total = bucket.allowed + bucket.blocked;
  const blockRate = ((bucket.blocked / Math.max(1, total)) * 100).toFixed(2);

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Rate Limiter</div>
          <div className="gw-page-sub">Request throttling engine and algorithm configuration.</div>
        </div>
        <span className="gw-badge info"><Gauge size={11} /> {current.name}</span>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 16 }}>
        <StatCard icon={CheckCircle2} label="Requests Allowed" value={fmtCompact(bucket.allowed)} tint="var(--success)" />
        <StatCard icon={XCircle} label="Requests Blocked" value={fmtCompact(bucket.blocked)} tint="var(--danger)" />
        <StatCard icon={Zap} label="Remaining Tokens" value={Math.round(bucket.tokens)} unit={`/ ${bucket.capacity}`} tint="var(--accent)" />
        <StatCard icon={AlertTriangle} label="Block Rate" value={blockRate} unit="%" tint="var(--warn)" />
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 16 }}>
        <SectionCard eyebrow="Live Visualization" title="Token Bucket">
          <div style={{ display: "flex", alignItems: "flex-end", gap: 26, padding: "10px 6px 4px" }}>
            <div style={{ position: "relative", width: 110, height: 160, flexShrink: 0 }}>
              <svg width="110" height="160" viewBox="0 0 110 160">
                <path d="M10,10 L100,10 L92,152 L18,152 Z" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1.6" />
                <clipPath id="bucket-clip"><path d="M12,12 L98,12 L91,150 L19,150 Z" /></clipPath>
                <motion.rect
                  x="10" width="90" fill="var(--accent)" opacity="0.55" clipPath="url(#bucket-clip)"
                  animate={{ y: 150 - (fillPct / 100) * 138, height: (fillPct / 100) * 138 + 12 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <text x="55" y="85" textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--text)" fontFamily="var(--font-mono)">{Math.round(bucket.tokens)}</text>
                <text x="55" y="100" textAnchor="middle" fontSize="9" fill="var(--text-faint)" fontFamily="var(--font-mono)">tokens</text>
              </svg>
              <AnimatePresence>
                {rejects.map((id) => (
                  <motion.div key={id} initial={{ opacity: 1, x: 0, y: 40 }} animate={{ opacity: 0, x: 60, y: 10 }} exit={{ opacity: 0 }} transition={{ duration: 1.1 }}
                    style={{ position: "absolute", left: 6, top: 30, fontSize: 10, color: "var(--danger)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                    ✕ 429
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>
                Bucket refills at <strong className="gw-mono" style={{ color: "var(--text)" }}>{bucket.refillRate} tokens/sec</strong>. Each request consumes one token; when the bucket is empty, incoming requests are rejected with <span className="gw-mono">HTTP 429</span>.
              </div>
              <ProgressBar value={fillPct} color={fillPct < 15 ? "var(--danger)" : fillPct < 40 ? "var(--warn)" : "var(--accent)"} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10.5, color: "var(--text-faint)" }}>
                <span>0</span><span>capacity {bucket.capacity}</span>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
                <div>
                  <div className="gw-mono" style={{ fontSize: 18, fontWeight: 700, color: "var(--success)" }}>{fmtCompact(bucket.allowed)}</div>
                  <div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>Allowed</div>
                </div>
                <div>
                  <div className="gw-mono" style={{ fontSize: 18, fontWeight: 700, color: "var(--danger)" }}>{fmtCompact(bucket.blocked)}</div>
                  <div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>Blocked</div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard eyebrow="Configuration" title="Limiting Algorithm">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {RL_ALGORITHMS.map((a) => (
              <div key={a.id} onClick={() => setRlAlgorithm(a.id)}
                style={{ padding: "10px 12px", borderRadius: 9, cursor: "pointer", border: `1px solid ${a.id === rlAlgorithm ? "var(--accent)" : "var(--border-soft)"}`, background: a.id === rlAlgorithm ? "var(--accent-soft)" : "transparent" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: a.id === rlAlgorithm ? "var(--accent)" : "var(--text)" }}>{a.name}</span>
                  {a.id === rlAlgorithm && <CheckCircle2 size={14} color="var(--accent)" />}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-dim)", marginBottom: 6 }}>{a.desc}</div>
                <div style={{ display: "flex", gap: 10, fontSize: 10.8 }}>
                  <span style={{ color: "var(--success)" }}>+ {a.pro}</span>
                </div>
                <div style={{ fontSize: 10.8, color: "var(--danger)" }}>− {a.con}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard eyebrow="Traffic" title="Requests: Allowed vs Blocked">
        <ResponsiveContainer width="100%" height={190}>
          <AreaChart data={engine.metrics}>
            <defs><linearGradient id="rl-lim" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--warn)" stopOpacity={0.4} /><stop offset="100%" stopColor="var(--warn)" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid stroke="var(--border-soft)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
            <YAxis stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} width={30} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="limited" name="Blocked" stroke="var(--warn)" strokeWidth={2} fill="url(#rl-lim)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
};

/* ============================================================================
   HEALTH CHECKER PAGE
============================================================================ */
const EVENT_COLOR = { Failed: "var(--danger)", Removed: "var(--danger)", Degraded: "var(--warn)", Recovered: "var(--success)" };

const HealthCheckerPage = ({ engine }) => {
  const { services, healthEvents } = engine;
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const iv = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(iv); }, []);
  const healthyCount = services.filter((s) => s.status === "healthy").length;

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Health Checker</div>
          <div className="gw-page-sub">Continuous liveness and readiness probing across the fleet.</div>
        </div>
        <span className="gw-badge healthy"><HeartPulse size={11} /> Probing every 5s</span>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 16 }}>
        <StatCard icon={Boxes} label="Services Monitored" value={services.length} tint="var(--accent)" />
        <StatCard icon={CheckCircle2} label="Passing" value={healthyCount} tint="var(--success)" />
        <StatCard icon={AlertTriangle} label="Degraded" value={services.filter((s) => s.status === "warning").length} tint="var(--warn)" />
        <StatCard icon={XCircle} label="Failing" value={services.filter((s) => s.status === "down").length} tint="var(--danger)" />
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
        <SectionCard eyebrow="Monitoring" title="Service Probes">
          <table className="gw-table">
            <thead>
              <tr><th>Service</th><th>Status</th><th>Last Check</th><th>Response</th><th>Failures</th></tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id}>
                  <td className="gw-mono">{s.id}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td className="gw-mono" style={{ color: "var(--text-dim)" }}>{Math.max(0, Math.round((now - s.lastCheck.getTime()) / 1000)) % 5 + 1}s ago</td>
                  <td className="gw-mono">{s.latency}ms</td>
                  <td className="gw-mono" style={{ color: s.status === "down" ? "var(--danger)" : "var(--text-dim)" }}>{s.status === "down" ? randInt(1, 4) : 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        <SectionCard eyebrow="Live Timeline" title="Health Events">
          <div className="gw-scrollbox" style={{ maxHeight: 420 }}>
            {healthEvents.map((ev) => (
              <div key={ev.id} className="gw-timeline-item">
                <div className="gw-timeline-line" />
                <div className="gw-timeline-dot" style={{ background: EVENT_COLOR[ev.event] || "var(--accent)" }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>
                    <span className="gw-mono">{ev.time}</span> <span style={{ color: "var(--text-dim)", fontWeight: 500 }}>{ev.message}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

/* ============================================================================
   SERVICES PAGE
============================================================================ */
const ServiceCard = ({ svc, onOpen, onAction }) => {
  const meta = STATUS_META[svc.status];
  return (
    <motion.div className="gw-card gw-card-pad" whileHover={{ y: -2 }} layout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ cursor: "pointer" }} onClick={() => onOpen(svc.id)}>
          <div className="gw-mono" style={{ fontWeight: 700, fontSize: 13.5 }}>{svc.id}</div>
          <div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>{svc.version} · {svc.zone}</div>
        </div>
        <StatusBadge status={svc.status} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-faint)", marginBottom: 3 }}><span>CPU</span><span className="gw-mono">{svc.cpu}%</span></div>
          <ProgressBar value={svc.cpu} color={svc.cpu > 80 ? "var(--danger)" : "var(--accent)"} />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-faint)", marginBottom: 3 }}><span>Memory</span><span className="gw-mono">{svc.mem}%</span></div>
          <ProgressBar value={svc.mem} color={svc.mem > 80 ? "var(--danger)" : "var(--accent-2)"} />
        </div>
      </div>
      <div className="gw-mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-dim)", marginBottom: 12 }}>
        <span>{svc.rps} req/s</span><span>{svc.latency}ms p95</span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button className="gw-btn sm ghost" onClick={() => onAction(svc, "restart")}><RefreshCw size={11} />Restart</button>
        {svc.status === "disabled" ? (
          <button className="gw-btn sm" onClick={() => onAction(svc, "enable")}><Power size={11} />Enable</button>
        ) : (
          <button className="gw-btn sm warn" onClick={() => onAction(svc, "disable")}><PowerOff size={11} />Disable</button>
        )}
        <button className="gw-btn sm danger" onClick={() => onAction(svc, "removeTraffic")}><ShieldAlert size={11} />Remove Traffic</button>
      </div>
    </motion.div>
  );
};

const ServiceDetail = ({ svc, engine, onClose }) => {
  const history = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    time: i, cpu: clamp(svc.cpu + rand(-10, 10), 5, 95), mem: clamp(svc.mem + rand(-8, 8), 5, 95),
    rps: clamp(svc.rps + rand(-20, 20), 1, 260), latency: clamp(svc.latency + rand(-8, 8), 10, 300),
  })), [svc.id]);
  const logs = engine.logs.filter((l) => l.service === svc.id).slice(-8).reverse();
  const deps = svc.group === "User Service" ? ["auth-service", "postgres-users", "redis-cache"] : svc.group === "Auth Service" ? ["postgres-auth", "redis-sessions"] : ["postgres-admin", "audit-log-service"];

  return (
    <Modal open onClose={onClose} title={svc.id} large footer={<button className="gw-btn ghost" onClick={onClose}>Close</button>}>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <StatusBadge status={svc.status} />
        <span className="gw-badge neutral">{svc.version}</span>
        <span className="gw-badge neutral"><MapPin size={10} />{svc.zone}</span>
        <span className="gw-badge neutral">{svc.group}</span>
      </div>
      <div className="gw-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 16 }}>
        <div className="gw-card gw-card-pad"><div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>CPU</div><div className="gw-mono" style={{ fontSize: 18, fontWeight: 700 }}>{svc.cpu}%</div></div>
        <div className="gw-card gw-card-pad"><div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>Memory</div><div className="gw-mono" style={{ fontSize: 18, fontWeight: 700 }}>{svc.mem}%</div></div>
        <div className="gw-card gw-card-pad"><div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>Requests</div><div className="gw-mono" style={{ fontSize: 18, fontWeight: 700 }}>{svc.rps}/s</div></div>
        <div className="gw-card gw-card-pad"><div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>Latency</div><div className="gw-mono" style={{ fontSize: 18, fontWeight: 700 }}>{svc.latency}ms</div></div>
      </div>
      <div className="gw-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 16 }}>
        <SectionCard title="CPU & Memory">
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={history}>
              <CartesianGrid stroke="var(--border-soft)" vertical={false} />
              <XAxis dataKey="time" hide /><YAxis stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} width={26} />
              <Tooltip content={<ChartTooltip unit="%" />} />
              <Line type="monotone" dataKey="cpu" name="CPU" stroke="var(--accent)" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="mem" name="Memory" stroke="var(--accent-2)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
        <SectionCard title="Requests & Latency">
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={history}>
              <CartesianGrid stroke="var(--border-soft)" vertical={false} />
              <XAxis dataKey="time" hide /><YAxis stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} width={26} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="rps" name="RPS" stroke="var(--success)" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="latency" name="ms" stroke="var(--warn)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
      <div className="gw-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <SectionCard title="Recent Logs">
          <div className="gw-scrollbox" style={{ maxHeight: 160 }}>
            {logs.length === 0 && <div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>No recent log lines for this instance.</div>}
            {logs.map((l) => (
              <div key={l.id} style={{ fontFamily: "var(--font-mono)", fontSize: 11, marginBottom: 5, color: "var(--text-dim)" }}>
                <span style={{ color: "var(--text-faint)" }}>{l.time}</span> <span style={{ color: l.level === "ERROR" ? "var(--danger)" : l.level === "WARNING" ? "var(--warn)" : "var(--text-dim)", fontWeight: 700 }}>{l.level}</span> {l.message}
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Dependencies">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {deps.map((d) => (
              <div key={d} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                <GitBranch size={13} color="var(--text-faint)" /><span className="gw-mono">{d}</span>
                <span className="gw-badge healthy" style={{ marginLeft: "auto" }}>Connected</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </Modal>
  );
};

const ServicesPage = ({ engine, selectedService, setSelectedService }) => {
  const { services, setServices } = engine;
  const groups = useMemo(() => [...new Set(services.map((s) => s.group))], [services]);
  const [tab, setTab] = useState(groups[0]);
  const [confirmAction, setConfirmAction] = useState(null);

  const applyAction = (svc, action) => {
    if (action === "restart") {
      setServices((prev) => prev.map((s) => (s.id === svc.id ? { ...s, status: "healthy", cpu: randInt(20, 40) } : s)));
      return;
    }
    setConfirmAction({ svc, action });
  };
  const confirmed = () => {
    const { svc, action } = confirmAction;
    setServices((prev) => prev.map((s) => {
      if (s.id !== svc.id) return s;
      if (action === "disable") return { ...s, status: "disabled" };
      if (action === "enable") return { ...s, status: "healthy" };
      if (action === "removeTraffic") return { ...s, rps: 0, status: s.status === "healthy" ? "warning" : s.status };
      return s;
    }));
    setConfirmAction(null);
  };

  const list = services.filter((s) => s.group === tab);
  const detailSvc = selectedService ? services.find((s) => s.id === selectedService) : null;

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Services</div>
          <div className="gw-page-sub">Manage backend service groups and their instances.</div>
        </div>
      </div>

      <div className="gw-tabs" style={{ marginBottom: 18 }}>
        {groups.map((g) => (
          <div key={g} className={`gw-tab ${tab === g ? "active" : ""}`} onClick={() => setTab(g)}>{g} <span className="gw-mono" style={{ color: "var(--text-faint)" }}>({services.filter((s) => s.group === g).length})</span></div>
        ))}
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {list.map((svc) => <ServiceCard key={svc.id} svc={svc} onOpen={setSelectedService} onAction={applyAction} />)}
      </div>

      {detailSvc && <ServiceDetail svc={detailSvc} engine={engine} onClose={() => setSelectedService(null)} />}

      <Modal
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title={confirmAction ? `${confirmAction.action === "disable" ? "Disable" : confirmAction.action === "enable" ? "Enable" : "Remove traffic from"} ${confirmAction.svc.id}?` : ""}
        footer={<>
          <button className="gw-btn ghost" onClick={() => setConfirmAction(null)}>Cancel</button>
          <button className="gw-btn danger" onClick={confirmed}>Confirm</button>
        </>}
      >
        <div style={{ fontSize: 13, color: "var(--text-dim)" }}>
          {confirmAction?.action === "disable" && "This instance will stop receiving new traffic and will be marked disabled until re-enabled."}
          {confirmAction?.action === "enable" && "This instance will rejoin the pool and start receiving traffic again."}
          {confirmAction?.action === "removeTraffic" && "In-flight traffic will be drained from this instance immediately."}
        </div>
      </Modal>
    </div>
  );
};

/* ============================================================================
   LOGS PAGE
============================================================================ */
const LEVEL_COLOR = { INFO: "var(--accent-2)", SUCCESS: "var(--success)", WARNING: "var(--warn)", ERROR: "var(--danger)" };

const LogsPage = ({ engine }) => {
  const { logs } = engine;
  const [query, setQuery] = useState("");
  const [levels, setLevels] = useState(["INFO", "SUCCESS", "WARNING", "ERROR"]);
  const [autoScroll, setAutoScroll] = useState(true);
  const boxRef = useRef(null);

  const filtered = logs.filter((l) => levels.includes(l.level) && (query === "" || l.message.toLowerCase().includes(query.toLowerCase()) || l.service.toLowerCase().includes(query.toLowerCase())));

  useEffect(() => {
    if (autoScroll && boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [filtered.length, autoScroll]);

  const toggleLevel = (lvl) => setLevels((prev) => (prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]));

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Logs</div>
          <div className="gw-page-sub">Real-time structured log stream from the gateway fleet.</div>
        </div>
        <span className="gw-badge healthy"><LiveDot color="var(--success)" /> Streaming</span>
      </div>

      <div className="gw-card gw-card-pad" style={{ marginBottom: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div className="gw-search" style={{ width: 280 }}>
          <Search size={13} />
          <input placeholder="Search logs by message or service…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["INFO", "SUCCESS", "WARNING", "ERROR"].map((lvl) => (
            <div key={lvl} onClick={() => toggleLevel(lvl)}
              className="gw-badge" style={{ cursor: "pointer", background: levels.includes(lvl) ? `${LEVEL_COLOR[lvl]}20` : "var(--surface-2)", color: levels.includes(lvl) ? LEVEL_COLOR[lvl] : "var(--text-faint)", border: `1px solid ${levels.includes(lvl) ? "transparent" : "var(--border)"}` }}>
              {lvl}
            </div>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className={`gw-btn sm ${autoScroll ? "primary" : "ghost"}`} onClick={() => setAutoScroll((s) => !s)}><ArrowDownToLine size={12} />Auto-scroll</button>
        </div>
      </div>

      <div className="gw-card" style={{ padding: "10px 4px" }}>
        <div style={{ padding: "0 12px 8px", display: "grid", gridTemplateColumns: "92px 76px 120px 1fr", gap: 12, fontSize: 10, color: "var(--text-faint)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 0.5 }}>
          <span>Time</span><span>Level</span><span>Service</span><span>Message</span>
        </div>
        <div ref={boxRef} className="gw-scrollbox" style={{ maxHeight: 520 }}>
          {filtered.map((l) => (
            <div key={l.id} className="gw-log-row">
              <span style={{ color: "var(--text-faint)" }}>{l.time}</span>
              <span className="gw-log-level" style={{ color: LEVEL_COLOR[l.level] }}>{l.level}</span>
              <span style={{ color: "var(--text-dim)" }}>{l.service}</span>
              <span style={{ color: "var(--text)" }}>{l.message}</span>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "var(--text-faint)", fontSize: 12.5 }}>No log lines match this filter.</div>}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   NOTIFICATIONS PAGE
============================================================================ */
const SEV_META = {
  critical: { color: "var(--danger)", icon: ShieldAlert, label: "Critical" },
  warning: { color: "var(--warn)", icon: AlertTriangle, label: "Warning" },
  info: { color: "var(--accent-2)", icon: Bell, label: "Info" },
};

const NotificationsPage = ({ engine }) => {
  const { notifications, setNotifications } = engine;
  const [filter, setFilter] = useState("all");
  const list = filter === "all" ? notifications : notifications.filter((n) => n.severity === filter);
  const counts = { critical: notifications.filter((n) => n.severity === "critical").length, warning: notifications.filter((n) => n.severity === "warning").length, info: notifications.filter((n) => n.severity === "info").length };

  const markRead = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Notifications</div>
          <div className="gw-page-sub">Incidents, warnings, and informational alerts.</div>
        </div>
        <button className="gw-btn ghost" onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}>Mark all read</button>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 16 }}>
        <StatCard icon={ShieldAlert} label="Critical" value={counts.critical} tint="var(--danger)" />
        <StatCard icon={AlertTriangle} label="Warnings" value={counts.warning} tint="var(--warn)" />
        <StatCard icon={Bell} label="Info" value={counts.info} tint="var(--accent-2)" />
      </div>

      <div className="gw-tabs" style={{ marginBottom: 14 }}>
        {["all", "critical", "warning", "info"].map((f) => (
          <div key={f} className={`gw-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)} style={{ textTransform: "capitalize" }}>{f}</div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {list.map((n) => {
          const meta = SEV_META[n.severity];
          const Icon = meta.icon;
          return (
            <motion.div key={n.id} layout className="gw-card gw-card-pad" style={{ display: "flex", gap: 12, borderLeft: `3px solid ${meta.color}`, opacity: n.read ? 0.72 : 1 }}>
              <span style={{ width: 34, height: 34, borderRadius: 9, background: `${meta.color}20`, color: meta.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={16} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{n.title}</div>
                  <span className="gw-mono" style={{ fontSize: 10.5, color: "var(--text-faint)", flexShrink: 0 }}>{n.time}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 3 }}>{n.message}</div>
                {n.severity === "critical" && (
                  <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
                    <Mail size={11} /> Email sent to <span className="gw-mono">architecture-team@example.com</span>
                  </div>
                )}
              </div>
              {!n.read && <div className="gw-btn sm ghost" style={{ alignSelf: "center", flexShrink: 0 }} onClick={() => markRead(n.id)}>Mark read</div>}
            </motion.div>
          );
        })}
        {list.length === 0 && <div className="gw-card gw-card-pad" style={{ textAlign: "center", color: "var(--text-faint)", fontSize: 12.5 }}>Nothing here.</div>}
      </div>
    </div>
  );
};

/* ============================================================================
   USERS PAGE
============================================================================ */
const USER_SEED = [
  { name: "Sam Ardley", email: "sam.ardley@apexgw.io", role: "Platform Admin", status: "active", lastActive: "Active now" },
  { name: "Priya Nandan", email: "priya.nandan@apexgw.io", role: "SRE", status: "active", lastActive: "12 min ago" },
  { name: "Marcus Webb", email: "marcus.webb@apexgw.io", role: "SRE", status: "active", lastActive: "1 hr ago" },
  { name: "Elena Cho", email: "elena.cho@apexgw.io", role: "Read Only", status: "active", lastActive: "3 hr ago" },
  { name: "Diego Fuentes", email: "diego.fuentes@apexgw.io", role: "Read Only", status: "suspended", lastActive: "6 days ago" },
];

const UsersPage = () => (
  <div>
    <div className="gw-page-head">
      <div>
        <div className="gw-page-title">Users</div>
        <div className="gw-page-sub">Administrators and access roles for this gateway.</div>
      </div>
      <button className="gw-btn primary">+ Invite user</button>
    </div>
    <SectionCard>
      <table className="gw-table">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Active</th><th></th></tr></thead>
        <tbody>
          {USER_SEED.map((u) => (
            <tr key={u.email}>
              <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="gw-avatar" style={{ width: 24, height: 24, fontSize: 10 }}>{u.name.split(" ").map((p) => p[0]).join("")}</span>
                {u.name}
              </td>
              <td className="gw-mono" style={{ color: "var(--text-dim)" }}>{u.email}</td>
              <td>{u.role}</td>
              <td><span className={`gw-badge ${u.status === "active" ? "healthy" : "down"}`}>{u.status === "active" ? "Active" : "Suspended"}</span></td>
              <td style={{ color: "var(--text-dim)" }}>{u.lastActive}</td>
              <td><MoreVertical size={14} color="var(--text-faint)" style={{ cursor: "pointer" }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  </div>
);

/* ============================================================================
   SETTINGS PAGE (Admin Control Panel)
============================================================================ */
const SettingsPage = ({ engine, theme, setTheme }) => {
  const { lbAlgorithm, setLbAlgorithm, rlAlgorithm, setRlAlgorithm, setServices, services } = engine;
  const [toast, setToast] = useState(null);
  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const triggerHealthCheck = () => {
    flash("Health check triggered across all services");
    setServices((prev) => prev.map((s) => ({ ...s, lastCheck: new Date() })));
  };

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Settings</div>
          <div className="gw-page-sub">Admin controls and system configuration.</div>
        </div>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 16 }}>
        <SectionCard eyebrow="Admin Controls" title="Quick Actions">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12.8, fontWeight: 600 }}>Trigger health check</div>
                <div style={{ fontSize: 11, color: "var(--text-faint)" }}>Run an immediate probe across every instance.</div>
              </div>
              <button className="gw-btn sm primary" onClick={triggerHealthCheck}><Play size={12} />Run</button>
            </div>
            <hr className="gw-divider" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12.8, fontWeight: 600 }}>Interface theme</div>
                <div style={{ fontSize: 11, color: "var(--text-faint)" }}>Switch between dark and light mode.</div>
              </div>
              <button className="gw-btn sm ghost" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}>{theme === "dark" ? "Switch to light" : "Switch to dark"}</button>
            </div>
            <hr className="gw-divider" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12.8, fontWeight: 600 }}>Reset all instances to healthy</div>
                <div style={{ fontSize: 11, color: "var(--text-faint)" }}>Clears warning/down state across the fleet.</div>
              </div>
              <button className="gw-btn sm ghost" onClick={() => { setServices((prev) => prev.map((s) => ({ ...s, status: "healthy" }))); flash("All instances reset to healthy"); }}><RotateCcw size={12} />Reset</button>
            </div>
          </div>
        </SectionCard>

        <SectionCard eyebrow="System Configuration" title="Current Configuration">
          <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 12.5 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-dim)" }}>Load balancing algorithm</span><span className="gw-mono">{LB_ALGORITHMS.find((a) => a.id === lbAlgorithm).name}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-dim)" }}>Rate limiting algorithm</span><span className="gw-mono">{RL_ALGORITHMS.find((a) => a.id === rlAlgorithm).name}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-dim)" }}>Health check interval</span><span className="gw-mono">5s</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-dim)" }}>Registered services</span><span className="gw-mono">{services.length}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-dim)" }}>Gateway region</span><span className="gw-mono">us-east-1</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-dim)" }}>TLS</span><span className="gw-badge healthy">Enabled</span></div>
          </div>
        </SectionCard>
      </div>

      <SectionCard eyebrow="Access" title="API Keys">
        <table className="gw-table">
          <thead><tr><th>Name</th><th>Prefix</th><th>Scope</th><th>Created</th><th></th></tr></thead>
          <tbody>
            <tr><td>CI/CD Pipeline</td><td className="gw-mono">agw_live_4f2a…</td><td>Read/Write</td><td style={{ color: "var(--text-dim)" }}>Mar 2, 2026</td><td><MoreVertical size={14} color="var(--text-faint)" /></td></tr>
            <tr><td>Grafana Exporter</td><td className="gw-mono">agw_live_9c1d…</td><td>Read Only</td><td style={{ color: "var(--text-dim)" }}>Jan 18, 2026</td><td><MoreVertical size={14} color="var(--text-faint)" /></td></tr>
          </tbody>
        </table>
      </SectionCard>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="gw-card gw-card-pad"
            style={{ position: "fixed", bottom: 22, right: 26, zIndex: 200, display: "flex", alignItems: "center", gap: 8, borderColor: "var(--accent)" }}>
            <CheckCircle2 size={15} color="var(--accent)" /> <span style={{ fontSize: 12.5 }}>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ============================================================================
   APP ROOT
============================================================================ */
export default function App() {
  const [page, setPage] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [notifOpen, setNotifOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const engine = useMockEngine();

  useEffect(() => {
    const onDocClick = () => setNotifOpen(false);
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const unread = engine.notifications.filter((n) => !n.read).length;
  const last = engine.metrics[engine.metrics.length - 1];
  const activeServices = engine.services.filter((s) => s.status !== "down" && s.status !== "disabled").length;

  const pageProps = { engine, setPage, selectedService, setSelectedService, theme, setTheme };

  const renderPage = () => {
    switch (page) {
      case "overview": return <OverviewPage {...pageProps} />;
      case "architecture": return <ArchitecturePage {...pageProps} />;
      case "gateway": return <GatewayPage {...pageProps} />;
      case "services": return <ServicesPage {...pageProps} />;
      case "loadbalancer": return <LoadBalancerPage {...pageProps} />;
      case "ratelimiter": return <RateLimiterPage {...pageProps} />;
      case "healthchecker": return <HealthCheckerPage {...pageProps} />;
      case "logs": return <LogsPage {...pageProps} />;
      case "notifications": return <NotificationsPage {...pageProps} />;
      case "users": return <UsersPage {...pageProps} />;
      case "settings": return <SettingsPage {...pageProps} />;
      default: return null;
    }
  };

  return (
    <div className={`gw-root ${theme === "light" ? "light" : ""}`}>
      <GlobalStyle />
      <div className="gw-shell">
        <Sidebar page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="gw-main">
          <Topbar
            rps={last.rps}
            activeServices={activeServices}
            unread={unread}
            theme={theme}
            setTheme={setTheme}
            notifOpen={notifOpen}
            setNotifOpen={setNotifOpen}
            notifications={engine.notifications}
            setNotifications={engine.setNotifications}
            setPage={setPage}
          />
          <div className="gw-page">
            <AnimatePresence mode="wait">
              <motion.div key={page} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
