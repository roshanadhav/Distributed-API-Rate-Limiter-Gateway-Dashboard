import axios from "axios";
import client from "../../../utils/radis.connection.js";
import {
  updateServiceHealth,
  createIncident,
  updateGatewayHealth
} from "../../middleware/healthMetrics.middleware.js";
class HealthChecker {
  constructor(interval = 5000) {
    this.interval = interval;
  }

  async checkHealth() {
    const serverConfig = JSON.parse(await client.get("server-config"));

    const runtime = JSON.parse(await client.get("dynamic-server-config"));

    for (const service of Object.values(serverConfig)) {
      for (const server of service.instances) {
        try {
          const start = Date.now();

          const { data } = await axios.get(`${server.url}/health`, {
            timeout: 3000,
          });

          const responseTime = Date.now() - start;

          const now = Date.now();

          /* ----------------------------------
                       Backward compatibility
                    ----------------------------------- */

          server.healthy = true;
          server.status = "UP";

          /* ----------------------------------
                       Runtime Dashboard
                    ----------------------------------- */

          runtime[server.id].healthy = true;
          runtime[server.id].status = "UP";

          await updateServiceHealth(server.id, runtime[server.id]);

          await createIncident(server.id, previousStatus, "UP");

          runtime[server.id].responseTime = responseTime;

          runtime[server.id].uptime = data.uptime ?? 0;

          runtime[server.id].cpuUsage = data.cpuUsage ?? 0;

          runtime[server.id].memoryUsage = data.memoryUsage ?? 0;

          runtime[server.id].heapUsed = data.heapUsed ?? 0;

          runtime[server.id].heapTotal = data.heapTotal ?? 0;

          runtime[server.id].threadCount = data.threadCount ?? 0;

          runtime[server.id].lastHeartbeat = now;
          runtime[server.id].lastHealthCheck = now;
          runtime[server.id].lastUpdated = now;
        } catch (err) {
          const now = Date.now();

          /* ----------------------------------
                       Backward compatibility
                    ----------------------------------- */

          server.healthy = false;
          server.status = "DOWN";

          await updateServiceHealth(server.id, runtime[server.id]);

          await createIncident(server.id, previousStatus, "DOWN");

          /* ----------------------------------
                       Runtime Dashboard
                    ----------------------------------- */

          runtime[server.id].healthy = false;
          runtime[server.id].status = "DOWN";

          runtime[server.id].responseTime = 0;

          runtime[server.id].cpuUsage = 0;
          runtime[server.id].memoryUsage = 0;
          runtime[server.id].heapUsed = 0;
          runtime[server.id].heapTotal = 0;
          runtime[server.id].threadCount = 0;
          runtime[server.id].uptime = 0;

          runtime[server.id].lastHealthCheck = now;
          runtime[server.id].lastUpdated = now;
        }
      }
    }

    await updateGatewayHealth(runtime);

    await client.set("server-config", JSON.stringify(serverConfig));

    await client.set("dynamic-server-config", JSON.stringify(runtime));
  }

  start() {
    this.checkHealth();

    setInterval(async () => {
      try {
        await this.checkHealth();
      } catch (err) {
        console.error("Health Check Failed:", err.message);
      }
    }, this.interval);
  }
}

export default HealthChecker;
