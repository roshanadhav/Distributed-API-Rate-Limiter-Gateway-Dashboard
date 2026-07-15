import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Radio } from "lucide-react";
import { useEngine } from "../../context/EngineContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import LiveDot from "../ui/LiveDot.jsx";
import NotificationBell from "../notifications/NotificationBell.jsx";
import { fmtNum } from "../../lib/utils.js";

export default function Topbar({ notifOpen, setNotifOpen }) {
  const { services, metrics } = useEngine();
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();

  const last = metrics[metrics.length - 1];
  const activeServices = services.filter((s) => s.status !== "down" && s.status !== "disabled").length;

  return (
    <div className="gw-topbar">
      <div className="gw-topbar-left">
        <div className="gw-status-pill">
          <LiveDot color="var(--success)" />
          All systems operational
        </div>
        <div className="gw-topbar-metric">
          <span className="val">{fmtNum(last.rps)}</span>
          <span className="lbl">Req / sec</span>
        </div>
        <div className="gw-topbar-metric">
          <span className="val">{activeServices}</span>
          <span className="lbl">Active services</span>
        </div>
        <div className="gw-search">
          <Search size={13} />
          <input placeholder="Search services, logs, routes…" />
        </div>
      </div>
      <div className="gw-topbar-right">
        <div className="gw-icon-btn" onClick={toggleTheme} title="Toggle theme">
          <Radio size={16} />
        </div>
        <NotificationBell open={notifOpen} setOpen={setNotifOpen} />
        <div className="gw-profile" onClick={() => navigate("/users")}>
          <div className="gw-avatar">SA</div>
          <div>
            <div className="gw-profile-name">Sam Ardley</div>
            <div className="gw-profile-role">Platform Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}
