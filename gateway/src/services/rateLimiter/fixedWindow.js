import client from "../../../utils/radis.connection.js";

class FixedWindow {


    async allow(ip , policies) {

        // console.log(policies) ; 

        let key = `fw:${ip}` ; 
        let state = await client.incr(key)  ; 
        if(state > policies.rateLimiter.config.limit) {
            return false ; 
        } ;  
        if(state == 1) {
            await client.expire(key , policies.rateLimiter.config.window) ; 
        }

        return true ; 
    }
}

export default FixedWindow ; 