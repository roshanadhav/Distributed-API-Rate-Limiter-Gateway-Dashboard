class WeightedRandom {

    async getServer(serviceName, servers) {

        const enabledServers = servers.filter(server => server.healthy);

        if (enabledServers.length === 0) {
            throw new Error(`No available servers for ${serviceName}`);
        }

        const totalWeight = enabledServers.reduce(
            (sum, server) => sum + server.weight,
            0
        );

        let random = Math.random() * totalWeight;

        for (const server of enabledServers) {

            random -= server.weight;

            if (random < 0) {
                return server;
            }
        }

        return enabledServers[enabledServers.length - 1];
    }
}

export default WeightedRandom;