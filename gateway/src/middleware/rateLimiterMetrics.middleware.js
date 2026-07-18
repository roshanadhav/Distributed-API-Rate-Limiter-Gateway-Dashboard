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
        await client.get("rl:metrics")
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

        // Atomic increment
        await client.incr(
            "gateway:rl:allowed_requests"
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

        // Atomic increment
        await client.incr(
            "gateway:rl:blocked_requests"
        );

        const rl =
            await getRateLimiter();

        rl.last_blocked_ip = ip;

        rl.last_blocked_at = Date.now();

        await saveRateLimiter(rl);

        await client.incr(
            "gateway:rate_limited_requests"
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