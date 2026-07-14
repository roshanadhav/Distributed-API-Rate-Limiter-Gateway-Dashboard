import LeakyBucket from "./leakyBucket.js";
import SlidingWindow from "./slidingWindow.js";
import FixedWindow from "./fixedWindow.js";
import TokenBucket from "./tokenBucket.js";
import DistriButedLimiter from "./distributedLimiter.js";

class RateLimiter {

    constructor() {
        this.leakyBucket = new LeakyBucket();
        this.slidingWindow = new SlidingWindow();
        this.fixedWindow = new FixedWindow();
        this.tokenBucket = new TokenBucket();
        this.distriButedLimiter = new DistriButedLimiter();
    }

    async allow(ip, policies) {

        const algorithm = policies.rateLimiter.algorithm;

        switch (algorithm) {

            case "fixedWindow":
                return await this.fixedWindow.allow(ip, policies);

            case "slidingWindow":
                return await this.slidingWindow.allow(ip, policies);

            case "tokenBucket":
                return await this.tokenBucket.allow(ip, policies);

            case "leakyBucket":
                return await this.leakyBucket.allow(ip, policies);

            case "distributedLimiter":
                return await this.distriButedLimiter.allow(ip, policies);

            default:
                throw new Error(`Unsupported Rate Limiter: ${algorithm}`);
        }
    }
}

export default RateLimiter;