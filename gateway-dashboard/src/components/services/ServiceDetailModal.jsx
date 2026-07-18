import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
} from "recharts";
import { Cpu, HardDrive } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import SectionCard from "../ui/SectionCard.jsx";
import StatusBadge from "../ui/StatusBadge.jsx";
import ChartTooltip from "../ui/ChartTooltip.jsx";
import { useEngine } from "../../context/EngineContext.jsx";
import { getServiceDetail } from "../../api/client.js";
import { formatEpoch } from "../../lib/mappers.js";
import { fmtNum } from "../../lib/utils.js";

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

export default function ServiceDetailModal({ svc, onClose }) {
  const { logs, serviceHistory } = useEngine();
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setDetail(null);
    setDetailError(null);
    getServiceDetail(svc.id)
      .then((res) => {
        if (!cancelled) setDetail(res.data);
      })
      .catch((err) => {
        if (!cancelled) setDetailError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [svc.id]);

  const history = serviceHistory[svc.id] || [];
  const svcLogs = logs.filter((l) => l.service === svc.id).slice(0, 8);

  return (
    <Modal open onClose={onClose} title={svc.id} large footer={<button className="gw-btn ghost" onClick={onClose}>Close</button>}>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <StatusBadge status={svc.status} />
        <span className="gw-badge neutral">{svc.group}</span>
        <span className="gw-badge neutral">{svc.activeConnections} active connections</span>
        {detail?.errorRate != null && <span className="gw-badge neutral">{detail.errorRate.toFixed?.(2) ?? detail.errorRate}% error rate</span>}
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 16 }}>
        <div className="gw-card gw-card-pad"><div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>CPU</div><div className="gw-mono" style={{ fontSize: 18, fontWeight: 700 }}>{svc.cpu}%</div></div>
        <div className="gw-card gw-card-pad"><div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>Memory</div><div className="gw-mono" style={{ fontSize: 18, fontWeight: 700 }}>{svc.mem}%</div></div>
        <div className="gw-card gw-card-pad"><div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>Requests</div><div className="gw-mono" style={{ fontSize: 18, fontWeight: 700 }}>{svc.rps}/s</div></div>
        <div className="gw-card gw-card-pad"><div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>Latency</div><div className="gw-mono" style={{ fontSize: 18, fontWeight: 700 }}>{svc.latency}ms</div></div>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 16 }}>
        <SectionCard title="CPU & Memory (this session)">
          {history.length > 1 ? (
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
          ) : (
            <div style={{ fontSize: 11.5, color: "var(--text-faint)", padding: "30px 0", textAlign: "center" }}>Collecting samples — chart fills in as the dashboard polls.</div>
          )}
        </SectionCard>
        <SectionCard title="Requests & Latency (this session)">
          {history.length > 1 ? (
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
          ) : (
            <div style={{ fontSize: 11.5, color: "var(--text-faint)", padding: "30px 0", textAlign: "center" }}>Collecting samples — chart fills in as the dashboard polls.</div>
          )}
        </SectionCard>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <SectionCard title="Recent Log Events">
          <div className="gw-scrollbox" style={{ maxHeight: 160 }}>
            {svcLogs.length === 0 && <div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>No status-change events for this instance yet.</div>}
            {svcLogs.map((l) => (
              <div key={l.id} style={{ fontFamily: "var(--font-mono)", fontSize: 11, marginBottom: 5, color: "var(--text-dim)" }}>
                <span style={{ color: "var(--text-faint)" }}>{l.time}</span>{" "}
                <span style={{ color: l.level === "ERROR" ? "var(--danger)" : l.level === "WARNING" ? "var(--warn)" : "var(--text-dim)", fontWeight: 700 }}>{l.level}</span> {l.message}
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Process Detail">
          {detailError && <div style={{ fontSize: 11.5, color: "var(--danger)" }}>Couldn't load extra detail: {detailError}</div>}
          {!detail && !detailError && <div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>Loading…</div>}
          {detail && (
            <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 12 }}>
              <Row icon={Cpu} label="Threads" value={fmtNum(detail.threadCount ?? 0)} />
              <Row icon={HardDrive} label="Heap used / total" value={`${formatBytes(detail.heapUsed ?? 0)} / ${formatBytes(detail.heapTotal ?? 0)}`} />
              <Row label="Bytes received / sent" value={`${formatBytes(detail.bytesReceived ?? 0)} / ${formatBytes(detail.bytesSent ?? 0)}`} />
              <Row label="Process uptime" value={formatEpoch(detail.lastUpdated)} />
              <Row label="Last request at" value={detail.lastRequestAt ? formatEpoch(detail.lastRequestAt) : "—"} />
            </div>
          )}
        </SectionCard>
      </div>
    </Modal>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6 }}>
        {Icon && <Icon size={13} color="var(--text-faint)" />}
        {label}
      </span>
      <span className="gw-mono">{value}</span>
    </div>
  );
}
