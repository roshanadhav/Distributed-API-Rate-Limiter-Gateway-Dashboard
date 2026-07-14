import { json } from "express"

const gateWayConfig = {
  "version": 1,

  "rateLimiter": {
    "enabled": true,
    "algorithm": "tokenBucket",

    "config": {
      "window": 60,
      "limit": 100,
      "capacity": 200,
      "refillRate": 20,
      "leakRate": 5
    }
  },

  "loadBalancer": {
    "enabled": true,
    "algorithm": "leastConnections",

    "config": {
      "hashHeader": "Authorization"
    }
  },

  "healthChecker": {
    "enabled": true,
    "interval": 5000,
    "timeout": 2000,
    "path": "/health",
    "healthyThreshold": 2,
    "unhealthyThreshold": 3
  },

  "proxy": {
    "timeout": 10000,
    "retries": 2
  }
}

const gateWayConfiString = JSON.stringify(gateWayConfig) ; 


export default gateWayConfiString ; 