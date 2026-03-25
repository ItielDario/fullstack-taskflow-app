import express from "express"
import cors from "cors"
import taskRoutes from "./routes/taskRouter.js"

const app = express()

// 2. Configure a permissão para a sua porta 3000
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())
app.use(taskRoutes)

app.get("/", (req, res) => {
    res.send("Taí meu patrão")
})

export default app