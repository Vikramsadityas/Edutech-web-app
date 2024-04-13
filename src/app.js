import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.json({ limit: "16kb" }))
// app.use(bodyParser.urlencoded({extended: true, limit: "16kb"}))
// app.use(bodyParser.json({limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js'
import facultyRouter from "./routes/faculty.routes.js"
import reviewRouter from "./routes/review.routes.js"
import videoRouter from "./routes/video.routes.js"


//routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/faculty",facultyRouter)
app.use("/api/v1/review",reviewRouter)
app.use("/api/v1/video",videoRouter)

// http://localhost:8000/api/v1/users/register

export { app }