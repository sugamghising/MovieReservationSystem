import { Navigate } from "react-router-dom";
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if ((requireAdmin || adminOnly) && user?.role !== "ADMIN") {
    return <Navigate to="/movies" replace />;
  }

  return <>{children}</>;
}
