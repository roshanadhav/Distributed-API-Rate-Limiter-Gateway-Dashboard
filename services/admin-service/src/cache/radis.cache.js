import {createClient} from 'redis' ; 


const client = createClient({
    
    username : 'default' ,
    password :"ClNuqNTqLpyEG0TVqMYJDCOTL17HQwvi" ,
    socket:{
        host: "attraction-purposeful-show-33388.db.redis.io",
        port: 14287
    }

}) ; 


export default client ; 

