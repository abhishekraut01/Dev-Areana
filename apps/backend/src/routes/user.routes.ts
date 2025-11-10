// user.routes.ts
import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserSubmissions,
  getUserStats,
  deleteAccount,
} from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router: Router = Router();

// Register a new user
router.route('/register').post(registerUser);

// Login user
router.route('/login').post(loginUser);

// Logout user
router.route('/logout').post(authenticate, logoutUser);

// Get current user profile
router.route('/profile').get(authenticate, getUserProfile);

// Update user profile
router.route('/profile').put(authenticate, updateUserProfile);

// Change password
router.route('/change-password').post(authenticate, changePassword);

// Get user submissions history
router.route('/submissions').get(authenticate, getUserSubmissions);

// Get user statistics
router.route('/stats').get(authenticate, getUserStats);

// Delete user account
router.route('/account').delete(authenticate, deleteAccount);

export default router;
