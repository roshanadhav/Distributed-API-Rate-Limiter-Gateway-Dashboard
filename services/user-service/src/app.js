import express from 'express' ; 

const app = express() ; 



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
    res.status(200).json({
        success: true,
        service: "user-service"
    });
});

export default app ; 