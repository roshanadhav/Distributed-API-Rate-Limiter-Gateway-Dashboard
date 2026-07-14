import os from "os";
import LeakyBucket from "./leakyBucket.js";
import SlidingWindow from "./slidingWindow.js";
import FixedWindow from "./fixedWindow.js";
import TokenBucket from "./tokenBucket.js";

class DistriButedLimiter {

    constructor() {
        this.fixedWindow = new FixedWindow();
        this.slidingWindow = new SlidingWindow();
        this.tokenBucket = new TokenBucket();
        this.leakyBucket = new LeakyBucket();
    }

    async allow(ip, policies) {

        const cpuLoad = os.loadavg()[0]; // 1 min load average
        const cpuCores = os.cpus().length;

        const cpuUsage = cpuLoad / cpuCores;

        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();

        const memoryUsage =
            (totalMemory - freeMemory) / totalMemory;

        // ------------------------------
        // Light Load
        // ------------------------------

        if (cpuUsage < 0.40 && memoryUsage < 0.60) {

            return await this.tokenBucket.allow(ip, policies);

        }

        // ------------------------------
        // Moderate Load
        // ------------------------------

        if (cpuUsage < 0.70 && memoryUsage < 0.80) {

            return await this.slidingWindow.allow(ip, policies);

        }

        // ------------------------------
        // Heavy Load
        // ------------------------------

        if (cpuUsage < 0.90) {

            return await this.leakyBucket.allow(ip, policies);

        }

        // ------------------------------
        // Critical Load
        // ------------------------------

        return await this.fixedWindow.allow(ip, policies);
    }
}

export default DistriButedLimiter;