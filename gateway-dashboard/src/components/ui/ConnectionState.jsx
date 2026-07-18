import React from "react";
import { RefreshCw } from "lucide-react";

export function LoadingState({ label = "Connecting to the gateway…" }) {
  return (
    <div style={{ padding: "60px 0", textAlign: "center", color: "var(--text-faint)" }}>
      {label}
    </div>
  );
}

export function UnreachableState({ onRetry, error }) {
  return (
    <div className="gw-card gw-card-pad" style={{ textAlign: "center", padding: 40 }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Can't reach the gateway</div>
      <div style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 6 }}>
        Check that the gateway is running and that the API base URL in <span className="gw-mono">src/config.js</span> points to it.
      </div>
      {error && (
        <div className="gw-mono" style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 16 }}>{error}</div>
      )}
      <button className="gw-btn primary" onClick={onRetry} style={{ margin: "16px auto 0" }}>
        <RefreshCw size={13} />
        Retry
      </button>
    </div>
  );
}
