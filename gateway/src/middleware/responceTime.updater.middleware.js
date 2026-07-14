import client from "../utils/radis.connection.js";

async function updateResponseTime(serverId, startTime) {

    const responseTime = Date.now() - startTime;

    await client.set(
        `lb:response:${serverId}`,
        responseTime
    );
}

export default updateResponseTime;