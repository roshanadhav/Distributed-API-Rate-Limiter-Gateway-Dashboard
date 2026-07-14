import client from "../../../utils/radis.connection.js";

class SlidingWindow {

    async allow(ip, policies) {

        const window = policies.rateLimiter.config.window;
        const limit = policies.rateLimiter.config.limit;

        const now = Math.floor(Date.now() / 1000);
        const currentWindow = Math.floor(now / window);

        const cwKey = `sw:${ip}:cw`;
        const pwKey = `sw:${ip}:pw`;
        const ccKey = `sw:${ip}:cc`;
        const pcKey = `sw:${ip}:pc`;

        // ---------- Initialize ----------

        let storedCurrentWindow = Number(await client.get(cwKey));

        if (!storedCurrentWindow) {

            await client.set(cwKey, currentWindow);
            await client.set(pwKey, currentWindow - 1);

            await client.set(ccKey, 0);
            await client.set(pcKey, 0);

            storedCurrentWindow = currentWindow;
        }

        // ---------- Window Shift ----------

        if (storedCurrentWindow < currentWindow) {

            const oldCurrentCount = Number(await client.get(ccKey) || 0);

            if (storedCurrentWindow + 1 === currentWindow) {

                await client.set(pcKey, oldCurrentCount);
                await client.set(pwKey, storedCurrentWindow);

            } else {

                await client.set(pcKey, 0);
                await client.set(pwKey, currentWindow - 1);

            }

            await client.set(ccKey, 0);
            await client.set(cwKey, currentWindow);

            storedCurrentWindow = currentWindow;
        }

        // ---------- Read Previous Count ----------

        const previousCount = Number(await client.get(pcKey) || 0);

        // ---------- Atomic Increment ----------

        const currentCount = await client.incr(ccKey);

        const elapsed = now % window;

        const weight = 1 - (elapsed / window);

        const estimatedRequests =
            currentCount + previousCount * weight;

        // ---------- Reject ----------

        if (estimatedRequests > limit) {

            await client.decr(ccKey);

            return false;
        }

        // ---------- TTL ----------

        await Promise.all([
            client.expire(ccKey, window * 2),
            client.expire(pcKey, window * 2),
            client.expire(cwKey, window * 2),
            client.expire(pwKey, window * 2)
        ]);

        console.log({
            currentWindow,
            currentCount,
            previousCount,
            estimatedRequests
        });

        return true;
    }
}

export default SlidingWindow;