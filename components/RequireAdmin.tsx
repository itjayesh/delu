import React from "react";
import { useAuth } from "../context/AuthContext";

interface RequireAdminProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children, fallback = null }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user || !isAdmin) return fallback || <div>Access denied.</div>;

  return <>{children}</>;
};

export default RequireAdmin;