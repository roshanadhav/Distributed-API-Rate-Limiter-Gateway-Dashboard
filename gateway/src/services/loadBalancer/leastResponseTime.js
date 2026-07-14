import client from "../../../utils/radis.connection.js";

class LeastResponseTime {

    async getServer(serviceName, servers) {

        const enabledServers = servers.filter(server => server.healthy);

        if (enabledServers.length === 0) {
            throw new Error(`No available servers for ${serviceName}`);
        }

        let bestServer = enabledServers[0];
        let leastResponse = Number.MAX_SAFE_INTEGER;

        for (const server of enabledServers) {

            const key = `lb:response:${server.id}`;

            let responseTime = await client.get(key);

            responseTime = responseTime ? Number(responseTime) : 0;

            if (responseTime < leastResponse) {
                leastResponse = responseTime;
                bestServer = server;
            }
        }

        return bestServer;
    }
}

export default LeastResponseTime;