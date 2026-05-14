import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { Modal, Button, Select, Badge, Textarea } from "flowbite-react";
import { 
  HiOutlineExclamationCircle, 
  HiPencil, 
  HiEye, 
  HiUser, 
  HiExternalLink, 
  HiDotsVertical,
  HiTrash,
  HiPhotograph,
  HiOutlineDocumentText,
  HiOutlineFilter,
  HiOutlineX,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiXCircle,
  HiRefresh
} from 'react-icons/hi';
import { Link } from "react-router-dom";

export default function AdminAllPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [postIdToAction, setPostIdToAction] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterUser, setFilterUser] = useState("");
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ 
    totalPosts: 0, draftCount: 0, publishedCount: 0, 
    pendingCount: 0, rejectedCount: 0, pendingEditCount: 0, pendingDeleteCount: 0 
  });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [timers, setTimers] = useState({});
  const menuRefs = useRef({});

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // Update timers for pending actions
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      posts.forEach(post => {
        if ((post.status === "pending_edit" || post.status === "pending_delete") && post.autoApproveAt) {
          const remaining = Math.max(0, Math.ceil((new Date(post.autoApproveAt) - new Date()) / (1000 * 60 * 60)));
          newTimers[post._id] = remaining;
        }
      });
      setTimers(newTimers);
    }, 60000);
    return () => clearInterval(interval);
  }, [posts]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId !== null) {
        const menuElement = menuRefs.current[openMenuId];
        if (menuElement && !menuElement.contains(event.target)) {
          setOpenMenuId(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  // Fetch all posts
  const fetchAllPosts = useCallback(async () => {
    if (currentUser?.role !== "admin") return;
    
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/v1/post/admin/all-posts?limit=100`;
      if (filterStatus !== "all") url += `&status=${filterStatus}`;
      if (filterUser) url += `&userId=${filterUser}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (res.ok) {
        let filteredPosts = data.posts || [];
        if (filterStatus === "pending") {
          filteredPosts = filteredPosts.filter(post => post.userId?._id !== currentUser._id);
        }
        setPosts(filteredPosts);
        setStats({
          totalPosts: data.totalPosts,
          draftCount: data.draftCount,
          publishedCount: data.publishedCount,
          pendingCount: filteredPosts.filter(p => p.status === "pending").length,
          rejectedCount: data.rejectedCount || 0,
          pendingEditCount: data.posts?.filter(p => p.status === "pending_edit").length || 0,
          pendingDeleteCount: data.posts?.filter(p => p.status === "pending_delete").length || 0,
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      showToast("Failed to fetch posts", "error");
    } finally {
      setLoading(false);
    }
  }, [currentUser, filterStatus, filterUser]);

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  // Fetch all users for filter dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/getUsers?limit=100`);
        const data = await res.json();
        if (res.ok) setUsers(data.users);
      } catch (error) { console.error(error); }
    };
    if (currentUser?.role === "admin") fetchUsers();
  }, [currentUser]);

  const handleDeletePost = async () => {
    setShowModal(false);
    setActionLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/deletePost/${postIdToDelete}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setPosts(prev => prev.filter(post => post._id !== postIdToDelete));
        showToast(data || "Post deleted successfully", "success");
        fetchAllPosts();
      } else {
        showToast(data.message || "Failed to delete post", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    } finally {
      setActionLoading(false);
      setOpenMenuId(null);
    }
  };

  const handleApprovePost = async (postId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/approve-post/${postId}`, { method: "PUT" });
      const data = await res.json();
      if (res.ok) {
        showToast("Post approved and published", "success");
        fetchAllPosts();
      } else {
        showToast(data.message || "Failed to approve post", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    } finally {
      setActionLoading(false);
      setOpenMenuId(null);
    }
  };

  const handleApproveEditRequest = async (postId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/approve-edit/${postId}`, { method: "PUT" });
      const data = await res.json();
      if (res.ok) {
        showToast("Edit request approved and applied", "success");
        fetchAllPosts();
      } else {
        showToast(data.message || "Failed to approve edit", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    } finally {
      setActionLoading(false);
      setOpenMenuId(null);
    }
  };

  const handleApproveDeleteRequest = async (postId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/approve-delete/${postId}`, { method: "PUT" });
      if (res.ok) {
        showToast("Delete request approved, post removed", "success");
        fetchAllPosts();
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to approve delete", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    } finally {
      setActionLoading(false);
      setOpenMenuId(null);
    }
  };

  const handleRejectRequest = async () => {
    if (!rejectionReason.trim()) {
      showToast("Please provide a rejection reason", "error");
      return;
    }
    setShowRejectModal(false);
    setActionLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/reject-request/${postIdToAction}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectionReason }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Request rejected", "success");
        setRejectionReason("");
        fetchAllPosts();
      } else {
        showToast(data.message || "Failed to reject request", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    } finally {
      setActionLoading(false);
      setOpenMenuId(null);
    }
  };

  const handleRejectPost = async () => {
    if (!rejectionReason.trim()) {
      showToast("Please provide a rejection reason", "error");
      return;
    }
    setShowRejectModal(false);
    setActionLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/reject-post/${postIdToAction}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectionReason }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Post rejected", "success");
        setRejectionReason("");
        fetchAllPosts();
      } else {
        showToast(data.message || "Failed to reject post", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    } finally {
      setActionLoading(false);
      setOpenMenuId(null);
    }
  };

  const handleStatusChange = async (postId, newStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/updatePostStatus/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Post moved to ${newStatus}`, "success");
        fetchAllPosts();
      } else {
        showToast(data.message || "Failed to update status", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    } finally {
      setActionLoading(false);
      setOpenMenuId(null);
    }
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setShowViewModal(true);
    setOpenMenuId(null);
  };

  const handleImageError = (postId) => setImageErrors(prev => ({ ...prev, [postId]: true }));

  const getTimeRemaining = (autoApproveAt) => {
    if (!autoApproveAt) return null;
    const hours = Math.max(0, Math.ceil((new Date(autoApproveAt) - new Date()) / (1000 * 60 * 60)));
    if (hours === 0) return "Expiring soon";
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} left`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} left`;
  };

  const getStatusBadge = (status, autoApproveAt) => {
    const timeRemaining = getTimeRemaining(autoApproveAt);
    
    switch(status) {
      case "draft": return <Badge color="gray" size="sm">Draft</Badge>;
      case "pending": return <Badge color="warning" size="sm">Pending Approval</Badge>;
      case "published": return <Badge color="success" size="sm">Published</Badge>;
      case "rejected": return <Badge color="failure" size="sm">Rejected</Badge>;
      case "pending_edit":
        return (
          <div className="flex flex-col items-end">
            <Badge color="warning" size="sm" className="flex items-center gap-1"><HiRefresh className="w-3 h-3" /> Pending Edit</Badge>
            {timeRemaining && <span className="text-xs text-amber-600 mt-1">{timeRemaining}</span>}
          </div>
        );
      case "pending_delete":
        return (
          <div className="flex flex-col items-end">
            <Badge color="failure" size="sm" className="flex items-center gap-1"><HiXCircle className="w-3 h-3" /> Pending Delete</Badge>
            {timeRemaining && <span className="text-xs text-red-600 mt-1">{timeRemaining}</span>}
          </div>
        );
      default: return <Badge color="gray" size="sm">{status}</Badge>;
    }
  };

  if (currentUser?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <HiOutlineExclamationCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Access Denied</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Admin privileges required</p>
        </div>
      </div>
    );
  }

  const PostCard = ({ post }) => {
    const hasImageError = imageErrors[post._id];
    const isOpen = openMenuId === post._id;
    const timeRemaining = getTimeRemaining(post.autoApproveAt);
    const isPendingAction = post.status === "pending_edit" || post.status === "pending_delete";
    
    return (
      <div ref={el => menuRefs.current[post._id] = el} className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 border ${
        isPendingAction 
          ? post.status === "pending_edit" 
            ? 'border-amber-400 bg-amber-50/30 dark:bg-amber-900/10' 
            : 'border-red-400 bg-red-50/30 dark:bg-red-900/10'
          : 'border-gray-200 dark:border-gray-700'
      }`}>
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            {!hasImageError && post.image ? (
              <img src={post.image} alt={post.title} className="w-16 h-16 object-cover rounded-lg ring-1 ring-gray-200" onError={() => handleImageError(post._id)} loading="lazy" />
            ) : (
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <HiPhotograph className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Link to={`/post/${post.slug}`} className="font-semibold text-gray-800 hover:text-teal-600 transition-colors line-clamp-2 text-base">
                  {post.title}
                </Link>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5"><HiUser className="w-3.5 h-3.5" /> {post.userId?.username || "Unknown"}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="capitalize">{post.category}</span>
                </div>
                {post.status === "pending_edit" && post.editRequestData && (
                  <p className="text-xs text-amber-600 mt-1">📝 Edit requested - Changes pending approval</p>
                )}
                {post.status === "pending_delete" && timeRemaining && (
                  <p className="text-xs text-red-600 mt-1">⚠️ Delete requested - {timeRemaining}</p>
                )}
                {post.status === "rejected" && post.rejectionReason && (
                  <p className="text-xs text-red-500 mt-1">Reason: {post.rejectionReason}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {getStatusBadge(post.status, post.autoApproveAt)}
                
                <button onClick={() => handleViewPost(post)} className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all" title="Quick View">
                  <HiEye className="w-5 h-5" />
                </button>
                
                <div className="relative">
                  <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(isOpen ? null : post._id); }}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${isOpen ? 'bg-gray-100' : 'text-gray-500 hover:bg-gray-100'}`}
                    disabled={actionLoading}>
                    <HiDotsVertical className="w-5 h-5" />
                  </button>
                  
                  {isOpen && (
                    <div className="dropdown-menu absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border z-50 py-1">
                      <button onClick={() => handleViewPost(post)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                        <HiEye className="w-4 h-4 text-blue-500" /> Quick View
                      </button>
                      
                      <Link to={`/update-post/${post._id}`}>
                        <button onClick={() => setOpenMenuId(null)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                          <HiPencil className="w-4 h-4 text-emerald-500" /> Edit Post
                        </button>
                      </Link>
                      
                      <Link to={`/post/${post.slug}`} target="_blank">
                        <button onClick={() => setOpenMenuId(null)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                          <HiExternalLink className="w-4 h-4 text-purple-500" /> Open in New Tab
                        </button>
                      </Link>
                      
                      {/* Pending Actions */}
                      {(post.status === "pending_edit" || post.status === "pending_delete") && (
                        <>
                          <div className="border-t my-1"></div>
                          {post.status === "pending_edit" && (
                            <button onClick={() => handleApproveEditRequest(post._id)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-green-600">
                              <HiOutlineCheckCircle className="w-4 h-4" /> Approve Edit Request
                            </button>
                          )}
                          {post.status === "pending_delete" && (
                            <button onClick={() => handleApproveDeleteRequest(post._id)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-green-600">
                              <HiOutlineCheckCircle className="w-4 h-4" /> Approve Delete Request
                            </button>
                          )}
                          <button onClick={() => { setPostIdToAction(post._id); setShowRejectModal(true); setOpenMenuId(null); }} className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-red-600">
                            <HiXCircle className="w-4 h-4" /> Reject Request
                          </button>
                        </>
                      )}
                      
                      {/* Regular Approval */}
                      {(post.status === "pending" || post.status === "draft") && (
                        <>
                          <div className="border-t my-1"></div>
                          <button onClick={() => handleApprovePost(post._id)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-green-600">
                            <HiOutlineCheckCircle className="w-4 h-4" /> Approve & Publish
                          </button>
                          <button onClick={() => { setPostIdToAction(post._id); setShowRejectModal(true); setOpenMenuId(null); }} className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-red-600">
                            <HiXCircle className="w-4 h-4" /> Reject with Reason
                          </button>
                        </>
                      )}
                      
                      <div className="border-t my-1"></div>
                      
                      <div className="px-3 py-2">
                        <label className="text-xs text-gray-500 block mb-2">Change Status</label>
                        <Select size="sm" value={post.status} onChange={(e) => { handleStatusChange(post._id, e.target.value); setOpenMenuId(null); }} className="w-full">
                          <option value="draft">Move to Draft</option>
                          <option value="pending">Mark as Pending</option>
                          <option value="published">Publish Now</option>
                          <option value="rejected">Reject</option>
                        </Select>
                      </div>
                      
                      <div className="border-t my-1"></div>
                      
                      <button onClick={() => { setShowModal(true); setPostIdToDelete(post._id); setOpenMenuId(null); }} className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-600">
                        <HiTrash className="w-4 h-4" /> Delete Post
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-full min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className={`rounded-lg shadow-lg p-3 min-w-[280px] ${toast.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            <p className={`text-sm ${toast.type === "success" ? "text-green-800" : "text-red-800"}`}>{toast.message}</p>
          </div>
        </div>
      )}

      {actionLoading && (
        <div className="fixed inset-0 bg-black/20 z-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 shadow-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-500"></div>
            <span>Processing...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Posts Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and moderate all blog posts</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <HiOutlineDocumentText className="w-5 h-5 text-teal-500" />
            <span className="text-sm text-gray-600">Total</span>
            <span className="text-2xl font-bold text-teal-600">{stats.totalPosts}</span>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {[
            { label: "Total", value: stats.totalPosts, color: "blue", icon: HiOutlineDocumentText },
            { label: "Published", value: stats.publishedCount, color: "emerald", icon: HiOutlineCheckCircle },
            { label: "Pending", value: stats.pendingCount, color: "amber", icon: HiOutlineClock },
            { label: "Pending Edit", value: stats.pendingEditCount, color: "orange", icon: HiRefresh },
            { label: "Pending Delete", value: stats.pendingDeleteCount, color: "rose", icon: HiXCircle },
            { label: "Drafts", value: stats.draftCount, color: "gray", icon: HiPencil },
            { label: "Rejected", value: stats.rejectedCount, color: "red", icon: HiXCircle }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`w-8 h-8 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full">
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="pending">Pending Approval</option>
              <option value="pending_edit">Pending Edit</option>
              <option value="pending_delete">Pending Delete</option>
              <option value="draft">Draft</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Author Filter</label>
            <Select value={filterUser} onChange={(e) => setFilterUser(e.target.value)} className="w-full">
              <option value="">All Authors</option>
              {users.map((user) => <option key={user._id} value={user._id}>{user.username} ({user.role})</option>)}
            </Select>
          </div>
          {(filterStatus !== "all" || filterUser) && (
            <div className="flex items-end">
              <button onClick={() => { setFilterStatus("all"); setFilterUser(""); }} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                <HiOutlineX className="w-4 h-4" /> Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-gray-500">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4"><HiOutlineDocumentText className="w-10 h-10 text-gray-400" /></div>
          <p className="text-lg font-medium text-gray-600">No posts found</p>
          <p className="text-sm text-gray-500 mt-1">Try changing your filters</p>
        </div>
      ) : (
        <div className="space-y-3">{posts.map((post) => <PostCard key={post._id} post={post} />)}</div>
      )}
      
      {/* View Post Modal */}
      <Modal show={showViewModal} onClose={() => setShowViewModal(false)} size="4xl">
        <Modal.Header>Post Preview</Modal.Header>
        <Modal.Body>
          {selectedPost && (
            <div className="max-h-[70vh] overflow-y-auto">
              {selectedPost.image && !imageErrors[selectedPost._id] && <img src={selectedPost.image} className="w-full h-56 object-cover rounded-xl mb-5" onError={() => handleImageError(selectedPost._id)} />}
              <h1 className="text-xl font-bold mb-3">{selectedPost.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-5 pb-4 border-b">
                <span>By: {selectedPost.userId?.username || "Unknown"}</span>
                <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                <span className="capitalize">{selectedPost.category}</span>
              </div>
              {selectedPost.status === "pending_edit" && selectedPost.editRequestData && (
                <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-semibold text-amber-800 mb-2">Pending Changes:</p>
                  <p className="text-sm">Title: {selectedPost.editRequestData.title}</p>
                  <p className="text-sm">Category: {selectedPost.editRequestData.category}</p>
                </div>
              )}
              {selectedPost.status === "rejected" && selectedPost.rejectionReason && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200"><p className="text-sm text-red-600">Rejection Reason: {selectedPost.rejectionReason}</p></div>
              )}
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer><Button color="gray" onClick={() => setShowViewModal(false)}>Close</Button></Modal.Footer>
      </Modal>
      
      {/* Reject Modal */}
      <Modal show={showRejectModal} onClose={() => { setShowRejectModal(false); setRejectionReason(""); }} size="md" popup>
        <Modal.Header /><Modal.Body>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center"><HiXCircle className="w-8 h-8 text-red-600" /></div>
            <h3 className="mb-2 text-lg font-semibold">Reject Request</h3>
            <p className="text-gray-500 text-sm mb-4">Please provide a reason for rejection</p>
            <Textarea placeholder="Enter rejection reason..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={3} className="mb-4" />
            <div className="flex justify-center gap-3">
              <Button color="failure" onClick={postIdToAction ? (postIdToAction.startsWith ? handleRejectRequest : handleRejectPost) : handleRejectRequest}>Reject</Button>
              <Button color="gray" onClick={() => { setShowRejectModal(false); setRejectionReason(""); }}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      
      {/* Delete Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header /><Modal.Body>
          <div className="text-center"><div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center"><HiTrash className="w-8 h-8 text-red-600" /></div>
          <h3 className="mb-2 text-lg font-semibold">Delete this post?</h3><p className="text-gray-500 text-sm mb-4">This action cannot be undone.</p>
          <div className="flex justify-center gap-3"><Button color="failure" onClick={handleDeletePost}>Yes, Delete</Button><Button color="gray" onClick={() => setShowModal(false)}>Cancel</Button></div></div>
        </Modal.Body>
      </Modal>

      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }.animate-slide-in { animation: slideIn 0.3s ease-out; }`}</style>
    </div>
  );
}