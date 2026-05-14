import React, { useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineShare, HiShare } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function ShareButton({ postId, postTitle, postSlug }) {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [sharing, setSharing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleShare = async () => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    const shareData = {
      title: postTitle,
      text: "Check out this amazing article!",
      url: `${window.location.origin}/post/${postSlug}`,
    };

    setSharing(true);

    // Record share in backend
    try {
      await fetch(`/api/v1/post/share/${postId}`, { method: "PUT" });
    } catch (error) {
      console.error("Error recording share:", error);
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }

    setSharing(false);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={sharing}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
      >
        <HiOutlineShare className="w-5 h-5" />
        <span className="text-sm font-medium">Share</span>
      </button>

      {showMenu && (
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
  );
}