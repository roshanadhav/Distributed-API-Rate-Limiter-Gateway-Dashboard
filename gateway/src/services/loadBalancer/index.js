import ConsistentHashing from "./consistentHashing.js";
import HealthChecker from "./healthChecker.js";
import IpHash from "./ipHash.js";
import LeastConnections from "./leastConnections.js";
import LeastResponseTime from "./leastResponseTime.js";
import RandomAllocation from "./random.js";
import RoundRobin from "./roundRobin.js";
import ServerPool from "./serverPool.js";
import WeightedRandom from "./weightedRandom.js";
import WeightedRoundRobin from "./weightedRoundRobin.js";

class LoadBalancer {

    constructor() {

        this.consistentHashing = new ConsistentHashing();
        this.healthChecker = new HealthChecker();
        this.ipHash = new IpHash();
        this.leastConnections = new LeastConnections();
        this.leastResponseTime = new LeastResponseTime();
        this.randomAllocation = new RandomAllocation();
        this.roundRobin = new RoundRobin();
        this.serverPool = new ServerPool();
        this.weightedRandomAllocation = new WeightedRandom();
        this.weightedRoundRobin = new WeightedRoundRobin();
    }

    async getServer(serviceName, s , context = {}) {

        const config = s ;
        const service = config[serviceName];
        
        if (!service) {
            throw new Error(`Service ${serviceName} not found`);
        }

        switch (service.strategy) {

            case "round-robin":
                return this.roundRobin.getServer(
                    service.service,
                    service.instances,
                    context
                );

            case "weighted-round-robin":
                return this.weightedRoundRobin.getServer(
                    service.service,
                    service.instances,
                    context
                );

            case "random":
                return this.randomAllocation.getServer(
                    service.service,
                    service.instances,
                    context
                );

            case "weighted-random":
                return this.weightedRandomAllocation.getServer(
                    service.service,
                    service.instances,
                    context
                );

            case "least-connections":
                return this.leastConnections.getServer(
                    service.service,
                    service.instances,
                    context
                );

            case "least-response-time":
                return this.leastResponseTime.getServer(
                    service.service,
                    service.instances,
                    context
                );

            case "ip-hash":
                return this.ipHash.getServer(
                    service.service,
                    service.instances,
                    context
                );

            case "consistent-hashing":
                return this.consistentHashing.getServer(
                    service.service,
                    service.instances,
                    context
                );

            case "server-pool":
                return this.serverPool.getServer(
                    service.service,
                    service.instances,
                    context
                );

            default:
                throw new Error(
                    `Unsupported Load Balancer Strategy: ${service.strategy}`
                );
        }
    }
}

export default LoadBalancer;