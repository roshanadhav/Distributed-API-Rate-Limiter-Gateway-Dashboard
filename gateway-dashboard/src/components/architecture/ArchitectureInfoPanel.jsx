import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEngine } from "../../context/EngineContext.jsx";
import StatusBadge from "../ui/StatusBadge.jsx";
import { ARCH_STATIC_NODES, NODE_PAGE_MAP } from "../../lib/constants.js";

export default function ArchitectureInfoPanel({ selected }) {
  const { services } = useEngine();
  const navigate = useNavigate();

  const info = useMemo(() => {
    if (services.some((s) => s.id === selected)) return services.find((s) => s.id === selected);
    return ARCH_STATIC_NODES.find((n) => n.id === selected);
  }, [selected, services]);

  const openPage = () => {
    if (!info) return;
    if (NODE_PAGE_MAP[info.id]) navigate(NODE_PAGE_MAP[info.id]);
    else navigate(`/services/${info.id}`);
  };

  return (
    <div className="gw-card gw-card-pad" style={{ height: "fit-content", position: "sticky", top: 76 }}>
      {info && (
        <>
          <div className="gw-eyebrow">Selected node</div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{info.label || info.id}</div>
          {info.status && (
            <div style={{ marginBottom: 10 }}>
              <StatusBadge status={info.status} />
            </div>
          )}
          {info.sub && <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>{info.sub}</div>}
          {info.group && (
            <div className="gw-mono" style={{ fontSize: 11.5, color: "var(--text-dim)", display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
              <div>RPS · {info.rps}</div>
              <div>Latency · {info.latency}ms</div>
              <div>CPU · {info.cpu}%</div>
              <div>Zone · {info.zone}</div>
            </div>
          )}
          <button className="gw-btn primary sm" style={{ width: "100%", justifyContent: "center" }} onClick={openPage}>
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
  );
}
