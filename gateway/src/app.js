import express from "express";
import axios from "axios";
import rateLimiter from "./middleware/ratelimiter.middleware.js";
import client from "../utils/radis.connection.js";
import LoadBalancer from "./services/loadBalancer/index.js";
import { onRequest ,onSuccess , onFailure , updateLatency, updateStatus} from "./middleware/middleware.js";

client.on("error", (err) => console.log(err));

await client
  .connect()
  .then(() => console.log("REDIS CONNECTION SUCCESSFUL"))
  .catch(console.error);




const loadBalancer = new LoadBalancer();
loadBalancer.healthChecker.start();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API Gateway Running",
  });
});

app.use(rateLimiter, async (req, res) => {
  const serviceName = "/" + req.path.split("/")[1];

  const routes = JSON.parse(await client.get("server-config"));

  const service = routes[serviceName];

  if (!service) {
    return res.status(404).json({
      message: "Service Not Found",
    });
  }

  const context = {
    clientIp:
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.socket.remoteAddress,

    clientKey:
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.socket.remoteAddress,

    req,
    headers: req.headers,
    method: req.method,
    path: req.originalUrl,
  };

  const target = await loadBalancer.getServer(
    serviceName,
    routes,
    context
  );

  const url = target.url + req.originalUrl;

  /* -----------------------------
        Runtime Metrics
  ------------------------------ */

  const runtime = JSON.parse(
    await client.get("dynamic-server-config")
  );

  const server = runtime[target.id];

  const now = Date.now();
  await onRequest();
  server.activeConnections++;
  server.totalRequests++;
  server.selectedCount++;
  server.lastSelected = now;
  server.lastRequestAt = now;
  server.lastUpdated = now;

  await client.set(
    "dynamic-server-config",
    JSON.stringify(runtime)
  );

  /* -----------------------------
        Load Balancer Metrics
  ------------------------------ */

  await client.incr(`lb:connections:${target.id}`);

  const start = Date.now();

  try {

    const response = await axios({
      method: req.method,
      url,
      headers: req.headers,
      data: req.body,
    });

    const responseTime = Date.now() - start;

    await onSuccess(responseTime);
    await updateLatency(responseTime);
    /* -----------------------------
          Update Runtime
    ------------------------------ */

    server.successfulRequests++;
    server.activeConnections--;

    server.lastLatency = responseTime;

    server.averageLatency =
      (
        server.averageLatency *
        (server.successfulRequests - 1) +
        responseTime
      ) / server.successfulRequests;

    if (
      server.minLatency === 0 ||
      responseTime < server.minLatency
    ) {
      server.minLatency = responseTime;
    }

    server.maxLatency = Math.max(
      server.maxLatency,
      responseTime
    );

    server.bytesReceived += Buffer.byteLength(
      JSON.stringify(req.body || {})
    );

    server.bytesSent += Buffer.byteLength(
      JSON.stringify(response.data || {})
    );

    server.lastUpdated = Date.now();

    await client.set(
      "dynamic-server-config",
      JSON.stringify(runtime)
    );

    await client.set(
      `lb:response:${target.id}`,
      responseTime
    );

    return res
      .status(response.status)
      .json(response.data);

  } catch (err) {

    const responseTime = Date.now() - start;
    await onFailure(responseTime);
    await updateLatency(responseTime);
    await updateTraffic(req, response);
    await updateStatus(response.status) ; 
    server.failedRequests++;
    server.activeConnections--;

    server.lastLatency = responseTime;
    server.lastUpdated = Date.now();

    await client.set(
      "dynamic-server-config",
      JSON.stringify(runtime)
    );

    await client.set(
      `lb:response:${target.id}`,
      responseTime
    );

    console.error(
      err.response?.data || err.message || err
    );

    return res.status(500).json({
      message: "Service Unavailable",
    });

  } finally {

    await client.decr(
      `lb:connections:${target.id}`
    );

  }
});

export default app;