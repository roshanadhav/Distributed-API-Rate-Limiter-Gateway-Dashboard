import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NAV_ITEMS } from "../../lib/constants.js";

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <div className={`gw-sidebar ${collapsed ? "collapsed" : ""}`} style={{ width: collapsed ? 68 : 224 }}>
      <div className="gw-sidebar-logo">
        <div className="gw-logo-mark">AG</div>
        <div>
          <div className="gw-logo-text">Apex Gateway</div>
          <div className="gw-logo-sub">CONTROL CENTER</div>
        </div>
      </div>
      <nav className="gw-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `gw-nav-item ${isActive ? "active" : ""}`}
            title={collapsed ? item.label : undefined}
          >
            <item.Icon size={16} />
            <span className="gw-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="gw-sidebar-foot">
        <div className="gw-collapse-btn" onClick={() => setCollapsed((c) => !c)}>
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <>
              <ChevronLeft size={14} /> Collapse
            </>
          )}
        </div>
      </div>
    </div>
  );
}
