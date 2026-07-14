import client from "../../../utils/radis.connection.js";

class LeastConnections {

    async getServer(serviceName, servers) {

        const enabledServers = servers.filter(server => server.healthy);

        if (enabledServers.length === 0) {
            throw new Error(`No available servers for ${serviceName}`);
        }

        let bestServer = enabledServers[0];
        let leastConnections = Number.MAX_SAFE_INTEGER;

        for (const server of enabledServers) {

            const key = `lb:connections:${server.id}`;

            let connections = await client.get(key);

            connections = connections ? Number(connections) : 0;

            if (connections < leastConnections) {
                leastConnections = connections;
                bestServer = server;
            }
        }

        return bestServer;
    }
}

export default LeastConnections;