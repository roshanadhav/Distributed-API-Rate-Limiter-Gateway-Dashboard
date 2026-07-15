import React, { useState } from "react";
import { Play, RotateCcw, MoreVertical } from "lucide-react";
import { useEngine } from "../context/EngineContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import SectionCard from "../components/ui/SectionCard.jsx";
import Toast from "../components/ui/Toast.jsx";
import { LB_ALGORITHMS, RL_ALGORITHMS } from "../lib/constants.js";

export default function SettingsPage() {
  const { lbAlgorithm, rlAlgorithm, setServices, services } = useEngine();
  const { theme, toggleTheme } = useTheme();
  const [toast, setToast] = useState(null);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const triggerHealthCheck = () => {
    flash("Health check triggered across all services");
    setServices((prev) => prev.map((s) => ({ ...s, lastCheck: new Date() })));
  };

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Settings</div>
          <div className="gw-page-sub">Admin controls and system configuration.</div>
        </div>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 16 }}>
        <SectionCard eyebrow="Admin Controls" title="Quick Actions">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12.8, fontWeight: 600 }}>Trigger health check</div>
                <div style={{ fontSize: 11, color: "var(--text-faint)" }}>Run an immediate probe across every instance.</div>
              </div>
              <button className="gw-btn sm primary" onClick={triggerHealthCheck}><Play size={12} />Run</button>
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
                <div style={{ fontSize: 12.8, fontWeight: 600 }}>Reset all instances to healthy</div>
                <div style={{ fontSize: 11, color: "var(--text-faint)" }}>Clears warning/down state across the fleet.</div>
              </div>
              <button
                className="gw-btn sm ghost"
                onClick={() => {
                  setServices((prev) => prev.map((s) => ({ ...s, status: "healthy" })));
                  flash("All instances reset to healthy");
                }}
              >
                <RotateCcw size={12} />
                Reset
              </button>
            </div>
          </div>
        </SectionCard>

        <SectionCard eyebrow="System Configuration" title="Current Configuration">
          <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 12.5 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-dim)" }}>Load balancing algorithm</span>
              <span className="gw-mono">{LB_ALGORITHMS.find((a) => a.id === lbAlgorithm).name}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-dim)" }}>Rate limiting algorithm</span>
              <span className="gw-mono">{RL_ALGORITHMS.find((a) => a.id === rlAlgorithm).name}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-dim)" }}>Health check interval</span>
              <span className="gw-mono">5s</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-dim)" }}>Registered services</span>
              <span className="gw-mono">{services.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-dim)" }}>Gateway region</span>
              <span className="gw-mono">us-east-1</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-dim)" }}>TLS</span>
              <span className="gw-badge healthy">Enabled</span>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard eyebrow="Access" title="API Keys">
        <table className="gw-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Prefix</th>
              <th>Scope</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CI/CD Pipeline</td>
              <td className="gw-mono">agw_live_4f2a…</td>
              <td>Read/Write</td>
              <td style={{ color: "var(--text-dim)" }}>Mar 2, 2026</td>
              <td><MoreVertical size={14} color="var(--text-faint)" /></td>
            </tr>
            <tr>
              <td>Grafana Exporter</td>
              <td className="gw-mono">agw_live_9c1d…</td>
              <td>Read Only</td>
              <td style={{ color: "var(--text-dim)" }}>Jan 18, 2026</td>
              <td><MoreVertical size={14} color="var(--text-faint)" /></td>
            </tr>
          </tbody>
        </table>
      </SectionCard>

      <Toast message={toast} />
    </div>
  );
}
