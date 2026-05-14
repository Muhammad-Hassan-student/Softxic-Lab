import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

//  Author ya Admin ke liye
export default function AuthorRoutes() {
  const { currentUser } = useSelector((state) => state.user);
  
  if (!currentUser) return <Navigate to="/sign-in" />;
  if (currentUser.role !== "author" && currentUser.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }
  
  return <Outlet />;
}