import { Router } from "express";
import { createCategory, deleteCategory, getCategories } from "../controllers/categoryController.js";

const router = Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.delete("/delete-category/:id", deleteCategory);

export default router;