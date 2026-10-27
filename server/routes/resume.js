import { Router } from 'express';
import { getResume, uploadResume, deleteResume } from '../controllers/resumeController.js';
import { authenticateUser } from '../middleware/auth.js';
import { uploadResume as uploadMiddleware } from '../middleware/upload.js';

const router = Router();

router.get('/', getResume);
router.post('/', authenticateUser, uploadMiddleware.single('resume'), uploadResume);
router.delete('/', authenticateUser, deleteResume);

export default router;
