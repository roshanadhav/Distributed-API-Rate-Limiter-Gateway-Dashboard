import React, { useEffect, useRef, useState } from "react";
import { Search, ArrowDownToLine } from "lucide-react";
import { useEngine } from "../context/EngineContext.jsx";

const LEVEL_COLOR = { INFO: "var(--accent-2)", SUCCESS: "var(--success)", WARNING: "var(--warn)", ERROR: "var(--danger)" };
const LEVEL_SOFT = { INFO: "var(--accent-2-soft)", SUCCESS: "var(--success-soft)", WARNING: "var(--warn-soft)", ERROR: "var(--danger-soft)" };

export default function LogsPage() {
  const { logs } = useEngine();
  const [query, setQuery] = useState("");
  const [levels, setLevels] = useState(["INFO", "SUCCESS", "WARNING", "ERROR"]);
  const [autoScroll, setAutoScroll] = useState(true);
  const boxRef = useRef(null);

  const filtered = logs.filter(
    (l) => levels.includes(l.level) && (query === "" || l.message.toLowerCase().includes(query.toLowerCase()) || l.service.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    if (autoScroll && boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [filtered.length, autoScroll]);

  const toggleLevel = (lvl) => setLevels((prev) => (prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]));

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Logs</div>
          <div className="gw-page-sub">Events derived from live health/status changes detected between gateway polls (no log-streaming endpoint is available yet).</div>
        </div>
        <span className="gw-badge healthy">Live</span>
      </div>

      <div className="gw-card gw-card-pad" style={{ marginBottom: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div className="gw-search" style={{ width: 280 }}>
          <Search size={13} />
          <input placeholder="Search logs by message or service…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["INFO", "SUCCESS", "WARNING", "ERROR"].map((lvl) => (
            <div
              key={lvl}
              onClick={() => toggleLevel(lvl)}
              className="gw-badge"
              style={{
                cursor: "pointer",
                background: levels.includes(lvl) ? LEVEL_SOFT[lvl] : "var(--surface-2)",
                color: levels.includes(lvl) ? LEVEL_COLOR[lvl] : "var(--text-faint)",
                border: `1px solid ${levels.includes(lvl) ? "transparent" : "var(--border)"}`,
              }}
            >
              {lvl}
            </div>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className={`gw-btn sm ${autoScroll ? "primary" : "ghost"}`} onClick={() => setAutoScroll((s) => !s)}>
            <ArrowDownToLine size={12} />
            Auto-scroll
          </button>
        </div>
      </div>

      <div className="gw-card" style={{ padding: "10px 4px" }}>
        <div
          style={{
            padding: "0 12px 8px", display: "grid", gridTemplateColumns: "92px 76px 120px 1fr", gap: 12,
            fontSize: 10, color: "var(--text-faint)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 0.5,
          }}
        >
          <span>Time</span>
          <span>Level</span>
          <span>Service</span>
          <span>Message</span>
        </div>
        <div ref={boxRef} className="gw-scrollbox" style={{ maxHeight: 520 }}>
          {filtered.map((l) => (
            <div key={l.id} className="gw-log-row">
              <span style={{ color: "var(--text-faint)" }}>{l.time}</span>
              <span className="gw-log-level" style={{ color: LEVEL_COLOR[l.level] }}>{l.level}</span>
              <span style={{ color: "var(--text-dim)" }}>{l.service}</span>
              <span style={{ color: "var(--text)" }}>{l.message}</span>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "var(--text-faint)", fontSize: 12.5 }}>No log lines match this filter.</div>}
        </div>
      </div>
    </div>
  );
}
