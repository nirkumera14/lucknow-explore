import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdminRoute({ children }) {
  const { isAuthenticated, user, initialLoading } = useSelector(s => s.auth);
  if (initialLoading) return null;
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/home" replace />;
  return children;
}
