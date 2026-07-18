import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, AlertTriangle, Bell } from "lucide-react";
import { useEngine } from "../context/EngineContext.jsx";
import StatCard from "../components/ui/StatCard.jsx";

const SEV_META = {
  critical: { color: "var(--danger)", soft: "var(--danger-soft)", icon: ShieldAlert, label: "Critical" },
  warning: { color: "var(--warn)", soft: "var(--warn-soft)", icon: AlertTriangle, label: "Warning" },
  info: { color: "var(--accent-2)", soft: "var(--accent-2-soft)", icon: Bell, label: "Info" },
};

export default function NotificationsPage() {
  const { notifications, setNotifications } = useEngine();
  const [filter, setFilter] = useState("all");
  const list = filter === "all" ? notifications : notifications.filter((n) => n.severity === filter);
  const counts = {
    critical: notifications.filter((n) => n.severity === "critical").length,
    warning: notifications.filter((n) => n.severity === "warning").length,
    info: notifications.filter((n) => n.severity === "info").length,
  };

  const markRead = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Notifications</div>
          <div className="gw-page-sub">Generated automatically when a service's health changes on a live gateway poll.</div>
        </div>
        <button className="gw-btn ghost" onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}>
          Mark all read
        </button>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 16 }}>
        <StatCard icon={ShieldAlert} label="Critical" value={counts.critical} tint="var(--danger)" />
        <StatCard icon={AlertTriangle} label="Warnings" value={counts.warning} tint="var(--warn)" />
        <StatCard icon={Bell} label="Info" value={counts.info} tint="var(--accent-2)" />
      </div>

      <div className="gw-tabs" style={{ marginBottom: 14 }}>
        {["all", "critical", "warning", "info"].map((f) => (
          <div key={f} className={`gw-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)} style={{ textTransform: "capitalize" }}>
            {f}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {list.map((n) => {
          const meta = SEV_META[n.severity];
          const Icon = meta.icon;
          return (
            <motion.div key={n.id} layout className="gw-card gw-card-pad" style={{ display: "flex", gap: 12, borderLeft: `3px solid ${meta.color}`, opacity: n.read ? 0.72 : 1 }}>
              <span style={{ width: 34, height: 34, borderRadius: 9, background: meta.soft, color: meta.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={16} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{n.title}</div>
                  <span className="gw-mono" style={{ fontSize: 10.5, color: "var(--text-faint)", flexShrink: 0 }}>{n.time}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 3 }}>{n.message}</div>
              </div>
              {!n.read && (
                <div className="gw-btn sm ghost" style={{ alignSelf: "center", flexShrink: 0 }} onClick={() => markRead(n.id)}>
                  Mark read
                </div>
              )}
            </motion.div>
          );
        })}
        {list.length === 0 && (
          <div className="gw-card gw-card-pad" style={{ textAlign: "center", color: "var(--text-faint)", fontSize: 12.5 }}>
            No notifications yet — these appear the moment a service's health changes between polls.
          </div>
        )}
      </div>
    </div>
  );
}
