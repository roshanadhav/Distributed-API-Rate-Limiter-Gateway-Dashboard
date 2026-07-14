import crypto from "crypto";

class IpHash {

    async getServer(serviceName, servers, context = {}) {

        const enabledServers = servers.filter(server => server.healthy);

        if (enabledServers.length === 0) {
            throw new Error(`No available servers for ${serviceName}`);
        }

        const clientIp = context.clientIp;

        if (!clientIp) {
            throw new Error("Client IP is required for IP Hash");
        }

        const hash = crypto
            .createHash("md5")
            .update(clientIp)
            .digest("hex");

        const hashValue = parseInt(hash.substring(0, 8), 16);

        const index = hashValue % enabledServers.length;

        return enabledServers[index];
    }
}

export default IpHash;