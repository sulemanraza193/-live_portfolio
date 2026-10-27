import { Router } from 'express';
import { body } from 'express-validator';
import {
  getServices, createService, updateService, deleteService,
} from '../controllers/serviceController.js';
import { handleValidation } from '../middleware/handleValidation.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

const rules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 300 }),
];

router.get('/', getServices);
router.post('/', authenticateUser, rules, handleValidation, createService);
router.put('/:id', authenticateUser, rules, handleValidation, updateService);
router.delete('/:id', authenticateUser, deleteService);

export default router;
