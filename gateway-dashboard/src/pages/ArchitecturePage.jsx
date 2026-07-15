import React, { useState } from "react";
import ArchitectureDiagram from "../components/architecture/ArchitectureDiagram.jsx";
import ArchitectureInfoPanel from "../components/architecture/ArchitectureInfoPanel.jsx";

export default function ArchitecturePage() {
  const [selected, setSelected] = useState("gateway");

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Architecture</div>
          <div className="gw-page-sub">Live topology of the distributed gateway. Drag nodes, scroll to zoom, double-click to open a page.</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 14 }}>
        <ArchitectureDiagram selected={selected} onSelect={setSelected} />
        <ArchitectureInfoPanel selected={selected} />
      </div>
    </div>
  );
}
