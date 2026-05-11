import { Router } from "express";
import { createExpense, deleteExpense, getExpense, getExpensesByCategory, getTotalExpenses } from "../controllers/expensesController.js";

const router = Router();

router.post("/", createExpense);
router.delete("/delete-expense/:id", deleteExpense);
router.get("/", getExpense);
router.get("/total", getTotalExpenses)
router.get("/by-category", getExpensesByCategory);
export default router;