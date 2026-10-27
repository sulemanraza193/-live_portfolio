import { Router } from 'express';
import { getStats } from '../controllers/dashboardController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.get('/stats', authenticateUser, getStats);

export default router;
