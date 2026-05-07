import { Navigate, useLocation } from "react-router-dom";
import AppLoader from "./AppLoader";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <AppLoader label="Restoring your secure workspace..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
