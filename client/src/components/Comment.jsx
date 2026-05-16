import React, { useState, useEffect } from "react";
import moment from "moment";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea, Spinner } from "flowbite-react";
import { HiPencil, HiTrash, HiCheck, HiX } from "react-icons/hi";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [saving, setSaving] = useState(false);
  const [liked, setLiked] = useState(false);
  const [userData, setUserData] = useState(null);

  // Fetch user data if not populated
  useEffect(() => {
    const fetchUserData = async () => {
      // If userId is already populated
      if (comment.userId && typeof comment.userId === 'object' && comment.userId.username) {
        setUserData({
          username: comment.userId.username,
          profilePicture: comment.userId.profilePicture,
          id: comment.userId._id
        });
        return;
      }
      
      // If userId is just a string ID, fetch from API
      if (comment.userId && typeof comment.userId === 'string') {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/${comment.userId}`, {credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      }});
          const data = await res.json();
          if (res.ok) {
            setUserData({
              username: data.username || "Anonymous",
              profilePicture: data.profilePicture,
              id: comment.userId
            });
          } else {
            setUserData({
              username: "Anonymous",
              profilePicture: null,
              id: comment.userId
            });
          }
        } catch (error) {
          setUserData({
            username: "Anonymous",
            profilePicture: null,
            id: comment.userId
          });
        }
      } else {
        setUserData({
          username: "Anonymous",
          profilePicture: null,
          id: null
        });
      }
    };
    
    fetchUserData();
  }, [comment.userId]);

  useEffect(() => {
    if (currentUser && comment.likes?.includes(currentUser._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [currentUser, comment.likes]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleSave = async () => {
    if (editContent.trim().length === 0) return;
    if (editContent.length > 500) return;
    
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/comment/editComment/${comment._id}`, {
        method: "PUT",
                credentials: "include",

        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editContent);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLike = () => {
    onLike(comment._id);
  };

  const displayName = userData?.username || "Anonymous";
  const isCommentOwner = currentUser?._id === userData?.id || currentUser?._id === comment.userId;
  const profileImage = userData?.profilePicture || `https://ui-avatars.com/api/?name=${displayName.charAt(0)}&background=8b5cf6&color=fff&bold=true`;

  if (!userData) {
    return (
      <div className="group p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={profileImage}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/30 group-hover:ring-purple-500 transition-all"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${displayName.charAt(0)}&background=8b5cf6&color=fff&bold=true`;
            }}
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-bold text-sm text-gray-800 dark:text-white">
              @{displayName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {moment(comment.createdAt).fromNow()}
            </span>
            {comment.createdAt !== comment.updatedAt && (
              <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                (edited)
              </span>
            )}
          </div>
          
          {/* Content or Edit Form */}
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                className="resize-none rounded-lg"
                placeholder="Edit your comment..."
                rows="3"
                maxLength="500"
                onChange={(e) => setEditContent(e.target.value)}
                value={editContent}
              />
              <div className="flex justify-end gap-2">
                <Button
                  gradientDuoTone="greenToBlue"
                  size="xs"
                  onClick={handleSave}
                  disabled={saving}
                  className="transform hover:scale-105 transition-transform"
                >
                  {saving ? (
                    <Spinner size="sm" className="mr-1" />
                  ) : (
                    <HiCheck className="w-3 h-3 mr-1" />
                  )}
                  Save
                </Button>
                <Button
                  color="gray"
                  size="xs"
                  outline
                  onClick={() => setIsEditing(false)}
                  className="transform hover:scale-105 transition-transform"
                >
                  <HiX className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-2">
                {comment.content}
              </p>
              
              {/* Actions */}
              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-full transition-all duration-300 ${
                    liked 
                      ? "text-red-500 bg-red-50 dark:bg-red-900/20" 
                      : "text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {liked ? (
                    <FaThumbsUp className="w-3 h-3" />
                  ) : (
                    <FaRegThumbsUp className="w-3 h-3" />
                  )}
                  <span className="font-medium">
                    {comment.numberOfLikes > 0 && comment.numberOfLikes}
                  </span>
                </button>
                
                {(isCommentOwner || currentUser?.isAdmin) && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-full text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    >
                      <HiPencil className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(comment._id)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-full text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    >
                      <HiTrash className="w-3 h-3" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}