import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Gauge,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

import { useEngine } from "../context/EngineContext.jsx";

import StatCard from "../components/ui/StatCard.jsx";
import SectionCard from "../components/ui/SectionCard.jsx";
import ProgressBar from "../components/ui/ProgressBar.jsx";
import ChartTooltip from "../components/ui/ChartTooltip.jsx";
import {
  LoadingState,
  UnreachableState,
} from "../components/ui/ConnectionState.jsx";

import { RL_ALGORITHMS } from "../lib/constants.js";
import { fmtCompact, fmtNum } from "../lib/utils.js";

function normalizeAlgoName(name) {
  return (name || "").toLowerCase().replace(/\s+/g, "-");
}

export default function RateLimiterPage() {
  const {
    rateLimiter,
    history,
    connection,
    connectionError,
    refreshNow,
  } = useEngine();

  if (connection === "connecting" && !rateLimiter)
    return <LoadingState />;

  if (connection === "error" && !rateLimiter)
    return (
      <UnreachableState
        onRetry={refreshNow}
        error={connectionError}
      />
    );

  const rl = rateLimiter || {};

  const algorithmId = normalizeAlgoName(
    rl.algorithm
  );

  const current = RL_ALGORITHMS.find(
    (a) => a.id === algorithmId
  );

  const total = rl.totalRequests ?? 0;

  const blockRate =
    total > 0
      ? (
          (rl.blockedRequests / total) *
          100
        ).toFixed(2)
      : "0.00";

  const allowedPct =
    total > 0
      ? (rl.allowedRequests / total) * 100
      : 100;

  return (
    <div>
      <div className="gw-page-head">
        <div>
          <div className="gw-page-title">
            Rate Limiter
          </div>

          <div className="gw-page-sub">
            Live request throttling reported by
            the gateway.
          </div>
        </div>

        <span className="gw-badge info">
          <Gauge size={11} />
          {rl.algorithm || "Unknown"}
        </span>
      </div>

      <div
        className="gw-grid"
        style={{
          gridTemplateColumns:
            "repeat(4, 1fr)",
          marginBottom: 16,
        }}
      >
        <StatCard
          icon={CheckCircle2}
          label="Requests Allowed"
          value={fmtCompact(
            rl.allowedRequests ?? 0
          )}
          tint="var(--success)"
        />

        <StatCard
          icon={XCircle}
          label="Requests Blocked"
          value={fmtCompact(
            rl.blockedRequests ?? 0
          )}
          tint="var(--danger)"
        />

        <StatCard
          icon={Clock}
          label="Limit"
          value={rl.limit ?? "—"}
          unit={
            rl.windowMs
              ? `/ ${rl.windowMs}s`
              : ""
          }
          tint="var(--accent)"
        />

        <StatCard
          icon={AlertTriangle}
          label="Block Rate"
          value={blockRate}
          unit="%"
          tint="var(--warn)"
        />
      </div>

      <div
        className="gw-grid"
        style={{
          gridTemplateColumns: "1fr 1fr",
          marginBottom: 16,
        }}
      >
        <SectionCard
          eyebrow="Live Visualization"
          title="Allowed vs Blocked"
        >
          <div
            style={{
              padding: "10px 6px",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "var(--text-dim)",
                marginBottom: 14,
              }}
            >
              Configured limit:{" "}
              <strong
                className="gw-mono"
                style={{
                  color: "var(--text)",
                }}
              >
                {rl.limit ?? "—"} requests
              </strong>{" "}
              per{" "}
              <strong
                className="gw-mono"
                style={{
                  color: "var(--text)",
                }}
              >
                {rl.windowMs ?? "—"}s
              </strong>{" "}
              window, enforced with{" "}
              <strong
                style={{
                  color: "var(--text)",
                }}
              >
                {rl.algorithm ||
                  "an unconfigured algorithm"}
              </strong>
              .
            </div>

            <ProgressBar
              value={allowedPct}
              color={
                allowedPct > 85
                  ? "var(--success)"
                  : allowedPct > 60
                  ? "var(--warn)"
                  : "var(--danger)"
              }
            />

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginTop: 4,
                fontSize: 10.5,
                color:
                  "var(--text-faint)",
              }}
            >
              <span>
                {allowedPct.toFixed(1)}%
                allowed
              </span>

              <span>
                {(
                  100 - allowedPct
                ).toFixed(1)}
                % blocked
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 20,
              }}
            >
              <div>
                <div
                  className="gw-mono"
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color:
                      "var(--success)",
                  }}
                >
                  {fmtCompact(
                    rl.allowedRequests ?? 0
                  )}
                </div>

                <div
                  style={{
                    fontSize: 10.5,
                    color:
                      "var(--text-faint)",
                  }}
                >
                  Allowed
                </div>
              </div>

              <div>
                <div
                  className="gw-mono"
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color:
                      "var(--danger)",
                  }}
                >
                  {fmtCompact(
                    rl.blockedRequests ?? 0
                  )}
                </div>

                <div
                  style={{
                    fontSize: 10.5,
                    color:
                      "var(--text-faint)",
                  }}
                >
                  Blocked
                </div>
              </div>
            </div>

            {/* Real Request Details */}

            <div
              style={{
                marginTop: 22,
                paddingTop: 14,
                borderTop:
                  "1px solid var(--border-soft)",
                display: "grid",
                gridTemplateColumns:
                  "repeat(2,1fr)",
                gap: 12,
                fontSize: 11.5,
              }}
            >
              <div>
                <div
                  style={{
                    color:
                      "var(--text-faint)",
                  }}
                >
                  Total Requests
                </div>

                <div className="gw-mono">
                  {fmtCompact(
                    rl.totalRequests ?? 0
                  )}
                </div>
              </div>

              <div>
                <div
                  style={{
                    color:
                      "var(--text-faint)",
                  }}
                >
                  Success Rate
                </div>

                <div
                  className="gw-mono"
                  style={{
                    color:
                      "var(--success)",
                  }}
                >
                  {rl.successRate ?? 0}%
                </div>
              </div>

              <div>
                <div
                  style={{
                    color:
                      "var(--text-faint)",
                  }}
                >
                  Last Blocked IP
                </div>

                <div className="gw-mono">
                  {rl.lastBlockedIp ||
                    "—"}
                </div>
              </div>

              <div>
                <div
                  style={{
                    color:
                      "var(--text-faint)",
                  }}
                >
                  Last Blocked At
                </div>

                <div className="gw-mono">
                  {rl.lastBlockedAt
                    ? new Date(
                        rl.lastBlockedAt
                      ).toLocaleString()
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Configuration"
          title="Algorithm Reference"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {RL_ALGORITHMS.map((a) => (
              <div
                key={a.id}
                style={{
                  padding:
                    "10px 12px",
                  borderRadius: 9,
                  border: `1px solid ${
                    a.id === algorithmId
                      ? "var(--accent)"
                      : "var(--border-soft)"
                  }`,
                  background:
                    a.id === algorithmId
                      ? "var(--accent-soft)"
                      : "transparent",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color:
                        a.id ===
                        algorithmId
                          ? "var(--accent)"
                          : "var(--text)",
                    }}
                  >
                    {a.name}
                  </span>

                  {a.id ===
                    algorithmId && (
                    <span className="gw-badge healthy">
                      Active
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontSize: 11.5,
                    color:
                      "var(--text-dim)",
                    marginBottom: 6,
                  }}
                >
                  {a.desc}
                </div>

                <div
                  style={{
                    fontSize: 10.8,
                    color:
                      "var(--success)",
                  }}
                >
                  + {a.pro}
                </div>

                <div
                  style={{
                    fontSize: 10.8,
                    color:
                      "var(--danger)",
                  }}
                >
                  − {a.con}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    fontSize: 10.5,
                    color:
                      "var(--text-faint)",
                  }}
                >
                  Requests Processed:{" "}
                  <strong>
                    {fmtNum(
                      a.id ===
                        "fixed-window"
                        ? rl
                            .algorithms
                            ?.fixedWindow ??
                            0
                        : a.id ===
                          "sliding-window"
                        ? rl
                            .algorithms
                            ?.slidingWindow ??
                          0
                        : a.id ===
                          "token-bucket"
                        ? rl
                            .algorithms
                            ?.tokenBucket ??
                          0
                        : rl
                            .algorithms
                            ?.leakyBucket ??
                          0
                    )}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        eyebrow="Traffic"
        title="Rate Limited Requests (per poll interval)"
      >
        <ResponsiveContainer
          width="100%"
          height={190}
        >
          <AreaChart data={history}>
            <defs>
              <linearGradient
                id="rl-lim"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--warn)"
                  stopOpacity={0.4}
                />

                <stop
                  offset="100%"
                  stopColor="var(--warn)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="var(--border-soft)"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              stroke="var(--text-faint)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />

            <YAxis
              stroke="var(--text-faint)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              width={30}
            />

            <Tooltip
              content={<ChartTooltip />}
            />

            <Area
              type="monotone"
              dataKey="limited"
              name="Blocked"
              stroke="var(--warn)"
              strokeWidth={2}
              fill="url(#rl-lim)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
}