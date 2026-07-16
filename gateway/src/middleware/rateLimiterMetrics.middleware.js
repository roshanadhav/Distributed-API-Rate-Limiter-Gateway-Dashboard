import client from "../../utils/radis.connection.js";

/* ----------------------------------------------------
Helpers
----------------------------------------------------- */

async function getRateLimiter() {
    return JSON.parse(
        await client.get("gateway:ratelimiter")
    );
}

async function saveRateLimiter(data) {
    await client.set(
        "gateway:ratelimiter",
        JSON.stringify(data)
    );
}

async function getGatewayMetrics() {
    return JSON.parse(
        await client.get("gateway:metrics")
    );
}

async function saveGatewayMetrics(data) {
    await client.set(
        "gateway:metrics",
        JSON.stringify(data)
    );
}

async function getRLMetrics() {
    return JSON.parse(
        await client.get("rl:metrics")
    );
}

async function saveRLMetrics(data) {
    await client.set(
        "rl:metrics",
        JSON.stringify(data)
    );
}

/* ----------------------------------------------------
Request Allowed
----------------------------------------------------- */

export const onAllowed = async (algorithm) => {

    try {

        const rl = await getRateLimiter();

        rl.allowed_requests++;

        await saveRateLimiter(rl);

        const metrics = await getRLMetrics();

        switch (algorithm) {

            case "Fixed Window":
                metrics.fixed_window++;
                break;

            case "Sliding Window":
                metrics.sliding_window++;
                break;

            case "Token Bucket":
                metrics.token_bucket++;
                break;

            case "Leaky Bucket":
                metrics.leaky_bucket++;
                break;

        }

        await saveRLMetrics(metrics);

    } catch (err) {

        console.error(
            "[RL Allowed]",
            err
        );

    }

};

/* ----------------------------------------------------
Request Blocked
----------------------------------------------------- */

export const onBlocked = async (
    algorithm,
    ip
) => {

    try {

        const rl = await getRateLimiter();

        rl.blocked_requests++;

        rl.last_blocked_ip = ip;

        rl.last_blocked_at = Date.now();

        await saveRateLimiter(rl);

        const gateway =
            await getGatewayMetrics();

        gateway.rate_limited_requests++;

        await saveGatewayMetrics(
            gateway
        );

        const metrics =
            await getRLMetrics();

        switch (algorithm) {

            case "Fixed Window":
                metrics.fixed_window++;
                break;

            case "Sliding Window":
                metrics.sliding_window++;
                break;

            case "Token Bucket":
                metrics.token_bucket++;
                break;

            case "Leaky Bucket":
                metrics.leaky_bucket++;
                break;

        }

        await saveRLMetrics(metrics);

    } catch (err) {

        console.error(
            "[RL Blocked]",
            err
        );

    }

};