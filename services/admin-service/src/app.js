import express from 'express' ; 

import os from "os";
import process from "process";

import client from './cache/radis.cache.js';

client.on("error", (err) => console.log(err));

const startedAt = Date.now();

const app = express() ; 

app.disable("etag");


await client
  .connect()
  .then(() => console.log("REDIS CONNECTION SUCCESSFUL"))
  .catch(console.error);


app.get("/health", (req, res) => {

    const memory = process.memoryUsage();

    res.status(200).json({

        success: true,

        service: "user-service",

        status: "UP",

        uptime: process.uptime(),

        cpuCount: os.cpus().length,

        loadAverage: os.loadavg()[0],

        memoryUsage: Math.round(
            (memory.heapUsed / memory.heapTotal) * 100
        ),

        heapUsed: Math.round(
            memory.heapUsed / 1024 / 1024
        ),

        heapTotal: Math.round(
            memory.heapTotal / 1024 / 1024
        ),

        threadCount: 1,

        timestamp: Date.now(),

        startedAt

    });

});



// apis ; 
/*
{
  "success": true,
  "data": {
    "gateway": "MindEdix Gateway",
    "version": "1.0.0",
    "environment": "development",
    "uptime": 5295300,
    "totalRequests": 24561,
    "requestsPerSecond": 82,
    "peakRps": 196,
    "avgLatency": 12.8,
    "minLatency": 3,
    "maxLatency": 94,
    "activeConnections": 7,
    "activeServices": 4,
    "successfulRequests": 24391,
    "failedRequests": 170,
    "rateLimitedRequests": 58,
    "errorRate": "0.69",
    "recentIncidents": 2
  }
}

*/

app.get("/admin/overview", async (req, res) => {

    try {

        const [
            config,
            metrics,
            latency,
            incidents
        ] = await Promise.all([
            client.get("gateway:config"),
            client.get("gateway:metrics"),
            client.get("gateway:latency"),
            client.get("gateway:incidents")
        ]);

        const gatewayConfig = JSON.parse(config);
        const gatewayMetrics = JSON.parse(metrics);
        const gatewayLatency = JSON.parse(latency);
        const gatewayIncidents = JSON.parse(incidents);

        const uptime = Date.now() - gatewayConfig.startedAt;

        const errorRate =
            gatewayMetrics.total_requests === 0
                ? 0
                : Number(
                    (
                        gatewayMetrics.failed_requests /
                        gatewayMetrics.total_requests
                    ) * 100
                ).toFixed(2);

        return res.status(200).json({

            success: true,

            data: {

                gateway: gatewayConfig.gatewayName,

                version: gatewayConfig.version,

                environment: gatewayConfig.environment,

                uptime,

                totalRequests:
                    gatewayMetrics.total_requests,

                requestsPerSecond:
                    gatewayMetrics.requests_this_second,

                peakRps:
                    gatewayMetrics.peak_rps,

                avgLatency:
                    gatewayLatency.average_latency_ms,

                minLatency:
                    gatewayLatency.min_latency_ms,

                maxLatency:
                    gatewayLatency.max_latency_ms,

                activeConnections:
                    gatewayMetrics.active_connections,

                activeServices:
                    gatewayMetrics.active_services,

                successfulRequests:
                    gatewayMetrics.successful_requests,

                failedRequests:
                    gatewayMetrics.failed_requests,

                rateLimitedRequests:
                    gatewayMetrics.rate_limited_requests,

                errorRate,

                recentIncidents:
                    gatewayIncidents.length

            }

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to fetch dashboard overview"

        });

    }

});




app.get("/admin/gateway", async (req, res) => {

    try {

        const [
            config,
            metrics,
            latency,
            traffic,
            status,
            loadBalancer,
            rateLimiter
        ] = await Promise.all([

            client.get("gateway:config"),

            client.get("gateway:metrics"),

            client.get("gateway:latency"),

            client.get("gateway:traffic"),

            client.get("gateway:status"),

            client.get("gateway:loadbalancer"),

            client.get("gateway:ratelimiter")

        ]);

        const gatewayConfig = JSON.parse(config);

        const gatewayMetrics = JSON.parse(metrics);

        const gatewayLatency = JSON.parse(latency);

        const gatewayTraffic = JSON.parse(traffic);

        const gatewayStatus = JSON.parse(status);

        const gatewayLoadBalancer =
            JSON.parse(loadBalancer);

        const gatewayRateLimiter =
            JSON.parse(rateLimiter);

        return res.status(200).json({

            success: true,

            data: {

                config: gatewayConfig,

                metrics: gatewayMetrics,

                latency: gatewayLatency,

                traffic: {

                    incomingBytes:
                        gatewayTraffic.incoming_bytes,

                    outgoingBytes:
                        gatewayTraffic.outgoing_bytes,

                    totalBytes:
                        gatewayTraffic.incoming_bytes +
                        gatewayTraffic.outgoing_bytes

                },

                status: gatewayStatus,

                loadBalancer: gatewayLoadBalancer,

                rateLimiter: gatewayRateLimiter

            }

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to fetch gateway information"

        });

    }

});


/*
{
    "success": true,
    "data": {

        "config": { ... },

        "metrics": { ... },

        "latency": { ... },

        "traffic": {
            "incomingBytes": 1203912,
            "outgoingBytes": 2839102,
            "totalBytes": 4043014
        },

        "status": {
            "2xx": 19231,
            "3xx": 10,
            "4xx": 132,
            "429": 53,
            "5xx": 21
        },

        "loadBalancer": {

        },

        "rateLimiter": {

        }

    }
}

*/




