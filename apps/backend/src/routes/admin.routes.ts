// admin.routes.ts
import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  banUser,
  unbanUser,
  createContest,
  updateContest,
  deleteContest,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getSystemStats,
  reviewSubmission,
  getPendingSubmissions,
} from '../controllers/admin.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router: Router = Router();

// All routes require authentication and admin authorization
router.use(authenticate, authorizeAdmin);

// User management
router.route('/users').get(getAllUsers);
router.route('/users/:userId').get(getUserById);
router.route('/users/:userId').put(updateUser);
router.route('/users/:userId').delete(deleteUser);
router.route('/users/:userId/ban').post(banUser);
router.route('/users/:userId/unban').post(unbanUser);

// Contest management
router.route('/contests').post(createContest);
router.route('/contests/:contestId').put(updateContest);
router.route('/contests/:contestId').delete(deleteContest);

// Challenge management
router.route('/challenges').post(createChallenge);
router.route('/challenges/:challengeId').put(updateChallenge);
router.route('/challenges/:challengeId').delete(deleteChallenge);

// System statistics
router.route('/stats').get(getSystemStats);

// Submission review
router.route('/submissions/pending').get(getPendingSubmissions);
router.route('/submissions/:submissionId/review').post(reviewSubmission);

export default router;
