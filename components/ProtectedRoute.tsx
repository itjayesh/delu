
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  const { currentUser, isAuthLoading, openAuthModal } = context || {};

  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      // If auth check is complete and there's no user, open modal and redirect
      if(openAuthModal) openAuthModal();
      navigate('/live', { replace: true });
    }
  }, [currentUser, isAuthLoading, openAuthModal, navigate]);

  if (isAuthLoading || !currentUser) {
    // Show a loading indicator or nothing while checking auth or if not authenticated
    return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-primary"></div>
        </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;