import express from "express";
import { getCancellationReport, getDashboardOverview, getOccupancyReport, getPopularMoviesReport, getRevenueReport } from "../controllers/analytic.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { adminLimiter } from '../middleware/rate-limit.middleware';

const router = express.Router();

/**
 * GET /api/analytics/dashboard
 * Get dashboard overview (Admin only)
 * Rate limited: 50 requests per 15 minutes
 */
router.get('/dashboard', adminLimiter, requireAuth, requireRole('ADMIN'), getDashboardOverview);

/**
 * GET /api/analytics/revenue
 * Get revenue report (Admin only)
 * Rate limited: 50 requests per 15 minutes
 */
router.get('/revenue', adminLimiter, requireAuth, requireRole('ADMIN'), getRevenueReport);

/**
 * GET /api/analytics/occupancy
 * Get occupancy report (Admin only)
 * Rate limited: 50 requests per 15 minutes
 */
router.get('/occupancy', adminLimiter, requireAuth, requireRole('ADMIN'), getOccupancyReport);

/**
 * GET /api/analytics/popular-movies
 * Get popular movies report (Admin only)
 * Rate limited: 50 requests per 15 minutes
 */
router.get('/popular-movies', adminLimiter, requireAuth, requireRole('ADMIN'), getPopularMoviesReport);

/**
 * GET /api/analytics/cancellations
 * Get cancellations report (Admin only)
 * Rate limited: 50 requests per 15 minutes
 */
router.get('/cancellations', adminLimiter, requireAuth, requireRole('ADMIN'), getCancellationReport);

export default router;
