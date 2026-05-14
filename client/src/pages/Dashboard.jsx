import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashhPost from "../components/DashhPost";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashComp from "../components/DashComp";
import AdminAllPosts from "../components/AdminAllPosts";
import { 
  HiUser, 
  HiDocumentText, 
  HiUsers, 
  HiChat, 
  HiChartPie, 
  HiTemplate,
  HiShieldCheck,
  HiExclamationCircle
} from "react-icons/hi";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // Get tab title and icon
  const getTabInfo = () => {
    switch (tab) {
      case "profile":
        return { title: "My Profile", icon: HiUser, description: "Manage your personal information and account settings" };
      case "posts":
        return { title: "My Posts", icon: HiDocumentText, description: "Create, edit, and manage your blog posts" };
      case "admin-posts":
        return { title: "All Posts", icon: HiTemplate, description: "Moderate and manage all posts across the platform" };
      case "users":
        return { title: "User Management", icon: HiUsers, description: "Manage users, roles, and permissions" };
      case "comments":
        return { title: "Comment Moderation", icon: HiChat, description: "Review and moderate user comments" };
      case "dash":
        return { title: "Analytics Overview", icon: HiChartPie, description: "View platform statistics and performance metrics" };
      default:
        return { title: "Dashboard", icon: HiChartPie, description: "Welcome to your dashboard" };
    }
  };

  const tabInfo = getTabInfo();
  const TabIcon = tabInfo.icon;

  // Check if user has access to current tab
  const hasAccess = () => {
    if (tab === "profile") return true;
    if (tab === "posts") return currentUser?.role === "author" || currentUser?.role === "admin";
    if (tab === "admin-posts") return currentUser?.role === "admin";
    if (tab === "users") return currentUser?.role === "admin";
    if (tab === "comments") return currentUser?.role === "admin";
    if (tab === "dash") return currentUser?.role === "admin";
    return false;
  };

  const accessDenied = !hasAccess() && tab !== "" && tab !== undefined;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <DashSidebar />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <TabIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {tabInfo.title}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tabInfo.description}
                </p>
              </div>
            </div>
          </div>

          {/* Access Denied State */}
          {accessDenied && (
            <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <HiShieldCheck className="w-10 h-10 text-red-500 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Access Denied
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  You don't have permission to access this section. This area is restricted to {tab === "posts" ? "authors and administrators" : "administrators"} only.
                </p>
                <Link to="/dashboard?tab=profile">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Go to Profile
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Content Sections - Role Based */}
          {!accessDenied && (
            <div className="p-6">
              {/* Profile - All Users */}
              {tab === "profile" && <DashProfile />}

              {/* My Posts - Author & Admin */}
              {tab === "posts" && (currentUser?.role === "author" || currentUser?.role === "admin") && (
                <DashhPost />
              )}

              {/* All Posts - Admin Only */}
              {tab === "admin-posts" && currentUser?.role === "admin" && (
                <AdminAllPosts />
              )}

              {/* Users Management - Admin Only */}
              {tab === "users" && currentUser?.role === "admin" && (
                <DashUsers />
              )}

              {/* Comments Moderation - Admin Only */}
              {tab === "comments" && currentUser?.role === "admin" && (
                <DashComments />
              )}

              {/* Dashboard Analytics - Admin Only */}
              {tab === "dash" && currentUser?.role === "admin" && (
                <DashComp />
              )}

              {/* Default/Empty State - When no tab selected */}
              {!tab && (
                <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <HiChartPie className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                      Welcome back, {currentUser?.username || "User"}!
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Select an option from the sidebar to manage your account and content.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Link to="/dashboard?tab=profile">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                          View Profile
                        </button>
                      </Link>
                      {(currentUser?.role === "author" || currentUser?.role === "admin") && (
                        <Link to="/create-post">
                          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            Create New Post
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}