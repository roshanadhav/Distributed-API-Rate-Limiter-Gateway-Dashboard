import React from "react";
import { STATUS_META } from "../../lib/constants.js";

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.healthy;
  const Icon = meta.Icon;
  return (
    <span className={`gw-badge ${meta.badge}`}>
      <Icon size={11} />
      {meta.label}
    </span>
  );
}
