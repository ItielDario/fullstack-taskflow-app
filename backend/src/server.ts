import "dotenv/config" 
import express from "express"

const app = express();
const PORT = Number(process.env.PORT_BACKEND) || 5000;

app.get("/", (req, res) => {
    res.send("Taí meu patrão");
})

app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`)
})