import client from "../../utils/radis.connection.js";

async function getGatewayHealth() {
    return JSON.parse(
        await client.get("gateway:health")
    );
}

async function saveGatewayHealth(health) {
    await client.set(
        "gateway:health",
        JSON.stringify(health)
    );
}

async function getIncidents() {
    return JSON.parse(
        await client.get("gateway:incidents")
    );
}

async function saveIncidents(incidents) {
    await client.set(
        "gateway:incidents",
        JSON.stringify(incidents)
    );
}

/**
 * Called after every health check cycle.
 */

export const updateGatewayHealth = async (runtime) => {

    try {

        const health = await getGatewayHealth();

        health.total_checks++;

        health.last_check = Date.now();

        let healthy = 0;
        let unhealthy = 0;

        for (const service of Object.values(runtime)) {

            if (service.healthy) {

                healthy++;

            } else {

                unhealthy++;

            }

        }

        health.healthy_services = healthy;
        health.unhealthy_services = unhealthy;

        health.failed_checks += unhealthy;

        await saveGatewayHealth(health);

    } catch (err) {

        console.error(
            "[Health Metrics]",
            err
        );

    }

};

/**
 * Update service:<id>
 */

export const updateServiceHealth = async (
    serverId,
    runtimeServer
) => {

    try {

        const service = {
            serviceName: serverId,

            healthy: runtimeServer.healthy,

            status: runtimeServer.status,

            activeConnections:
                runtimeServer.activeConnections,

            avgResponseTime:
                runtimeServer.averageLatency,

            requestsServed:
                runtimeServer.totalRequests,

            lastHeartbeat:
                runtimeServer.lastHeartbeat
        };

        await client.set(
            `service:${serverId}`,
            JSON.stringify(service)
        );

    } catch (err) {

        console.error(
            "[Service Metrics]",
            err
        );

    }

};

/**
 * Creates incident only
 * when state changes.
 */

export const createIncident = async (
    serverId,
    oldStatus,
    newStatus
) => {

    try {

        if (oldStatus === newStatus)
            return;

        const incidents =
            await getIncidents();

        incidents.unshift({

            id:
                "INC-" +
                Date.now(),

            time:
                Date.now(),

            severity:
                newStatus === "DOWN"
                    ? "HIGH"
                    : "INFO",

            type:
                newStatus === "DOWN"
                    ? "SERVICE_DOWN"
                    : "SERVICE_RECOVERED",

            service: serverId,

            message:
                newStatus === "DOWN"
                    ? `${serverId} is unreachable`
                    : `${serverId} recovered`

        });

        await saveIncidents(
            incidents.slice(0, 20)
        );

    } catch (err) {

        console.error(
            "[Incident]",
            err
        );

    }

};