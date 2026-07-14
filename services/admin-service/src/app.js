import express from 'express' ; 


const app = express() ; 

app.disable("etag");
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "admin-service"
    });
}); 


export default app ; 