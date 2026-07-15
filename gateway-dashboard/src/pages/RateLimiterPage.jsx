import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
} from "recharts";
import { Gauge, CheckCircle2, XCircle, Zap, AlertTriangle } from "lucide-react";
import { useEngine } from "../context/EngineContext.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import SectionCard from "../components/ui/SectionCard.jsx";
import ProgressBar from "../components/ui/ProgressBar.jsx";
import ChartTooltip from "../components/ui/ChartTooltip.jsx";
import { RL_ALGORITHMS } from "../lib/constants.js";
import { fmtCompact, uid } from "../lib/utils.js";

export default function RateLimiterPage() {
  const { rlAlgorithm, setRlAlgorithm, bucket, metrics } = useEngine();
  const [rejects, setRejects] = useState([]);
  const prevTokens = useRef(bucket.tokens);

  useEffect(() => {
    if (bucket.tokens <= 1 && prevTokens.current > 1) {
      const id = uid();
      setRejects((r) => [...r.slice(-8), id]);
      setTimeout(() => setRejects((r) => r.filter((x) => x !== id)), 1200);
    }
    prevTokens.current = bucket.tokens;
  }, [bucket.tokens]);

  const current = RL_ALGORITHMS.find((a) => a.id === rlAlgorithm);
  const fillPct = (bucket.tokens / bucket.capacity) * 100;
  const total = bucket.allowed + bucket.blocked;
  const blockRate = ((bucket.blocked / Math.max(1, total)) * 100).toFixed(2);

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Rate Limiter</div>
          <div className="gw-page-sub">Request throttling engine and algorithm configuration.</div>
        </div>
        <span className="gw-badge info"><Gauge size={11} /> {current.name}</span>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 16 }}>
        <StatCard icon={CheckCircle2} label="Requests Allowed" value={fmtCompact(bucket.allowed)} tint="var(--success)" />
        <StatCard icon={XCircle} label="Requests Blocked" value={fmtCompact(bucket.blocked)} tint="var(--danger)" />
        <StatCard icon={Zap} label="Remaining Tokens" value={Math.round(bucket.tokens)} unit={`/ ${bucket.capacity}`} tint="var(--accent)" />
        <StatCard icon={AlertTriangle} label="Block Rate" value={blockRate} unit="%" tint="var(--warn)" />
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 16 }}>
        <SectionCard eyebrow="Live Visualization" title="Token Bucket">
          <div style={{ display: "flex", alignItems: "flex-end", gap: 26, padding: "10px 6px 4px" }}>
            <div style={{ position: "relative", width: 110, height: 160, flexShrink: 0 }}>
              <svg width="110" height="160" viewBox="0 0 110 160">
                <path d="M10,10 L100,10 L92,152 L18,152 Z" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1.6" />
                <clipPath id="bucket-clip">
                  <path d="M12,12 L98,12 L91,150 L19,150 Z" />
                </clipPath>
                <motion.rect
                  x="10"
                  width="90"
                  fill="var(--accent)"
                  opacity="0.55"
                  clipPath="url(#bucket-clip)"
                  animate={{ y: 150 - (fillPct / 100) * 138, height: (fillPct / 100) * 138 + 12 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <text x="55" y="85" textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--text)" fontFamily="var(--font-mono)">
                  {Math.round(bucket.tokens)}
                </text>
                <text x="55" y="100" textAnchor="middle" fontSize="9" fill="var(--text-faint)" fontFamily="var(--font-mono)">
                  tokens
                </text>
              </svg>
              <AnimatePresence>
                {rejects.map((id) => (
                  <motion.div
                    key={id}
                    initial={{ opacity: 1, x: 0, y: 40 }}
                    animate={{ opacity: 0, x: 60, y: 10 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.1 }}
                    style={{ position: "absolute", left: 6, top: 30, fontSize: 10, color: "var(--danger)", fontFamily: "var(--font-mono)", fontWeight: 700 }}
                  >
                    ✕ 429
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>
                Bucket refills at <strong className="gw-mono" style={{ color: "var(--text)" }}>{bucket.refillRate} tokens/sec</strong>. Each request consumes
                one token; when the bucket is empty, incoming requests are rejected with <span className="gw-mono">HTTP 429</span>.
              </div>
              <ProgressBar value={fillPct} color={fillPct < 15 ? "var(--danger)" : fillPct < 40 ? "var(--warn)" : "var(--accent)"} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10.5, color: "var(--text-faint)" }}>
                <span>0</span>
                <span>capacity {bucket.capacity}</span>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
                <div>
                  <div className="gw-mono" style={{ fontSize: 18, fontWeight: 700, color: "var(--success)" }}>{fmtCompact(bucket.allowed)}</div>
                  <div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>Allowed</div>
                </div>
                <div>
                  <div className="gw-mono" style={{ fontSize: 18, fontWeight: 700, color: "var(--danger)" }}>{fmtCompact(bucket.blocked)}</div>
                  <div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>Blocked</div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard eyebrow="Configuration" title="Limiting Algorithm">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {RL_ALGORITHMS.map((a) => (
              <div
                key={a.id}
                onClick={() => setRlAlgorithm(a.id)}
                style={{
                  padding: "10px 12px", borderRadius: 9, cursor: "pointer",
                  border: `1px solid ${a.id === rlAlgorithm ? "var(--accent)" : "var(--border-soft)"}`,
                  background: a.id === rlAlgorithm ? "var(--accent-soft)" : "transparent",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: a.id === rlAlgorithm ? "var(--accent)" : "var(--text)" }}>{a.name}</span>
                  {a.id === rlAlgorithm && <CheckCircle2 size={14} color="var(--accent)" />}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-dim)", marginBottom: 6 }}>{a.desc}</div>
                <div style={{ display: "flex", gap: 10, fontSize: 10.8 }}>
                  <span style={{ color: "var(--success)" }}>+ {a.pro}</span>
                </div>
                <div style={{ fontSize: 10.8, color: "var(--danger)" }}>− {a.con}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard eyebrow="Traffic" title="Requests: Allowed vs Blocked">
        <ResponsiveContainer width="100%" height={190}>
          <AreaChart data={metrics}>
            <defs>
              <linearGradient id="rl-lim" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--warn)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--warn)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border-soft)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
            <YAxis stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} width={30} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="limited" name="Blocked" stroke="var(--warn)" strokeWidth={2} fill="url(#rl-lim)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
}
