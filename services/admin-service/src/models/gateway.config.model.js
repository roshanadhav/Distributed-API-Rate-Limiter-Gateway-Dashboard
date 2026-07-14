import mongoose from "mongoose";

const GatewayConfigSchema = new mongoose.Schema(
  {
    version: {
      type: Number,
      default: 1,
    },

    rateLimiter: {
      enabled: {
        type: Boolean,
        default: true,
      },

      algorithm: {
        type: String,
        enum: [
          "fixedWindow",
          "slidingWindow",
          "slidingLog",
          "tokenBucket",
          "leakyBucket",
        ],
        default: "fixedWindow",
      },

      config: {
        window: {
          type: Number,
          default: 60,
        },

        limit: {
          type: Number,
          default: 100,
        },

        capacity: {
          type: Number,
          default: 100,
        },

        refillRate: {
          type: Number,
          default: 10,
        },

        leakRate: {
          type: Number,
          default: 5,
        },
      },
    },

    loadBalancer: {
      enabled: {
        type: Boolean,
        default: true,
      },

      algorithm: {
        type: String,
        enum: [
          "roundRobin",
          "weightedRoundRobin",
          "random",
          "weightedRandom",
          "leastConnections",
          "leastResponseTime",
          "ipHash",
          "consistentHash",
        ],
        default: "roundRobin",
      },

      config: {
        hashHeader: {
          type: String,
          default: "",
        },
      },
    },

    healthChecker: {
      enabled: {
        type: Boolean,
        default: true,
      },

      interval: {
        type: Number,
        default: 5000,
      },

      timeout: {
        type: Number,
        default: 2000,
      },

      path: {
        type: String,
        default: "/health",
      },

      healthyThreshold: {
        type: Number,
        default: 2,
      },

      unhealthyThreshold: {
        type: Number,
        default: 3,
      },
    },

    proxy: {
      timeout: {
        type: Number,
        default: 10000,
      },

      retries: {
        type: Number,
        default: 2,
      },
    },

    updatedBy: {
      type: String,
      default: "system",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("GatewayConfig", GatewayConfigSchema);