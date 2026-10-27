import { Router } from 'express';
import { body } from 'express-validator';
import {
  getSkills, createSkill, updateSkill, deleteSkill,
} from '../controllers/skillController.js';
import { handleValidation } from '../middleware/handleValidation.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

const rules = [
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('percentage').isInt({ min: 0, max: 100 }).withMessage('Percentage must be 0-100'),
];

router.get('/', getSkills);
router.post('/', authenticateUser, rules, handleValidation, createSkill);
router.put('/:id', authenticateUser, rules, handleValidation, updateSkill);
router.delete('/:id', authenticateUser, deleteSkill);

export default router;
