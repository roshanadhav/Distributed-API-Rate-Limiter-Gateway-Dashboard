import React, { useEffect, useState } from "react";
import { HeartPulse, Boxes, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { useEngine } from "../context/EngineContext.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import SectionCard from "../components/ui/SectionCard.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { randInt } from "../lib/utils.js";

const EVENT_COLOR = { Failed: "var(--danger)", Removed: "var(--danger)", Degraded: "var(--warn)", Recovered: "var(--success)" };

export default function HealthCheckerPage() {
  const { services, healthEvents } = useEngine();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);
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
              <tr>
                <th>Service</th>
                <th>Status</th>
                <th>Last Check</th>
                <th>Response</th>
                <th>Failures</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id}>
                  <td className="gw-mono">{s.id}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td className="gw-mono" style={{ color: "var(--text-dim)" }}>
                    {(Math.max(0, Math.round((now - s.lastCheck.getTime()) / 1000)) % 5) + 1}s ago
                  </td>
                  <td className="gw-mono">{s.latency}ms</td>
                  <td className="gw-mono" style={{ color: s.status === "down" ? "var(--danger)" : "var(--text-dim)" }}>
                    {s.status === "down" ? randInt(1, 4) : 0}
                  </td>
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
