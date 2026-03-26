import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { canAccessPath, getDefaultPathForRole } from "../../auth/rbac";

export const RequireAuth = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  if (!canAccessPath(role, location.pathname)) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />;
  }

  return children;
};

export const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={getDefaultPathForRole(role)} replace />;
  }

  return children;
};
