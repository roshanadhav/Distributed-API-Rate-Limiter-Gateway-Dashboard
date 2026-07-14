class RandomAllocation {

    async getServer(serviceName, servers) {

        const enabledServers = servers.filter(server => server.healthy);

        if (enabledServers.length === 0) {
            throw new Error(`No available servers for ${serviceName}`);
        }

        const index = Math.floor(Math.random() * enabledServers.length);

        return enabledServers[index];
    }
}

export default RandomAllocation;