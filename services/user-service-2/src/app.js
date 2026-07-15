import express from 'express' ; 
import os from "os";
import process from "process";

const app = express() ; 
const startedAt = Date.now();


app.disable("etag");
app.get('/users' , (req , res)=>{
    res.status(200).json({
        success : true , 
        users : [
            {
                id : 1 , 
                name : "Roshan" 
            } ,
            {
                id : 2 , 
                name : "Ram"
            }
        ]
    })
})
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