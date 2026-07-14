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

const serverConfigString = JSON.stringify(serverConfig);

export default serverConfigString;