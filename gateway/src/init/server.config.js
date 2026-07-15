const serverConfig = [
    {
        id: "auth-1",
        service: "auth-service",
        name: "Auth Service",
        url: "http://localhost:5001",

        weight: 1,
        enabled: true,

        zone: "ap-south-1a",
        version: "v1",

        maxConnections: 1000,
        maxRPS: 500
    },

    {
        id: "user-1",
        service: "user-service",
        name: "User Service 1",
        url: "http://localhost:5002",

        weight: 5,
        enabled: true,

        zone: "ap-south-1a",
        version: "v1",

        maxConnections: 1000,
        maxRPS: 500
    },

    {
        id: "user-2",
        service: "user-service",
        name: "User Service 2",
        url: "http://localhost:5003",

        weight: 3,
        enabled: true,

        zone: "ap-south-1b",
        version: "v1",

        maxConnections: 1000,
        maxRPS: 500
    },

    {
        id: "user-3",
        service: "user-service",
        name: "User Service 3",
        url: "http://localhost:5004",

        weight: 2,
        enabled: true,

        zone: "ap-south-1c",
        version: "v1",

        maxConnections: 1000,
        maxRPS: 500
    },

    {
        id: "admin-1",
        service: "admin-service",
        name: "Admin Service",
        url: "http://localhost:5005",

        weight: 1,
        enabled: true,

        zone: "ap-south-1a",
        version: "v1",

        maxConnections: 1000,
        maxRPS: 500
    }
];



export const dynamic_server_config = {
    "auth-1": {
        // Health
        status: "UNKNOWN",                 // UNKNOWN | UP | DOWN
        healthy: false,
        enabled: true,

        // Request Statistics
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        blockedRequests: 0,

        // Connections
        activeConnections: 0,
        queuedRequests: 0,

        // Performance
        currentRPS: 0,
        peakRPS: 0,

        lastLatency: 0,
        averageLatency: 0,
        minLatency: 0,
        maxLatency: 0,

        errorRate: 0,

        // Resource Usage
        cpuUsage: 0,
        memoryUsage: 0,
        heapUsed: 0,
        heapTotal: 0,
        threadCount: 0,

        // Network
        bytesReceived: 0,
        bytesSent: 0,

        // Load Balancer
        selectedCount: 0,
        currentWeight: 0,
        lastSelected: null,

        // Health Check
        uptime: 0,
        responseTime: 0,
        lastHeartbeat: null,
        lastHealthCheck: null,

        // Activity
        lastRequestAt: null,
        startedAt: null,

        // Rate Limiter
        currentTokens: 0,
        rateLimitedRequests: 0,

        // Dashboard
        lastUpdated: null
    },

    "user-1": {
        status: "UNKNOWN",
        healthy: false,
        enabled: true,

        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        blockedRequests: 0,

        activeConnections: 0,
        queuedRequests: 0,

        currentRPS: 0,
        peakRPS: 0,

        lastLatency: 0,
        averageLatency: 0,
        minLatency: 0,
        maxLatency: 0,

        errorRate: 0,

        cpuUsage: 0,
        memoryUsage: 0,
        heapUsed: 0,
        heapTotal: 0,
        threadCount: 0,

        bytesReceived: 0,
        bytesSent: 0,

        selectedCount: 0,
        currentWeight: 0,
        lastSelected: null,

        uptime: 0,
        responseTime: 0,
        lastHeartbeat: null,
        lastHealthCheck: null,

        lastRequestAt: null,
        startedAt: null,

        currentTokens: 0,
        rateLimitedRequests: 0,

        lastUpdated: null
    },

    "user-2": {
        status: "UNKNOWN",
        healthy: false,
        enabled: true,

        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        blockedRequests: 0,

        activeConnections: 0,
        queuedRequests: 0,

        currentRPS: 0,
        peakRPS: 0,

        lastLatency: 0,
        averageLatency: 0,
        minLatency: 0,
        maxLatency: 0,

        errorRate: 0,

        cpuUsage: 0,
        memoryUsage: 0,
        heapUsed: 0,
        heapTotal: 0,
        threadCount: 0,

        bytesReceived: 0,
        bytesSent: 0,

        selectedCount: 0,
        currentWeight: 0,
        lastSelected: null,

        uptime: 0,
        responseTime: 0,
        lastHeartbeat: null,
        lastHealthCheck: null,

        lastRequestAt: null,
        startedAt: null,

        currentTokens: 0,
        rateLimitedRequests: 0,

        lastUpdated: null
    },

    "user-3": {
        status: "UNKNOWN",
        healthy: false,
        enabled: true,

        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        blockedRequests: 0,

        activeConnections: 0,
        queuedRequests: 0,

        currentRPS: 0,
        peakRPS: 0,

        lastLatency: 0,
        averageLatency: 0,
        minLatency: 0,
        maxLatency: 0,

        errorRate: 0,

        cpuUsage: 0,
        memoryUsage: 0,
        heapUsed: 0,
        heapTotal: 0,
        threadCount: 0,

        bytesReceived: 0,
        bytesSent: 0,

        selectedCount: 0,
        currentWeight: 0,
        lastSelected: null,

        uptime: 0,
        responseTime: 0,
        lastHeartbeat: null,
        lastHealthCheck: null,

        lastRequestAt: null,
        startedAt: null,

        currentTokens: 0,
        rateLimitedRequests: 0,

        lastUpdated: null
    },

    "admin-1": {
        status: "UNKNOWN",
        healthy: false,
        enabled: true,

        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        blockedRequests: 0,

        activeConnections: 0,
        queuedRequests: 0,

        currentRPS: 0,
        peakRPS: 0,

        lastLatency: 0,
        averageLatency: 0,
        minLatency: 0,
        maxLatency: 0,

        errorRate: 0,

        cpuUsage: 0,
        memoryUsage: 0,
        heapUsed: 0,
        heapTotal: 0,
        threadCount: 0,

        bytesReceived: 0,
        bytesSent: 0,

        selectedCount: 0,
        currentWeight: 0,
        lastSelected: null,

        uptime: 0,
        responseTime: 0,
        lastHeartbeat: null,
        lastHealthCheck: null,

        lastRequestAt: null,
        startedAt: null,

        currentTokens: 0,
        rateLimitedRequests: 0,

        lastUpdated: null
    }



}


export const stringDynamicServerConfig = JSON.stringify(dynamic_server_config) ; 

const serverConfigString = JSON.stringify(serverConfig);

export default serverConfigString;