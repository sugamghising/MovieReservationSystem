import { Router } from 'express';
import authRoutes from './auth.routes';
import movieRoutes from './movie.routes';
import theatresRoutes from './theatres.routes'
import showtimesRoutes from './showtimes.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/theatres', theatresRoutes)
router.use('/showtimes', showtimesRoutes);

export default router;
