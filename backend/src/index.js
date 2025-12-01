import dotenv from "dotenv"
import dataBase from "./db/index.js"
import app from "./app.js"


dotenv.config({
    path:"./.env"
})

dataBase().then(
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`app is connected on part ${process.env.PORT}`)
    })

).catch(
    (err)=>console.log("database connection failed in index js",err)
)



