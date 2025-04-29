import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && !user.isAdmin) {
    // Redirect to dashboard if not an admin
    return <Navigate to="/dashboard@member" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 