import client from "../../../utils/radis.connection.js";

class LeakyBucket {

    async allow(ip, policies) {

        const capacity = policies.rateLimiter.config.capacity;
        const leakRate = policies.rateLimiter.config.leakRate;

        const queueKey = `lb:${ip}:queue`;
        const leakKey = `lb:${ip}:lastLeak`;

        const now = Math.floor(Date.now() / 1000);

        let lastLeak = Number(await client.get(leakKey));

        // Initialize
        if (!lastLeak) {

            await client.set(queueKey, 0);
            await client.set(leakKey, now);

            lastLeak = now;
        }

        // Leak requests
        const elapsed = now - lastLeak;

        if (elapsed > 0) {

            let queue = Number(await client.get(queueKey) || 0);

            queue = Math.max(
                0,
                queue - elapsed * leakRate
            );

            await client.set(queueKey, queue);
            await client.set(leakKey, now);
        }

        // Atomic enqueue
        const queueSize = await client.incr(queueKey);

        if (queueSize > capacity) {

            await client.decr(queueKey);

            return false;
        }

        const ttl = Math.ceil(capacity / leakRate) * 2;

        await Promise.all([
            client.expire(queueKey, ttl),
            client.expire(leakKey, ttl)
        ]);

        return true;
    }
}

export default LeakyBucket;