import { Router } from 'express';
import {
    getCurrentUser,
    login,
    logout,
    signup,
} from '../controllers/authController.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { loginSchema, signupSchema } from '../validators/authSchemas.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router: Router = Router();

// ================================
// @@path: api/v1/auth
// ================================

router.post('/login', validate(loginSchema), asyncHandler(login));
router.post('/signup', validate(signupSchema), asyncHandler(signup));
router.get('/logout', asyncHandler(logout));

// current user
router.get('/me', authenticateUser, asyncHandler(getCurrentUser));

export default router;
