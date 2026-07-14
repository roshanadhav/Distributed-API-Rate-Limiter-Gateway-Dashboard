import client from "../../../utils/radis.connection.js";

class RoundRobin {

    async getServer(serviceName, servers) {

        const key = `lb:rr:${serviceName}:index`;

        const index = await client.incr(key);

        return servers[(index - 1) % servers.length];
    }
}

export default RoundRobin;