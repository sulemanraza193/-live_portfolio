import { Router } from 'express';
import { body } from 'express-validator';
import {
  submitContact,
  getMessages,
  markMessageRead,
  deleteMessage,
} from '../controllers/contactController.js';
import { handleValidation } from '../middleware/handleValidation.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

const contactRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Enter a valid email').normalizeEmail(),
  body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 150 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters'),
];

router.post('/contact', contactRules, handleValidation, submitContact);
router.get('/messages', authenticateUser, getMessages);
router.patch('/messages/:id/read', authenticateUser, markMessageRead);
router.delete('/messages/:id', authenticateUser, deleteMessage);

export default router;
