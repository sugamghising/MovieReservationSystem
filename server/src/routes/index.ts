import { Router } from 'express';
import authRoutes from './auth.routes';
import movieRoutes from './movie.routes';
import theatresRoutes from './theatres.routes'

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/theatres', theatresRoutes)

export default router;
