import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function SaveButton({ postId, onSaveChange }) {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [savesCount, setSavesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSaveStatus = async () => {
      if (!currentUser) {
        setSaved(false);
        return;
      }

      try {
        const res = await fetch(`/api/v1/post/check-save/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setSaved(data.saved);
          setSavesCount(data.numberOfSaves);
        }
      } catch (error) {
        console.error("Error checking save status:", error);
      }
    };

    if (postId) {
      checkSaveStatus();
    }
  }, [postId, currentUser]);

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/v1/post/save/${postId}`, {
        method: "PUT",
      });
      const data = await res.json();

      if (res.ok) {
        setSaved(data.saved);
        setSavesCount(data.numberOfSaves);
        if (onSaveChange) {
          onSaveChange(data.saved, data.numberOfSaves);
        }
      }
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      className={`group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
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
      <span className="text-sm font-medium">
        {loading ? "..." : saved ? `${savesCount} Saved` : `${savesCount} Save`}
      </span>
    </button>
  );
}