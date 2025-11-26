import { Navigate } from "react-router-dom";

import { useAuth } from "./src/Context/AuthContext";
export default function ProtectedRoute({ children, requiredRoles = [] }) {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // If roles are specified, enforce permission
  if (requiredRoles && requiredRoles.length > 0 && !hasPermission(requiredRoles)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
