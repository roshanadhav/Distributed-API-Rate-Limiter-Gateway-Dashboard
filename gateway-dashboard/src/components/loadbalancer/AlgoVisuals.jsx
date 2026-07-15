import React from "react";
import { ArrowRight, Timer, Hash, Lock, CircleDot } from "lucide-react";

export const ALGO_VISUAL = {
  cycle: ({ nodes }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 11 }}>
      {nodes.map((n, i) => (
        <React.Fragment key={n}>
          <span style={{ padding: "3px 8px", borderRadius: 6, background: "var(--surface-2)", border: "1px solid var(--border)" }}>{n}</span>
          {i < nodes.length - 1 && <ArrowRight size={12} color="var(--text-faint)" />}
        </React.Fragment>
      ))}
    </div>
  ),
  weighted: ({ nodes }) => (
    <div style={{ display: "flex", gap: 6 }}>
      {nodes.map((n, i) => (
        <div
          key={n}
          style={{
            flex: [3, 2, 1][i] || 1, height: 22, borderRadius: 5, background: "var(--accent-soft)",
            border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9.5, fontFamily: "var(--font-mono)", color: "var(--accent)",
          }}
        >
          {n}
        </div>
      ))}
    </div>
  ),
  leastconn: () => (
    <div style={{ fontSize: 11, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6 }}>
      <ArrowRight size={13} color="var(--accent)" /> Traffic moves toward the least-busy instance
    </div>
  ),
  latency: () => (
    <div style={{ fontSize: 11, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6 }}>
      <Timer size={13} color="var(--accent)" /> Traffic favors the fastest-responding instance
    </div>
  ),
  random: () => (
    <div style={{ fontSize: 11, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6 }}>
      <Hash size={13} color="var(--accent)" /> Each request lands on a uniformly random instance
    </div>
  ),
  hash: () => (
    <div style={{ fontSize: 11, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6 }}>
      <Lock size={13} color="var(--accent)" /> Same client IP always maps to the same instance
    </div>
  ),
  ring: () => (
    <div style={{ fontSize: 11, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 6 }}>
      <CircleDot size={13} color="var(--accent)" /> Instances placed on a hash ring; only neighbors remap on scale
    </div>
  ),
};

export function computeDistribution(algorithm, instances) {
  const n = instances.length;
  switch (algorithm) {
    case "weighted-round-robin": {
      const totalW = instances.reduce((a, s) => a + s.weight, 0);
      return instances.map((s) => ({ id: s.id, pct: Math.round((s.weight / totalW) * 100) }));
    }
    case "least-connection":
    case "least-response-time": {
      const inv = instances.map((s) => 1 / Math.max(1, algorithm === "least-connection" ? s.cpu : s.latency));
      const total = inv.reduce((a, b) => a + b, 0);
      return instances.map((s, i) => ({ id: s.id, pct: Math.round((inv[i] / total) * 100) }));
    }
    case "ip-hash":
    case "consistent-hashing": {
      let acc = [];
      let remaining = 100;
      instances.forEach((s, i) => {
        const v = i === instances.length - 1 ? remaining : Math.round(100 / n + (Math.random() * 12 - 6));
        acc.push({ id: s.id, pct: v });
        remaining -= v;
      });
      return acc;
    }
    case "random": {
      let acc = [];
      let remaining = 100;
      instances.forEach((s, i) => {
        const v = i === instances.length - 1 ? remaining : Math.round(100 / n + (Math.random() * 20 - 10));
        acc.push({ id: s.id, pct: v });
        remaining -= v;
      });
      return acc;
    }
    default:
      return instances.map((s) => ({ id: s.id, pct: Math.round(100 / n) }));
  }
}
