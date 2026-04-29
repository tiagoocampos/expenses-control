import { Router } from "express";
import { createCategory } from "../controllers/categoryController.js";

const router = Router();

router.post("/add-category", createCategory);

export default router;