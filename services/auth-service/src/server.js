import app from "./app.js";
import dotenv from 'dotenv' ; 

dotenv.config() ; 
const PORT = process.env.PORT || 5001 ;


app.listen(PORT , ()=>{
    console.log(`Auth Service is Listning On PORT ${PORT}`) ; 
}) ;