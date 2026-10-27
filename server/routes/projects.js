import { Router } from 'express';
import { body } from 'express-validator';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { handleValidation } from '../middleware/handleValidation.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

const projectRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 120 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 500 }),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('techStack').optional().isArray().withMessage('techStack must be an array'),
  body('featured').optional().isBoolean(),
  body('github').optional({ checkFalsy: true }).isURL().withMessage('GitHub link must be a valid URL'),
  body('live').optional({ checkFalsy: true }).isURL().withMessage('Live link must be a valid URL'),
];

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', authenticateUser, projectRules, handleValidation, createProject);
router.put('/:id', authenticateUser, projectRules, handleValidation, updateProject);
router.delete('/:id', authenticateUser, deleteProject);

export default router;
