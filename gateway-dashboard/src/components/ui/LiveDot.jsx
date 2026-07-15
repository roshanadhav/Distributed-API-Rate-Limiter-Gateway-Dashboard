import React from "react";

export default function LiveDot({ color = "var(--success)" }) {
  return <span className="gw-live-dot" style={{ color }} />;
}
