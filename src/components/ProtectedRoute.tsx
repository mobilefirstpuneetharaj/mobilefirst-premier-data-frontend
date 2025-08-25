import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import { useEffect } from 'react';
import ToastContainer from './ToastContainer';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      <ToastContainer />;
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}