import express from "express"
import cors from "cors"
import authRoutes  from "./routes/auth.routes.js"
import courseRoutes from "./routes/course.routes.js"
import feedbackRoutes from "./routes/feedback.routes.js"
import reportRoutes from "./routes/report.routes.js"
import userRoutes from "./routes/user.routes.js"
import errorMiddleware from "./middleware/error.middleware.js"
import questionRoutes from "./routes/question.routes.js";

const app=express()
//gobal middlewares
app.use(express.json())
app.use(cors({
  origin: "*",
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"]
}))
app.get("/",(req,res)=>{
    res.json({
        status:"success",
        messgae:"Student Feedback Management API is running"
    })
})
app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/courses",courseRoutes)
app.use("/api/feedback",feedbackRoutes)
app.use("/api/reports",reportRoutes)
app.use("/api/questions", questionRoutes);
app.use(errorMiddleware);
export default app;

