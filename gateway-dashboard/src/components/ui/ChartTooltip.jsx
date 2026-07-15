import React from "react";
import { fmtNum } from "../../lib/utils.js";

export default function ChartTooltip({ active, payload, label, unit }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: "var(--elevated)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "8px 11px",
        fontSize: 11.5,
        fontFamily: "var(--font-mono)",
      }}
    >
      <div style={{ color: "var(--text-faint)", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {fmtNum(p.value)}
          {unit || ""}
        </div>
      ))}
    </div>
  );
}
