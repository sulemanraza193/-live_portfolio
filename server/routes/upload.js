import { Router } from 'express';
import { uploadImage as uploadImageController } from '../controllers/uploadController.js';
import { authenticateUser } from '../middleware/auth.js';
import { uploadImage as uploadMiddleware } from '../middleware/upload.js';

const router = Router();

router.post('/image', authenticateUser, uploadMiddleware.single('image'), uploadImageController);

export default router;
