const routes = {
    "/auth": {
        service: "auth-service",
        strategy: "round-robin",

        instances: [
            {
                id: "auth-1",
                url: "http://auth-service:5001",

                weight: 1,
                healthy: true,

                zone: "ap-south-1a",
                version: "v1",

                maxConnections: 1000,
                maxRPS: 500
            }
        ]
    },


    "/users": {
        service: "user-service",
        strategy: "round-robin",

        instances: [
            {
                id: "user-1",
                url: "http://user-service:5002",

                weight: 5,
                healthy: true,

                zone: "ap-south-1a",
                version: "v1",

                maxConnections: 1000,
                maxRPS: 500
            },
            {
                id: "user-2",
                url: "http://user-service-2:5003",

                weight: 3,
                healthy: true,

                zone: "ap-south-1b",
                version: "v1",

                maxConnections: 1000,
                maxRPS: 500
            },
            {
                id: "user-3",
                url: "http://user-service-3:5004",

                weight: 2,
                healthy: true,

                zone: "ap-south-1c",
                version: "v1",

                maxConnections: 1000,
                maxRPS: 500
            }
        ]
    },


    "/admin": {
        service: "admin-service",
        strategy: "round-robin",

        instances: [
            {
                id: "admin-1",
                url: "http://admin-service:5005",

                weight: 1,
                healthy: true,

                zone: "ap-south-1a",
                version: "v1",

                maxConnections: 1000,
                maxRPS: 500
            }
        ]
    }
};

export default routes;