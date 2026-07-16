import client from "../../utils/radis.connection.js";

/**
 * --------------------------------------------------------
 * Helper
 * --------------------------------------------------------
 */

async function getGatewayMetrics() {
  return JSON.parse(await client.get("gateway:metrics"));
}

async function saveGatewayMetrics(metrics) {
  await client.set(
    "gateway:metrics",
    JSON.stringify(metrics)
  );
}

/**
 * --------------------------------------------------------
 * onRequest()
 *
 * Updates:
 *
 * Total Requests
 * Active Connections
 * Requests This Second
 * Peak RPS
 *
 * Call this immediately before forwarding
 * request to backend.
 *
 * --------------------------------------------------------
 */

export const onRequest = async () => {
  try {

    const metrics = await getGatewayMetrics();

    metrics.total_requests++;

    metrics.active_connections++;

    metrics.requests_this_second++;

    if (
      metrics.requests_this_second >
      metrics.peak_rps
    ) {
      metrics.peak_rps =
        metrics.requests_this_second;
    }

    await saveGatewayMetrics(metrics);

    /**
     * Reset current RPS every second.
     *
     * This keeps requests_this_second
     * representing the current second.
     */

    const exists = await client.exists(
      "gateway:rps:timer"
    );

    if (!exists) {

      await client.set(
        "gateway:rps:timer",
        "1",
        {
          EX: 1
        }
      );

      setTimeout(async () => {

        try {

          const gateway =
            await getGatewayMetrics();

          gateway.requests_this_second = 0;

          await saveGatewayMetrics(
            gateway
          );

        } catch (err) {
          console.error(err);
        }

      }, 1000);

    }

  } catch (err) {

    console.error(
      "[Gateway Metrics][onRequest]",
      err
    );

  }
};




/**
 * --------------------------------------------------------
 * onSuccess()
 *
 * Updates:
 *
 * Successful Requests
 * Active Connections
 * Total Response Time
 *
 * Call immediately after axios succeeds.
 *
 * --------------------------------------------------------
 */

export const onSuccess = async (responseTime) => {

  try {

    const metrics = await getGatewayMetrics();

    metrics.successful_requests++;

    // Request completed
    metrics.active_connections = Math.max(
      0,
      metrics.active_connections - 1
    );

    metrics.total_response_time_ms += responseTime;

    metrics.total_latency_ms += responseTime;

    await saveGatewayMetrics(metrics);

  } catch (err) {

    console.error(
      "[Gateway Metrics][onSuccess]",
      err
    );

  }

};



/**
 * --------------------------------------------------------
 * onFailure()
 *
 * Updates:
 *
 * Failed Requests
 * Active Connections
 * Total Response Time
 * Total Latency
 *
 * Call immediately inside catch().
 *
 * --------------------------------------------------------
 */

export const onFailure = async (responseTime) => {

  try {

    const metrics = await getGatewayMetrics();

    metrics.failed_requests++;

    // Request completed even though it failed
    metrics.active_connections = Math.max(
      0,
      metrics.active_connections - 1
    );

    metrics.total_response_time_ms += responseTime;

    metrics.total_latency_ms += responseTime;

    await saveGatewayMetrics(metrics);

  } catch (err) {

    console.error(
      "[Gateway Metrics][onFailure]",
      err
    );

  }

};



/**
 * --------------------------------------------------------
 * Helpers
 * --------------------------------------------------------
 */

async function getGatewayLatency() {
  return JSON.parse(await client.get("gateway:latency"));
}

async function saveGatewayLatency(latency) {
  await client.set(
    "gateway:latency",
    JSON.stringify(latency)
  );
}

/**
 * --------------------------------------------------------
 * updateLatency()
 *
 * Updates:
 *
 * Total Requests
 * Total Latency
 * Average Latency
 * Minimum Latency
 * Maximum Latency
 *
 * Call for BOTH success and failure responses.
 *
 * --------------------------------------------------------
 */

export const updateLatency = async (responseTime) => {

  try {

    const latency = await getGatewayLatency();

    latency.total_requests++;

    latency.total_latency_ms += responseTime;

    latency.average_latency_ms =
      Number(
        (
          latency.total_latency_ms /
          latency.total_requests
        ).toFixed(2)
      );

    // First request
    if (
      latency.min_latency_ms === Number.MAX_SAFE_INTEGER
    ) {
      latency.min_latency_ms = responseTime;
    } else {
      latency.min_latency_ms = Math.min(
        latency.min_latency_ms,
        responseTime
      );
    }

    latency.max_latency_ms = Math.max(
      latency.max_latency_ms,
      responseTime
    );

    await saveGatewayLatency(latency);

  } catch (err) {

    console.error(
      "[Gateway Metrics][updateLatency]",
      err
    );

  }

};





/**
 * --------------------------------------------------------
 * Helpers
 * --------------------------------------------------------
 */

async function getGatewayTraffic() {
  return JSON.parse(await client.get("gateway:traffic"));
}

async function saveGatewayTraffic(traffic) {
  await client.set(
    "gateway:traffic",
    JSON.stringify(traffic)
  );
}

/**
 * --------------------------------------------------------
 * updateTraffic()
 *
 * Updates:
 *
 * ✅ Incoming Bytes
 * ✅ Outgoing Bytes
 *
 * Call ONLY after a successful backend response.
 *
 * --------------------------------------------------------
 */

export const updateTraffic = async (req, response) => {

  try {

    const traffic = await getGatewayTraffic();

    // Request payload size
    const incomingBytes = Buffer.byteLength(
      JSON.stringify(req.body || {})
    );

    // Response payload size
    const outgoingBytes = Buffer.byteLength(
      JSON.stringify(response.data || {})
    );

    traffic.incoming_bytes += incomingBytes;
    traffic.outgoing_bytes += outgoingBytes;

    await saveGatewayTraffic(traffic);

  } catch (err) {

    console.error(
      "[Gateway Metrics][updateTraffic]",
      err
    );

  }

};


/**
 * --------------------------------------------------------
 * Helpers
 * --------------------------------------------------------
 */

async function getGatewayStatus() {
  return JSON.parse(await client.get("gateway:status"));
}

async function saveGatewayStatus(status) {
  await client.set(
    "gateway:status",
    JSON.stringify(status)
  );
}

/**
 * --------------------------------------------------------
 * updateStatus()
 *
 * Updates:
 *
 * ✅ 2xx
 * ✅ 3xx
 * ✅ 4xx
 * ✅ 429
 * ✅ 5xx
 *
 * Call after every request.
 *
 * --------------------------------------------------------
 */

export const updateStatus = async (statusCode) => {

  try {

    const status = await getGatewayStatus();

    if (statusCode >= 200 && statusCode < 300) {

      status["2xx"]++;

    } else if (statusCode >= 300 && statusCode < 400) {

      status["3xx"]++;

    } else if (statusCode === 429) {

      status["429"]++;
      status["4xx"]++;

    } else if (statusCode >= 400 && statusCode < 500) {

      status["4xx"]++;

    } else if (statusCode >= 500) {

      status["5xx"]++;

    }

    await saveGatewayStatus(status);

  } catch (err) {

    console.error(
      "[Gateway Metrics][updateStatus]",
      err
    );

  }

};