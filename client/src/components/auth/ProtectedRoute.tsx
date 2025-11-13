import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  adminOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  adminOnly = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if ((requireAdmin || adminOnly) && user?.role !== "ADMIN") {
    return <Navigate to="/movies" replace />;
  }

  return <>{children}</>;
}
