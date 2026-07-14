import app from "./app.js";
import dotenv from 'dotenv' ; 

dotenv.config() ; 


const PORT = process.env.PORT || 5002 ; 

app.listen(PORT , ()=>{
    console.log(`Server is Listning On Port ${PORT}`) ; 
}) ; 