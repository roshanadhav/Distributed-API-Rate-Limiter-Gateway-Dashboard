import { useEffect, useRef, useState } from "react";
import { rand, randInt, clamp, fmtTime, uid } from "../lib/utils.js";
import {
  SERVICE_SEED, seedMetrics, seedLogs, seedHealthEvents, seedNotifications, seedIncidents,
} from "../data/seed.js";

function pushLog(setLogs, level, message, service) {
  setLogs((prev) => [...prev.slice(-160), { id: uid(), time: fmtTime(new Date()), level, message, service }]);
}
function pushHealthEvent(setHealthEvents, service, event, message) {
  setHealthEvents((prev) => [{ id: uid(), time: fmtTime(new Date()), service, event, message }, ...prev].slice(0, 60));
}
function pushNotification(setNotifications, severity, title, message) {
  setNotifications((prev) => [{ id: uid(), severity, title, message, time: fmtTime(new Date()), read: false }, ...prev].slice(0, 40));
}

/**
 * useMockEngine
 * The simulated telemetry / control-plane engine for the whole dashboard.
 * In a real deployment this would be replaced by API calls + a WebSocket
 * subscription; every consumer (pages/components) reads from this same
 * shape either way, so swapping the transport later requires no UI changes.
 */
export function useMockEngine() {
  const [services, setServices] = useState(SERVICE_SEED);
  const [metrics, setMetrics] = useState(seedMetrics);
  const [logs, setLogs] = useState(seedLogs);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [healthEvents, setHealthEvents] = useState(seedHealthEvents);
  const [lbAlgorithm, setLbAlgorithm] = useState("round-robin");
  const [rlAlgorithm, setRlAlgorithm] = useState("token-bucket");
  const [bucket, setBucket] = useState({ tokens: 72, capacity: 100, refillRate: 6, allowed: 48210, blocked: 892 });
  const [totals, setTotals] = useState({ totalRequests: 18_452_310, uptime: 99.982 });
  const [incidents, setIncidents] = useState(seedIncidents);
  const tickRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;
      const now = new Date();

      // metrics history
      setMetrics((prev) => {
        const last = prev[prev.length - 1];
        const anyDown = services.some((s) => s.status === "down");
        const point = {
          t: now.getTime(),
          time: fmtTime(now),
          rps: clamp(Math.round(last.rps + rand(-140, 160)), 1800, 3400),
          latency: clamp(Math.round(last.latency + rand(-4, anyDown ? 10 : 4)), 24, anyDown ? 180 : 75),
          errors: clamp(Math.round(last.errors + rand(-2, anyDown ? 8 : 2)), 0, anyDown ? 60 : 14),
          limited: clamp(Math.round(last.limited + rand(-10, 12)), 0, 140),
        };
        return [...prev.slice(1), point];
      });

      // total requests / uptime ticking
      setTotals((prev) => ({
        totalRequests: prev.totalRequests + randInt(1800, 2600),
        uptime: clamp(prev.uptime + rand(-0.001, 0.0006), 99.83, 99.995),
      }));

      // token bucket simulation
      setBucket((prev) => {
        const incoming = randInt(4, 14);
        let tokens = clamp(prev.tokens + prev.refillRate - incoming * rand(0.6, 1.1), 0, prev.capacity);
        const blocked = tokens <= 0.5 ? randInt(1, 5) : 0;
        const allowedNow = Math.max(0, incoming - blocked);
        return { ...prev, tokens, allowed: prev.allowed + allowedNow, blocked: prev.blocked + blocked };
      });

      // occasionally mutate a service (jitter + rare incident)
      setServices((prev) => {
        let next = prev.map((s) => ({
          ...s,
          cpu: clamp(Math.round(s.cpu + rand(-4, 4)), 8, 96),
          mem: clamp(Math.round(s.mem + rand(-3, 3)), 15, 92),
          rps: clamp(Math.round(s.rps + rand(-14, 14)), 4, 240),
          latency: clamp(Math.round(s.latency + rand(-3, 3)), 18, 320),
        }));

        const roll = Math.random();
        if (roll < 0.045) {
          const healthyIdx = next.map((s, i) => (s.status === "healthy" ? i : -1)).filter((i) => i >= 0);
          if (healthyIdx.length) {
            const idx = healthyIdx[randInt(0, healthyIdx.length - 1)];
            const svc = next[idx];
            next[idx] = { ...svc, status: "warning", latency: svc.latency + 60 };
            pushLog(setLogs, "WARNING", `${svc.id} latency exceeded threshold (${svc.latency + 60}ms)`, svc.id);
            pushHealthEvent(setHealthEvents, svc.id, "Degraded", `${svc.id} response time degraded, marked WARNING`);
          }
        } else if (roll < 0.06) {
          const warnIdx = next.map((s, i) => (s.status === "warning" ? i : -1)).filter((i) => i >= 0);
          if (warnIdx.length) {
            const idx = warnIdx[randInt(0, warnIdx.length - 1)];
            const svc = next[idx];
            next[idx] = { ...svc, status: "down" };
            pushLog(setLogs, "ERROR", `${svc.id} health check failed — removed from load balancer`, svc.id);
            pushHealthEvent(setHealthEvents, svc.id, "Failed", `${svc.id} failed health check, removed from rotation`);
            pushNotification(setNotifications, "critical", `${svc.id} is down`, `Traffic automatically shifted to healthy instances in ${svc.group}.`);
            setIncidents((p) => [{ id: uid(), time: now, service: svc.id, title: `${svc.id} became unhealthy`, status: "investigating" }, ...p].slice(0, 8));
          }
        } else if (roll < 0.11) {
          const badIdx = next.map((s, i) => (s.status !== "healthy" ? i : -1)).filter((i) => i >= 0);
          if (badIdx.length) {
            const idx = badIdx[randInt(0, badIdx.length - 1)];
            const svc = next[idx];
            const wasDown = svc.status === "down";
            next[idx] = { ...svc, status: "healthy", latency: clamp(svc.latency - 50, 24, 60) };
            pushLog(setLogs, "SUCCESS", `${svc.id} recovered and rejoined the pool`, svc.id);
            pushHealthEvent(setHealthEvents, svc.id, "Recovered", `${svc.id} passed health check, back in rotation`);
            if (wasDown) {
              pushNotification(setNotifications, "info", `${svc.id} recovered`, `Service is healthy again and receiving traffic.`);
              setIncidents((p) => p.map((inc) => (inc.service === svc.id && inc.status !== "resolved" ? { ...inc, status: "resolved" } : inc)));
            }
          }
        }

        // routine info log
        if (Math.random() < 0.7) {
          const svc = next[randInt(0, next.length - 1)];
          const msgs = [
            `Gateway routed request to ${svc.id}`,
            `Health check passed for ${svc.id} (${randInt(8, 40)}ms)`,
            `Rate limiter allowed request from client ${randInt(100, 250)}.x.x.${randInt(2, 250)}`,
            `Load balancer dispatched request via ${lbAlgorithm.replace(/-/g, " ")}`,
          ];
          pushLog(setLogs, "INFO", msgs[randInt(0, msgs.length - 1)], svc.id);
        }
        return next;
      });
    }, 2200);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lbAlgorithm]);

  return {
    services, setServices,
    metrics, logs, setLogs,
    notifications, setNotifications,
    healthEvents,
    lbAlgorithm, setLbAlgorithm,
    rlAlgorithm, setRlAlgorithm,
    bucket, totals, incidents,
  };
}
