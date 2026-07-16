// ===============================
// gateway:config
// ===============================


const gatewayConfig = {
  gatewayName: "MindEdix Gateway",
  version: "1.0.0",
  environment: process.env.NODE_ENV || "development",
  startedAt: Date.now()
};

export const stringGatewayConfig = JSON.stringify(gatewayConfig);

// ===============================
// gateway:metrics
// ===============================

const gatewayMetrics = {
  total_requests: 0,
  successful_requests: 0,
  failed_requests: 0,

  total_bytes_sent: 0,
  total_bytes_received: 0,

  active_connections: 0,

  peak_rps: 0,
  requests_this_second: 0,

  total_latency_ms: 0,
  total_response_time_ms: 0,

  rate_limited_requests: 0,

  active_services: 0
};

export const stringGatewayMetrics = JSON.stringify(gatewayMetrics);

// ===============================
// gateway:status
// ===============================

const gatewayStatus = {
  "2xx": 0,
  "3xx": 0,
  "4xx": 0,
  "429": 0,
  "5xx": 0
};

export const stringGatewayStatus = JSON.stringify(gatewayStatus);

// ===============================
// gateway:latency
// ===============================

const gatewayLatency = {
  total_requests: 0,
  total_latency_ms: 0,
  average_latency_ms: 0,
  min_latency_ms: Number.MAX_SAFE_INTEGER,
  max_latency_ms: 0
};

export const stringGatewayLatency = JSON.stringify(gatewayLatency);

// ===============================
// gateway:loadbalancer
// ===============================

const gatewayLoadBalancer = {
  enabled: true,
  algorithm: "Round Robin",

  total_forwarded: 0,

  distribution: {
    "user-service": 0,
    "user-service-2": 0,
    "user-service-3": 0,
    "auth-service": 0
  }
};

export const stringGatewayLoadBalancer = JSON.stringify(gatewayLoadBalancer);

// ===============================
// gateway:ratelimiter
// ===============================

const gatewayRateLimiter = {
  enabled: true,

  algorithm: "Sliding Window",

  default_limit: 100,

  window_seconds: 60,

  allowed_requests: 0,

  blocked_requests: 0
};

export const stringGatewayRateLimiter = JSON.stringify(gatewayRateLimiter);

// ===============================
// gateway:traffic
// ===============================

const gatewayTraffic = {
  incoming_bytes: 0,
  outgoing_bytes: 0
};

export const stringGatewayTraffic = JSON.stringify(gatewayTraffic);

// ===============================
// gateway:error_logs
// ===============================

const gatewayErrorLogs = {
  health_check_failures: 0,
  proxy_failures: 0,
  redis_errors: 0,
  timeout_errors: 0,
  connection_refused: 0
};

export const stringGatewayErrorLogs = JSON.stringify(gatewayErrorLogs);

// ===============================
// gateway:rps
// ===============================

const gatewayRps = {
  current_rps: 0
};

export const stringGatewayRps = JSON.stringify(gatewayRps);

// ===============================
// gateway:routes
// ===============================

const gatewayRoutes = {
  "/login": 0,
  "/users": 0,
  "/products": 0,
  "/health": 0
};

export const stringGatewayRoutes = JSON.stringify(gatewayRoutes);

// ===============================
// gateway:users
// ===============================

const gatewayUsers = {
  active_users: 0,
  unique_ips: 0
};

export const stringGatewayUsers = JSON.stringify(gatewayUsers);

// ===============================
// gateway:incidents
// ===============================

const gatewayIncidents = [];

export const stringGatewayIncidents = JSON.stringify(gatewayIncidents);

// ===============================
// service:user-service
// ===============================

const userService = {
  serviceName: "user-service",

  healthy: false,

  status: "UNKNOWN",

  activeConnections: 0,

  avgResponseTime: 0,

  requestsServed: 0,

  lastHeartbeat: 0
};

export const stringUserService = JSON.stringify(userService);

// ===============================
// service:user-service-2
// ===============================

const userService2 = {
  serviceName: "user-service-2",

  healthy: false,

  status: "UNKNOWN",

  activeConnections: 0,

  avgResponseTime: 0,

  requestsServed: 0,

  lastHeartbeat: 0
};

export const stringUserService2 = JSON.stringify(userService2);

// ===============================
// service:user-service-3
// ===============================

const userService3 = {
  serviceName: "user-service-3",

  healthy: false,

  status: "UNKNOWN",

  activeConnections: 0,

  avgResponseTime: 0,

  requestsServed: 0,

  lastHeartbeat: 0
};

export const stringUserService3 = JSON.stringify(userService3);

// ===============================
// service:auth-service
// ===============================

const authService = {
  serviceName: "auth-service",

  healthy: false,

  status: "UNKNOWN",

  activeConnections: 0,

  avgResponseTime: 0,

  requestsServed: 0,

  lastHeartbeat: 0
};

export const stringAuthService = JSON.stringify(authService);


// await client.set('service:auth-service' , stringAuthService)  ; 