import express from "express";
import { verifyToken, isAdmin } from "../utils/verifyUser.js";
import {
  sendContactMessage,
  getAllContactMessages,
  getContactMessage,
  markAsReplied,
  deleteContactMessage,
  getContactStats,
} from "../controller/contact.controller.js";

const router = express.Router();

// Public route - Anyone can send message
router.post("/send", sendContactMessage);

// Protected routes - Admin only
router.get("/admin/messages", verifyToken, isAdmin, getAllContactMessages);
router.get(
  "/admin/messages/:messageId",
  verifyToken,
  isAdmin,
  getContactMessage,
);
router.get("/admin/stats", verifyToken, isAdmin, getContactStats);
router.put(
  "/admin/messages/:messageId/reply",
  verifyToken,
  isAdmin,
  markAsReplied,
);
router.delete(
  "/admin/messages/:messageId",
  verifyToken,
  isAdmin,
  deleteContactMessage,
);

export default router;
