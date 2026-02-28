import express from "express";
import {
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  changePassword,
  getAllUsers,
  updateUserRole,
} from "../controllers/user.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { uploadAvatar as uploadAvatarMiddleware } from "../middleware/upload.middleware.js";

const router = express.Router();

// Protected routes (all users)
router.use(protect);

router.put("/profile", updateProfile);
router.post("/avatar", uploadAvatarMiddleware, uploadAvatar);
router.delete("/avatar", deleteAvatar);
router.put("/change-password", changePassword);

// Admin routes
router.get("/admin/all", authorize("admin"), getAllUsers);
router.put("/admin/:id/role", authorize("admin"), updateUserRole);

export default router;
