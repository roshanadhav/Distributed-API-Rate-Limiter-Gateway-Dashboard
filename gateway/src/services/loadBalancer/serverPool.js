class ServerPool {

    async getServer(serviceName, servers) {

        const server = servers.find(server => server.healthy);

        if (!server) {
            throw new Error(`No available servers for ${serviceName}`);
        }

        return server;
    }
}

export default ServerPool;