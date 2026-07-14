import client from "../../../utils/radis.connection.js";

class TokenBucket {

    async allow(ip, policies) {

        const capacity = policies.rateLimiter.config.capacity;
        const refillRate = policies.rateLimiter.config.refillRate;

        const tokenKey = `tb:${ip}:tokens`;
        const refillKey = `tb:${ip}:lastRefill`;

        const now = Math.floor(Date.now() / 1000);

        // ---------- Initialize ----------

        let lastRefill = Number(await client.get(refillKey));

        if (!lastRefill) {

            await client.set(tokenKey, capacity);
            await client.set(refillKey, now);

            lastRefill = now;
        }

        // ---------- Refill ----------

        const elapsed = now - lastRefill;

        if (elapsed > 0) {

            let tokens = Number(await client.get(tokenKey) || 0);

            tokens = Math.min(
                capacity,
                tokens + elapsed * refillRate
            );

            await client.set(tokenKey, tokens);
            await client.set(refillKey, now);
        }

        // ---------- Consume Token (Atomic) ----------

        const remaining = await client.decr(tokenKey);

        if (remaining < 0) {

            // Rollback
            await client.incr(tokenKey);

            return false;
        }

        // ---------- TTL ----------

        const ttl = Math.ceil(capacity / refillRate) * 2;

        await Promise.all([
            client.expire(tokenKey, ttl),
            client.expire(refillKey, ttl)
        ]);

        return true;
    }
}

export default TokenBucket;