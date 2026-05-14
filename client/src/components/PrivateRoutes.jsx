import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

// 🔥 Sirf logged-in users (koi bhi role)
export default function PrivateRoutes() {
  const { currentUser } = useSelector((state) => state.user);
  
  if (!currentUser) return <Navigate to="/sign-in" />;
  
  return <Outlet />;
}