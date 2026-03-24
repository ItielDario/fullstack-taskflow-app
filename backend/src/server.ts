import "dotenv/config"
import app from "./app.js"

const PORT: number = Number(process.env.PORT_BACKEND) || 5000

app.listen(PORT, "0.0.0.0", () => {
    console.log(`API rodando em http://localhost:${PORT}`)
})