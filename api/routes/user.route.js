import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  signOut,
  updateUser,
} from "../controller/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// router.get("/test", (req, res) => {
//     res.json("Hello")
// });

// ====================================== update user profile =============================
router.put("/update/:userId", verifyToken, updateUser);

// ====================================== Delete User ======================================
router.delete("/delete/:userId", verifyToken, deleteUser);

// ==================================== Sign out ===========================================
router.post("/signOut", signOut);
// ==================================== Get users ==========================================
router.get("/getUsers", verifyToken, getUsers);
// ==================================== get User for comment section =======================
router.get('/:userId',getUser)
export default router;
