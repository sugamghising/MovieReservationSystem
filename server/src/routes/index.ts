import { Router } from 'express';
import authRoutes from './auth.routes';
import movieRoutes from './movie.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);

export default router;
