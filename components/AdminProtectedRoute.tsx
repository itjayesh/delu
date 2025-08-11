
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const context = useContext(AppContext);

  if (context?.isAuthLoading) {
    return (
        <div className="min-h-screen bg-brand-dark flex justify-center items-center">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-brand-primary"></div>
        </div>
    );
  }

  if (!context?.currentUser || !context.currentUser.isAdmin) {
    // Redirect non-admins to the home page
    return <Navigate to="/live" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;