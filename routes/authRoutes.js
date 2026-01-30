import express from "express";
import { register, login, adminLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// ✅ ADMIN LOGIN (DO NOT CHANGE PATH)
router.post("/admin/login", adminLogin);

export default router;
