import express from "express";
import {
  getMenuItems,
  getMenuItem,
  getCategories,
  searchMenuItems,
} from "../controllers/menu.controller.js";

const router = express.Router();

router.get("/", getMenuItems);
router.get("/search", searchMenuItems);
router.get("/categories", getCategories);
router.get("/:id", getMenuItem);

export default router;
