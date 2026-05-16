import Post from "../model/post.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// ==================== CREATE POST ====================
export const create = async (req, res, next) => {
  try {
    if (
      !req.user ||
      (req.user.role !== "author" && req.user.role !== "admin")
    ) {
      return next(
        errorHandler(403, "Only authors and admins can create posts"),
      );
    }

    if (!req.body.title || !req.body.content) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "-");

    // Admin can directly publish, author posts go to pending
    let initialStatus = "draft";
    if (req.user.role === "admin" && req.body.status === "published") {
      initialStatus = "published";
    } else if (req.user.role === "author" && req.body.status === "published") {
      initialStatus = "pending";
    } else {
      initialStatus = req.body.status || "draft";
    }

    const newPost = new Post({
      ...req.body,
      slug,
      userId: req.user.id,
      status: initialStatus,
    });

    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    next(error);
  }
};

// ==================== GET POSTS ====================
export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const query = {};

    let isAdminUser = false;
    let isAuthorUser = false;

    try {
      const token = req.cookies.access_token;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        isAdminUser = decoded.role === "admin";
        isAuthorUser = decoded.role === "author";
      }
    } catch (err) {}

    // Build query based on request type
    if (req.query.slug) {
      query.slug = req.query.slug;
      if (!isAdminUser && !isAuthorUser) query.status = "published";
    } else if (req.query.userId) {
      query.userId = req.query.userId;
    } else {
      query.status = "published";
    }

    if (req.query.category) query.category = req.query.category;
    if (req.query.postId) query._id = req.query.postId;
    if (req.query.searchTerm) {
      query.$or = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }

    const posts = await Post.find(query)
      .populate("userId", "username email role profilePicture")
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    res
      .status(200)
      .json({ posts, totalPosts: posts.length, lastMonthPosts: 0 });
  } catch (error) {
    next(error);
  }
};

// ==================== DELETE POST ====================
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return next(errorHandler(404, "Post not found"));

    const isOwner = post.userId.toString() === req.user.id;
    const isAdminUser = req.user.role === "admin";

    if (!isAdminUser && !isOwner) {
      return next(errorHandler(403, "You are not allowed to delete this post"));
    }

    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    next(error);
  }
};

// ==================== UPDATE POST ====================
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return next(errorHandler(404, "Post not found"));

    const isOwner = post.userId.toString() === req.user.id;
    const isAdminUser = req.user.role === "admin";

    if (!isAdminUser && !isOwner) {
      return next(errorHandler(403, "You are not allowed to update this post"));
    }

    let newStatus = post.status;
    if (isAdminUser) {
      newStatus = req.body.status || post.status;
    } else if (isOwner && post.status === "published") {
      newStatus = "pending";
    } else {
      newStatus = req.body.status || post.status;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
          status: newStatus,
        },
      },
      { new: true },
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

// ==================== GET USER DRAFTS ====================
export const getUserDrafts = async (req, res, next) => {
  if (!req.user || (req.user.role !== "author" && req.user.role !== "admin")) {
    return next(errorHandler(403, "Unauthorized"));
  }

  try {
    const drafts = await Post.find({
      userId: req.user.id,
      status: "draft",
    }).sort({ updatedAt: -1 });
    res.status(200).json(drafts);
  } catch (error) {
    next(error);
  }
};

// ==================== GET USER PUBLISHED POSTS ====================
export const getUserPublishedPosts = async (req, res, next) => {
  if (!req.user || (req.user.role !== "author" && req.user.role !== "admin")) {
    return next(errorHandler(403, "Unauthorized"));
  }

  try {
    const published = await Post.find({
      userId: req.user.id,
      status: "published",
    }).sort({ updatedAt: -1 });
    res.status(200).json(published);
  } catch (error) {
    next(error);
  }
};

// ==================== UPDATE POST STATUS ====================
export const updatePostStatus = async (req, res, next) => {
  const { postId } = req.params;
  const { status } = req.body;

  const validStatuses = ["draft", "published", "pending", "rejected"];
  if (!status || !validStatuses.includes(status)) {
    return next(errorHandler(400, "Invalid status"));
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return next(errorHandler(404, "Post not found"));

    const isOwner = post.userId.toString() === req.user.id;
    const isAdminUser = req.user.role === "admin";

    if (!isAdminUser && !isOwner) {
      return next(errorHandler(403, "Not allowed to update status"));
    }

    const updateData = { status };
    if (status === "published") {
      updateData.publishedAt = new Date();
      if (isAdminUser) {
        updateData.approvedAt = new Date();
        updateData.approvedBy = req.user.id;
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
      new: true,
    });
    res
      .status(200)
      .json({ success: true, message: `Post ${status}`, post: updatedPost });
  } catch (error) {
    next(error);
  }
};

