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
import { LoadingState, UnreachableState } from "../components/ui/ConnectionState.jsx";
import { FlowStage, FlowConnector } from "../components/gateway/FlowStage.jsx";
import { fmtCompact, fmtNum } from "../lib/utils.js";
import { sanitizeMetric } from "../lib/mappers.js";

function formatBytes(n) {
  if (!n) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

const STATUS_CODE_META = {
  "2xx": { label: "2xx Success", color: "var(--success)" },
  "3xx": { label: "3xx Redirect", color: "var(--accent-2)" },
  "4xx": { label: "4xx Client Error", color: "var(--warn)" },
  "5xx": { label: "5xx Server Error", color: "var(--danger)" },
  "429": { label: "429 Rate Limited", color: "var(--warn)" },
};

export default function GatewayPage() {
  const { gatewayDetails, history, services, connection, connectionError, refreshNow } = useEngine();

  if (connection === "connecting" && !gatewayDetails) return <LoadingState />;
  if (connection === "error" && !gatewayDetails) return <UnreachableState onRetry={refreshNow} error={connectionError} />;

  const { config, metrics, latency, traffic, status, loadBalancer, rateLimiter } = gatewayDetails || {};
  const avgLatency = sanitizeMetric(latency?.average_latency_ms);
  const statusTotal = Object.values(status || {}).reduce((a, b) => a + (b || 0), 0);

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Gateway</div>
          <div className="gw-page-sub">
            Edge routing performance for <span className="gw-mono">{config?.gatewayName || "gateway"}</span> · {config?.environment}
          </div>
        </div>
        <span className="gw-badge healthy"><LiveDot color="var(--success)" /> {loadBalancer?.enabled ? "Routing normally" : "Load balancing disabled"}</span>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)", marginBottom: 16 }}>
        <StatCard icon={Database} label="Total Requests" value={fmtCompact(metrics?.total_requests ?? 0)} tint="var(--accent-2)" />
        <StatCard icon={Radio} label="Active Connections" value={fmtNum(metrics?.active_connections ?? 0)} tint="var(--accent)" />
        <StatCard icon={Timer} label="Avg Latency" value={avgLatency ?? "—"} unit={avgLatency != null ? "ms" : ""} tint="var(--accent-2)" />
        <StatCard icon={ArrowUpFromLine} label="Total Traffic" value={formatBytes(traffic?.totalBytes ?? 0)} tint="var(--success)" />
        <StatCard icon={AlertTriangle} label="Failed Requests" value={fmtNum(metrics?.failed_requests ?? 0)} tint="var(--danger)" />
      </div>

      <SectionCard eyebrow="Request Pipeline" title="Live Request Flow" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 10px", flexWrap: "wrap", gap: 0 }}>
          <FlowStage icon={ArrowDownToLine} label="Incoming" sub={`${fmtNum(metrics?.requests_this_second ?? 0)} req this sec`} active />
          <FlowConnector />
          <FlowStage icon={Waypoints} label="Routing" sub={config?.gatewayName || "gateway"} active />
          <FlowConnector />
          <FlowStage icon={Gauge} label="Rate Limit" sub={`${rateLimiter?.algorithm || "—"} · ${fmtNum(rateLimiter?.blocked_requests ?? 0)} blocked`} active />
          <FlowConnector />
          <FlowStage icon={Scale} label="Load Balancing" sub={`${loadBalancer?.algorithm || "—"} · ${services.length} instances`} active />
        </div>
      </SectionCard>

      <div className="gw-grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <SectionCard eyebrow="Traffic" title="Requests / sec (live)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={history}>
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
        <SectionCard eyebrow="Responses" title="Status Code Breakdown">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(status || {}).map(([code, count]) => {
              const meta = STATUS_CODE_META[code] || { label: code, color: "var(--accent-2)" };
              const pct = statusTotal > 0 ? Math.round((count / statusTotal) * 100) : 0;
              return (
                <div key={code}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 4 }}>
                    <span style={{ color: "var(--text-dim)" }}>{meta.label}</span>
                    <span className="gw-mono">{fmtNum(count)}</span>
                  </div>
                  <ProgressBar value={pct} color={meta.color} />
                </div>
              );
            })}
            {statusTotal === 0 && <div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>No responses recorded yet.</div>}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
