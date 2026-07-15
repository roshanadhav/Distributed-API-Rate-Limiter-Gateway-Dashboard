import React from "react";
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
} from "recharts";
import {
  Database, Radio, Timer, ArrowUpFromLine, AlertTriangle, ArrowDownToLine, Waypoints, Gauge, Scale,
} from "lucide-react";
import { useEngine } from "../context/EngineContext.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import SectionCard from "../components/ui/SectionCard.jsx";
import LiveDot from "../components/ui/LiveDot.jsx";
import ChartTooltip from "../components/ui/ChartTooltip.jsx";
import ProgressBar from "../components/ui/ProgressBar.jsx";
import { FlowStage, FlowConnector } from "../components/gateway/FlowStage.jsx";
import { fmtCompact, fmtNum } from "../lib/utils.js";

const TOP_ROUTES = [
  { path: "/api/v2/users/*", pct: 38 },
  { path: "/api/v2/auth/login", pct: 24 },
  { path: "/api/v2/auth/refresh", pct: 17 },
  { path: "/api/v1/admin/*", pct: 8 },
  { path: "/api/v2/users/:id/orders", pct: 13 },
];

export default function GatewayPage() {
  const { metrics, services, totals } = useEngine();
  const last = metrics[metrics.length - 1];
  const connections = services.reduce((acc, s) => acc + Math.round(s.rps / 8), 0);

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Gateway</div>
          <div className="gw-page-sub">
            Edge routing performance for <span className="gw-mono">api.gateway.internal</span>
          </div>
        </div>
        <span className="gw-badge healthy"><LiveDot color="var(--success)" /> Routing normally</span>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)", marginBottom: 16 }}>
        <StatCard icon={Database} label="Total Requests" value={fmtCompact(totals.totalRequests)} tint="var(--accent-2)" />
        <StatCard icon={Radio} label="Active Connections" value={fmtNum(connections)} tint="var(--accent)" />
        <StatCard icon={Timer} label="Latency" value={last.latency} unit="ms" tint="var(--accent-2)" />
        <StatCard icon={ArrowUpFromLine} label="Throughput" value={((last.rps * 4.2) / 1000).toFixed(1)} unit="MB/s" tint="var(--success)" />
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
              <defs>
                <linearGradient id="gw-rps2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
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
            {TOP_ROUTES.map((r) => (
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
}
