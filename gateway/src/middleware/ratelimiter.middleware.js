import RateLimiter from "../services/rateLimiter/index.js";
import client from "../../utils/radis.connection.js";


async function rateLimiter(req , res , next){
    let rateLimiterChecker = new RateLimiter() ; 
    const data = await client.get("gateway-config") ;
    const policies = JSON.parse(data) ; 
    let ip = req.ip ; 
    const allowed =  await rateLimiterChecker.allow(ip , policies) ; 
    if (!allowed) {
        return res.status(429).json({
            message : "wait for some time"
        })
    }

    next() ; 
}

export default rateLimiter ;