import { Router } from "express";
import { createExpense, deleteExpense, getExpense, getExpensesByCategory, getTotalExpenses, updateExpense } from "../controllers/expensesController.js";

const router = Router();

router.post("/", createExpense);
router.delete("/delete-expense/:id", deleteExpense);
router.get("/", getExpense);
router.get("/total", getTotalExpenses)
router.get("/by-category", getExpensesByCategory);
router.put("/update-expense/:id", updateExpense);
export default router;