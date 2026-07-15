import React from "react";
import { motion } from "framer-motion";

export function FlowStage({ icon: Icon, label, sub, active }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 150 }}>
      <motion.div
        animate={{ boxShadow: active ? "0 0 0 6px var(--accent-soft)" : "0 0 0 0px transparent" }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        style={{ width: 56, height: 56, borderRadius: 14, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}
      >
        <Icon size={22} />
      </motion.div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12.5, fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>{sub}</div>
      </div>
    </div>
  );
}

export function FlowConnector() {
  return (
    <svg width="70" height="4" style={{ marginTop: -30, flexShrink: 0 }}>
      <line x1="0" y1="2" x2="70" y2="2" stroke="var(--border)" strokeWidth="1.4" />
      <circle cy="2" r="3" fill="var(--accent)">
        <animateMotion dur="1.3s" repeatCount="indefinite" path="M0,0 L70,0" />
      </circle>
    </svg>
  );
}
