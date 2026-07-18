import React, { useMemo } from "react";
import { Scale, Database, Server, Timer, XCircle } from "lucide-react";
import { useEngine } from "../context/EngineContext.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import SectionCard from "../components/ui/SectionCard.jsx";
import { LoadingState, UnreachableState } from "../components/ui/ConnectionState.jsx";
import { LB_ALGORITHMS, STATUS_META } from "../lib/constants.js";
import { fmtCompact, fmtNum } from "../lib/utils.js";
import { distributionToPercents } from "../lib/mappers.js";
import { ALGO_VISUAL } from "../components/loadbalancer/AlgoVisuals.jsx";

function normalizeAlgoName(name) {
  return (name || "").toLowerCase().replace(/\s+/g, "-");
}

export default function LoadBalancerPage() {
  const { loadBalancer, services, gatewayDetails, connection, connectionError, refreshNow } = useEngine();

  if (connection === "connecting" && !loadBalancer) return <LoadingState />;
  if (connection === "error" && !loadBalancer) return <UnreachableState onRetry={refreshNow} error={connectionError} />;

  const algorithmId = normalizeAlgoName(loadBalancer?.algorithm);
  const current = LB_ALGORITHMS.find((a) => a.id === algorithmId);
  const distribution = useMemo(() => distributionToPercents(loadBalancer?.distribution), [loadBalancer]);

  const activeCount = services.filter((s) => s.status !== "down").length;
  const avgResponseTime = services.length
    ? Math.round(services.reduce((a, s) => a + (s.latency || 0), 0) / services.length)
    : 0;
  const failedRequests = gatewayDetails?.metrics?.failed_requests ?? 0;

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Load Balancer</div>
          <div className="gw-page-sub">Live traffic distribution reported by the gateway.</div>
        </div>
        <span className="gw-badge info"><Scale size={11} /> {loadBalancer?.algorithm || "Unknown"}</span>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)", marginBottom: 16 }}>
        <StatCard icon={Scale} label="Current Algorithm" value={loadBalancer?.algorithm || "—"} tint="var(--accent)" />
        <StatCard icon={Database} label="Requests Forwarded" value={fmtCompact(loadBalancer?.totalForwarded ?? 0)} tint="var(--accent-2)" />
        <StatCard icon={Server} label="Active Instances" value={`${activeCount}/${services.length}`} tint="var(--success)" />
        <StatCard icon={Timer} label="Avg Response Time" value={avgResponseTime} unit="ms" tint="var(--accent-2)" />
        <StatCard icon={XCircle} label="Failed Requests" value={fmtNum(failedRequests)} tint="var(--danger)" />
      </div>

      <SectionCard eyebrow="Live Topology" title="Gateway → Load Balancer → Instances" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "6px 0 14px" }}>
          <div style={{ padding: "8px 16px", borderRadius: 9, background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: 12, fontWeight: 700 }}>Gateway</div>
          <svg width="2" height="26"><line x1="1" y1="0" x2="1" y2="26" stroke="var(--border)" /></svg>
          <div style={{ padding: "8px 16px", borderRadius: 9, background: "var(--accent-soft)", border: "1px solid rgba(47,216,202,0.3)", fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>
            Load Balancer · {loadBalancer?.algorithm || "—"}
          </div>
          <svg width="2" height="26"><line x1="1" y1="0" x2="1" y2="26" stroke="var(--border)" /></svg>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          {distribution.map((d) => {
            const svc = services.find((s) => s.id === d.id);
            return (
              <div key={d.id} style={{ textAlign: "center", width: 110 }}>
                <div style={{ width: 44, height: 44, margin: "0 auto 6px", borderRadius: "50%", border: "3px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12, position: "relative" }}>
                  {d.pct}%
                  {svc && <span style={{ position: "absolute", top: -2, right: -2, width: 9, height: 9, borderRadius: "50%", background: STATUS_META[svc.status].color, border: "2px solid var(--surface)" }} />}
                </div>
                <div className="gw-mono" style={{ fontSize: 10.5, color: "var(--text-dim)" }}>{d.id}</div>
                <div className="gw-mono" style={{ fontSize: 9.5, color: "var(--text-faint)" }}>{fmtNum(d.count)} req</div>
              </div>
            );
          })}
          {distribution.length === 0 && <div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>No forwarded requests recorded yet.</div>}
        </div>
      </SectionCard>

      <div>
        <div className="gw-eyebrow" style={{ marginBottom: 10 }}>Algorithm Reference</div>
        <div className="gw-page-sub" style={{ marginBottom: 12 }}>
          The gateway currently uses <strong style={{ color: "var(--text)" }}>{loadBalancer?.algorithm || "an unknown algorithm"}</strong>. Switching algorithms requires a control-plane endpoint that hasn't been wired up yet — these cards are reference material for each option.
        </div>
        <div className="gw-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          {LB_ALGORITHMS.map((a) => (
            <div key={a.id} className="gw-card gw-card-pad" style={{ border: a.id === algorithmId ? "1px solid var(--accent)" : undefined }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 13.5 }}>{a.name}</span>
                {a.id === algorithmId ? <span className="gw-badge healthy">Active</span> : <span className="gw-badge info">{a.performance}</span>}
              </div>
              <div style={{ marginBottom: 10 }}>{ALGO_VISUAL[a.visual]({ nodes: ["srv-1", "srv-2", "srv-3"] })}</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>
                <strong style={{ color: "var(--text)" }}>Best for: </strong>
                {a.useCase}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--success)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>Advantages</div>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: "var(--text-dim)" }}>
                    {a.advantages.map((x) => (
                      <li key={x} style={{ marginBottom: 2 }}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--danger)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>Disadvantages</div>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: "var(--text-dim)" }}>
                    {a.disadvantages.map((x) => (
                      <li key={x} style={{ marginBottom: 2 }}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
