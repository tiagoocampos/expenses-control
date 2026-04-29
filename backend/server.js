import express from "express";
import cors from "cors";
import "dotenv/config";
import db from "./database/db.js";
import routes from "./routes/expensesRoutes.js"

const app = express();
app.use(express.json());
app.use(cors());

app.use("/",routes);
const PORT = process.env.PORT;



app.get("/", (req, res) => {
    res.send("Servidor rodando!")
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: http://localhost:${PORT}`);
})