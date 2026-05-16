import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Table, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const [loading, setLoading] = useState(true);

  // Helper function to get post display text
  const getPostDisplay = (post) => {
    if (!post) return "Unknown";
    // If post is populated object
    if (typeof post === 'object' && post !== null) {
      return post.title || post.slug || "View Post";
    }
    // If post is just a string ID
    if (typeof post === 'string') {
      return post.slice(-8);
    }
    return "View Post";
  };

  // Helper function to get post link
  const getPostLink = (post) => {
    if (!post) return "#";
    // If post is populated object with slug
    if (typeof post === 'object' && post !== null && post.slug) {
      return `/post/${post.slug}`;
    }
    // If post is populated object with _id
    if (typeof post === 'object' && post !== null && post._id) {
      return `/post-id/${post._id}`;
    }
    // If post is just a string ID
    if (typeof post === 'string') {
      return `/post-id/${post}`;
    }
    return "#";
  };

  // Helper function to get user display
  const getUserDisplay = (user) => {
    if (!user) return "Unknown";
    // If user is populated object
    if (typeof user === 'object' && user !== null) {
      return user.username || user.slice(-8);
    }
    // If user is just a string ID
    if (typeof user === 'string') {
      return user.slice(-8);
    }
    return "Unknown";
  };

  // Helper function to get user link
  const getUserLink = (user) => {
    if (!user) return "#";
    // If user is populated object
    if (typeof user === 'object' && user !== null && user._id) {
      return `/dashboard?tab=users&userId=${user._id}`;
    }
    // If user is just a string ID
    if (typeof user === 'string') {
      return `/dashboard?tab=users&userId=${user}`;
    }
    return "#";
  };

  // Security check - Sirf admin
  if (currentUser?.role !== "admin") {
    return (
      <div className="flex-1 p-4 text-center text-red-500">
        Access Denied. Only admins can view all comments.
      </div>
    );
  }

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/comment/getAllUsersComments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser?.role === "admin") {
      fetchComments();
    }
  }, [currentUser?._id, currentUser?.role]);
  
  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}comment/getAllUsersComments?&startIndex=${startIndex}`,
        {
          credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      }
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      }
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  return (
    <div className="p-4 md:p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
          Comments Management
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage and moderate all user comments
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <HiOutlineExclamationCircle className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500">No comments found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table hoverable className="shadow-md min-w-[800px]">
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Comment</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
              <Table.HeadCell>Post</Table.HeadCell>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {comments.map((comment) => (
                <Table.Row key={comment._id} className="bg-white dark:border-gray-500 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="max-w-md">
                    <p className="line-clamp-2 text-sm break-words">{comment.content}</p>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="inline-flex items-center gap-1">
                      <FaThumbsUp color="blue" /> {comment.numberOfLikes || 0}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link 
                      to={getPostLink(comment.postId)} 
                      className="text-teal-500 hover:underline text-sm"
                      target="_blank"
                    >
                      {getPostDisplay(comment.postId)}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link 
                      to={getUserLink(comment.userId)} 
                      className="text-blue-500 hover:underline text-sm"
                    >
                      @{getUserDisplay(comment.userId)}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      size="xs"
                      color="failure"
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                    >
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-4 mt-4 hover:underline"
            >
              Show More
            </button>
          )}
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
            <HiOutlineExclamationCircle className="h-12 w-12 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">
              Are you sure you want to delete this comment?
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color={"failure"} onClick={handleDeleteComment}>
              Yes, delete
            </Button>
            <Button color={"gray"} onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}