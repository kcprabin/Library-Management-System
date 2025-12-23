import express from 'express'
import cors from "cors"
import cookieparser from 'cookie-parser'

const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))

app.use(cookieparser())
app.use(express.json({
    limit: "10kb"
}))
app.use(express.urlencoded({
    limit:"10kb",
    extended:true
}))


// router for user
import Userrouter from './routes/user.routes.js';
app.use('/api/v1/library',Userrouter)
//for books entry 
import BookRouter from './routes/admin.routes.js'
app.use('/api/v1/library',BookRouter)





export default app;