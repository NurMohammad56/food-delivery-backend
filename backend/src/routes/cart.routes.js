import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getCart).delete(clearCart);

router.post("/items", addToCart);
router.put("/items/:menuItemId", updateCartItem);
router.delete("/items/:menuItemId", removeFromCart);

export default router;
