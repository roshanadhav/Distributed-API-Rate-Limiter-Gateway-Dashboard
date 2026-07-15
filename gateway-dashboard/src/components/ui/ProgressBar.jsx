import React from "react";
import { clamp } from "../../lib/utils.js";

export default function ProgressBar({ value, max = 100, color = "var(--accent)" }) {
  return (
    <div className="gw-progress-track">
      <div
        className="gw-progress-fill"
        style={{ width: `${clamp((value / max) * 100, 0, 100)}%`, background: color }}
      />
    </div>
  );
}
