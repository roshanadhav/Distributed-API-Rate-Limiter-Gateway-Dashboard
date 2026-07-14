import client from "../../../utils/radis.connection.js";

class WeightedRoundRobin {

    async getServer(serviceName, servers) {

        const enabledServers = servers.filter(server => server.healthy);

        if (enabledServers.length === 0) {
            throw new Error("No healthy server available");
        }

        const weightedServers = [];

        for (const server of enabledServers) {
            for (let i = 0; i < server.weight; i++) {
                weightedServers.push(server);
            }
        }

        const key = `lb:wrr:${serviceName}:index`;

        const index = await client.incr(key);

        return weightedServers[(index - 1) % weightedServers.length];
    }
}

export default WeightedRoundRobin;