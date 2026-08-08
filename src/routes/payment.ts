import { Router } from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/authorizeMiddleware.js';
import { RoleType } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
    createOrder,
    failedPayment,
    verifyPayment,
} from '../controllers/paymentController.js';

const router: Router = Router();

// ================================
// @@path: api/v1/payments/order
// ================================
router.post(
    '/order',
    authenticateUser,
    authorizeRoles(RoleType.APPELLANT),
    asyncHandler(createOrder),
);

// ================================
// @@path: api/v1/payments/verify
// ================================
router.post(
    '/verify',
    authenticateUser,
    authorizeRoles(RoleType.APPELLANT),
    asyncHandler(verifyPayment),
);

// ================================
// @@path: api/v1/payments/failure
// ================================
router.post(
    '/failure',
    authenticateUser,
    authorizeRoles(RoleType.APPELLANT),
    asyncHandler(failedPayment),
);

export default router;
