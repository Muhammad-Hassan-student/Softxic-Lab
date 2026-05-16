import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Spinner, Badge, Modal } from "flowbite-react";
import { 
  HiPencil, 
  HiTrash, 
  HiCheckCircle, 
  HiClock, 
  HiExternalLink, 
  HiX,
  HiCalendar,
  HiBookOpen,
  HiUser,
  HiEye,
  HiArrowLeft,
  HiShare,
  HiHeart,
  HiBookmark,
  HiChatAlt2,
  HiOutlineShare,
  HiOutlineBookmark
} from "react-icons/hi";
import CallToAction from "./CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

export default function Post() {
  const { postSlug } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  
  // Like, Save, Share states
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [savesCount, setSavesCount] = useState(0);
  const [sharesCount, setSharesCount] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  // Action states
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Check permissions
  const isAdmin = currentUser?.role === "admin";
  const isAuthor = currentUser?.role === "author";
  const isOwner = post?.userId === currentUser?._id;
  const canEdit = isAdmin || (isAuthor && isOwner);
  const canPublish = canEdit && post?.status === "draft";

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  const readingTime = (content) => {
    const wordsPerMinute = 200;
    const text = content?.replace(/<[^>]*>/g, '') || '';
    const words = text.split(/\s/g).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  // 🔥 Handle Like
  const handleLike = async () => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/like/${post._id}`, {
        method: "PUT",
               credentials: "include",

        headers: { "Content-Type": "application/json" },

      });
      const data = await res.json();
      if (res.ok) {
        setLiked(data.liked);
        setLikesCount(data.numberOfLikes);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // 🔥 Handle Save
  const handleSave = async () => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/save/${post._id}`, {
        method: "PUT",
               credentials: "include",

        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setSaved(data.saved);
        setSavesCount(data.numberOfSaves);
      }
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // 🔥 Handle Share
  const handleShare = async () => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    setActionLoading(true);
    
    // Record share in backend
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/share/${post._id}`, { method: "PUT" ,        credentials: "include",

        headers: { "Content-Type": "application/json" },});
      setSharesCount(prev => prev + 1);
    } catch (error) {
      console.error("Error recording share:", error);
    }

    const shareData = {
      title: post?.title,
      text: "Check out this amazing article!",
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast("Shared successfully!", "success");
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!", "success");
    }
    
    setActionLoading(false);
    setShowShareMenu(false);
  };

  // 🔥 Fetch like, save, share status
  useEffect(() => {
    const fetchEngagementData = async () => {
      if (!post?._id) return;

      try {
        // Fetch like status
        if (currentUser) {
          const likeRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/check-like/${post._id}`);
          const likeData = await likeRes.json();
          if (likeRes.ok) {
            setLiked(likeData.liked);
            setLikesCount(likeData.numberOfLikes);
          }

          // Fetch save status
          const saveRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/check-save/${post._id}`);
          const saveData = await saveRes.json();
          if (saveRes.ok) {
            setSaved(saveData.saved);
            setSavesCount(saveData.numberOfSaves);
          }
        }

        // Fetch share count
        const shareRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/share-count/${post._id}`);
        const shareData = await shareRes.json();
        if (shareRes.ok) {
          setSharesCount(shareData.numberOfShares);
        }
      } catch (error) {
        console.error("Error fetching engagement data:", error);
      }
    };

    fetchEngagementData();
  }, [post?._id, currentUser]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(false);
        
        let url = `${import.meta.env.VITE_API_URL}/api/v1/post/getPosts?slug=${postSlug}`;
        if (currentUser && (isAdmin || isAuthor)) {
          url += `&includeDrafts=true`;
        }
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (!res.ok) {
          setLoading(false);
          setError(true);
          setErrorMessage(data.message || "Failed to fetch post");
          return;
        }
        
        if (res.ok && data.posts && data.posts.length > 0) {
          const fetchedPost = data.posts[0];
          
          if (fetchedPost.status === "draft" && !canEdit) {
            setError(true);
            setErrorMessage("This post is not published yet.");
            setPost(null);
          } else {
            setPost(fetchedPost);
            setError(false);
          }
          setLoading(false);
        } else {
          setError(true);
          setErrorMessage("Post not found");
          setLoading(false);
        }
      } catch (error) {
        setError(true);
        setErrorMessage("Something went wrong");
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug, currentUser, isAdmin, isAuthor, canEdit]);

  useEffect(() => {
    const fetchRecentPost = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/getPosts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRecentPost();
  }, []);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/updatePostStatus/${post._id}`, {
        method: "PUT",
               credentials: "include",

       
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setPost({ ...post, status: "published" });
        showToast("Post published successfully!", "success");
        setTimeout(() => navigate(`/post/${post.slug}`), 1500);
      } else {
        showToast(data.message || "Failed to publish post", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setShowDeleteModal(false);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/deletePost/${post._id}`, {
        method: "DELETE",
               credentials: "include",

        headers: { "Content-Type": "application/json" },
      });
      
      if (res.ok) {
        showToast("Post deleted successfully!", "success");
        setTimeout(() => navigate("/dashboard?tab=posts"), 1500);
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to delete post", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="relative">
            <Spinner size="xl" color="purple" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-t-2 border-purple-500 rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center animate-pulse">
            <HiX className="w-12 h-12 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Post Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{errorMessage}</p>
          <div className="flex gap-3 justify-center">
            <Button gradientDuoTone="purpleToPink" onClick={() => navigate("/")}>
              <HiArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
            <Button color="gray" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Custom Toast Notification */}
      {toast.show && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className={`rounded-xl shadow-2xl p-4 min-w-[280px] max-w-md backdrop-blur-sm ${
            toast.type === "success" 
              ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/95 dark:to-emerald-900/95 border border-green-200 dark:border-green-700" 
              : "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/95 dark:to-rose-900/95 border border-red-200 dark:border-red-700"
          }`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {toast.type === "success" ? (
                  <HiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <HiX className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  toast.type === "success" 
                    ? "text-green-800 dark:text-green-200" 
                    : "text-red-800 dark:text-red-200"
                }`}>
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToast({ show: false, message: "", type: "success" })}
                className="flex-shrink-0"
              >
                <HiX className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-all duration-300 hover:translate-x-[-4px]"
            >
              <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to articles</span>
            </button>
            
            <Link
              to={`/search?category=${post?.category}`}
              className="inline-block mb-6 transform hover:scale-105 transition-transform duration-300"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-white/20 transition-all">
                <HiBookOpen className="w-4 h-4" />
                {post?.category}
              </span>
            </Link>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
              {post?.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {post?.userId?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">@{post?.userId?.username || "Unknown"}</div>
                  <div className="text-xs text-white/70">Author</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <HiCalendar className="w-4 h-4" />
                <span className="text-sm">{new Date(post?.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <HiBookOpen className="w-4 h-4" />
                <span className="text-sm">{readingTime(post?.content)} min read</span>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12 md:h-20">
              <path d="M0,0 C300,100 900,100 1200,0 L1200,120 L0,120 Z" fill="#f3f4f6" className="dark:fill-gray-900"></path>
            </svg>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Action Bar - For Author/Admin */}
          {canEdit && (
            <div className="mb-8 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
              <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800">
                <div className="flex items-center gap-3">
                  {post?.status === "draft" ? (
                    <Badge color="warning" size="lg" className="px-3 py-1.5 text-sm font-medium animate-pulse">
                      <HiClock className="w-4 h-4 mr-1.5 inline" />
                      Draft Mode
                    </Badge>
                  ) : (
                    <Badge color="success" size="lg" className="px-3 py-1.5 text-sm font-medium">
                      <HiCheckCircle className="w-4 h-4 mr-1.5 inline" />
                      Published
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {canPublish && (
                    <Button gradientDuoTone="greenToBlue" onClick={handlePublish} disabled={publishing} size="sm">
                      {publishing ? <><Spinner size="sm" className="mr-2" /> Publishing...</> : <><HiCheckCircle className="w-4 h-4 mr-1.5" /> Publish</>}
                    </Button>
                  )}
                  <Button gradientDuoTone="purpleToPink" onClick={() => navigate(`/update-post/${post._id}`)} size="sm">
                    <HiPencil className="w-4 h-4 mr-1.5" /> Edit
                  </Button>
                  <Button color="failure" onClick={() => setShowDeleteModal(true)} size="sm">
                    <HiTrash className="w-4 h-4 mr-1.5" /> Delete
                  </Button>
                  <Button color="gray" onClick={() => window.open(`/post/${post.slug}`, "_blank")} size="sm">
                    <HiExternalLink className="w-4 h-4 mr-1.5" /> New Tab
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Featured Image */}
          {post?.image && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl group">
              <img src={post.image} alt={post.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
          )}

          {/* Engagement Bar - Integrated Like, Save, Share */}
          <div className="flex flex-wrap items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Like Button */}
              <button
                onClick={handleLike}
                disabled={actionLoading}
                className={`group flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 ${
                  liked 
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg" 
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <HiHeart className={`w-5 h-5 transition-transform group-hover:scale-110 ${liked ? "fill-white" : ""}`} />
                <span className="text-sm font-medium">{actionLoading ? "..." : `${likesCount} ${liked ? "Liked" : "Like"}`}</span>
              </button>
              
              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={actionLoading}
                className={`group flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 ${
                  saved 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" 
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {saved ? (
                  <HiBookmark className="w-5 h-5 fill-white transition-transform group-hover:scale-110" />
                ) : (
                  <HiOutlineBookmark className="w-5 h-5 transition-transform group-hover:scale-110" />
                )}
                <span className="text-sm font-medium">{actionLoading ? "..." : `${savesCount} ${saved ? "Saved" : "Save"}`}</span>
              </button>
              
              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  <HiOutlineShare className="w-5 h-5" />
                  <span className="text-sm font-medium">{sharesCount} Share</span>
                </button>
                
                {showShareMenu && (
                  <div className="absolute top-full mt-2 left-0 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-2 z-10 animate-fade-in-up">
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full"
                    >
                      <HiShare className="w-4 h-4" />
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-3 sm:mt-0">
              <HiChatAlt2 className="w-4 h-4" />
              <span>Join the conversation</span>
            </div>
          </div>

          {/* Post Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none mb-12
              prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-h1:text-4xl prose-h1:mb-6 prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 
              prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-5
              prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
              prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:mb-1
              prose-blockquote:border-l-4 prose-blockquote:border-l-purple-500 
              prose-blockquote:bg-gradient-to-r prose-blockquote:from-purple-50 prose-blockquote:to-transparent 
              dark:prose-blockquote:from-purple-900/20 prose-blockquote:py-3 prose-blockquote:px-5 
              prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-600
              dark:prose-blockquote:text-gray-400
              prose-code:text-purple-600 dark:prose-code:text-purple-400 
              prose-code:bg-gray-100 dark:prose-code:bg-gray-800 
              prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm
              prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl
              prose-img:rounded-xl prose-img:shadow-lg
              prose-ul:my-4 prose-ol:my-4
              transition-all duration-300"
            dangerouslySetInnerHTML={{ __html: post?.content }}
          />

          {/* Author Bio Card */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-900/20 border border-purple-100 dark:border-purple-800/50 shadow-xl">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-white dark:ring-gray-800">
                {post?.userId?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  About @{post?.userId?.username || "Unknown"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Passionate writer sharing insights about technology, development, and creative thinking.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <CallToAction />
        </div>
        
        {/* Comments Section */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Discussion</h2>
            <p className="text-gray-600 dark:text-gray-400">Share your thoughts and join the conversation</p>
          </div>
          {post && post._id && <CommentSection postId={post._id} />}
        </div>

        {/* Recent Posts */}
        {recentPosts && recentPosts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 rounded-full px-4 py-1.5 mb-4">
                <HiBookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Keep Reading</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">More Articles</h2>
              <p className="text-gray-600 dark:text-gray-400">Continue exploring our latest insights</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((recentPost) => (
                <PostCard key={recentPost._id} post={recentPost} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="md" popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center animate-pulse">
              <HiTrash className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-200">Delete this post?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <Button color="failure" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Yes, Delete"}
              </Button>
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #8b5cf6, #ec4899); border-radius: 5px; }
        ::selection { background: linear-gradient(to right, #8b5cf6, #ec4899); color: white; }
      `}</style>
    </>
  );
}