import RateLimiter from "../services/rateLimiter/index.js";
import client from "../../utils/radis.connection.js";

import {
    onAllowed,
    onBlocked
} from "./rateLimiterMetrics.middleware.js";

async function rateLimiter(req, res, next) {

    const rateLimiterChecker = new RateLimiter();

    const data = await client.get("gateway-config");

    const policies = JSON.parse(data);

    const ip = req.ip;

    const algorithm =
        policies.algorithm;

    const allowed =
        await rateLimiterChecker.allow(
            ip,
            policies
        );

    if (!allowed) {

        await onBlocked(
            algorithm,
            ip
        );

        return res.status(429).json({
            message: "wait for some time"
        });

    }

    await onAllowed(
        algorithm
    );

    next();

}

export default rateLimiter;