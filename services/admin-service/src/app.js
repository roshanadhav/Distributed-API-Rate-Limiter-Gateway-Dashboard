import express from 'express' ; 

import os from "os";
import process from "process";

const startedAt = Date.now();

const app = express() ; 

app.disable("etag");



app.get("/health", (req, res) => {

    const memory = process.memoryUsage();

    res.status(200).json({

        success: true,

        service: "user-service",

        status: "UP",

        uptime: process.uptime(),

        cpuCount: os.cpus().length,

        loadAverage: os.loadavg()[0],

        memoryUsage: Math.round(
            (memory.heapUsed / memory.heapTotal) * 100
        ),

        heapUsed: Math.round(
            memory.heapUsed / 1024 / 1024
        ),

        heapTotal: Math.round(
            memory.heapTotal / 1024 / 1024
        ),

        threadCount: 1,

        timestamp: Date.now(),

        startedAt

    });

});


export default app ; 