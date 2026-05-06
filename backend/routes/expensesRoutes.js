import { Router } from "express";
import { createExpense, getExpense } from "../controllers/expensesController.js";

const router = Router();

router.post("/", createExpense);
router.get("/", getExpense);

export default router;