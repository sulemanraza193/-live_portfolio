import { Router } from 'express';
import {
  getProfile, getRepos, getPinnedRepos, getContributions, getActivity,
} from '../controllers/githubController.js';

const router = Router();

// All public — this is display data for the portfolio, not user account data.
router.get('/profile', getProfile);
router.get('/repos', getRepos);
router.get('/pinned', getPinnedRepos);
router.get('/contributions', getContributions);
router.get('/activity', getActivity);

export default router;
