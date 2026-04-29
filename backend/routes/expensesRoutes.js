import { Router } from "express";
import { createExpense } from "../controllers/expensesController.js";

const router = Router();

router.post("/add-expense", createExpense);

export default router;