import React from "react";
import { HeartPulse, Boxes, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { useEngine } from "../context/EngineContext.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import SectionCard from "../components/ui/SectionCard.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { LoadingState, UnreachableState } from "../components/ui/ConnectionState.jsx";
import { formatEpoch } from "../lib/mappers.js";
import { fmtNum } from "../lib/utils.js";

const EVENT_COLOR = { Failed: "var(--danger)", Removed: "var(--danger)", Degraded: "var(--warn)", Recovered: "var(--success)" };

export default function HealthCheckerPage() {
  const { services, healthEvents, connection, connectionError, refreshNow } = useEngine();

  if (connection === "connecting" && services.length === 0) return <LoadingState />;
  if (connection === "error" && services.length === 0) return <UnreachableState onRetry={refreshNow} error={connectionError} />;

  const healthyCount = services.filter((s) => s.status === "healthy").length;

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Health Checker</div>
          <div className="gw-page-sub">Live liveness/readiness state reported by the gateway for each service.</div>
        </div>
        <span className="gw-badge healthy"><HeartPulse size={11} /> Polling gateway</span>
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
              <tr>
                <th>Service</th>
                <th>Status</th>
                <th>Last Health Check</th>
                <th>Last Heartbeat</th>
                <th>Response</th>
                <th>Failed Reqs</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id}>
                  <td className="gw-mono">{s.id}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td className="gw-mono" style={{ color: "var(--text-dim)" }}>{formatEpoch(s.lastHealthCheck)}</td>
                  <td className="gw-mono" style={{ color: "var(--text-dim)" }}>{formatEpoch(s.lastHeartbeat)}</td>
                  <td className="gw-mono">{s.responseTime}ms</td>
                  <td className="gw-mono" style={{ color: s.failedRequests > 0 ? "var(--danger)" : "var(--text-dim)" }}>{fmtNum(s.failedRequests)}</td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-faint)" }}>No services reported.</td></tr>
              )}
            </tbody>
          </table>
        </SectionCard>

        <SectionCard eyebrow="Live Timeline" title="Health Events" right={<span className="gw-mono" style={{ fontSize: 11, color: "var(--text-faint)" }}>this session</span>}>
          <div className="gw-scrollbox" style={{ maxHeight: 420 }}>
            {healthEvents.length === 0 && (
              <div style={{ fontSize: 12, color: "var(--text-faint)" }}>No status changes observed yet — events appear here as soon as a service's health changes between polls.</div>
            )}
            {healthEvents.map((ev) => (
              <div key={ev.id} className="gw-timeline-item">
                <div className="gw-timeline-line" />
                <div className="gw-timeline-dot" style={{ background: EVENT_COLOR[ev.event] || "var(--accent)" }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>
                    <span className="gw-mono">{ev.time}</span>{" "}
                    <span style={{ color: "var(--text-dim)", fontWeight: 500 }}>{ev.message}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
