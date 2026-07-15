import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Scale, Database, Server, Timer, XCircle, CheckCircle2 } from "lucide-react";
import { useEngine } from "../context/EngineContext.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import SectionCard from "../components/ui/SectionCard.jsx";
import { LB_ALGORITHMS } from "../lib/constants.js";
import { STATUS_META } from "../lib/constants.js";
import { fmtCompact, fmtNum } from "../lib/utils.js";
import { ALGO_VISUAL, computeDistribution } from "../components/loadbalancer/AlgoVisuals.jsx";

export default function LoadBalancerPage() {
  const { services, lbAlgorithm, setLbAlgorithm } = useEngine();
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
    setTimeout(() => {
      setLbAlgorithm(id);
      setSwitching(false);
    }, 500);
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
            <motion.div
              animate={{ scale: switching ? [1, 1.06, 1] : 1 }}
              transition={{ duration: 0.5 }}
              style={{ padding: "8px 16px", borderRadius: 9, background: "var(--accent-soft)", border: "1px solid rgba(47,216,202,0.3)", fontSize: 12, fontWeight: 700, color: "var(--accent)" }}
            >
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
              <div
                key={a.id}
                onClick={() => changeAlgorithm(a.id)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 11px", borderRadius: 8, cursor: "pointer",
                  border: `1px solid ${a.id === lbAlgorithm ? "var(--accent)" : "var(--border-soft)"}`,
                  background: a.id === lbAlgorithm ? "var(--accent-soft)" : "transparent",
                }}
              >
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
