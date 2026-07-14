import express, { json } from "express";
import axios from "axios";
import rateLimiter from "./middleware/ratelimiter.middleware.js";
import client from "../utils/radis.connection.js";
import SlidingWindow from "./services/rateLimiter/slidingWindow.js";
import LoadBalancer from "./services/loadBalancer/index.js";




client.on('error' , err=> console.log(err)) ; 

await client.connect()
.then(()=>console.log("RADIS CONNECTION TO RADIS CLIENT SUCCESSFUL")) 
.catch(e=>console.log(e)) ; 


const loadBalancer = new LoadBalancer() ; 
loadBalancer.healthChecker.start() ; 
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "api gateway running",
  });
});

app.use(rateLimiter, async (req, res) => {

    const serviceName = "/" + req.path.split("/")[1];
    const routes = JSON.parse(await client.get('server-config')) ; 
    const service = routes[serviceName];
    if (!service) {
        return res.status(404).json({
            message: "Service Not Found",
        });
    }
    const context = {
        clientIp:
            req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
            req.socket.remoteAddress,

        clientKey:
            req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
            req.socket.remoteAddress,

        req,
        headers: req.headers,
        method: req.method,
        path: req.originalUrl
    };
    const target = await loadBalancer.getServer(
        serviceName,
        routes , 
        context
    );
    

    const url = target.url + req.originalUrl;

    // Request assigned -> increment active connections
    await client.incr(`lb:connections:${target.id}`);

    const start = Date.now();

    try {

        const response = await axios({
            method: req.method,
            url,
            headers: req.headers,
            data: req.body,
        });

        const responseTime = Date.now() - start;

        await client.set(
            `lb:response:${target.id}`,
            responseTime
        );

        return res.status(response.status).json(response.data);

    } catch (e) {

        console.log(e);

        const responseTime = Date.now() - start;

        await client.set(
            `lb:response:${target.id}`,
            responseTime
        );

        return res.status(500).json({
            message: "service unavailable",
        });

    } finally {

        // Request finished -> decrement active connections
        await client.decr(`lb:connections:${target.id}`);
    }
});


export default app;
