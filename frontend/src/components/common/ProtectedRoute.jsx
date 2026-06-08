// components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, initialLoading } = useSelector(s => s.auth);
  const location = useLocation();
  if (initialLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
