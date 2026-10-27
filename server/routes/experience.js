import { Router } from 'express';
import { body } from 'express-validator';
import {
  getExperience, createExperience, updateExperience, deleteExperience,
} from '../controllers/experienceController.js';
import { handleValidation } from '../middleware/handleValidation.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

const rules = [
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('position').trim().notEmpty().withMessage('Position is required'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 600 }),
];

router.get('/', getExperience);
router.post('/', authenticateUser, rules, handleValidation, createExperience);
router.put('/:id', authenticateUser, rules, handleValidation, updateExperience);
router.delete('/:id', authenticateUser, deleteExperience);

export default router;
