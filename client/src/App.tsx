import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

// Layouts
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";

// Public pages
import HomePage from "./pages/public/HomePage";
import MoviesPage from "./pages/public/MoviesPage";
import MovieDetailPage from "./pages/public/MovieDetailPage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";

// User pages
import BookingPage from "./pages/user/BookingPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import MyReservationsPage from "./pages/user/MyReservationsPage";
import PaymentSuccessPage from "./pages/user/PaymentSuccessPage";
import ProfilePage from "./pages/user/ProfilePage";

// Admin pages
import DashboardPage from "./pages/admin/DashboardPage";
import MoviesManagementPage from "./pages/admin/MoviesManagementPage";

// Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ROUTES } from "./lib/constants";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<Layout />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.MOVIES} element={<MoviesPage />} />
            <Route path={ROUTES.MOVIE_DETAIL} element={<MovieDetailPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          </Route>

          {/* Protected user routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.BOOKING} element={<BookingPage />} />
            <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
            <Route
              path={ROUTES.MY_RESERVATIONS}
              element={<MyReservationsPage />}
            />
            <Route
              path={ROUTES.PAYMENT_SUCCESS}
              element={<PaymentSuccessPage />}
            />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          </Route>

          {/* Protected admin routes */}
          <Route
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<DashboardPage />} />
            <Route
              path={ROUTES.ADMIN_MOVIES}
              element={<MoviesManagementPage />}
            />
            {/* Add other admin routes */}
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
