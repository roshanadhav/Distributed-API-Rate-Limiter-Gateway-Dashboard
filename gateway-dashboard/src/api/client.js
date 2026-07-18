import { API_BASE_URL } from "../config.js";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path) {
  const url = `${API_BASE_URL}${path}`;
  let res;
  try {
    res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  } catch (err) {
    // Network-level failure: server down, wrong host/port, CORS block, etc.
    throw new ApiError(`Could not reach ${url} (${err.message})`, 0);
  }
  if (!res.ok) {
    throw new ApiError(`${path} responded with HTTP ${res.status}`, res.status);
  }
  const json = await res.json();
  if (json && json.success === false) {
    throw new ApiError(`${path} returned success:false`, res.status);
  }
  return json;
}

// GET /admin/overview
export const getOverview = () => request("/admin/overview");

// GET /admin/gateway
export const getGatewayDetails = () => request("/admin/gateway");

// GET /admin/services
export const getServices = () => request("/admin/services");

// GET /admin/services/:id
export const getServiceDetail = (id) => request(`/admin/services/${encodeURIComponent(id)}`);

// GET /admin/load-balancer
export const getLoadBalancer = () => request("/admin/load-balancer");

export const getRateLimiter = () =>request("/admin/rate-limiter");

export { ApiError };
