import crypto from "crypto";

class ConsistentHashing {

    constructor(virtualNodes = 100) {
        this.virtualNodes = virtualNodes;
    }

    hash(value) {
        const hash = crypto
            .createHash("md5")
            .update(value)
            .digest("hex");

        return parseInt(hash.substring(0, 8), 16);
    }

    async getServer(serviceName, servers, context = {}) {

        const enabledServers = servers.filter(server => server.healthy);

        if (enabledServers.length === 0) {
            throw new Error(`No available servers for ${serviceName}`);
        }

        const clientKey = context.clientKey;

        if (!clientKey) {
            throw new Error("clientKey is required for Consistent Hashing");
        }

        const ring = [];

        // Create virtual nodes
        for (const server of enabledServers) {

            for (let i = 0; i < this.virtualNodes; i++) {

                ring.push({
                    hash: this.hash(`${server.id}:${i}`),
                    server
                });

            }
        }

        // Sort hash ring
        ring.sort((a, b) => a.hash - b.hash);

        const keyHash = this.hash(clientKey);

        // Find first server clockwise
        for (const node of ring) {

            if (node.hash >= keyHash) {
                return node.server;
            }

        }

        // Wrap around
        return ring[0].server;
    }
}

export default ConsistentHashing;