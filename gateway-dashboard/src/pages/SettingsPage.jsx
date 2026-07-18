import React, { useState } from "react";
import { RefreshCw, Save } from "lucide-react";
import { useEngine } from "../context/EngineContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import SectionCard from "../components/ui/SectionCard.jsx";
import Toast from "../components/ui/Toast.jsx";
import { LoadingState, UnreachableState } from "../components/ui/ConnectionState.jsx";
import { API_BASE_URL, POLL_INTERVAL_MS } from "../config.js";

export default function SettingsPage() {
  const { gatewayDetails, services, connection, connectionError, refreshNow, lastUpdated } = useEngine();
  const { theme, toggleTheme } = useTheme();
  const [toast, setToast] = useState(null);
  const [apiBaseInput, setApiBaseInput] = useState(API_BASE_URL);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const saveApiBase = () => {
    const cleaned = apiBaseInput.trim().replace(/\/$/, "");
    if (!cleaned) return;
    window.localStorage.setItem("apexgw:apiBase", cleaned);
    flash("API base URL saved — reloading…");
    setTimeout(() => window.location.reload(), 600);
  };

  if (connection === "connecting" && !gatewayDetails) return <LoadingState />;
  if (connection === "error" && !gatewayDetails) return <UnreachableState onRetry={refreshNow} error={connectionError} />;

  const { config, loadBalancer, rateLimiter } = gatewayDetails || {};

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Settings</div>
          <div className="gw-page-sub">Live gateway configuration and dashboard connection settings.</div>
        </div>
        <button className="gw-btn primary" onClick={refreshNow}><RefreshCw size={13} />Refresh now</button>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 16 }}>
        <SectionCard eyebrow="Dashboard" title="Connection">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <div style={{ fontSize: 12.8, fontWeight: 600, marginBottom: 4 }}>API base URL</div>
              <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 8 }}>
                Every request in this app is built from this single value (see <span className="gw-mono">src/config.js</span>). Change it here to point the whole dashboard at a different host — no other file needs editing.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={apiBaseInput}
                  onChange={(e) => setApiBaseInput(e.target.value)}
                  className="gw-mono"
                  style={{ flex: 1, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 12.5, outline: "none" }}
                  placeholder="http://localhost:3000"
                />
                <button className="gw-btn sm primary" onClick={saveApiBase}><Save size={12} />Save & reload</button>
              </div>
            </div>
            <hr className="gw-divider" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12.8, fontWeight: 600 }}>Interface theme</div>
                <div style={{ fontSize: 11, color: "var(--text-faint)" }}>Switch between dark and light mode.</div>
              </div>
              <button className="gw-btn sm ghost" onClick={toggleTheme}>{theme === "dark" ? "Switch to light" : "Switch to dark"}</button>
            </div>
            <hr className="gw-divider" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12.8, fontWeight: 600 }}>Poll interval</div>
                <div style={{ fontSize: 11, color: "var(--text-faint)" }}>How often the dashboard re-fetches the four admin endpoints.</div>
              </div>
              <span className="gw-mono" style={{ fontSize: 12.5 }}>{POLL_INTERVAL_MS / 1000}s</span>
            </div>
            <hr className="gw-divider" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 12.8, fontWeight: 600 }}>Last synced</div>
              <span className="gw-mono" style={{ fontSize: 12.5 }}>{lastUpdated ? lastUpdated.toLocaleTimeString("en-US", { hour12: false }) : "—"}</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard eyebrow="Gateway" title="Live Configuration">
          <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 12.5 }}>
            <Row label="Gateway name" value={config?.gatewayName || "—"} />
            <Row label="Version" value={config?.version || "—"} />
            <Row label="Environment" value={config?.environment || "—"} />
            <Row label="Started at" value={config?.startedAt ? new Date(config.startedAt).toLocaleString() : "—"} />
            <Row label="Load balancing algorithm" value={loadBalancer?.algorithm || "—"} />
            <Row label="Rate limiting algorithm" value={rateLimiter?.algorithm || "—"} />
            <Row label="Rate limit" value={rateLimiter ? `${rateLimiter.default_limit} req / ${rateLimiter.window_seconds}s` : "—"} />
            <Row label="Registered services" value={String(services.length)} />
          </div>
        </SectionCard>
      </div>

      <Toast message={toast} />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "var(--text-dim)" }}>{label}</span>
      <span className="gw-mono">{value}</span>
    </div>
  );
}
