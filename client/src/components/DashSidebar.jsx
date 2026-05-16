import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiArrowSmRight,
  HiUser,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiOutlineChartPie,
  HiPencil,
  HiTemplate,
  HiCog,
  HiViewGrid,
  HiHome,
  HiMailOpen,
} from "react-icons/hi";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import { useSelector } from "react-redux";
import { AiTwotoneMessage } from "react-icons/ai";

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/signOut`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getUserRoleLabel = () => {
    if (currentUser?.role === "admin") return "Administrator";
    if (currentUser?.role === "author") return "Content Author";
    return "Member";
  };

  return (
    <Sidebar className="w-full md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* User Profile Header */}
      <div className="px-3 py-5 mb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
         
          <div className="flex-1 min-w-0">
           
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getUserRoleLabel()}
            </p>
          </div>
        </div>
      </div>

      <Sidebar.ItemGroup>
        {/* Dashboard / Overview - Admin Only */}
        {currentUser?.role === "admin" && (
          <Link to="/dashboard?tab=dash">
            <Sidebar.Item
              active={tab === "dash"}
              icon={HiOutlineChartPie}
              label="Admin"
              labelColor="purple"
              as="div"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Overview
            </Sidebar.Item>
          </Link>
        )}
        
        {/* Profile - All Users */}
        <Link to="/dashboard?tab=profile">
          <Sidebar.Item
            active={tab === "profile"}
            icon={HiUser}
            as="div"
            className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            My Profile
          </Sidebar.Item>
        </Link>
        
        {/* My Posts - Author & Admin */}
        {(currentUser?.role === "author" || currentUser?.role === "admin") && (
          <Link to="/dashboard?tab=posts">
            <Sidebar.Item
              active={tab === "posts"}
              icon={HiDocumentText}
              as="div"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              My Posts
            </Sidebar.Item>
          </Link>
        )}
        
        {/* Create Post - Author & Admin */}
        {(currentUser?.role === "author" || currentUser?.role === "admin") && (
          <Link to="/create-post">
            <Sidebar.Item
              active={tab === "create-post"}
              icon={HiPencil}
              as="div"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Write New Post
            </Sidebar.Item>
          </Link>
        )}

        {/* Admin Section Divider */}
        {currentUser?.role === "admin" && (
          <div className="my-3">
            <div className="px-3 py-1">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Administration
              </p>
            </div>
          </div>
        )}
        
        {/* All Posts - Admin Only */}
        {currentUser?.role === "admin" && (
          <Link to="/dashboard?tab=admin-posts">
            <Sidebar.Item
              active={tab === "admin-posts"}
              icon={HiTemplate}
              as="div"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              All Posts
            </Sidebar.Item>
          </Link>
        )}
        
        {/* Users - Admin Only */}
        {currentUser?.role === "admin" && (
          <Link to="/dashboard?tab=users">
            <Sidebar.Item
              active={tab === "users"}
              icon={HiOutlineUserGroup}
              as="div"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              User Management
            </Sidebar.Item>
          </Link>
        )}
        
        {/* Comments - Admin Only */}
        {currentUser?.role === "admin" && (
          <Link to="/dashboard?tab=comments">
            <Sidebar.Item
              active={tab === "comments"}
              icon={HiAnnotation}
              as="div"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Comment Moderation
            </Sidebar.Item>
          </Link>
        )}
        {currentUser?.role === "admin" && (
         <Link to={"/dashboard?tab=contact"}>
  <Sidebar.Item active={tab === "contact"} icon={HiMailOpen} as="div">
    Contact Messages
  </Sidebar.Item>
</Link>
        )}

        {/* Divider before sign out */}
        <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
        
        {/* Sign Out - All Users */}
        <Sidebar.Item
          onClick={handleSignOut}
          icon={HiArrowSmRight}
          className="cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          Sign Out
        </Sidebar.Item>
      </Sidebar.ItemGroup>
    </Sidebar>
  );
}