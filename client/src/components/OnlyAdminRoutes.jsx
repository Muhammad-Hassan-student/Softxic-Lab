import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

// 🔥 Sirf Admin ke liye (Author ko allow nahi)
export default function OnlyAdminRoutes() {
  const { currentUser } = useSelector((state) => state.user);
  
  if (!currentUser) return <Navigate to="/sign-in" />;
  if (currentUser.role !== "admin") return <Navigate to="/dashboard" />;
  
  return <Outlet />;
}