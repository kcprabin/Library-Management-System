import express from 'express'
import cors from "cors"
import cookieparser from 'cookie-parser'

const app = express();

app.use(cors({
    origin:process.env.CORS
}))

app.use(cookieparser())
app.use(express.json({
    limit: "10kb"
}))
app.use(express.urlencoded({
    limit:"10kb"
}))

export default app;