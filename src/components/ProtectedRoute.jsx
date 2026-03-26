import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute() {
  const { session, profile, loading } = useAuth();

  if (loading) return null; // AuthProvider already gates children on loading

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // New users who haven't completed onboarding
  if (profile && !profile.full_name) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
