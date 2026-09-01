import { Router } from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/authorizeMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { RoleType } from '@prisma/client';
import {
    createOfficial,
    getOfficials,
} from '../controllers/adminController.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { createOfficialSchema } from '../validators/adminSchemas.js';

const router: Router = Router();

// @route GET api/v1/admin/officials
// @desc Get all Registrar and Verifier users
// @access Private/Only admin

router.get(
    '/officials',
    authenticateUser,
    authorizeRoles(RoleType.ADMIN),
    asyncHandler(getOfficials),
);

// @route POST api/v1/admin/officials
// @desc Create Registrar and Verifier users
// @access Private/Only admin

router.post(
    '/officials',
    validate(createOfficialSchema),
    authenticateUser,
    authorizeRoles(RoleType.ADMIN),
    asyncHandler(createOfficial),
);
export default router;
