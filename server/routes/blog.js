import { Router } from 'express';
import { body } from 'express-validator';
import {
  getPublishedBlogs,
  getBlogCategories,
  getBlogBySlug,
  getAllBlogsAdmin,
  getBlogByIdAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import { handleValidation } from '../middleware/handleValidation.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

const blogRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 150 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 300 }),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Status must be draft or published'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('slug').optional().trim().isLength({ max: 180 }),
];

// --- Admin routes (must be registered before the public /:slug route) ---
router.get('/admin/all', authenticateUser, getAllBlogsAdmin);
router.get('/admin/:id', authenticateUser, getBlogByIdAdmin);
router.post('/', authenticateUser, blogRules, handleValidation, createBlog);
router.put('/:id', authenticateUser, blogRules, handleValidation, updateBlog);
router.delete('/:id', authenticateUser, deleteBlog);

// --- Public routes ---
router.get('/', getPublishedBlogs);
router.get('/categories', getBlogCategories);
router.get('/:slug', getBlogBySlug);

export default router;
