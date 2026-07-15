import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { useEngine } from "../../context/EngineContext.jsx";

export default function NotificationBell({ open, setOpen }) {
  const { notifications, setNotifications } = useEngine();
  const navigate = useNavigate();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ position: "relative" }}>
      <div
        className="gw-icon-btn"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        <Bell size={16} />
        {unread > 0 && <span className="gw-badge-dot">{unread > 9 ? "9+" : unread}</span>}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="gw-card"
            style={{ position: "absolute", right: 0, top: 42, width: 320, zIndex: 60, overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-soft)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>Notifications</span>
              <span className="gw-mono" style={{ fontSize: 11, color: "var(--text-faint)" }}>{unread} unread</span>
            </div>
            <div className="gw-scrollbox" style={{ maxHeight: 320 }}>
              {notifications.slice(0, 6).map((n) => (
                <div key={n.id} style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-soft)", display: "flex", gap: 9 }}>
                  <div
                    style={{
                      width: 6, height: 6, borderRadius: "50%", marginTop: 5, flexShrink: 0,
                      background: n.severity === "critical" ? "var(--danger)" : n.severity === "warning" ? "var(--warn)" : "var(--accent-2)",
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{n.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{n.message}</div>
                    <div className="gw-mono" style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 3 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{ padding: "9px 14px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "var(--accent)", cursor: "pointer" }}
              onClick={() => {
                navigate("/notifications");
                setOpen(false);
                setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
              }}
            >
              View all notifications
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
