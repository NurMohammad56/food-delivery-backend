import express from "express";

// Import all route files
import authRoutes from "../routes/auth.routes.js";
import userRoutes from "../routes/user.routes.js";
import cartRoutes from "../routes/cart.routes.js";
import orderRoutes from "../routes/order.routes.js";
import menuRoutes from "../routes/menu.routes.js";
import adminRoutes from "../routes/admin.routes.js";

const router = express.Router();

// Health check route
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// Mount all routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/menu", menuRoutes);
router.use("/admin", adminRoutes);

// 404 handler for undefined routes
router.all("/", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

export default router;
