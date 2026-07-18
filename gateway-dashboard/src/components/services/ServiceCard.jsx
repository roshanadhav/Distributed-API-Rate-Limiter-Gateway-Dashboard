import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RefreshCw, PowerOff, ShieldAlert } from "lucide-react";
import StatusBadge from "../ui/StatusBadge.jsx";
import ProgressBar from "../ui/ProgressBar.jsx";
import { fmtNum } from "../../lib/utils.js";

export default function ServiceCard({ svc, onAction }) {
  const navigate = useNavigate();
  return (
    <motion.div className="gw-card gw-card-pad" whileHover={{ y: -2 }} layout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ cursor: "pointer" }} onClick={() => navigate(`/services/${svc.id}`)}>
          <div className="gw-mono" style={{ fontWeight: 700, fontSize: 13.5 }}>{svc.id}</div>
          <div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>{svc.activeConnections} active conn.</div>
        </div>
        <StatusBadge status={svc.status} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-faint)", marginBottom: 3 }}>
            <span>CPU</span><span className="gw-mono">{svc.cpu}%</span>
          </div>
          <ProgressBar value={svc.cpu} color={svc.cpu > 80 ? "var(--danger)" : "var(--accent)"} />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-faint)", marginBottom: 3 }}>
            <span>Memory</span><span className="gw-mono">{svc.mem}%</span>
          </div>
          <ProgressBar value={svc.mem} color={svc.mem > 80 ? "var(--danger)" : "var(--accent-2)"} />
        </div>
      </div>
      <div className="gw-mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-dim)", marginBottom: 12 }}>
        <span>{svc.rps} req/s</span><span>{svc.latency}ms avg</span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button className="gw-btn sm ghost" onClick={() => onAction(svc, "restart")}><RefreshCw size={11} />Restart</button>
        <button className="gw-btn sm warn" onClick={() => onAction(svc, "disable")}><PowerOff size={11} />Disable</button>
        <button className="gw-btn sm danger" onClick={() => onAction(svc, "removeTraffic")}><ShieldAlert size={11} />Remove Traffic</button>
      </div>
    </motion.div>
  );
}