// ==================== GET ALL POSTS (ADMIN) ====================
export const getAllPostsAdmin = async (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(errorHandler(403, "Only admins can view all posts"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 100;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const { status, userId, category } = req.query;

    const query = {};
    if (status && status !== "all") query.status = status;
    if (userId) query.userId = userId;
    if (category) query.category = category;

    const posts = await Post.find(query)
      .populate("userId", "username email role profilePicture")
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();
    const draftCount = await Post.countDocuments({ status: "draft" });
    const publishedCount = await Post.countDocuments({ status: "published" });
    const pendingCount = await Post.countDocuments({ status: "pending" });
    const rejectedCount = await Post.countDocuments({ status: "rejected" });

    res.status(200).json({
      success: true,
      posts,
      totalPosts,
      draftCount,
      publishedCount,
      pendingCount,
      rejectedCount,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== SUBMIT FOR APPROVAL ====================
export const submitForApproval = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return next(errorHandler(404, "Post not found"));

    const isOwner = post.userId.toString() === req.user.id;
    if (!isOwner && req.user.role !== "admin") {
      return next(errorHandler(403, "Not allowed"));
    }

    if (post.status !== "draft") {
      return next(errorHandler(400, "Only draft posts can be submitted"));
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { status: "pending", submittedForApprovalAt: new Date() },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Submitted for approval",
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== APPROVE POST ====================
export const approvePost = async (req, res, next) => {
  const { postId } = req.params;

  if (req.user?.role !== "admin") {
    return next(errorHandler(403, "Only admins can approve posts"));
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return next(errorHandler(404, "Post not found"));

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        status: "published",
        approvedAt: new Date(),
        approvedBy: req.user.id,
        publishedAt: new Date(),
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Post approved and published",
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== REJECT POST ====================
export const rejectPost = async (req, res, next) => {
  const { postId } = req.params;
  const { rejectionReason } = req.body;

  if (req.user?.role !== "admin") {
    return next(errorHandler(403, "Only admins can reject posts"));
  }

  if (!rejectionReason) {
    return next(errorHandler(400, "Rejection reason required"));
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return next(errorHandler(404, "Post not found"));

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { status: "rejected", rejectionReason },
      { new: true },
    );

    res
      .status(200)
      .json({ success: true, message: "Post rejected", post: updatedPost });
  } catch (error) {
    next(error);
  }
};

// ==================== GET MY POSTS WITH STATUS ====================
export const getMyPostsWithStatus = async (req, res, next) => {
  if (!req.user || (req.user.role !== "author" && req.user.role !== "admin")) {
    return next(errorHandler(403, "Unauthorized"));
  }

  try {
    const posts = await Post.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    const stats = {
      draft: posts.filter((p) => p.status === "draft").length,
      pending: posts.filter((p) => p.status === "pending").length,
      published: posts.filter((p) => p.status === "published").length,
      rejected: posts.filter((p) => p.status === "rejected").length,
    };
    res.status(200).json({ success: true, posts, stats });
  } catch (error) {
    next(error);
  }
};

// ==================== REQUEST EDIT POST ====================
export const requestEditPost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return next(errorHandler(404, "Post not found"));

    const isOwner = post.userId.toString() === req.user.id;
    const isAdminUser = req.user.role === "admin";

    if (!isOwner && !isAdminUser) {
      return next(errorHandler(403, "Not allowed to edit this post"));
    }

    if (isAdminUser) {
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            image: req.body.image,
          },
        },
        { new: true },
      );
      return res.status(200).json(updatedPost);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        status: "pending_edit",
        editRequestData: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
        editRequestedAt: new Date(),
        autoApproveAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Edit request submitted. Will auto-approve in 24 hours.",
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== REQUEST DELETE POST ====================
export const requestDeletePost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return next(errorHandler(404, "Post not found"));

    const isOwner = post.userId.toString() === req.user.id;
    const isAdminUser = req.user.role === "admin";

    if (!isOwner && !isAdminUser) {
      return next(errorHandler(403, "Not allowed to delete this post"));
    }

    if (isAdminUser) {
      await Post.findByIdAndDelete(postId);
      return res
        .status(200)
        .json({ success: true, message: "Post deleted successfully" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        status: "pending_delete",
        deleteRequestedAt: new Date(),
        autoApproveAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Delete request submitted. Will auto-delete in 24 hours.",
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== APPROVE EDIT REQUEST ====================
export const approveEditRequest = async (req, res, next) => {
  const { postId } = req.params;

  if (req.user?.role !== "admin") {
    return next(errorHandler(403, "Only admins can approve edit requests"));
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return next(errorHandler(404, "Post not found"));
    if (post.status !== "pending_edit") {
      return next(errorHandler(400, "No pending edit request found"));
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $set: {
          title: post.editRequestData?.title,
          content: post.editRequestData?.content,
          category: post.editRequestData?.category,
          image: post.editRequestData?.image,
          status: "published",
          editRequestData: null,
          editRequestedAt: null,
          autoApproveAt: null,
        },
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Edit request approved",
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== APPROVE DELETE REQUEST ====================
export const approveDeleteRequest = async (req, res, next) => {
  const { postId } = req.params;

  if (req.user?.role !== "admin") {
    return next(errorHandler(403, "Only admins can approve delete requests"));
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return next(errorHandler(404, "Post not found"));
    if (post.status !== "pending_delete") {
      return next(errorHandler(400, "No pending delete request found"));
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ success: true, message: "Delete request approved" });
  } catch (error) {
    next(error);
  }
};

// ==================== REJECT REQUEST ====================
export const rejectRequest = async (req, res, next) => {
  const { postId } = req.params;
  const { rejectionReason } = req.body;

  if (req.user?.role !== "admin") {
    return next(errorHandler(403, "Only admins can reject requests"));
  }

  if (!rejectionReason) {
    return next(errorHandler(400, "Rejection reason required"));
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return next(errorHandler(404, "Post not found"));

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        status: "published",
        rejectionReason,
        editRequestData: null,
        editRequestedAt: null,
        deleteRequestedAt: null,
        autoApproveAt: null,
      },
      { new: true },
    );

    res
      .status(200)
      .json({ success: true, message: "Request rejected", post: updatedPost });
  } catch (error) {
    next(error);
  }
};

// ==================== AUTO APPROVE EXPIRED REQUESTS ====================
export const autoApproveExpiredRequests = async () => {
  const now = new Date();

  const pendingEdits = await Post.find({
    status: "pending_edit",
    autoApproveAt: { $lte: now },
  });

  for (const post of pendingEdits) {
    if (post.editRequestData) {
      post.title = post.editRequestData.title;
      post.content = post.editRequestData.content;
      post.category = post.editRequestData.category;
      post.image = post.editRequestData.image;
    }
    post.status = "published";
    post.editRequestData = null;
    post.editRequestedAt = null;
    post.autoApproveAt = null;
    await post.save();
    console.log(`✅ Auto-approved edit for post: ${post._id}`);
  }

  const pendingDeletes = await Post.find({
    status: "pending_delete",
    autoApproveAt: { $lte: now },
  });

  for (const post of pendingDeletes) {
    await Post.findByIdAndDelete(post._id);
    console.log(`✅ Auto-deleted post: ${post._id}`);
  }
};

// ==================== POST LIKES SYSTEM ====================
export const likePost = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    const userIndex = post.likes.indexOf(userId);

    if (userIndex === -1) {
      post.likes.push(userId);
      post.numberOfLikes += 1;
    } else {
      post.likes.splice(userIndex, 1);
      post.numberOfLikes -= 1;
    }

    await post.save();

    res.status(200).json({
      success: true,
      liked: userIndex === -1,
      numberOfLikes: post.numberOfLikes,
    });
  } catch (error) {
    next(error);
  }
};

// 🔥 PUBLIC - Check if user liked a post (no token required)
export const checkUserLike = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user?.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    if (!userId) {
      return res.status(200).json({
        liked: false,
        numberOfLikes: post.numberOfLikes,
      });
    }

    const liked = post.likes.includes(userId);
    res.status(200).json({
      liked,
      numberOfLikes: post.numberOfLikes,
    });
  } catch (error) {
    next(error);
  }
};

// Get posts liked by user (protected)
export const getUserLikedPosts = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const posts = await Post.find({ likes: userId, status: "published" })
      .populate("userId", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
      total: posts.length,
    });
  } catch (error) {
    next(error);
  }
};
// ==================== POST SHARE ====================

export const sharePost = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    const userIndex = post.shares.indexOf(userId);

    if (userIndex === -1) {
      post.shares.push(userId);
      post.numberOfShares += 1;
    }

    await post.save();

    res.status(200).json({
      success: true,
      numberOfShares: post.numberOfShares,
    });
  } catch (error) {
    next(error);
  }
};

