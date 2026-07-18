import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip,
} from "recharts";
import {
  Activity, Database, Zap, Timer, AlertTriangle, Boxes, RefreshCw, CheckCircle2,
} from "lucide-react";
import { useEngine } from "../context/EngineContext.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import SectionCard from "../components/ui/SectionCard.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import ChartTooltip from "../components/ui/ChartTooltip.jsx";
import { GROUP_ICON } from "../lib/constants.js";
import { fmtCompact, fmtNum } from "../lib/utils.js";
import { formatDuration, sanitizeMetric } from "../lib/mappers.js";
import { LoadingState, UnreachableState } from "../components/ui/ConnectionState.jsx";

export default function OverviewPage() {
  const { services, history, overview, incidents, connection, connectionError, refreshNow, lastUpdated } = useEngine();
  const navigate = useNavigate();

  const grouped = useMemo(() => {
    const g = {};
    services.forEach((s) => {
      (g[s.group] = g[s.group] || []).push(s);
    });
    return g;
  }, [services]);

  const groupStatus = (list) =>
    list.some((s) => s.status === "down") ? "down" : list.some((s) => s.status === "warning") ? "warning" : "healthy";

  if (connection === "connecting" && !overview) {
    return <LoadingState />;
  }
  if (connection === "error" && !overview) {
    return <UnreachableState onRetry={refreshNow} error={connectionError} />;
  }

  const avgLatency = sanitizeMetric(overview?.avgLatency);

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">Overview</div>
          <div className="gw-page-sub">
            Executive summary of gateway health, traffic, and incidents.
            {lastUpdated && <span className="gw-mono" style={{ color: "var(--text-faint)" }}> · updated {lastUpdated.toLocaleTimeString("en-US", { hour12: false })}</span>}
          </div>
        </div>
        <button className="gw-btn primary" onClick={refreshNow}><RefreshCw size={13} />Refresh now</button>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "repeat(6, 1fr)", marginBottom: 16 }}>
        <StatCard icon={Activity} label="Gateway Uptime" value={formatDuration(overview?.uptime)} tint="var(--success)" />
        <StatCard icon={Database} label="Total Requests" value={fmtCompact(overview?.totalRequests ?? 0)} tint="var(--accent-2)" />
        <StatCard icon={Zap} label="Requests / sec" value={fmtNum(Math.round(overview?.requestsPerSecond ?? 0))} tint="var(--accent)" />
        <StatCard icon={Timer} label="Avg Latency" value={avgLatency ?? "—"} unit={avgLatency != null ? "ms" : ""} tint="var(--accent-2)" />
        <StatCard icon={AlertTriangle} label="Error Rate" value={Number(overview?.errorRate ?? 0).toFixed(2)} unit="%" tint="var(--danger)" />
        <StatCard icon={Boxes} label="Active Services" value={`${overview?.activeServices ?? services.filter((s) => s.status !== "down").length}/${services.length}`} tint="var(--success)" />
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 16 }}>
        <SectionCard eyebrow="Traffic" title="Request Volume">
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="ov-rps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border-soft)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
              <YAxis stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} width={36} />
              <Tooltip content={<ChartTooltip unit=" rps" />} />
              <Area type="monotone" dataKey="rps" name="Requests" stroke="var(--accent)" strokeWidth={2} fill="url(#ov-rps)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
        <SectionCard eyebrow="Performance" title="Average Latency">
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={history}>
              <CartesianGrid stroke="var(--border-soft)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
              <YAxis stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} width={36} />
              <Tooltip content={<ChartTooltip unit="ms" />} />
              <Line type="monotone" dataKey="latency" name="Latency" stroke="var(--accent-2)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="gw-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 16 }}>
        <SectionCard eyebrow="Reliability" title="Failed Requests (per poll interval)">
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="ov-err" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--danger)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--danger)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border-soft)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
              <YAxis stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} width={30} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="errors" name="Failed" stroke="var(--danger)" strokeWidth={2} fill="url(#ov-err)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
        <SectionCard eyebrow="Throttling" title="Rate Limited (per poll interval)">
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={history}>
              <CartesianGrid stroke="var(--border-soft)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
              <YAxis stroke="var(--text-faint)" fontSize={10} tickLine={false} axisLine={false} width={30} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="limited" name="Limited" fill="var(--warn)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div className="gw-eyebrow" style={{ marginBottom: 10 }}>Service Health</div>
        <div className="gw-grid" style={{ gridTemplateColumns: `repeat(${Math.max(Object.keys(grouped).length, 1)}, 1fr)` }}>
          {Object.entries(grouped).map(([group, list]) => {
            const status = groupStatus(list);
            const GIcon = GROUP_ICON[group] || Boxes;
            return (
              <motion.div key={group} className="gw-card gw-card-pad" whileHover={{ y: -2 }} style={{ cursor: "pointer" }} onClick={() => navigate("/services")}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
                    <span style={{ width: 30, height: 30, borderRadius: 8, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-dim)" }}>
                      <GIcon size={15} />
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13.5 }}>{group}</div>
                      <div className="gw-mono" style={{ fontSize: 10.5, color: "var(--text-faint)" }}>{list.length} instance{list.length === 1 ? "" : "s"}</div>
                    </div>
                  </div>
                  <StatusBadge status={status} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {list.map((inst) => (
                    <div
                      key={inst.id}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11.5 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/services/${inst.id}`);
                      }}
                    >
                      <span className="gw-mono" style={{ color: "var(--text-dim)" }}>{inst.id}</span>
                      <StatusDot status={inst.status} />
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <SectionCard eyebrow="Incidents" title="Recent Incidents" right={<span className="gw-mono" style={{ fontSize: 11, color: "var(--text-faint)" }}>{overview?.recentIncidents ?? incidents.length} reported by gateway</span>}>
        {incidents.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: "var(--text-faint)", fontSize: 12.5 }}>No status transitions observed yet this session.</div>
        ) : (
          <div>
            {incidents.slice(0, 5).map((inc) => (
              <div key={inc.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 2px", borderBottom: "1px solid var(--border-soft)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: inc.status === "resolved" ? "var(--success)" : "var(--danger)" }}>
                    {inc.status === "resolved" ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                  </span>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{inc.title}</div>
                    <div className="gw-mono" style={{ fontSize: 10.5, color: "var(--text-faint)" }}>{inc.time.toLocaleTimeString("en-US", { hour12: false })}</div>
                  </div>
                </div>
                <span className={`gw-badge ${inc.status === "resolved" ? "healthy" : "down"}`}>{inc.status === "resolved" ? "Resolved" : "Investigating"}</span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function StatusDot({ status }) {
  const color = status === "healthy" ? "var(--success)" : status === "warning" ? "var(--warn)" : status === "down" ? "var(--danger)" : "var(--text-faint)";
  return <span style={{ color, fontSize: 10 }}>●</span>;
}
