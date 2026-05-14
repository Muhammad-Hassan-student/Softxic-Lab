import Comment from "../model/comment.model.js";
import Post from "../model/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId } = req.body;
    const userId = req.user.id;

    if (!content || !postId) {
      return next(errorHandler(400, "Content and PostId are required"));
    }

    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });

    await newComment.save();

    // 🔥 Populate both userId and postId
    await newComment.populate("userId", "username profilePicture");
    await newComment.populate("postId", "title slug");

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .populate("userId", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    const isOwner = comment.userId.toString() === req.user.id;
    const isAdminUser = req.user.role === "admin";

    if (!isOwner && !isAdminUser) {
      return next(
        errorHandler(403, "You are not allowed to edit this comment"),
      );
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content: req.body.content },
      { new: true },
    ).populate("userId", "username profilePicture");

    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    const isOwner = comment.userId.toString() === req.user.id;
    const isAdminUser = req.user.role === "admin";

    if (!isOwner && !isAdminUser) {
      return next(
        errorHandler(403, "You are not allowed to delete this comment"),
      );
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comment has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getAllUserComments = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(errorHandler(403, "You are not allowed to get all comments"));
    }

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const comments = await Comment.find()
      .populate("userId", "username profilePicture")
      .populate("postId", "title slug")
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );

    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};
