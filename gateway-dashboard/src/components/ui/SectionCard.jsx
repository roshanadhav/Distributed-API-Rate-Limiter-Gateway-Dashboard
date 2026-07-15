import React from "react";

export default function SectionCard({ title, eyebrow, right, children, style }) {
  return (
    <div className="gw-card gw-card-pad" style={style}>
      {(title || right) && (
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, gap: 10, flexWrap: "wrap" }}>
          <div>
            {eyebrow && <div className="gw-eyebrow">{eyebrow}</div>}
            {title && <div style={{ fontSize: 14, fontWeight: 700 }}>{title}</div>}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}
