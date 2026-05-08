import { Router } from "express";
import { createExpense, getExpense, getTotalExpenses } from "../controllers/expensesController.js";

const router = Router();

router.post("/", createExpense);
router.get("/", getExpense);
router.get("/total", getTotalExpenses)
export default router;