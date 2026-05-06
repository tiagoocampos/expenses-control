import express from "express";
import cors from "cors";
import "dotenv/config";
import db from "./database/db.js";
import expenseRoute from "./routes/expensesRoutes.js"
import categoryRoute from "./routes/categoryRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());


const PORT = process.env.PORT;

app.use("/expense", expenseRoute);
app.use("/categories", categoryRoute);


app.get("/", (req, res) => {
    res.send("Servidor rodando!")
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: http://localhost:${PORT}`);
})