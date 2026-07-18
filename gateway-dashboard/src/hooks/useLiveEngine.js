import { useCallback, useEffect, useRef, useState } from "react";
import { getOverview, getGatewayDetails, getServices, getLoadBalancer ,getRateLimiter } from "../api/client.js";
import { mapServicesList, sanitizeMetric } from "../lib/mappers.js";
import { fmtTime, uid } from "../lib/utils.js";
import { POLL_INTERVAL_MS, HISTORY_LENGTH } from "../config.js";

function pushCapped(setter, item, cap) {
  setter((prev) => [item, ...prev].slice(0, cap));
}

/**
 * useLiveEngine
 * Polls the real gateway admin API (GET /admin/overview, /admin/gateway,
 * /admin/services, /admin/load-balancer) on an interval and exposes:
 *  - the latest snapshot of each endpoint
 *  - a rolling client-side history buffer for the trend charts (the API
 *    only exposes current values, not a time series)
 *  - health/notification/log entries *derived* from real state transitions
 *    between polls (a service flipping healthy -> down, error-rate
 *    crossing a threshold, etc.) — nothing here is randomly generated.
 */
export function useLiveEngine() {
  const [connection, setConnection] = useState("connecting"); // connecting | connected | error
  const [connectionError, setConnectionError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [rateLimiter, setRateLimiter] = useState(null);
  const [overview, setOverview] = useState(null);
  const [gatewayDetails, setGatewayDetails] = useState(null);
  const [services, setServices] = useState([]);
  const [loadBalancer, setLoadBalancer] = useState(null);

  const [history, setHistory] = useState([]);
  const [serviceHistory, setServiceHistory] = useState({});
  const [healthEvents, setHealthEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [logs, setLogs] = useState([]);
  const [incidents, setIncidents] = useState([]);

  const prevServicesRef = useRef({});
  const prevStatusRef = useRef({});
  const prevPollTimeRef = useRef(null);
  const prevOverviewRef = useRef(null);

  const fetchAll = useCallback(async () => {
    const now = Date.now();
    try {
      const [ovRes, gwRes, svcRes, lbRes ,rlRes] = await Promise.all([
        getOverview(),
        getGatewayDetails(),
        getServices(),
        getLoadBalancer(),
        getRateLimiter(),
      ]);

      const dtSeconds = prevPollTimeRef.current ? (now - prevPollTimeRef.current) / 1000 : 0;
      const mapped = mapServicesList(svcRes.services || [], prevServicesRef.current, dtSeconds);

      mapped.forEach((s) => {
        const prevStatus = prevStatusRef.current[s.id];
        if (prevStatus && prevStatus !== s.status) {
          const time = fmtTime(new Date(now));
          if (s.status === "down") {
            pushCapped(setHealthEvents, { id: uid(), time, service: s.id, event: "Failed", message: `${s.id} health check failed, marked DOWN` }, 60);
            pushCapped(setLogs, { id: uid(), time, level: "ERROR", message: `${s.id} health check failed`, service: s.id }, 200);
            pushCapped(setNotifications, { id: uid(), severity: "critical", title: `${s.id} is down`, message: "Detected on the latest health poll from the live gateway.", time, read: false }, 50);
            pushCapped(setIncidents, { id: uid(), time: new Date(now), service: s.id, title: `${s.id} became unhealthy`, status: "investigating" }, 30);
          } else if (s.status === "healthy" && prevStatus === "down") {
            pushCapped(setHealthEvents, { id: uid(), time, service: s.id, event: "Recovered", message: `${s.id} passed health check, back to healthy` }, 60);
            pushCapped(setLogs, { id: uid(), level: "SUCCESS", time, message: `${s.id} recovered`, service: s.id }, 200);
            pushCapped(setNotifications, { id: uid(), severity: "info", title: `${s.id} recovered`, message: "Service reported healthy again.", time, read: false }, 50);
            setIncidents((prev) => prev.map((inc) => (inc.service === s.id && inc.status !== "resolved" ? { ...inc, status: "resolved" } : inc)));
          } else if (s.status === "warning") {
            pushCapped(setHealthEvents, { id: uid(), time, service: s.id, event: "Degraded", message: `${s.id} marked degraded` }, 60);
            pushCapped(setLogs, { id: uid(), level: "WARNING", time, message: `${s.id} degraded`, service: s.id }, 200);
          }
        }
        prevStatusRef.current[s.id] = s.status;
      });

      prevServicesRef.current = Object.fromEntries(mapped.map((s) => [s.id, s]));
      prevPollTimeRef.current = now;

      const time = fmtTime(new Date(now));
      setServiceHistory((prev) => {
        const next = { ...prev };
        mapped.forEach((s) => {
          const arr = next[s.id] ? [...next[s.id]] : [];
          arr.push({ t: now, time, cpu: s.cpu, mem: s.mem, rps: s.rps, latency: s.latency });
          next[s.id] = arr.slice(-HISTORY_LENGTH);
        });
        return next;
      });

      setOverview(ovRes.data);
      setGatewayDetails(gwRes.data);
      setServices(mapped);
      setLoadBalancer(lbRes.data);
      setRateLimiter(rlRes.data);
      setConnection("connected");
      setConnectionError(null);
      setLastUpdated(new Date(now));

      setHistory((prev) => {
        const prevOv = prevOverviewRef.current;
        const deltaFailed = prevOv ? Math.max(0, (ovRes.data.failedRequests ?? 0) - (prevOv.failedRequests ?? 0)) : 0;
        const deltaLimited = prevOv ? Math.max(0, (ovRes.data.rateLimitedRequests ?? 0) - (prevOv.rateLimitedRequests ?? 0)) : 0;
        const point = {
          t: now,
          time: fmtTime(new Date(now)),
          rps: ovRes.data.requestsPerSecond ?? 0,
          latency: sanitizeMetric(ovRes.data.avgLatency) ?? 0,
          errors: deltaFailed,
          errorRate: ovRes.data.errorRate ?? 0,
          limited: deltaLimited,
        };
        return [...prev.slice(-(HISTORY_LENGTH - 1)), point];
      });
      prevOverviewRef.current = ovRes.data;
    } catch (err) {
      setConnection("error");
      setConnectionError(err.message || String(err));
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const iv = setInterval(fetchAll, POLL_INTERVAL_MS);
    return () => clearInterval(iv);
  }, [fetchAll]);

  return {
    connection,
    connectionError,
    lastUpdated,
    overview,
    gatewayDetails,
    services,
    loadBalancer,
    rateLimiter,
    history,
    serviceHistory,
    healthEvents,
    notifications,
    setNotifications,
    logs,
    incidents,
    refreshNow: fetchAll,
  };
}
