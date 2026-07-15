import React, { useMemo } from "react";
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
} from "recharts";
import { MapPin, GitBranch } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import SectionCard from "../ui/SectionCard.jsx";
import StatusBadge from "../ui/StatusBadge.jsx";
import ChartTooltip from "../ui/ChartTooltip.jsx";
import { useEngine } from "../../context/EngineContext.jsx";
import { clamp, rand } from "../../lib/utils.js";

export default function ServiceDetailModal({ svc, onClose }) {
  const { logs } = useEngine();

  const history = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        time: i,
        cpu: clamp(svc.cpu + rand(-10, 10), 5, 95),
        mem: clamp(svc.mem + rand(-8, 8), 5, 95),
        rps: clamp(svc.rps + rand(-20, 20), 1, 260),
        latency: clamp(svc.latency + rand(-8, 8), 10, 300),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [svc.id]
  );

  const svcLogs = logs.filter((l) => l.service === svc.id).slice(-8).reverse();
  const deps =
    svc.group === "User Service"
      ? ["auth-service", "postgres-users", "redis-cache"]
      : svc.group === "Auth Service"
      ? ["postgres-auth", "redis-sessions"]
      : ["postgres-admin", "audit-log-service"];

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
              <XAxis dataKey="time" hide />
              <YAxis stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} width={26} />
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
              <XAxis dataKey="time" hide />
              <YAxis stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} width={26} />
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
            {svcLogs.length === 0 && <div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>No recent log lines for this instance.</div>}
            {svcLogs.map((l) => (
              <div key={l.id} style={{ fontFamily: "var(--font-mono)", fontSize: 11, marginBottom: 5, color: "var(--text-dim)" }}>
                <span style={{ color: "var(--text-faint)" }}>{l.time}</span>{" "}
                <span style={{ color: l.level === "ERROR" ? "var(--danger)" : l.level === "WARNING" ? "var(--warn)" : "var(--text-dim)", fontWeight: 700 }}>{l.level}</span> {l.message}
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
}