// Get share count - PUBLIC
export const getShareCount = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    res.status(200).json({
      numberOfShares: post.numberOfShares,
    });
  } catch (error) {
    next(error);
  }
};
// ==================== POST SAVE/BOOKMARK ====================

// 🔥 Save or Unsave a post
export const savePost = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    const userIndex = post.savedBy.indexOf(userId);

    if (userIndex === -1) {
      // Save post
      post.savedBy.push(userId);
      post.numberOfSaves += 1;
    } else {
      // Unsave post
      post.savedBy.splice(userIndex, 1);
      post.numberOfSaves -= 1;
    }

    await post.save();

    res.status(200).json({
      success: true,
      saved: userIndex === -1,
      numberOfSaves: post.numberOfSaves,
    });
  } catch (error) {
    next(error);
  }
};

// 🔥 PUBLIC - Check if user saved a post (no token required)
export const checkUserSave = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user?.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    if (!userId) {
      return res.status(200).json({
        saved: false,
        numberOfSaves: post.numberOfSaves,
      });
    }

    const saved = post.savedBy.includes(userId);
    res.status(200).json({
      saved,
      numberOfSaves: post.numberOfSaves,
    });
  } catch (error) {
    next(error);
  }
};
// Get user's saved posts (protected)
export const getUserSavedPosts = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const posts = await Post.find({ savedBy: userId, status: "published" })
      .populate("userId", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
      total: posts.length,
    });
  } catch (error) {
    next(error);
  }
};
