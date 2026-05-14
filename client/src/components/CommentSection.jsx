import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Textarea,
  Button,
  Alert,
  Modal,
  Spinner,
} from "flowbite-react";
import Comment from "./Comment";
import { 
  HiOutlineExclamationCircle, 
  HiChatAlt2, 
  HiUserCircle,
  HiOutlineEmojiHappy,
  HiOutlinePhotograph
} from "react-icons/hi";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch comments when postId is available
  useEffect(() => {
    if (!postId) return;
    
    const getComments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/comment/getComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    getComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postId) {
      setCommentError("Unable to post comment. Please try again.");
      return;
    }
    if (comment.length > 500) {
      setCommentError("Comment cannot exceed 500 characters");
      return;
    }
    if (comment.trim().length === 0) {
      setCommentError("Please write something before submitting");
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId: postId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      } else {
        setCommentError(data.message || "Failed to post comment");
      }
    } catch (error) {
      setCommentError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/v1/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/v1/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Loading state while waiting for postId
  if (!postId) {
    return (
      <div className="max-w-2xl mx-auto w-full p-4 md:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <div className="flex justify-center py-8">
          <Spinner size="lg" color="purple" />
          <p className="ml-3 text-gray-500">Loading comments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full p-4 md:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
          <HiChatAlt2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Discussion</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Join the conversation • {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </p>
        </div>
      </div>

      {/* User Info */}
      {currentUser ? (
        <div className="flex items-center gap-3 mb-5 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
          <img
            src={currentUser?.profilePicture}
            className="h-10 w-10 object-cover rounded-full ring-2 ring-purple-500"
            alt="Profile"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Signed in as{" "}
              <Link
                to={"/dashboard?tab=profile"}
                className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                @{currentUser?.username}
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <HiUserCircle className="w-10 h-10 text-blue-500" />
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                You must be signed in to comment and join the discussion.
              </p>
              <Link 
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline mt-1" 
                to="/sign-in"
              >
                Sign in to continue
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Comment Form */}
      {currentUser && (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <Textarea
              placeholder="Share your thoughts... Be respectful and constructive."
              rows="4"
              maxLength="500"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              className="resize-none rounded-xl border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button type="button" className="text-gray-400 hover:text-purple-500 transition-colors">
                <HiOutlineEmojiHappy className="w-5 h-5" />
              </button>
              <button type="button" className="text-gray-400 hover:text-purple-500 transition-colors">
                <HiOutlinePhotograph className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            {comment && (
              <p className={`text-xs ${comment.length > 450 ? "text-orange-500" : "text-gray-500"}`}>
                {comment.length}/500 characters
              </p>
            )}
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={submitting || !comment.trim()}
              className="ml-auto transform hover:scale-105 transition-transform duration-300"
            >
              {submitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Posting...
                </>
              ) : (
                "Post Comment"
              )}
            </Button>
          </div>
          
          {commentError && (
            <Alert color="failure" className="mt-4 rounded-xl">
              <span className="text-sm">{commentError}</span>
            </Alert>
          )}
        </form>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" color="purple" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <HiChatAlt2 className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{comments.length}</span>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
            </p>
          </div>
          
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center">
              <HiOutlineExclamationCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Delete Comment?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              This action cannot be undone. The comment will be permanently removed.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                color="failure"
                onClick={() => handleDelete(commentToDelete)}
                className="transform hover:scale-105 transition-transform"
              >
                Yes, Delete
              </Button>
              <Button
                color="gray"
                onClick={() => setShowModal(false)}
                className="transform hover:scale-105 transition-transform"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}