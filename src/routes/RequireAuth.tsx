import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function RequireAuth() {
  const location = useLocation();
  const accessToken =
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken');

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