app.get("/admin/services", async (req, res) => {

    try {

        const runtime = JSON.parse(
            await client.get("dynamic-server-config")
        );

        const services = Object.values(runtime).map(service => ({

            id: service.id,

            serviceName: service.serviceName,

            url: service.url,

            healthy: service.healthy,

            status: service.status,

            responseTime: service.responseTime,

            averageLatency: service.averageLatency,

            minLatency: service.minLatency,

            maxLatency: service.maxLatency,

            totalRequests: service.totalRequests,

            successfulRequests: service.successfulRequests,

            failedRequests: service.failedRequests,

            activeConnections: service.activeConnections,

            selectedCount: service.selectedCount,

            cpuUsage: service.cpuUsage,

            memoryUsage: service.memoryUsage,

            heapUsed: service.heapUsed,

            heapTotal: service.heapTotal,

            uptime: service.uptime,

            threadCount: service.threadCount,

            bytesReceived: service.bytesReceived,

            bytesSent: service.bytesSent,

            lastHeartbeat: service.lastHeartbeat,

            lastSelected: service.lastSelected,

            lastHealthCheck: service.lastHealthCheck,

            lastUpdated: service.lastUpdated

        }));

        return res.status(200).json({

            success: true,

            total: services.length,

            healthy: services.filter(s => s.healthy).length,

            unhealthy: services.filter(s => !s.healthy).length,

            services

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to fetch services"

        });

    }

});


/*

{
    "success": true,
    "total": 4,
    "healthy": 4,
    "unhealthy": 0,
    "services": [
        {
            "id": "user-service",
            "serviceName": "User Service",
            "url": "http://localhost:5001",
            "healthy": true,
            "status": "UP",
            "responseTime": 12,
            "averageLatency": 14,
            "minLatency": 4,
            "maxLatency": 52,
            "totalRequests": 2034,
            "successfulRequests": 2028,
            "failedRequests": 6,
            "activeConnections": 2,
            "selectedCount": 2034,
            "cpuUsage": 18,
            "memoryUsage": 44,
            "heapUsed": 31,
            "heapTotal": 70,
            "uptime": 24531,
            "threadCount": 1,
            "bytesReceived": 812342,
            "bytesSent": 1943201,
            "lastHeartbeat": 1721158213,
            "lastSelected": 1721158202,
            "lastHealthCheck": 1721158213,
            "lastUpdated": 1721158213
        }
    ]
}



*/


app.get("/admin/services/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const runtime = JSON.parse(
            await client.get("dynamic-server-config")
        );

        const service = runtime[id];

        if (!service) {

            return res.status(404).json({

                success: false,

                message: "Service not found"

            });

        }

        const errorRate =
            service.totalRequests === 0
                ? 0
                : Number(
                    (
                        service.failedRequests /
                        service.totalRequests
                    ) * 100
                ).toFixed(2);

        return res.status(200).json({

            success: true,

            data: {

                id: service.id,

                serviceName: service.serviceName,

                url: service.url,

                healthy: service.healthy,

                status: service.status,

                uptime: service.uptime,

                responseTime: service.responseTime,

                averageLatency: service.averageLatency,

                minLatency: service.minLatency,

                maxLatency: service.maxLatency,

                totalRequests: service.totalRequests,

                successfulRequests:
                    service.successfulRequests,

                failedRequests:
                    service.failedRequests,

                errorRate,

                activeConnections:
                    service.activeConnections,

                selectedCount:
                    service.selectedCount,

                cpuUsage:
                    service.cpuUsage,

                memoryUsage:
                    service.memoryUsage,

                heapUsed:
                    service.heapUsed,

                heapTotal:
                    service.heapTotal,

                threadCount:
                    service.threadCount,

                bytesReceived:
                    service.bytesReceived,

                bytesSent:
                    service.bytesSent,

                lastRequestAt:
                    service.lastRequestAt,

                lastSelected:
                    service.lastSelected,

                lastHeartbeat:
                    service.lastHeartbeat,

                lastHealthCheck:
                    service.lastHealthCheck,

                lastUpdated:
                    service.lastUpdated

            }

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to fetch service details"

        });

    }

});


/*
{
  "success": true,
  "data": {
    "id": "user-service",
    "serviceName": "User Service",
    "url": "http://localhost:5001",
    "healthy": true,
    "status": "UP",
    "uptime": 32451,
    "responseTime": 13,
    "averageLatency": 15,
    "minLatency": 4,
    "maxLatency": 41,
    "totalRequests": 19342,
    "successfulRequests": 19312,
    "failedRequests": 30,
    "errorRate": "0.16",
    "activeConnections": 2,
    "selectedCount": 19342,
    "cpuUsage": 14,
    "memoryUsage": 38,
    "heapUsed": 45,
    "heapTotal": 128,
    "threadCount": 1,
    "bytesReceived": 1823942,
    "bytesSent": 9218392,
    "lastRequestAt": 1721159000,
    "lastSelected": 1721159000,
    "lastHeartbeat": 1721159001,
    "lastHealthCheck": 1721159001,
    "lastUpdated": 1721159001
  }
}


*/

export default app ; 