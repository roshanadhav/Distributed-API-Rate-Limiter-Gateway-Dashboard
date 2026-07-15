import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wifi, Waypoints, CircleDot, ZoomIn, ZoomOut, Maximize2, ArrowRight } from "lucide-react";
import { useEngine } from "../../context/EngineContext.jsx";
import { STATUS_META, ARCH_STATIC_NODES, ARCH_SERVICE_X, NODE_PAGE_MAP } from "../../lib/constants.js";
import { clamp } from "../../lib/utils.js";

const NODE_ICON = { client: Wifi, gateway: Waypoints, hub: CircleDot };

export default function ArchitectureDiagram({ selected, onSelect }) {
  const { services } = useEngine();
  const navigate = useNavigate();
  const svgRef = useRef(null);

  const [positions, setPositions] = useState(() => {
    const p = {};
    ARCH_STATIC_NODES.forEach((n) => (p[n.id] = { x: n.x, y: n.y }));
    services.forEach((s) => (p[s.id] = { x: ARCH_SERVICE_X[s.id] || 500, y: 560 }));
    return p;
  });
  const [dragId, setDragId] = useState(null);
  const dragMoved = useRef(false);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 1000, h: 630 });

  const toSvgPoint = useCallback(
    (clientX, clientY) => {
      const rect = svgRef.current.getBoundingClientRect();
      return {
        x: viewBox.x + ((clientX - rect.left) / rect.width) * viewBox.w,
        y: viewBox.y + ((clientY - rect.top) / rect.height) * viewBox.h,
      };
    },
    [viewBox]
  );

  const onPointerDownNode = (id) => (e) => {
    e.stopPropagation();
    setDragId(id);
    dragMoved.current = false;
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragId) return;
      dragMoved.current = true;
      const pt = toSvgPoint(e.clientX, e.clientY);
      setPositions((prev) => ({ ...prev, [dragId]: { x: clamp(pt.x, 40, 960), y: clamp(pt.y, 20, 610) } }));
    };
    const onUp = () => setDragId(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragId, toSvgPoint]);

  const handleNodeClick = (id) => () => {
    if (!dragMoved.current) onSelect(id);
  };
  const handleNodeDouble = (id) => () => {
    if (NODE_PAGE_MAP[id]) navigate(NODE_PAGE_MAP[id]);
    else if (services.some((s) => s.id === id)) navigate(`/services/${id}`);
  };

  const zoom = (dir) =>
    setViewBox((vb) => {
      const factor = dir === "in" ? 0.85 : 1.176;
      const w = clamp(vb.w * factor, 500, 1400);
      const h = clamp(vb.h * factor, 315, 882);
      return { x: vb.x - (w - vb.w) / 2, y: vb.y - (h - vb.h) / 2, w, h };
    });
  const resetView = () => setViewBox({ x: 0, y: 0, w: 1000, h: 630 });

  const edges = useMemo(() => {
    const chain = [
      ["client", "gateway"],
      ["gateway", "healthchecker"],
      ["healthchecker", "loadbalancer"],
      ["loadbalancer", "ratelimiter"],
    ];
    const toServices = services.map((s) => ["ratelimiter", s.id]);
    return [...chain, ...toServices];
  }, [services]);

  return (
    <div className="gw-card" style={{ overflow: "hidden", position: "relative", height: 640 }}>
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 5, display: "flex", gap: 6 }}>
        <div className="gw-icon-btn" onClick={() => zoom("in")}><ZoomIn size={15} /></div>
        <div className="gw-icon-btn" onClick={() => zoom("out")}><ZoomOut size={15} /></div>
        <div className="gw-icon-btn" onClick={resetView}><Maximize2 size={15} /></div>
      </div>
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        width="100%"
        height="100%"
        onWheel={(e) => {
          e.preventDefault();
          zoom(e.deltaY < 0 ? "in" : "out");
        }}
        style={{ display: "block", cursor: dragId ? "grabbing" : "default" }}
      >
        <defs>
          <pattern id="arch-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="var(--border-soft)" strokeWidth="1" />
          </pattern>
          <marker id="arch-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--text-faint)" />
          </marker>
        </defs>
        <rect x={-2000} y={-2000} width={6000} height={6000} fill="url(#arch-grid)" />

        {edges.map(([from, to], i) => {
          const a = positions[from], b = positions[to];
          if (!a || !b) return null;
          const path = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
          const dim = selected && selected !== from && selected !== to;
          return (
            <g key={i} opacity={dim ? 0.35 : 1}>
              <path d={path} stroke="var(--border)" strokeWidth={1.4} fill="none" markerEnd="url(#arch-arrow)" />
              <circle r="3.4" fill="var(--accent)">
                <animateMotion dur={`${1.1 + (i % 4) * 0.35}s`} repeatCount="indefinite" path={path} />
              </circle>
            </g>
          );
        })}

        {ARCH_STATIC_NODES.map((n) => {
          const pos = positions[n.id];
          const Icon = NODE_ICON[n.type];
          const isSel = selected === n.id;
          return (
            <g
              key={n.id}
              transform={`translate(${pos.x},${pos.y})`}
              className="gw-node"
              onMouseDown={onPointerDownNode(n.id)}
              onClick={handleNodeClick(n.id)}
              onDoubleClick={handleNodeDouble(n.id)}
            >
              <rect x={-64} y={-26} width={128} height={52} rx={12} fill="var(--surface)" stroke={isSel ? "var(--accent)" : "var(--border)"} strokeWidth={isSel ? 2 : 1.2} />
              <foreignObject x={-64} y={-26} width={128} height={52}>
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 8, padding: "0 10px", fontFamily: "var(--font-ui)" }}>
                  <span style={{ width: 26, height: 26, borderRadius: 7, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={13} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.label}</div>
                    <div style={{ fontSize: 9, color: "var(--text-faint)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.sub}</div>
                  </div>
                </div>
              </foreignObject>
            </g>
          );
        })}

        {services.map((s) => {
          const pos = positions[s.id];
          if (!pos) return null;
          const meta = STATUS_META[s.status];
          const isSel = selected === s.id;
          return (
            <g
              key={s.id}
              transform={`translate(${pos.x},${pos.y})`}
              className="gw-node"
              onMouseDown={onPointerDownNode(s.id)}
              onClick={handleNodeClick(s.id)}
              onDoubleClick={handleNodeDouble(s.id)}
            >
              <rect x={-58} y={-24} width={116} height={48} rx={11} fill="var(--surface)" stroke={isSel ? "var(--accent)" : "var(--border)"} strokeWidth={isSel ? 2 : 1.2} />
              <circle cx={-44} cy={-12} r={4} fill={meta.color} />
              <foreignObject x={-58} y={-24} width={116} height={48}>
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 10px 0 16px" }}>
                  <div className="gw-mono" style={{ fontSize: 10, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.id}</div>
                  <div style={{ fontSize: 8.5, color: "var(--text-faint)" }}>{s.rps} rps · {s.latency}ms</div>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", bottom: 12, left: 14, fontSize: 10.5, color: "var(--text-faint)", fontFamily: "var(--font-mono)", display: "flex", gap: 6, alignItems: "center" }}>
        <ArrowRight size={11} style={{ transform: "rotate(-45deg)" }} /> drag nodes · scroll to zoom · double-click to open
      </div>
    </div>
  );
}
