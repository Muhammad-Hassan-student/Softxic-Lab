import {
  create,
  deletePost,
  getPosts,
  updatePost,
  getUserDrafts,
  getUserPublishedPosts,
  updatePostStatus,
  getAllPostsAdmin,
  submitForApproval,
  approvePost,
  rejectPost,
  getMyPostsWithStatus,
  requestEditPost,
  requestDeletePost,
  approveEditRequest,
  approveDeleteRequest,
  rejectRequest,
  likePost, //
  checkUserLike,
  getUserLikedPosts,
  sharePost,
  getShareCount,
  savePost,
  checkUserSave,
  getUserSavedPosts,
} from "../controller/post.controller.js";
import { verifyToken, isAdmin } from "../utils/verifyUser.js";
import express from "express";

const router = express.Router();

// ==================== PUBLIC ROUTES ====================
router.get("/getPosts", getPosts);
router.get("/check-like/:postId", checkUserLike);
router.get("/check-save/:postId", checkUserSave);

// ==================== PROTECTED ROUTES ====================
router.post("/create", verifyToken, create);
router.delete("/deletePost/:postId", verifyToken, deletePost);
router.put("/updatePost/:postId", verifyToken, updatePost);
router.get("/getUserDrafts", verifyToken, getUserDrafts);
router.get("/getUserPublishedPosts", verifyToken, getUserPublishedPosts);
router.put("/updatePostStatus/:postId", verifyToken, updatePostStatus);

// ==================== POST LIKES SYSTEM ====================
router.put("/like/:postId", verifyToken, likePost);
router.get("/user-liked-posts/:userId", verifyToken, getUserLikedPosts);

// ==================== APPROVAL SYSTEM ====================
router.put("/submit-for-approval/:postId", verifyToken, submitForApproval);
router.put("/approve-post/:postId", verifyToken, isAdmin, approvePost);
router.put("/reject-post/:postId", verifyToken, isAdmin, rejectPost);
router.get("/my-posts-status", verifyToken, getMyPostsWithStatus);
// ==================== POST SHARE SYSTEM ====================
router.put("/share/:postId", verifyToken, sharePost);
router.get("/share-count/:postId", getShareCount);

// ==================== POST SAVE/BOOKMARK SYSTEM ====================
router.put("/save/:postId", verifyToken, savePost);
router.get("/user-saved-posts/:userId", verifyToken, getUserSavedPosts);
// ==================== REQUEST SYSTEM (Edit/Delete) ====================
router.put("/request-edit/:postId", verifyToken, requestEditPost);
router.put("/request-delete/:postId", verifyToken, requestDeletePost);
router.put("/approve-edit/:postId", verifyToken, isAdmin, approveEditRequest);
router.put(
  "/approve-delete/:postId",
  verifyToken,
  isAdmin,
  approveDeleteRequest,
);
router.put("/reject-request/:postId", verifyToken, isAdmin, rejectRequest);

// ==================== ADMIN ROUTES ====================
router.get("/admin/all-posts", verifyToken, isAdmin, getAllPostsAdmin);

export default router;
