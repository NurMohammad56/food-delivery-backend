import express from "express";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/admin.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { uploadSingle } from "../middleware/upload.middleware.js";

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize("admin"));

// Menu item routes
router.post("/menu", uploadSingle, createMenuItem);
router.put("/menu/:id", uploadSingle, updateMenuItem);
router.delete("/menu/:id", deleteMenuItem);
router.patch("/menu/:id/availability", toggleAvailability);

// Category routes
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

export default router;
