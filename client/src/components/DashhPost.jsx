import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Button, Badge } from "flowbite-react";
import { 
  HiOutlineExclamationCircle, 
  HiPencil, 
  HiEye, 
  HiExternalLink, 
  HiClock, 
  HiCheckCircle, 
  HiXCircle,
  HiRefresh,
  HiCalendar,
  HiFolder,
  HiDocumentText
} from 'react-icons/hi';
import { Link } from "react-router-dom";

export default function DashhPost() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [submittingId, setSubmittingId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [timers, setTimers] = useState({});

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      userPosts.forEach(post => {
        if ((post.status === "pending_edit" || post.status === "pending_delete") && post.autoApproveAt) {
          const remaining = Math.max(0, Math.ceil((new Date(post.autoApproveAt) - new Date()) / (1000 * 60 * 60)));
          newTimers[post._id] = remaining;
        }
      });
      setTimers(newTimers);
    }, 60000);
    return () => clearInterval(interval);
  }, [userPosts]);

  const fetchPosts = async () => {
    if (!currentUser?._id) return;
    setLoading(true);
    try {
      let url = "";
      if (activeTab === "draft") {
        url = `/api/v1/post/getUserDrafts`;
      } else if (activeTab === "pending" || activeTab === "pending_edit" || activeTab === "pending_delete") {
        url = `/api/v1/post/my-posts-status`;
      } else if (activeTab === "published") {
        url = `/api/v1/post/getUserPublishedPosts`;
      } else {
        url = `/api/v1/post/getPosts?userId=${currentUser._id}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        let postsArray = data.posts || data;
        
        if (activeTab === "pending_edit") {
          postsArray = postsArray.filter(p => p.status === "pending_edit");
        } else if (activeTab === "pending_delete") {
          postsArray = postsArray.filter(p => p.status === "pending_delete");
        } else if (activeTab === "pending") {
          postsArray = postsArray.filter(p => p.status === "pending");
        }
        
        setUserPosts(postsArray);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "author" || currentUser?.role === "admin") {
      fetchPosts();
    }
  }, [currentUser?._id, currentUser?.role, activeTab]);

  const handleSubmitForApproval = async (postId) => {
    setSubmittingId(postId);
    try {
      const res = await fetch(`/api/v1/post/submit-for-approval/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => prev.map((post) => post._id === postId ? { ...post, status: "pending" } : post));
        showToast("Post submitted for admin approval", "success");
      } else {
        showToast(data.message || "Failed to submit", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    } finally {
      setSubmittingId(null);
    }
  };

  const handleDeleteRequest = async (postId) => {
    if (!window.confirm("Request to delete this post? Admin will review.")) return;
    try {
      const res = await fetch(`/api/v1/post/request-delete/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => prev.map((post) => post._id === postId ? { ...post, status: "pending_delete", autoApproveAt: data.post?.autoApproveAt } : post));
        showToast("Delete request submitted", "success");
      } else {
        showToast(data.message || "Failed to submit delete request", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/v1/post/deletePost/${postIdToDelete}`, { method: "DELETE" });
      if (res.ok) {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
        showToast("Post deleted successfully", "success");
      } else {
        showToast("Failed to delete post", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    }
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setShowViewModal(true);
  };

  const getTimeRemaining = (autoApproveAt) => {
    if (!autoApproveAt) return null;
    const hours = Math.max(0, Math.ceil((new Date(autoApproveAt) - new Date()) / (1000 * 60 * 60)));
    if (hours === 0) return "Expiring soon";
    if (hours < 24) return `${hours}h left`;
    const days = Math.floor(hours / 24);
    return `${days}d left`;
  };

  const getStatusConfig = (status, autoApproveAt) => {
    const configs = {
      draft: { color: "gray", icon: HiPencil, label: "Draft", bgClass: "bg-gray-100 dark:bg-gray-700" },
      pending: { color: "warning", icon: HiClock, label: "Pending", bgClass: "bg-amber-100 dark:bg-amber-900/30" },
      published: { color: "success", icon: HiCheckCircle, label: "Published", bgClass: "bg-green-100 dark:bg-green-900/30" },
      rejected: { color: "failure", icon: HiXCircle, label: "Rejected", bgClass: "bg-red-100 dark:bg-red-900/30" },
      pending_edit: { color: "warning", icon: HiRefresh, label: "Edit Requested", bgClass: "bg-amber-100 dark:bg-amber-900/30" },
      pending_delete: { color: "failure", icon: HiXCircle, label: "Delete Requested", bgClass: "bg-red-100 dark:bg-red-900/30" }
    };
    return configs[status] || configs.draft;
  };

  const tabs = [
    { key: "all", label: "All Posts", icon: HiDocumentText },
    { key: "published", label: "Published", icon: HiCheckCircle },
    { key: "pending", label: "Pending", icon: HiClock },
    { key: "pending_edit", label: "Edit Requests", icon: HiRefresh },
    { key: "pending_delete", label: "Delete Requests", icon: HiXCircle },
    { key: "draft", label: "Drafts", icon: HiPencil },
    { key: "rejected", label: "Rejected", icon: HiXCircle },
  ];

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
            <HiEye className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Please Login</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to view and manage your posts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className={`rounded-xl shadow-2xl p-4 min-w-[280px] backdrop-blur-sm ${
            toast.type === "success" 
              ? "bg-green-50 dark:bg-green-900/90 border border-green-200" 
              : "bg-red-50 dark:bg-red-900/90 border border-red-200"
          }`}>
            <div className="flex items-center gap-3">
              {toast.type === "success" ? (
                <HiCheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <HiXCircle className="w-5 h-5 text-red-600" />
              )}
              <p className={`text-sm font-medium ${toast.type === "success" ? "text-green-800" : "text-red-800"}`}>
                {toast.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          My Posts
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track your blog posts</p>
      </div>

      {/* Responsive Tabs - Grid layout for mobile, flex for desktop */}
      <div className="mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap gap-2">
          {tabs.map((tab) => {
            const count = userPosts.filter(p => tab.key === "all" ? true : p.status === tab.key).length;
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.key;
            
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.substring(0, 3)}</span>
                {count > 0 && (
                  <Badge className={`ml-1 ${isActive ? "bg-white/20 text-white" : "bg-gray-200 dark:bg-gray-700"}`}>
                    {count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-indigo-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      ) : userPosts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
            <HiPencil className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No posts found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">No posts in {activeTab.replace("_", " ")} section</p>
          <Link to="/create-post">
            <Button gradientDuoTone="purpleToPink" className="mt-6 rounded-xl">
              Create New Post
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userPosts.map((post) => {
            const statusConfig = getStatusConfig(post.status);
            const StatusIcon = statusConfig.icon;
            const timeRemaining = getTimeRemaining(post.autoApproveAt);
            
            return (
              <div 
                key={post._id} 
                className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 ${
                  post.status === "pending_edit" ? "border-l-amber-500" :
                  post.status === "pending_delete" ? "border-l-red-500" :
                  "border-l-indigo-500"
                }`}
              >
                <div className="p-5">
                  {/* Title and Status Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <Link to={`/post/${post.slug}`} className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig.bgClass}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{statusConfig.label}</span>
                      </div>
                      {timeRemaining && (
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                          {timeRemaining}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <HiCalendar className="w-3.5 h-3.5" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HiFolder className="w-3.5 h-3.5" />
                      <span>{post.category}</span>
                    </div>
                    {post.editRequestedAt && (
                      <span className="text-amber-600">Edit requested: {new Date(post.editRequestedAt).toLocaleDateString()}</span>
                    )}
                    {post.deleteRequestedAt && (
                      <span className="text-red-600">Delete requested: {new Date(post.deleteRequestedAt).toLocaleDateString()}</span>
                    )}
                  </div>

                  {/* Rejection Reason */}
                  {post.status === "rejected" && post.rejectionReason && (
                    <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg mb-3">
                      Reason: {post.rejectionReason}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <Button size="xs" gradientDuoTone="purpleToPink" onClick={() => handleViewPost(post)} className="rounded-lg">
                      <HiEye className="w-3.5 h-3.5 mr-1.5" /> View
                    </Button>

                    {post.status === "draft" && (
                      <>
                        <Button size="xs" gradientDuoTone="greenToBlue" onClick={() => handleSubmitForApproval(post._id)} disabled={submittingId === post._id} className="rounded-lg">
                          {submittingId === post._id ? "Submitting..." : "Submit"}
                        </Button>
                        <Link to={`/update-post/${post._id}`}>
                          <Button size="xs" gradientDuoTone="tealToLime" className="rounded-lg">
                            <HiPencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                          </Button>
                        </Link>
                      </>
                    )}

                    {post.status === "published" && (
                      <Link to={`/update-post/${post._id}`}>
                        <Button size="xs" gradientDuoTone="tealToLime" className="rounded-lg">
                          <HiPencil className="w-3.5 h-3.5 mr-1.5" /> Request Edit
                        </Button>
                      </Link>
                    )}

                    {post.status === "rejected" && (
                      <Link to={`/update-post/${post._id}`}>
                        <Button size="xs" gradientDuoTone="tealToLime" className="rounded-lg">
                          <HiPencil className="w-3.5 h-3.5 mr-1.5" /> Edit & Resubmit
                        </Button>
                      </Link>
                    )}

                    {(post.status === "pending_edit" || post.status === "pending_delete") && (
                      <Button size="xs" color="gray" disabled className="rounded-lg">
                        <HiClock className="w-3.5 h-3.5 mr-1.5" /> Waiting
                      </Button>
                    )}

                    {post.status !== "pending_delete" && post.status !== "pending_edit" && (
                      <Button size="xs" color="failure" onClick={() => handleDeleteRequest(post._id)} className="rounded-lg">
                        Request Delete
                      </Button>
                    )}

                    <Link to={`/post/${post.slug}`} target="_blank">
                      <Button size="xs" color="gray" className="rounded-lg">
                        <HiExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Post Modal */}
      <Modal show={showViewModal} onClose={() => setShowViewModal(false)} size="4xl" className="rounded-2xl">
        <Modal.Header className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <HiEye className="w-5 h-5 text-indigo-500" />
            <span>Post Preview</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          {selectedPost && (
            <div className="max-h-[70vh] overflow-y-auto px-1">
              {selectedPost.image && (
                <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-64 object-cover rounded-xl mb-5" />
              )}
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{selectedPost.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="flex items-center gap-1"><HiCalendar className="w-4 h-4" /> {new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><HiFolder className="w-4 h-4" /> {selectedPost.category}</span>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-t border-gray-200 dark:border-gray-700">
          <Button color="gray" onClick={() => setShowViewModal(false)} className="rounded-lg">Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md" className="rounded-2xl">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <HiOutlineExclamationCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">Delete this post?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <Button color="failure" onClick={handleDeletePost} className="rounded-lg">Yes, Delete</Button>
              <Button color="gray" onClick={() => setShowModal(false)} className="rounded-lg">Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}