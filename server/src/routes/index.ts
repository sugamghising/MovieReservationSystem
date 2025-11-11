import { Router } from 'express';
import authRoutes from './auth.routes';
import movieRoutes from './movie.routes';
import theatresRoutes from './theatres.routes'
import showtimesRoutes from './showtimes.routes';
import reservationsRoutes from './reservations.routes'
import analyticsRoutes from './analytic.routes'
import paymentRoutes from './payment.routes'

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/theatres', theatresRoutes)
router.use('/showtimes', showtimesRoutes);
router.use('/reservations', reservationsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/payments', paymentRoutes);

export default router;
