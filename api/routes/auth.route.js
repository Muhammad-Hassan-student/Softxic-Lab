import express from "express";
import {
  google,
  signInController,
  signUpController,
  updateUserRole,
} from "../controller/auth.controller.js";
import { isAdmin, verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// ============================ sign up routes ===================================
router.post("/signUp", signUpController);

// ============================= sign in routes =================================
router.post("/signIn", signInController);

// ============================ Google Sign up / Sign in ========================
router.post("/google", google);

// ============================= Update User Role =================================

router.put("/role/:userId", verifyToken, isAdmin, updateUserRole);

export default router;
