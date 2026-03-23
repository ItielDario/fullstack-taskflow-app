import express from "express"
import taskRoutes from "./routes/taskRouter.js"

const app = express()
app.use(express.json())
app.use(taskRoutes)

app.get("/", (req, res) => {
    res.send("Taí meu patrão")
})

export default app