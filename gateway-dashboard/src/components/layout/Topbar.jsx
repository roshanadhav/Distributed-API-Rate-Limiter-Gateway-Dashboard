import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sun, Moon, WifiOff } from "lucide-react";
import { useEngine } from "../../context/EngineContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import LiveDot from "../ui/LiveDot.jsx";
import NotificationBell from "../notifications/NotificationBell.jsx";
import { fmtNum } from "../../lib/utils.js";

export default function Topbar({ notifOpen, setNotifOpen }) {
  const { services, overview, connection } = useEngine();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const rps = Math.round(overview?.requestsPerSecond ?? 0);
  const activeServices = services.filter((s) => s.status !== "down").length;

  return (
    <div className="gw-topbar">
      <div className="gw-topbar-left">
        {connection === "error" ? (
          <span className="gw-badge down"><WifiOff size={11} /> Gateway unreachable</span>
        ) : connection === "connecting" ? (
          <span className="gw-badge neutral">Connecting…</span>
        ) : (
          <div className="gw-status-pill">
            <LiveDot color="var(--success)" />
            Live from gateway
          </div>
        )}
        <div className="gw-topbar-metric">
          <span className="val">{fmtNum(rps)}</span>
          <span className="lbl">Req / sec</span>
        </div>
        <div className="gw-topbar-metric">
          <span className="val">{activeServices}/{services.length || "—"}</span>
          <span className="lbl">Active services</span>
        </div>
        <div className="gw-search">
          <Search size={13} />
          <input placeholder="Search services, logs, routes…" />
        </div>
      </div>
      <div className="gw-topbar-right">
        <div className="gw-icon-btn" onClick={toggleTheme} title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </div>
        <NotificationBell open={notifOpen} setOpen={setNotifOpen} />
        <div className="gw-profile" onClick={() => navigate("/settings")}>
          <div className="gw-avatar">AG</div>
          <div>
            <div className="gw-profile-name">Admin</div>
            <div className="gw-profile-role">MindEdix Gateway</div>
          </div>
        </div>
      </div>
    </div>
  );
}
