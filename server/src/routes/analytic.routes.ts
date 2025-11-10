import express from "express";
import { getCancellationReport, getDashboardOverview, getOccupancyReport, getPopularMoviesReport, getRevenueReport } from "../controllers/analytic.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = express.Router();

router.get('/dashboard', requireAuth, requireRole('ADMIN'), getDashboardOverview);
router.get('/revenue', requireAuth, requireRole('ADMIN'), getRevenueReport);
router.get('/occupancy', requireAuth, requireRole('ADMIN'), getOccupancyReport);
router.get('/popular-movies', requireAuth, requireRole('ADMIN'), getPopularMoviesReport);
router.get('/cancellations', requireAuth, requireRole('ADMIN'), getCancellationReport);

export default router;
